# Verotel FlexPay Setup Instructions

## Verotel Configuration für TransEscorta Premium-Zugang (€9.99 einmalig für 1 Monat)

### FlexPay Setup in Verotel Dashboard

**URLs in Verotel Dashboard konfigurieren:**

1. **Flexpay success URL:**
   ```
   https://transen.replit.app/premium-success
   ```

2. **Flexpay decline URL:**
   ```
   https://transen.replit.app/premium-declined
   ```

3. **Flexpay postback URL:**
   ```
   https://transen.replit.app/api/webhooks/verotel
   ```

4. **Flexpay cancel URL:**
   ```
   https://transen.replit.app/premium
   ```

### Verotel Konfiguration:
- **shopID:** 134573
- **Statische Signatur:** 2f500af84981e6c2919f0e0a885d40d8c552ab127b9e511b32630bf6823e410d

### Zahlungslink (statisch):
```
https://secure.verotel.com/startorder?description=TransEscorta+Premium+Abo&priceAmount=9.99&priceCurrency=EUR&shopID=134573&type=purchase&version=4&signature=2f500af84981e6c2919f0e0a885d40d8c552ab127b9e511b32630bf6823e410d
```

**So funktioniert es:**
- Nutzer klickt "Premium werden" → statischer Verotel-Link öffnet sich
- Einmalige Zahlung für 1 Monat Premium-Zugang (keine automatische Verlängerung)
- Nach Zahlung → Verotel leitet automatisch zu den konfigurierten URLs weiter  
- Postback webhook aktiviert Premium-Status für 1 Monat automatisch

## Wie Premium funktioniert:

### Für Nutzer:
1. Trans Escorts können über `/premium` das Premium Abo für €9.99/Monat kaufen
2. Weiterleitung zu Verotel in neuem Tab für sichere Zahlung
3. Nach erfolgreicher Zahlung: Weiterleitung zu `/premium-success`
4. Bei fehlgeschlagener Zahlung: Weiterleitung zu `/premium-declined`

### Premium Features:
1. **Premium Badge:** Goldene Krone im Profil
2. **Premium Sektion:** Erscheint in separater "Premium Escorts" Sektion auf Homepage
3. **Höhere Sichtbarkeit:** Priorität in Suchergebnissen
4. **Premium Navigation:** Eigener "Premium" Tab in der Navigation für Trans Escorts

### Technische Integration:
1. **Webhook Handler:** `/api/webhooks/verotel` verarbeitet Zahlungsbestätigungen
2. **Datenbank:** `isPremium` Flag wird automatisch gesetzt
3. **UI Updates:** Premium Badge und separate Sektionen werden angezeigt

### Test-Schritte:
1. Als Trans Escort anmelden
2. Zu `/premium` navigieren  
3. "Jetzt Premium werden" klicken
4. Zahlung bei Verotel durchführen
5. Zurück zur App - Premium Status sollte aktiv sein
6. Homepage prüfen - sollte in "Premium Escorts" Sektion erscheinen

## Support:
- Bei Problemen: merchantsupport@verotel.com
- Webhook-Logs werden in der Konsole angezeigt