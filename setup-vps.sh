#!/bin/bash

# ==============================================
# TRANSESCORTA - VPS SETUP SCRIPT
# ==============================================
# Dieses Script richtet einen frischen Ubuntu VPS ein

set -e

echo "🔧 TransEscorta VPS Setup gestartet..."

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# System Update
log_step "1/8 - System Update..."
apt update && apt upgrade -y

# Installiere grundlegende Tools
log_step "2/8 - Installiere grundlegende Tools..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Installiere Docker
log_step "3/8 - Installiere Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
    log_info "✅ Docker installiert"
else
    log_info "✅ Docker bereits installiert"
fi

# Installiere Docker Compose
log_step "4/8 - Installiere Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "✅ Docker Compose installiert"
else
    log_info "✅ Docker Compose bereits installiert"
fi

# Installiere Certbot für SSL
log_step "5/8 - Installiere Certbot für SSL..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    log_info "✅ Certbot installiert"
else
    log_info "✅ Certbot bereits installiert"
fi

# Erstelle Benutzer für die Anwendung
log_step "6/8 - Erstelle Anwendungsbenutzer..."
if ! id "transescorta" &>/dev/null; then
    useradd -m -s /bin/bash transescorta
    usermod -aG docker transescorta
    log_info "✅ Benutzer 'transescorta' erstellt"
else
    log_info "✅ Benutzer 'transescorta' bereits vorhanden"
fi

# Erstelle Anwendungsverzeichnis
log_step "7/8 - Erstelle Anwendungsverzeichnis..."
mkdir -p /home/transescorta/app
chown -R transescorta:transescorta /home/transescorta/app

# Konfiguriere Firewall
log_step "8/8 - Konfiguriere Firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload

log_info "✅ VPS Setup abgeschlossen!"
echo ""
echo "==================================================="
echo "🎉 VPS ist bereit für TransEscorta!"
echo "==================================================="
echo ""
echo "Nächste Schritte:"
echo "1. Wechseln Sie zum Anwendungsbenutzer: su - transescorta"
echo "2. Laden Sie Ihre Anwendung hoch: git clone [IHR-REPOSITORY]"
echo "3. Führen Sie das Deployment aus: ./deploy.sh"
echo ""
echo "Nützliche Befehle:"
echo "  - Docker Status: systemctl status docker"
echo "  - Firewall Status: ufw status"
echo "  - Logs anzeigen: journalctl -f"