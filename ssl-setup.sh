#!/bin/bash

# ==============================================
# TRANSESCORTA - SSL CERTIFICATE SETUP
# ==============================================
# Dieses Script richtet SSL-Zertifikate ein

set -e

echo "🔒 SSL-Zertifikat Setup für TransEscorta..."

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Domain prüfen
DOMAIN="transescorta.com"
if [ "$1" != "" ]; then
    DOMAIN="$1"
fi

log_info "Richte SSL für Domain ein: $DOMAIN"

# Prüfe ob Domain auf Server zeigt
log_info "Prüfe DNS-Auflösung..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    log_warn "⚠️  Domain zeigt nicht auf diesen Server!"
    log_warn "Server IP: $SERVER_IP"
    log_warn "Domain IP: $DOMAIN_IP"
    log_warn "Bitte aktualisieren Sie Ihre DNS-Einstellungen und versuchen Sie es erneut."
    read -p "Trotzdem fortfahren? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stoppe Nginx falls läuft
log_info "Stoppe temporär Nginx..."
docker-compose stop nginx || true

# Erstelle SSL-Verzeichnis
log_info "Erstelle SSL-Verzeichnis..."
mkdir -p ./ssl

# Generiere SSL-Zertifikat
log_info "Generiere SSL-Zertifikat mit Let's Encrypt..."
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@$DOMAIN \
    -d $DOMAIN \
    -d www.$DOMAIN

# Kopiere Zertifikate
log_info "Kopiere Zertifikate..."
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/$DOMAIN.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/$DOMAIN.key

# Setze Berechtigungen
chown -R transescorta:transescorta ./ssl
chmod 600 ./ssl/*

# Auto-Renewal einrichten
log_info "Richte Auto-Renewal ein..."
if ! crontab -l | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && docker-compose restart nginx") | crontab -
    log_info "✅ Auto-Renewal eingerichtet (täglich um 3:00 Uhr)"
fi

# Starte Services neu
log_info "Starte Services neu..."
docker-compose up -d

# Teste HTTPS
log_info "Teste HTTPS-Verbindung..."
sleep 10
if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    log_info "✅ SSL erfolgreich eingerichtet!"
    log_info "🌐 Ihre Website ist verfügbar unter: https://$DOMAIN"
else
    log_error "❌ SSL-Test fehlgeschlagen!"
    log_info "Prüfen Sie die Logs: docker-compose logs nginx"
fi

echo ""
echo "==================================================="
echo "🔒 SSL-Setup abgeschlossen!"
echo "==================================================="
echo ""
echo "Zertifikat-Info:"
echo "  - Gültig für: $DOMAIN, www.$DOMAIN"
echo "  - Läuft ab: $(openssl x509 -enddate -noout -in ./ssl/$DOMAIN.crt | cut -d= -f2)"
echo "  - Auto-Renewal: Aktiviert"
echo ""
echo "Nützliche Befehle:"
echo "  - Zertifikat manuell erneuern: certbot renew"
echo "  - Zertifikat-Info: openssl x509 -text -in ./ssl/$DOMAIN.crt"
echo "  - SSL-Test: curl -I https://$DOMAIN"