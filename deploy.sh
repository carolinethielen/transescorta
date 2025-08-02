#!/bin/bash

# ==============================================
# TRANSESCORTA - DEPLOYMENT SCRIPT
# ==============================================
# Dieses Script deployed die Anwendung auf dem VPS

set -e  # Exit bei Fehlern

echo "🚀 TransEscorta Deployment gestartet..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktionen
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    log_error ".env Datei nicht gefunden!"
    log_info "Bitte kopieren Sie .env.example zu .env und tragen Sie Ihre Werte ein."
    exit 1
fi

# Stoppe alte Container
log_info "Stoppe alte Container..."
docker-compose down --remove-orphans || true

# Baue neue Images
log_info "Baue neue Docker Images..."
docker-compose build --no-cache

# Starte Services
log_info "Starte Services..."
docker-compose up -d

# Warte auf Database
log_info "Warte auf Datenbank..."
sleep 15

# Führe Database Migration aus
log_info "Führe Database Migration aus..."
docker-compose exec transescorta npm run db:push

# Prüfe Status
log_info "Prüfe Service Status..."
if docker-compose ps | grep -q "Up"; then
    log_info "✅ Deployment erfolgreich!"
    log_info "Ihre Anwendung ist verfügbar unter: https://transescorta.com"
else
    log_error "❌ Deployment fehlgeschlagen!"
    log_info "Logs anzeigen: docker-compose logs"
    exit 1
fi

# Zeige Logs
log_info "Aktuelle Logs (letzte 50 Zeilen):"
docker-compose logs --tail=50

echo ""
log_info "🎉 TransEscorta erfolgreich deployed!"
log_info "Nützliche Befehle:"
echo "  - Logs anzeigen: docker-compose logs -f"
echo "  - Services neu starten: docker-compose restart"
echo "  - Status prüfen: docker-compose ps"
echo "  - Services stoppen: docker-compose down"