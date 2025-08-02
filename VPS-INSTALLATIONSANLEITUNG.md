# 🚀 TransEscorta VPS Installation - Schritt-für-Schritt Anleitung

**Für absolute Anfänger: Komplette Anleitung von 0 bis zur funktionierenden Website**

---

## 📋 Was Sie brauchen

- ✅ VPS bei HostPro Ukraine (bereits bestellt)
- ✅ Domain transescorta.com (noch zu kaufen)
- ✅ Computer mit Internet
- ✅ Diese Dateien (werden bereitgestellt)

---

## 🎯 SCHRITT 1: VPS-Zugang einrichten

### 1.1 VPS-Daten erhalten
Nach der Bestellung erhalten Sie eine E-Mail mit:
- **IP-Adresse** (z.B. 185.123.45.67)
- **Benutzername** (meist: root)
- **Passwort** (z.B. Ab2#kL9mX)

### 1.2 SSH-Verbindung herstellen

**Windows Benutzer:**
1. Laden Sie **PuTTY** herunter: https://putty.org/
2. Installieren Sie PuTTY
3. Öffnen Sie PuTTY
4. Geben Sie Ihre **VPS-IP-Adresse** ein
5. Port: **22** (Standard)
6. Klicken Sie **"Open"**
7. Bei der Warnung: Klicken Sie **"Yes"**
8. Username: **root**
9. Password: **Ihr VPS-Passwort**

**Mac/Linux Benutzer:**
```bash
ssh root@IHR-VPS-IP
# Beispiel: ssh root@185.123.45.67
```

---

## 🎯 SCHRITT 2: VPS vorbereiten

### 2.1 Automatisches Setup-Script ausführen

Kopieren Sie diesen Befehl und fügen Sie ihn in Ihr SSH-Terminal ein:

```bash
wget https://raw.githubusercontent.com/IHR-USERNAME/transescorta/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

**❌ Falls der obige Befehl nicht funktioniert**, führen Sie manuell aus:

```bash
# System aktualisieren
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Benutzer erstellen
useradd -m -s /bin/bash transescorta
usermod -aG docker transescorta
mkdir -p /home/transescorta/app
chown -R transescorta:transescorta /home/transescorta/app

# Firewall konfigurieren
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
```

---

## 🎯 SCHRITT 3: Domain kaufen und einrichten

### 3.1 Domain kaufen
1. Gehen Sie zu einem Domain-Anbieter (z.B. Namecheap, GoDaddy, oder HostPro)
2. Kaufen Sie **transescorta.com**
3. Notieren Sie sich die **Nameserver** oder **DNS-Verwaltung**

### 3.2 DNS-Einstellungen

**In Ihrem Domain-Panel:**
1. Gehen Sie zu **DNS-Verwaltung**
2. Erstellen Sie diese **A-Records**:

| Name | Type | Value (Ihre VPS-IP) | TTL |
|------|------|---------------------|-----|
| @ | A | 185.123.45.67 | 3600 |
| www | A | 185.123.45.67 | 3600 |

**⏰ Warten Sie 2-24 Stunden** bis DNS weltweit aktualisiert ist.

**DNS testen:**
```bash
# Testen Sie auf Ihrem Computer:
nslookup transescorta.com
# Sollte Ihre VPS-IP zeigen
```

---

## 🎯 SCHRITT 4: Anwendung hochladen

### 4.1 Zu Anwendungsbenutzer wechseln
```bash
su - transescorta
cd /home/transescorta/app
```

### 4.2 Dateien hochladen

**Option A: Via GitHub (empfohlen)**
```bash
# Falls Sie GitHub verwenden:
git clone https://github.com/IHR-USERNAME/transescorta.git .
```

**Option B: Via SCP/SFTP**
1. Verwenden Sie **WinSCP** (Windows) oder **FileZilla**
2. Verbinden Sie sich mit:
   - Host: **Ihre VPS-IP**
   - Username: **transescorta**
   - Password: **gleicher wie root**
3. Laden Sie alle Dateien nach `/home/transescorta/app/` hoch

### 4.3 Berechtigungen setzen
```bash
chmod +x *.sh
```

---

## 🎯 SCHRITT 5: Environment-Variablen konfigurieren

### 5.1 Konfigurationsdatei erstellen
```bash
cp .env.example .env
nano .env
```

### 5.2 Wichtige Werte eintragen

**UNBEDINGT ÄNDERN:**
```bash
# Starke Geheimnisse generieren (verwenden Sie einen Passwort-Generator)
SESSION_SECRET="KOmPl3x-S3ss10n-G3h31mN1s-2024-XyZ9"
JWT_SECRET="S3hr-K0mPl3x3s-JWT-G3h31mN1s-Ab7#mK2L"

# Domain eintragen
DOMAIN="transescorta.com"

# Datenbank (belassen Sie diese Werte)
DATABASE_URL="postgresql://transescorta:S1ch3r3sP4ssw0rt@postgres:5432/transescorta"

# E-Mail konfigurieren (später einrichten)
EMAIL_USER="noreply@transescorta.com"
EMAIL_PASS="ihr-email-app-passwort"
```

**Speichern:** `Ctrl+X`, dann `Y`, dann `Enter`

---

## 🎯 SCHRITT 6: Services starten

### 6.1 Erstmaliges Deployment
```bash
./deploy.sh
```

**Das Script wird:**
- ✅ Docker Container bauen
- ✅ Datenbank erstellen
- ✅ Anwendung starten
- ✅ Status prüfen

### 6.2 Warten und testen
```bash
# Services prüfen
docker-compose ps

# Sollte zeigen:
# transescorta-app    Up
# transescorta-db     Up
# transescorta-nginx  Up
```

---

## 🎯 SCHRITT 7: SSL-Zertifikat einrichten

### 7.1 Automatic SSL-Setup
```bash
./ssl-setup.sh transescorta.com
```

**Das Script wird:**
- ✅ Let's Encrypt Zertifikat erstellen
- ✅ Automatische Erneuerung einrichten
- ✅ HTTPS aktivieren

---

## 🎯 SCHRITT 8: Website testen

### 8.1 Funktionalität prüfen

**Öffnen Sie in Ihrem Browser:**
- ✅ `http://transescorta.com` → sollte zu HTTPS weiterleiten
- ✅ `https://transescorta.com` → Website sollte laden

**Testen Sie:**
- ✅ Registrierung funktioniert
- ✅ Login funktioniert
- ✅ Profile werden angezeigt
- ✅ Chat funktioniert

---

## 🎯 SCHRITT 9: Weitere Services einrichten

### 9.1 Cloudinary (Bildupload)
1. Gehen Sie zu https://cloudinary.com
2. Erstellen Sie kostenloses Konto
3. Kopieren Sie: **Cloud Name**, **API Key**, **API Secret**
4. Tragen Sie in `.env` ein:
```bash
CLOUDINARY_CLOUD_NAME="ihr-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz12"
```

### 9.2 E-Mail Service
1. Verwenden Sie Gmail oder professionellen E-Mail Service
2. Erstellen Sie **App-Passwort**
3. Tragen Sie in `.env` ein:
```bash
EMAIL_USER="noreply@transescorta.com"
EMAIL_PASS="abcd efgh ijkl mnop"
EMAIL_FROM="TransEscorta <noreply@transescorta.com>"
```

### 9.3 Services neu starten
```bash
docker-compose restart
```

---

## 🔧 Nützliche Befehle

### Logs anzeigen
```bash
# Alle Logs
docker-compose logs -f

# Nur App-Logs
docker-compose logs -f transescorta

# Nur Datenbank-Logs
docker-compose logs -f postgres
```

### Services verwalten
```bash
# Status prüfen
docker-compose ps

# Services neu starten
docker-compose restart

# Services stoppen
docker-compose down

# Services starten
docker-compose up -d

# Neu deployment
./deploy.sh
```

### System-Monitoring
```bash
# Speicher und CPU
htop

# Festplatte
df -h

# Docker-Speicher
docker system df
```

---

## 🚨 Fehlerbehebung

### Problem: Website lädt nicht
```bash
# Services prüfen
docker-compose ps

# Logs prüfen
docker-compose logs

# Firewall prüfen
ufw status

# DNS prüfen
nslookup transescorta.com
```

### Problem: SSL funktioniert nicht
```bash
# SSL neu einrichten
./ssl-setup.sh transescorta.com

# Nginx neu starten
docker-compose restart nginx
```

### Problem: Datenbank-Fehler
```bash
# Datenbank-Logs
docker-compose logs postgres

# Datenbank neu starten
docker-compose restart postgres

# Migration erneut ausführen
docker-compose exec transescorta npm run db:push
```

---

## 📞 Support & Wartung

### Automatische Backups einrichten
```bash
# Daily backup script erstellen
cat > /home/transescorta/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U transescorta transescorta > /home/transescorta/backups/db_$DATE.sql
find /home/transescorta/backups -name "*.sql" -mtime +7 -delete
EOF

chmod +x /home/transescorta/backup.sh
mkdir -p /home/transescorta/backups

# Cron-Job einrichten
(crontab -l 2>/dev/null; echo "0 2 * * * /home/transescorta/backup.sh") | crontab -
```

### Updates einspielen
```bash
# Code aktualisieren
git pull origin main

# Neu deployment
./deploy.sh
```

---

## ✅ Checkliste: Alles erledigt?

- [ ] VPS eingerichtet und erreichbar
- [ ] Domain gekauft und DNS konfiguriert
- [ ] Anwendung hochgeladen
- [ ] Environment-Variablen konfiguriert
- [ ] Services gestartet
- [ ] SSL-Zertifikat eingerichtet
- [ ] Website funktioniert (HTTP → HTTPS)
- [ ] Registrierung/Login getestet
- [ ] Cloudinary eingerichtet
- [ ] E-Mail Service konfiguriert
- [ ] Backups eingerichtet

---

## 🎉 Herzlichen Glückwunsch!

**Ihre TransEscorta-Website ist jetzt online unter:**
**https://transescorta.com**

Bei Problemen oder Fragen, prüfen Sie zuerst die Logs mit:
```bash
docker-compose logs -f
```

**Viel Erfolg mit Ihrer Website! 🚀**