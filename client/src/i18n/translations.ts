// TransEscorta - Mehrsprachige Übersetzungen
// Unterstützte Sprachen: Deutsch (Standard), Englisch, Portugiesisch, Spanisch, Französisch

export interface Translations {
  // Allgemeine Navigation
  home: string;
  profile: string;
  chat: string;
  favorites: string;
  more: string;
  settings: string;
  language: string;
  
  // Brand & Titel
  appName: string;
  appDescription: string;
  
  // Authentifizierung
  login: string;
  register: string;
  logout: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  forgotPassword: string;
  
  // Registrierung
  iAm: string;
  transEscort: string;
  transEscortDesc: string;
  customer: string;
  customerDesc: string;
  acceptTerms: string;
  termsOfUse: string;
  privacyPolicy: string;
  secureEncrypted: string;
  dataSecureSSL: string;
  registering: string;
  loggingIn: string;
  
  // Profile
  editProfile: string;
  myProfile: string;
  personalInfo: string;
  firstName: string;
  lastName: string;
  age: string;
  bio: string;
  location: string;
  detectLocation: string;
  
  // Physische Details
  physicalDetails: string;
  height: string;
  weight: string;
  bodyType: string;
  ethnicity: string;
  cockSize: string;
  circumcision: string;
  position: string;
  
  // Services & Interessen
  services: string;
  interests: string;
  pricing: string;
  hourlyRate: string;
  
  // Filter
  filter: string;
  clearFilters: string;
  applyFilters: string;
  ageRange: string;
  priceRange: string;
  cockSizeRange: string;
  onlyOnline: string;
  onlyPremium: string;
  
  // Chat
  messages: string;
  typeMessage: string;
  sendMessage: string;
  photoMessage: string;
  online: string;
  offline: string;
  lastSeen: string;
  
  // Premium
  premium: string;
  upgradePremium: string;
  premiumActive: string;
  premiumEscorts: string;
  newEscorts: string;
  nearbyEscorts: string;
  
  // Allgemeine Aktionen
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  
  // Auth validation messages
  emailPlaceholder: string;
  passwordPlaceholder: string;
  invalidEmail: string;
  passwordMinLength: string;
  usernameRequired: string;
  selectUserType: string;
  acceptTermsRequired: string;
  passwordsNoMatch: string;
  
  // Auth feedback messages  
  loginSuccess: string;
  loginFailed: string;
  welcomeBack: string;
  invalidCredentials: string;
  
  // Settings page
  manageAccount: string;
  settingSaved: string;
  privacySettingUpdated: string;
  settingNotSaved: string;
  
  // Additional auth fields
  usernamePlaceholder: string;
  
  // Push notifications
  pushNotificationsEnabled: string;
  pushNotificationsEnabledDesc: string;
  permissionDenied: string;
  pushNotificationsBrowserSettings: string;
  pushNotificationsNotActivated: string;
  
  // Logout
  logoutSuccess: string;
  logoutSuccessDesc: string;
  
  // Premium features
  premiumBadge: string;
  premiumBadgeDesc: string;
  premiumSection: string;
  premiumSectionDesc: string;
  priority: string;
  priorityDesc: string;
  moreVisibility: string;
  moreVisibilityDesc: string;
  chatPriority: string;
  chatPriorityDesc: string;
  extendedReach: string;
  extendedReachDesc: string;
  premiumUpgrade: string;
  premiumUpgradeDesc: string;
  premiumHeaderDesc: string;
  premiumMember: string;
  standardMember: string;
  oneMonthActive: string;
  premiumAccess: string;
  oneTimePaymentDesc: string;
  oneTime: string;
  loginRequired: string;
  loginRequiredDesc: string;
  redirectingToVerotel: string;
  redirectingToVerotelDesc: string;
  premiumAlreadyActive: string;
  enjoyingPremiumBenefits: string;
  redirecting: string;
  becomePremiumNow: string;
  securePaymentVerotel: string;
  secureAndDiscreet: string;
  securePaymentDesc: string;
  frequentlyAskedQuestions: string;
  autoRenewalQuestion: string;
  autoRenewalAnswer: string;
  paymentMethodsQuestion: string;
  paymentMethodsAnswer: string;
  premiumDurationQuestion: string;
  premiumDurationAnswer: string;
  
  // Location & Navigation
  myLocation: string;
  useCurrentLocation: string;
  detectingLocation: string;
  newEscorts: string;
  escortsIn: string;
  premiumEscorts: string;
  standardEscorts: string;
  noEscortsFound: string;
  
  // Search & Filter
  searchAndFilter: string;
  filterActive: string;
  clearFilters: string;
  applyFilters: string;
  
  // Home Page specific
  nearbyEscorts: string;
  
  // Location Selector
  selectLocation: string;
  activatingGPS: string;
  popularCities: string;
  allCities: string;
  selectCity: string;
  enterOtherCity: string;
  enterCityOrZip: string;
  
  // Filter Dialog
  reset: string;
  yearsShort: string;
  price: string;
  perHour: string;
  selectPosition: string;
  all: string;
  onlineOnly: string;
  premiumOnly: string;

  // Navigation & Chat
  chats: string;
  newMessage: string;
  noChatsYet: string;
  typeMessage: string;
  sendMessage: string;
  online: string;
  offline: string;
  lastSeen: string;
  typing: string;
  messageNotSent: string;
  unauthorized: string;
  notLoggedIn: string;
  redirecting: string;
  anonymousUser: string;

  // Profile
  profileNotAvailable: string;
  myProfile: string;
  profileUpdated: string;
  changesSaved: string;
  errorSaving: string;
  profileUpdateFailed: string;
  back: string;
  profilePhotos: string;
  basicInfo: string;
  editProfile: string;
  personalInfo: string;
  physicalDetails: string;
  servicesOffered: string;
  availableServices: string;
  selectServices: string;
  pricePerHour: string;
  location: string;
  interests: string;
  addInterest: string;
  profileUpdated: string;
  profileUpdateError: string;
  uploadPhoto: string;
  deletePhoto: string;
  mainPhoto: string;
  additionalPhotos: string;

  // Settings
  settings: string;
  premiumActive: string;
  premiumUpgrade: string;
  upgrade: string;
  account: string;
  privacy: string;
  notifications: string;
  appearance: string;
  support: string;
  darkMode: string;
  lightMode: string;
  language: string;
  changePassword: string;
  deleteAccount: string;
  contactSupport: string;
  faq: string;
  logout: string;
  pushNotifications: string;
  soundNotifications: string;
  vibrationNotifications: string;
  chatNotifications: string;
  profileViewNotifications: string;
  matchNotifications: string;
  profileVisibility: string;
  showOnlineStatus: string;
  showLastSeen: string;
  allowMessagePreviews: string;
  twoFactorAuth: string;
  dataExport: string;
  
  // Status & Nachrichten
  loading: string;
  error: string;
  success: string;
  noResults: string;
  
  // Körpertypen
  bodyTypes: {
    slim: string;
    athletic: string;
    average: string;
    curvy: string;
    plusSize: string;
    muscular: string;
  };
  
  // Ethnizitäten
  ethnicities: {
    caucasian: string;
    latino: string;
    asian: string;
    african: string;
    arabic: string;
    mixed: string;
  };
  
  // Position
  positions: {
    top: string;
    bottom: string;
    versatile: string;
  };
  
  // Beschneidung
  circumcisionTypes: {
    circumcised: string;
    uncircumcised: string;
    partial: string;
  };
}

export const translations: Record<string, Translations> = {
  de: {
    // Navigation
    home: 'Home',
    profile: 'Profil',
    chat: 'Chat',
    favorites: 'Favoriten',
    more: 'Mehr',
    settings: 'Einstellungen',
    language: 'Sprache',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Premium TS-Escorts Platform',
    
    // Auth
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    username: 'Benutzername',
    forgotPassword: 'Passwort vergessen?',
    
    // Auth validation messages
    emailPlaceholder: 'deine@email.com',
    passwordPlaceholder: 'Dein Passwort',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    passwordMinLength: 'Passwort muss mindestens 6 Zeichen lang sein',
    usernameRequired: 'Benutzername ist erforderlich',
    selectUserType: 'Bitte wähle deinen Kontotyp',
    acceptTermsRequired: 'Du musst die Nutzungsbedingungen und Datenschutzerklärung akzeptieren',
    passwordsNoMatch: 'Passwörter stimmen nicht überein',
    
    // Auth feedback messages  
    loginSuccess: 'Anmeldung erfolgreich!',
    loginFailed: 'Anmeldung fehlgeschlagen',
    welcomeBack: 'Willkommen zurück',
    invalidCredentials: 'Ungültige E-Mail oder Passwort',
    
    // Settings page
    manageAccount: 'Verwalte dein Konto und deine Präferenzen',
    settingSaved: 'Einstellung gespeichert',
    privacySettingUpdated: 'Deine Privatsphäre-Einstellung wurde aktualisiert',
    settingNotSaved: 'Einstellung konnte nicht gespeichert werden',
    
    // Additional auth fields
    usernamePlaceholder: 'Dein Benutzername',
    
    // Push notifications
    pushNotificationsEnabled: 'Push-Benachrichtigungen aktiviert',
    pushNotificationsEnabledDesc: 'Du erhältst jetzt Benachrichtigungen für neue Nachrichten',
    permissionDenied: 'Berechtigung verweigert',
    pushNotificationsBrowserSettings: 'Push-Benachrichtigungen können in den Browser-Einstellungen aktiviert werden',
    pushNotificationsNotActivated: 'Push-Benachrichtigungen konnten nicht aktiviert werden',
    
    // Logout
    logoutSuccess: 'Erfolgreich abgemeldet',
    logoutSuccessDesc: 'Du wurdest erfolgreich abgemeldet',
    
    // Premium features
    premiumBadge: 'Premium Badge',
    premiumBadgeDesc: 'Goldene Krone in deinem Profil für bessere Sichtbarkeit',
    premiumSection: 'Premium Sektion',
    premiumSectionDesc: 'Erscheine in der separaten Premium Escorts Sektion',
    priority: 'Priorität',
    priorityDesc: 'Höhere Platzierung in Suchergebnissen',
    moreVisibility: 'Mehr Sichtbarkeit',
    moreVisibilityDesc: 'Dein Profil wird häufiger angezeigt',
    chatPriority: 'Chat Priorität',
    chatPriorityDesc: 'Deine Nachrichten werden bevorzugt angezeigt',
    extendedReach: 'Erweiterte Reichweite',
    extendedReachDesc: 'Sichtbar in größerem Umkreis',
    premiumUpgrade: 'Premium Upgrade',
    premiumUpgradeDesc: 'Upgrade jetzt für nur €9.99 für 1 Monat Premium-Zugang',
    premiumHeaderDesc: 'Steigere deine Sichtbarkeit und erhalte mehr Anfragen mit unserem Premium-Zugang',
    premiumMember: 'Premium Mitglied',
    standardMember: 'Standard Mitglied',
    oneMonthActive: '1 Monat aktiv',
    premiumAccess: 'Premium Zugang',
    oneTimePaymentDesc: 'Einmalige Zahlung für 1 Monat Premium • Keine automatische Verlängerung',
    oneTime: 'einmalig',
    loginRequired: 'Anmeldung erforderlich',
    loginRequiredDesc: 'Bitte melde dich an, um Premium zu aktivieren',
    redirectingToVerotel: 'Weiterleitung zu Verotel',
    redirectingToVerotelDesc: 'Du wirst zur sicheren Zahlungsseite weitergeleitet',
    premiumAlreadyActive: 'Premium bereits aktiv',
    enjoyingPremiumBenefits: 'Du genießt bereits alle Premium-Vorteile',
    redirecting: 'Weiterleitung...',
    becomePremiumNow: 'Jetzt Premium werden',
    securePaymentVerotel: 'Sichere Zahlung über Verotel • SSL-verschlüsselt',
    secureAndDiscreet: 'Sicher & Diskret',
    securePaymentDesc: 'Alle Zahlungen werden sicher über Verotel abgewickelt. Auf deiner Kreditkartenabrechnung erscheint "Verotel" - nicht "TransEscorta".',
    frequentlyAskedQuestions: 'Häufige Fragen',
    autoRenewalQuestion: 'Verlängert sich der Zugang automatisch?',
    autoRenewalAnswer: 'Nein, es handelt sich um eine einmalige Zahlung für 1 Monat. Keine automatische Verlängerung.',
    paymentMethodsQuestion: 'Welche Zahlungsmethoden werden akzeptiert?',
    paymentMethodsAnswer: 'Kreditkarten (Visa, Mastercard), Debitkarten und weitere lokale Zahlungsmethoden über Verotel.',
    premiumDurationQuestion: 'Wie lange ist der Premium-Zugang gültig?',
    premiumDurationAnswer: 'Der Premium-Zugang ist ab Aktivierung genau 1 Monat (30 Tage) gültig.',
    
    // Location & Navigation
    myLocation: 'Mein Standort',
    useCurrentLocation: 'Aktuellen Standort verwenden',
    detectingLocation: 'Standort wird ermittelt...',
    newEscorts: 'Neue Escorts',
    escortsIn: 'Escorts in',
    premiumEscorts: 'Premium Escorts',
    standardEscorts: 'Standard Escorts',
    noEscortsFound: 'Keine Escorts gefunden',
    
    // Search & Filter
    searchAndFilter: 'Suche & Filter',
    filterActive: 'Filter aktiv',
    clearFilters: 'Filter löschen',
    applyFilters: 'Filter anwenden',
    
    // Home Page specific
    nearbyEscorts: 'Escorts in der Nähe',
    
    // Location Selector
    selectLocation: 'Standort auswählen',
    activatingGPS: 'GPS wird aktiviert...',
    popularCities: 'Beliebte Städte',
    allCities: 'Alle Städte',
    selectCity: 'Stadt auswählen...',
    enterOtherCity: 'Andere Stadt eingeben',
    enterCityOrZip: 'Stadt oder Postleitzahl eingeben...',
    
    // Filter Dialog
    reset: 'Zurücksetzen',
    yearsShort: 'J',
    price: 'Preis',
    perHour: 'pro Stunde',
    selectPosition: 'Position wählen...',
    all: 'Alle',
    onlineOnly: 'Nur Online-Escorts',
    premiumOnly: 'Nur Premium-Escorts',

    // Navigation & Chat
    chats: 'Chats',
    newMessage: 'Neue Nachricht',
    noChatsYet: 'Noch keine Chats',
    typeMessage: 'Nachricht eingeben...',
    sendMessage: 'Senden',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Zuletzt gesehen',
    typing: 'tippt...',
    messageNotSent: 'Nachricht konnte nicht gesendet werden',
    unauthorized: 'Nicht autorisiert',
    notLoggedIn: 'Du bist nicht mehr angemeldet. Leite weiter...',
    redirecting: 'Weiterleitung...',
    anonymousUser: 'Anonymer Nutzer',

    // Profile
    profileNotAvailable: 'Profil nicht verfügbar',
    myProfile: 'Mein Profil',
    profileUpdated: 'Profil aktualisiert',
    changesSaved: 'Deine Änderungen wurden erfolgreich gespeichert.',
    errorSaving: 'Fehler beim Speichern',
    profileUpdateFailed: 'Profil konnte nicht aktualisiert werden.',
    back: 'Zurück',
    profilePhotos: 'Profilbilder',
    basicInfo: 'Grundinformationen',
    editProfile: 'Profil bearbeiten',
    personalInfo: 'Persönliche Informationen',
    physicalDetails: 'Körperliche Merkmale',
    servicesOffered: 'Angebotene Services',
    availableServices: 'Verfügbare Services',
    selectServices: 'Services auswählen',
    pricePerHour: 'Preis pro Stunde',
    location: 'Standort',
    interests: 'Interessen',
    addInterest: 'Interesse hinzufügen',
    profileUpdated: 'Profil aktualisiert',
    profileUpdateError: 'Fehler beim Aktualisieren des Profils',
    uploadPhoto: 'Foto hochladen',
    deletePhoto: 'Foto löschen',
    mainPhoto: 'Hauptfoto',
    additionalPhotos: 'Zusätzliche Fotos',

    // Settings
    settings: 'Einstellungen',
    premiumActive: 'Premium aktiv',
    premiumUpgrade: 'Premium Upgrade',
    upgrade: 'Upgrade',
    account: 'Konto',
    privacy: 'Privatsphäre',
    notifications: 'Benachrichtigungen',
    appearance: 'Darstellung',
    support: 'Support',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    language: 'Sprache',
    changePassword: 'Passwort ändern',
    deleteAccount: 'Konto löschen',
    contactSupport: 'Support kontaktieren',
    faq: 'Häufige Fragen',
    logout: 'Abmelden',
    pushNotifications: 'Push-Benachrichtigungen',
    soundNotifications: 'Ton-Benachrichtigungen',
    vibrationNotifications: 'Vibrations-Benachrichtigungen',
    chatNotifications: 'Chat-Benachrichtigungen',
    profileViewNotifications: 'Profilansicht-Benachrichtigungen',
    matchNotifications: 'Match-Benachrichtigungen',
    profileVisibility: 'Profil-Sichtbarkeit',
    showOnlineStatus: 'Online-Status anzeigen',
    showLastSeen: 'Zuletzt gesehen anzeigen',
    allowMessagePreviews: 'Nachrichten-Vorschau erlauben',
    twoFactorAuth: 'Zwei-Faktor-Authentifizierung',
    dataExport: 'Datenexport',
    
    // Registrierung
    iAm: 'Ich bin',
    transEscort: 'Trans Escort',
    transEscortDesc: 'Ich biete Services an',
    customer: 'Kunde',
    customerDesc: 'Ich suche Services',
    acceptTerms: 'Ich akzeptiere die',
    termsOfUse: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutzerklärung',
    secureEncrypted: 'Sicher & Verschlüsselt',
    dataSecureSSL: 'Deine Daten werden SSL-verschlüsselt und sicher gespeichert',
    registering: 'Registrieren...',
    loggingIn: 'Anmelden...',
    
    // Profile
    editProfile: 'Profil bearbeiten',
    myProfile: 'Mein Profil',
    personalInfo: 'Persönliche Informationen',
    firstName: 'Vorname',
    lastName: 'Nachname',
    age: 'Alter',
    bio: 'Beschreibung',
    location: 'Standort',
    detectLocation: 'Standort erkennen',
    
    // Physisch
    physicalDetails: 'Körperliche Details',
    height: 'Größe',
    weight: 'Gewicht',
    bodyType: 'Körpertyp',
    ethnicity: 'Ethnizität',
    cockSize: 'Schwanzgröße',
    circumcision: 'Beschneidung',
    position: 'Position',
    
    // Services
    services: 'Services',
    interests: 'Interessen',
    pricing: 'Preise',
    hourlyRate: 'Stundensatz',
    
    // Filter
    filter: 'Filter',
    ageRange: 'Altersbereich',
    priceRange: 'Preisbereich',
    cockSizeRange: 'Schwanzgröße',
    onlyOnline: 'Nur Online-Escorts',
    onlyPremium: 'Nur Premium-Escorts',
    
    // Chat
    messages: 'Nachrichten',
    typeMessage: 'Nachricht eingeben...',
    sendMessage: 'Senden',
    photoMessage: 'Foto senden',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Zuletzt online',
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Premium Upgrade',
    premiumActive: 'Premium aktiv',
    
    // Aktionen
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    search: 'Suchen',
    
    // Status
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    noResults: 'Keine Ergebnisse',
    
    // Optionen
    bodyTypes: {
      slim: 'Schlank',
      athletic: 'Athletisch',
      average: 'Durchschnittlich',
      curvy: 'Kurvig',
      plusSize: 'Plus Size',
      muscular: 'Muskulös',
    },
    
    ethnicities: {
      caucasian: 'Kaukasisch',
      latino: 'Lateinamerikanisch',
      asian: 'Asiatisch',
      african: 'Afrikanisch',
      arabic: 'Arabisch',
      mixed: 'Gemischt',
    },
    
    positions: {
      top: 'Top/Aktiv',
      bottom: 'Bottom/Passiv',
      versatile: 'Versatile/Switch',
    },
    
    circumcisionTypes: {
      circumcised: 'Beschnitten',
      uncircumcised: 'Unbeschnitten',
      partial: 'Teilweise',
    },
  },
  
  en: {
    // Navigation
    home: 'Home',
    profile: 'Profile',
    chat: 'Chat',
    favorites: 'Favorites',
    more: 'More',
    settings: 'Settings',
    language: 'Language',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Premium TS-Escorts Platform',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    username: 'Username',
    forgotPassword: 'Forgot Password?',
    
    // Auth validation messages
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Your password',
    invalidEmail: 'Invalid email address',
    passwordMinLength: 'Password must be at least 6 characters',
    usernameRequired: 'Username is required',
    selectUserType: 'Please select your account type',
    acceptTermsRequired: 'You must accept the terms and privacy policy',
    passwordsNoMatch: 'Passwords do not match',
    
    // Auth feedback messages  
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed',
    welcomeBack: 'Welcome back',
    invalidCredentials: 'Invalid email or password',
    
    // Settings page
    manageAccount: 'Manage your account and preferences',
    settingSaved: 'Setting saved',
    privacySettingUpdated: 'Your privacy setting has been updated',
    settingNotSaved: 'Setting could not be saved',
    
    // Additional auth fields
    usernamePlaceholder: 'Your username',
    
    // Push notifications
    pushNotificationsEnabled: 'Push notifications enabled',
    pushNotificationsEnabledDesc: 'You will now receive notifications for new messages',
    permissionDenied: 'Permission denied',
    pushNotificationsBrowserSettings: 'Push notifications can be enabled in browser settings',
    pushNotificationsNotActivated: 'Push notifications could not be activated',
    
    // Logout
    logoutSuccess: 'Successfully logged out',
    logoutSuccessDesc: 'You have been successfully logged out',
    
    // Premium features
    premiumBadge: 'Premium Badge',
    premiumBadgeDesc: 'Golden crown in your profile for better visibility',
    premiumSection: 'Premium Section',
    premiumSectionDesc: 'Appear in the separate Premium Escorts section',
    priority: 'Priority',
    priorityDesc: 'Higher placement in search results',
    moreVisibility: 'More Visibility',
    moreVisibilityDesc: 'Your profile will be shown more frequently',
    chatPriority: 'Chat Priority',
    chatPriorityDesc: 'Your messages will be displayed preferentially',
    extendedReach: 'Extended Reach',
    extendedReachDesc: 'Visible in a larger radius',
    premiumUpgrade: 'Premium Upgrade',
    premiumUpgradeDesc: 'Upgrade now for just €9.99 for 1 month Premium access',
    premiumHeaderDesc: 'Increase your visibility and get more requests with our Premium access',
    premiumMember: 'Premium Member',
    standardMember: 'Standard Member',
    oneMonthActive: '1 month active',
    premiumAccess: 'Premium Access',
    oneTimePaymentDesc: 'One-time payment for 1 month Premium • No automatic renewal',
    oneTime: 'one-time',
    loginRequired: 'Login required',
    loginRequiredDesc: 'Please log in to activate Premium',
    redirectingToVerotel: 'Redirecting to Verotel',
    redirectingToVerotelDesc: 'You will be redirected to the secure payment page',
    premiumAlreadyActive: 'Premium already active',
    enjoyingPremiumBenefits: 'You are already enjoying all Premium benefits',
    redirecting: 'Redirecting...',
    becomePremiumNow: 'Become Premium now',
    securePaymentVerotel: 'Secure payment via Verotel • SSL encrypted',
    secureAndDiscreet: 'Secure & Discreet',
    securePaymentDesc: 'All payments are processed securely via Verotel. "Verotel" will appear on your credit card statement - not "TransEscorta".',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    autoRenewalQuestion: 'Does access renew automatically?',
    autoRenewalAnswer: 'No, this is a one-time payment for 1 month. No automatic renewal.',
    paymentMethodsQuestion: 'What payment methods are accepted?',
    paymentMethodsAnswer: 'Credit cards (Visa, Mastercard), debit cards and other local payment methods via Verotel.',
    premiumDurationQuestion: 'How long is Premium access valid?',
    premiumDurationAnswer: 'Premium access is valid for exactly 1 month (30 days) from activation.',
    
    // Location & Navigation
    myLocation: 'My Location',
    useCurrentLocation: 'Use Current Location',
    detectingLocation: 'Detecting location...',
    newEscorts: 'New Escorts',
    escortsIn: 'Escorts in',
    premiumEscorts: 'Premium Escorts',
    standardEscorts: 'Standard Escorts',
    noEscortsFound: 'No escorts found',
    
    // Search & Filter
    searchAndFilter: 'Search & Filter',
    filterActive: 'Filter active',
    clearFilters: 'Clear filters',
    applyFilters: 'Apply filters',
    
    // Home Page specific
    nearbyEscorts: 'Nearby Escorts',
    
    // Location Selector
    selectLocation: 'Select Location',
    activatingGPS: 'Activating GPS...',
    popularCities: 'Popular Cities',
    allCities: 'All Cities',
    selectCity: 'Select city...',
    enterOtherCity: 'Enter other city',
    enterCityOrZip: 'Enter city or zip code...',
    
    // Filter Dialog
    reset: 'Reset',
    yearsShort: 'Y',
    price: 'Price',
    perHour: 'per hour',
    selectPosition: 'Select position...',
    all: 'All',
    onlineOnly: 'Online Only',
    premiumOnly: 'Premium Only',

    // Navigation & Chat
    chats: 'Chats',
    newMessage: 'New Message',
    noChatsYet: 'No chats yet',
    typeMessage: 'Type a message...',
    sendMessage: 'Send',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Last seen',
    typing: 'typing...',
    messageNotSent: 'Message could not be sent',
    unauthorized: 'Unauthorized',
    notLoggedIn: 'You are no longer logged in. Redirecting...',
    redirecting: 'Redirecting...',
    anonymousUser: 'Anonymous User',

    // Profile
    profileNotAvailable: 'Profile not available',
    myProfile: 'My Profile',
    profileUpdated: 'Profile Updated',
    changesSaved: 'Your changes have been saved successfully.',
    errorSaving: 'Error Saving',
    profileUpdateFailed: 'Profile could not be updated.',
    back: 'Back',
    profilePhotos: 'Profile Photos',
    basicInfo: 'Basic Information',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    physicalDetails: 'Physical Details',
    servicesOffered: 'Services Offered',
    availableServices: 'Available Services',
    selectServices: 'Select Services',
    pricePerHour: 'Price per Hour',
    location: 'Location',
    interests: 'Interests',
    addInterest: 'Add Interest',
    profileUpdated: 'Profile Updated',
    profileUpdateError: 'Error updating profile',
    uploadPhoto: 'Upload Photo',
    deletePhoto: 'Delete Photo',
    mainPhoto: 'Main Photo',
    additionalPhotos: 'Additional Photos',

    // Settings
    settings: 'Settings',
    premiumActive: 'Premium Active',
    premiumUpgrade: 'Premium Upgrade',
    upgrade: 'Upgrade',
    account: 'Account',
    privacy: 'Privacy',
    notifications: 'Notifications',
    appearance: 'Appearance',
    support: 'Support',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    contactSupport: 'Contact Support',
    faq: 'FAQ',
    logout: 'Logout',
    pushNotifications: 'Push Notifications',
    soundNotifications: 'Sound Notifications',
    vibrationNotifications: 'Vibration Notifications',
    chatNotifications: 'Chat Notifications',
    profileViewNotifications: 'Profile View Notifications',
    matchNotifications: 'Match Notifications',
    profileVisibility: 'Profile Visibility',
    showOnlineStatus: 'Show Online Status',
    showLastSeen: 'Show Last Seen',
    allowMessagePreviews: 'Allow Message Previews',
    twoFactorAuth: 'Two-Factor Authentication',
    dataExport: 'Data Export',
    
    // Registrierung
    iAm: 'I am',
    transEscort: 'Trans Escort',
    transEscortDesc: 'I offer services',
    customer: 'Customer',
    customerDesc: 'I seek services',
    acceptTerms: 'I accept the',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    secureEncrypted: 'Secure & Encrypted',
    dataSecureSSL: 'Your data is SSL-encrypted and securely stored',
    registering: 'Registering...',
    loggingIn: 'Logging in...',
    
    // Profile
    editProfile: 'Edit Profile',
    myProfile: 'My Profile',
    personalInfo: 'Personal Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    bio: 'Bio',
    location: 'Location',
    detectLocation: 'Detect Location',
    
    // Physisch
    physicalDetails: 'Physical Details',
    height: 'Height',
    weight: 'Weight',
    bodyType: 'Body Type',
    ethnicity: 'Ethnicity',
    cockSize: 'Size',
    circumcision: 'Circumcision',
    position: 'Position',
    
    // Services
    services: 'Services',
    interests: 'Interests',
    pricing: 'Pricing',
    hourlyRate: 'Hourly Rate',
    
    // Filter
    filter: 'Filter',
    ageRange: 'Age Range',
    priceRange: 'Price Range',
    cockSizeRange: 'Size Range',
    onlyOnline: 'Online Only',
    onlyPremium: 'Premium Only',
    
    // Chat
    messages: 'Messages',
    typeMessage: 'Type a message...',
    sendMessage: 'Send',
    photoMessage: 'Send Photo',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Last seen',
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Upgrade Premium',
    premiumActive: 'Premium Active',

    
    // Aktionen
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    
    // Status
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noResults: 'No Results',
    
    // Optionen
    bodyTypes: {
      slim: 'Slim',
      athletic: 'Athletic',
      average: 'Average',
      curvy: 'Curvy',
      plusSize: 'Plus Size',
      muscular: 'Muscular',
    },
    
    ethnicities: {
      caucasian: 'Caucasian',
      latino: 'Latino',
      asian: 'Asian',
      african: 'African',
      arabic: 'Arabic',
      mixed: 'Mixed',
    },
    
    positions: {
      top: 'Top/Active',
      bottom: 'Bottom/Passive',
      versatile: 'Versatile/Switch',
    },
    
    circumcisionTypes: {
      circumcised: 'Circumcised',
      uncircumcised: 'Uncircumcised',
      partial: 'Partial',
    },
  },
  
  pt: {
    // Navigation
    home: 'Início',
    profile: 'Perfil',
    chat: 'Chat',
    favorites: 'Favoritos',
    more: 'Mais',
    settings: 'Configurações',
    language: 'Idioma',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Plataforma Premium de TS-Escorts',
    
    // Auth
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Sair',
    email: 'Email',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    username: 'Nome de Usuário',
    forgotPassword: 'Esqueceu a Senha?',
    
    // Registrierung
    iAm: 'Eu sou',
    transEscort: 'Trans Escort',
    transEscortDesc: 'Ofereço serviços',
    customer: 'Cliente',
    customerDesc: 'Procuro serviços',
    acceptTerms: 'Aceito os',
    termsOfUse: 'Termos de Uso',
    privacyPolicy: 'Política de Privacidade',
    secureEncrypted: 'Seguro & Criptografado',
    dataSecureSSL: 'Seus dados são criptografados SSL e armazenados com segurança',
    registering: 'Registrando...',
    loggingIn: 'Entrando...',
    
    // Profile
    editProfile: 'Editar Perfil',
    myProfile: 'Meu Perfil',
    personalInfo: 'Informações Pessoais',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    age: 'Idade',
    bio: 'Biografia',
    location: 'Localização',
    detectLocation: 'Detectar Localização',
    
    // Physisch
    physicalDetails: 'Detalhes Físicos',
    height: 'Altura',
    weight: 'Peso',
    bodyType: 'Tipo Corporal',
    ethnicity: 'Etnia',
    cockSize: 'Tamanho',
    circumcision: 'Circuncisão',
    position: 'Posição',
    
    // Services
    services: 'Serviços',
    interests: 'Interesses',
    pricing: 'Preços',
    hourlyRate: 'Taxa por Hora',
    
    // Filter
    filter: 'Filtro',
    clearFilters: 'Limpar Filtros',
    applyFilters: 'Aplicar Filtros',
    ageRange: 'Faixa Etária',
    priceRange: 'Faixa de Preço',
    cockSizeRange: 'Faixa de Tamanho',
    onlyOnline: 'Apenas Online',
    onlyPremium: 'Apenas Premium',
    
    // Chat
    messages: 'Mensagens',
    typeMessage: 'Digite uma mensagem...',
    sendMessage: 'Enviar',
    photoMessage: 'Enviar Foto',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Visto por último',
    
    // Auth validation messages
    emailPlaceholder: 'seu@email.com',
    passwordPlaceholder: 'Sua senha',
    invalidEmail: 'Endereço de email inválido',
    passwordMinLength: 'A senha deve ter pelo menos 6 caracteres',
    usernameRequired: 'Nome de usuário é obrigatório',
    selectUserType: 'Por favor, selecione seu tipo de conta',
    acceptTermsRequired: 'Você deve aceitar os termos e política de privacidade',
    passwordsNoMatch: 'As senhas não coincidem',
    
    // Auth feedback messages  
    loginSuccess: 'Login realizado com sucesso!',
    loginFailed: 'Falha no login',
    welcomeBack: 'Bem-vindo de volta',
    invalidCredentials: 'Email ou senha inválidos',
    
    // Settings page
    manageAccount: 'Gerencie sua conta e preferências',
    settingSaved: 'Configuração salva',
    privacySettingUpdated: 'Sua configuração de privacidade foi atualizada',
    settingNotSaved: 'Configuração não pôde ser salva',
    
    // Additional auth fields
    usernamePlaceholder: 'Seu nome de usuário',
    
    // Push notifications
    pushNotificationsEnabled: 'Notificações push ativadas',
    pushNotificationsEnabledDesc: 'Você agora receberá notificações para novas mensagens',
    permissionDenied: 'Permissão negada',
    pushNotificationsBrowserSettings: 'Notificações push podem ser ativadas nas configurações do navegador',
    pushNotificationsNotActivated: 'Notificações push não puderam ser ativadas',
    
    // Logout
    logoutSuccess: 'Logout realizado com sucesso',
    logoutSuccessDesc: 'Você foi desconectado com sucesso',
    
    // Premium features
    premiumBadge: 'Badge Premium',
    premiumBadgeDesc: 'Coroa dourada no seu perfil para melhor visibilidade',
    premiumSection: 'Seção Premium',
    premiumSectionDesc: 'Apareça na seção separada de Escorts Premium',
    priority: 'Prioridade',
    priorityDesc: 'Colocação mais alta nos resultados de busca',
    moreVisibility: 'Mais Visibilidade',
    moreVisibilityDesc: 'Seu perfil será mostrado com mais frequência',
    chatPriority: 'Prioridade no Chat',
    chatPriorityDesc: 'Suas mensagens serão exibidas preferencialmente',
    extendedReach: 'Alcance Estendido',
    extendedReachDesc: 'Visível em um raio maior',
    premiumUpgrade: 'Upgrade Premium',
    premiumUpgradeDesc: 'Faça upgrade agora por apenas €9.99 por 1 mês de acesso Premium',
    premiumHeaderDesc: 'Aumente sua visibilidade e receba mais solicitações com nosso acesso Premium',
    premiumMember: 'Membro Premium',
    standardMember: 'Membro Padrão',
    oneMonthActive: '1 mês ativo',
    premiumAccess: 'Acesso Premium',
    oneTimePaymentDesc: 'Pagamento único por 1 mês Premium • Sem renovação automática',
    oneTime: 'único',
    loginRequired: 'Login necessário',
    loginRequiredDesc: 'Por favor, faça login para ativar o Premium',
    redirectingToVerotel: 'Redirecionando para Verotel',
    redirectingToVerotelDesc: 'Você será redirecionado para a página de pagamento seguro',
    premiumAlreadyActive: 'Premium já ativo',
    enjoyingPremiumBenefits: 'Você já está aproveitando todos os benefícios Premium',
    redirecting: 'Redirecionando...',
    becomePremiumNow: 'Tornar-se Premium agora',
    securePaymentVerotel: 'Pagamento seguro via Verotel • Criptografia SSL',
    secureAndDiscreet: 'Seguro e Discreto',
    securePaymentDesc: 'Todos os pagamentos são processados com segurança via Verotel. "Verotel" aparecerá na sua fatura do cartão de crédito - não "TransEscorta".',
    frequentlyAskedQuestions: 'Perguntas Frequentes',
    autoRenewalQuestion: 'O acesso renova automaticamente?',
    autoRenewalAnswer: 'Não, este é um pagamento único por 1 mês. Sem renovação automática.',
    paymentMethodsQuestion: 'Quais métodos de pagamento são aceitos?',
    paymentMethodsAnswer: 'Cartões de crédito (Visa, Mastercard), cartões de débito e outros métodos de pagamento locais via Verotel.',
    premiumDurationQuestion: 'Por quanto tempo o acesso Premium é válido?',
    premiumDurationAnswer: 'O acesso Premium é válido por exatamente 1 mês (30 dias) a partir da ativação.',
    
    // Location & Navigation
    myLocation: 'Minha Localização',
    useCurrentLocation: 'Usar Localização Atual',
    detectingLocation: 'Detectando localização...',
    newEscorts: 'Novas Escorts',
    escortsIn: 'Escorts em',
    premiumEscorts: 'Escorts Premium',
    standardEscorts: 'Escorts Padrão',
    noEscortsFound: 'Nenhuma escort encontrada',
    
    // Search & Filter
    searchAndFilter: 'Busca e Filtro',
    filterActive: 'Filtro ativo',

    
    // Home Page specific
    nearbyEscorts: 'Escorts Próximas',
    
    // Location Selector
    selectLocation: 'Selecionar Localização',
    activatingGPS: 'Ativando GPS...',
    popularCities: 'Cidades Populares',
    allCities: 'Todas as Cidades',
    selectCity: 'Selecionar cidade...',
    enterOtherCity: 'Inserir outra cidade',
    enterCityOrZip: 'Inserir cidade ou código postal...',
    
    // Filter Dialog
    reset: 'Redefinir',
    yearsShort: 'A',
    price: 'Preço',
    perHour: 'por hora',
    selectPosition: 'Selecionar posição...',
    all: 'Todos',
    onlineOnly: 'Apenas Online',
    premiumOnly: 'Apenas Premium',

    // Navigation & Chat
    chats: 'Chats',
    newMessage: 'Nova Mensagem',
    noChatsYet: 'Ainda sem chats',
    typeMessage: 'Digite uma mensagem...',
    sendMessage: 'Enviar',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Visto por último',
    typing: 'digitando...',
    messageNotSent: 'Mensagem não pôde ser enviada',
    unauthorized: 'Não autorizado',
    notLoggedIn: 'Você não está mais logado. Redirecionando...',
    redirecting: 'Redirecionando...',
    anonymousUser: 'Usuário Anônimo',

    // Profile
    profileNotAvailable: 'Perfil não disponível',
    myProfile: 'Meu Perfil',
    profileUpdated: 'Perfil Atualizado',
    changesSaved: 'Suas alterações foram salvas com sucesso.',
    errorSaving: 'Erro ao Salvar',
    profileUpdateFailed: 'Perfil não pôde ser atualizado.',
    back: 'Voltar',
    profilePhotos: 'Fotos do Perfil',
    basicInfo: 'Informações Básicas',
    editProfile: 'Editar Perfil',
    personalInfo: 'Informações Pessoais',
    physicalDetails: 'Detalhes Físicos',
    servicesOffered: 'Serviços Oferecidos',
    availableServices: 'Serviços Disponíveis',
    selectServices: 'Selecionar Serviços',
    pricePerHour: 'Preço por Hora',
    location: 'Localização',
    interests: 'Interesses',
    addInterest: 'Adicionar Interesse',
    profileUpdated: 'Perfil Atualizado',
    profileUpdateError: 'Erro ao atualizar perfil',
    uploadPhoto: 'Enviar Foto',
    deletePhoto: 'Excluir Foto',
    mainPhoto: 'Foto Principal',
    additionalPhotos: 'Fotos Adicionais',

    // Settings
    settings: 'Configurações',
    premiumActive: 'Premium Ativo',
    premiumUpgrade: 'Upgrade Premium',
    upgrade: 'Upgrade',
    account: 'Conta',
    privacy: 'Privacidade',
    notifications: 'Notificações',
    appearance: 'Aparência',
    support: 'Suporte',
    darkMode: 'Modo Escuro',
    lightMode: 'Modo Claro',
    language: 'Idioma',
    changePassword: 'Alterar Senha',
    deleteAccount: 'Excluir Conta',
    contactSupport: 'Contatar Suporte',
    faq: 'Perguntas Frequentes',
    logout: 'Sair',
    pushNotifications: 'Notificações Push',
    soundNotifications: 'Notificações Sonoras',
    vibrationNotifications: 'Notificações Vibratórias',
    chatNotifications: 'Notificações de Chat',
    profileViewNotifications: 'Notificações de Visualização de Perfil',
    matchNotifications: 'Notificações de Match',
    profileVisibility: 'Visibilidade do Perfil',
    showOnlineStatus: 'Mostrar Status Online',
    showLastSeen: 'Mostrar Última Visualização',
    allowMessagePreviews: 'Permitir Pré-visualizações de Mensagem',
    twoFactorAuth: 'Autenticação de Dois Fatores',
    dataExport: 'Exportação de Dados',
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Upgrade Premium',
    premiumActive: 'Premium Ativo',

    
    // Aktionen
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    search: 'Buscar',
    
    // Status
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    noResults: 'Nenhum Resultado',
    
    // Optionen
    bodyTypes: {
      slim: 'Magro',
      athletic: 'Atlético',
      average: 'Médio',
      curvy: 'Curvilíneo',
      plusSize: 'Plus Size',
      muscular: 'Musculoso',
    },
    
    ethnicities: {
      caucasian: 'Caucasiano',
      latino: 'Latino',
      asian: 'Asiático',
      african: 'Africano',
      arabic: 'Árabe',
      mixed: 'Misto',
    },
    
    positions: {
      top: 'Ativo',
      bottom: 'Passivo',
      versatile: 'Versátil',
    },
    
    circumcisionTypes: {
      circumcised: 'Circuncidado',
      uncircumcised: 'Não Circuncidado',
      partial: 'Parcial',
    },
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    profile: 'Perfil',
    chat: 'Chat',
    favorites: 'Favoritos',
    more: 'Más',
    settings: 'Configuración',
    language: 'Idioma',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Plataforma Premium de TS-Escorts',
    
    // Auth
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Email',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    username: 'Nombre de Usuario',
    forgotPassword: '¿Olvidaste la Contraseña?',
    
    // Registrierung
    iAm: 'Soy',
    transEscort: 'Trans Escort',
    transEscortDesc: 'Ofrezco servicios',
    customer: 'Cliente',
    customerDesc: 'Busco servicios',
    acceptTerms: 'Acepto los',
    termsOfUse: 'Términos de Uso',
    privacyPolicy: 'Política de Privacidad',
    secureEncrypted: 'Seguro y Encriptado',
    dataSecureSSL: 'Tus datos están encriptados SSL y almacenados de forma segura',
    registering: 'Registrando...',
    loggingIn: 'Iniciando sesión...',
    
    // Profile
    editProfile: 'Editar Perfil',
    myProfile: 'Mi Perfil',
    personalInfo: 'Información Personal',
    firstName: 'Nombre',
    lastName: 'Apellido',
    age: 'Edad',
    bio: 'Biografía',
    location: 'Ubicación',
    detectLocation: 'Detectar Ubicación',
    
    // Physisch
    physicalDetails: 'Detalles Físicos',
    height: 'Altura',
    weight: 'Peso',
    bodyType: 'Tipo de Cuerpo',
    ethnicity: 'Etnia',
    cockSize: 'Tamaño',
    circumcision: 'Circuncisión',
    position: 'Posición',
    
    // Services
    services: 'Servicios',
    interests: 'Intereses',
    pricing: 'Precios',
    hourlyRate: 'Tarifa por Hora',
    
    // Filter
    filter: 'Filtro',
    clearFilters: 'Limpiar Filtros',
    applyFilters: 'Aplicar Filtros',
    ageRange: 'Rango de Edad',
    priceRange: 'Rango de Precio',
    cockSizeRange: 'Rango de Tamaño',
    onlyOnline: 'Solo En Línea',
    onlyPremium: 'Solo Premium',
    
    // Chat
    messages: 'Mensajes',
    typeMessage: 'Escribe un mensaje...',
    sendMessage: 'Enviar',
    photoMessage: 'Enviar Foto',
    online: 'En Línea',
    offline: 'Desconectado',
    lastSeen: 'Visto por última vez',
    
    // Auth validation messages
    emailPlaceholder: 'tu@email.com',
    passwordPlaceholder: 'Tu contraseña',
    invalidEmail: 'Dirección de email inválida',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    usernameRequired: 'El nombre de usuario es obligatorio',
    selectUserType: 'Por favor selecciona tu tipo de cuenta',
    acceptTermsRequired: 'Debes aceptar los términos y política de privacidad',
    passwordsNoMatch: 'Las contraseñas no coinciden',
    
    // Auth feedback messages  
    loginSuccess: '¡Inicio de sesión exitoso!',
    loginFailed: 'Fallo en el inicio de sesión',
    welcomeBack: 'Bienvenido de vuelta',
    invalidCredentials: 'Email o contraseña inválidos',
    
    // Settings page
    manageAccount: 'Gestiona tu cuenta y preferencias',
    settingSaved: 'Configuración guardada',
    privacySettingUpdated: 'Tu configuración de privacidad ha sido actualizada',
    settingNotSaved: 'La configuración no pudo ser guardada',
    
    // Additional auth fields
    usernamePlaceholder: 'Tu nombre de usuario',
    
    // Push notifications
    pushNotificationsEnabled: 'Notificaciones push activadas',
    pushNotificationsEnabledDesc: 'Ahora recibirás notificaciones para nuevos mensajes',
    permissionDenied: 'Permiso denegado',
    pushNotificationsBrowserSettings: 'Las notificaciones push se pueden activar en la configuración del navegador',
    pushNotificationsNotActivated: 'Las notificaciones push no se pudieron activar',
    
    // Logout
    logoutSuccess: 'Sesión cerrada exitosamente',
    logoutSuccessDesc: 'Has cerrado sesión exitosamente',
    
    // Premium features
    premiumBadge: 'Insignia Premium',
    premiumBadgeDesc: 'Corona dorada en tu perfil para mejor visibilidad',
    premiumSection: 'Sección Premium',
    premiumSectionDesc: 'Aparece en la sección separada de Escorts Premium',
    priority: 'Prioridad',
    priorityDesc: 'Mayor posicionamiento en resultados de búsqueda',
    moreVisibility: 'Más Visibilidad',
    moreVisibilityDesc: 'Tu perfil se mostrará con más frecuencia',
    chatPriority: 'Prioridad en Chat',
    chatPriorityDesc: 'Tus mensajes se mostrarán preferencialmente',
    extendedReach: 'Alcance Extendido',
    extendedReachDesc: 'Visible en un radio más amplio',
    premiumUpgrade: 'Actualización Premium',
    premiumUpgradeDesc: 'Actualiza ahora por solo €9.99 por 1 mes de acceso Premium',
    premiumHeaderDesc: 'Aumenta tu visibilidad y recibe más solicitudes con nuestro acceso Premium',
    premiumMember: 'Miembro Premium',
    standardMember: 'Miembro Estándar',
    oneMonthActive: '1 mes activo',
    premiumAccess: 'Acceso Premium',
    oneTimePaymentDesc: 'Pago único por 1 mes Premium • Sin renovación automática',
    oneTime: 'único',
    loginRequired: 'Login requerido',
    loginRequiredDesc: 'Por favor, inicia sesión para activar Premium',
    redirectingToVerotel: 'Redirigiendo a Verotel',
    redirectingToVerotelDesc: 'Serás redirigido a la página de pago seguro',
    premiumAlreadyActive: 'Premium ya activo',
    enjoyingPremiumBenefits: 'Ya estás disfrutando de todos los beneficios Premium',
    redirecting: 'Redirigiendo...',
    becomePremiumNow: 'Hacerse Premium ahora',
    securePaymentVerotel: 'Pago seguro vía Verotel • Encriptación SSL',
    secureAndDiscreet: 'Seguro y Discreto',
    securePaymentDesc: 'Todos los pagos se procesan de forma segura vía Verotel. "Verotel" aparecerá en tu estado de cuenta - no "TransEscorta".',
    frequentlyAskedQuestions: 'Preguntas Frecuentes',
    autoRenewalQuestion: '¿El acceso se renueva automáticamente?',
    autoRenewalAnswer: 'No, este es un pago único por 1 mes. Sin renovación automática.',
    paymentMethodsQuestion: '¿Qué métodos de pago se aceptan?',
    paymentMethodsAnswer: 'Tarjetas de crédito (Visa, Mastercard), tarjetas de débito y otros métodos de pago locales vía Verotel.',
    premiumDurationQuestion: '¿Por cuánto tiempo es válido el acceso Premium?',
    premiumDurationAnswer: 'El acceso Premium es válido por exactamente 1 mes (30 días) desde la activación.',
    
    // Location & Navigation
    myLocation: 'Mi Ubicación',
    useCurrentLocation: 'Usar Ubicación Actual',
    detectingLocation: 'Detectando ubicación...',
    newEscorts: 'Nuevas Escorts',
    escortsIn: 'Escorts en',
    premiumEscorts: 'Escorts Premium',
    standardEscorts: 'Escorts Estándar',
    noEscortsFound: 'No se encontraron escorts',
    
    // Search & Filter
    searchAndFilter: 'Búsqueda y Filtro',
    filterActive: 'Filtro activo',

    
    // Home Page specific
    nearbyEscorts: 'Escorts Cercanas',
    
    // Location Selector
    selectLocation: 'Seleccionar Ubicación',
    activatingGPS: 'Activando GPS...',
    popularCities: 'Ciudades Populares',
    allCities: 'Todas las Ciudades',
    selectCity: 'Seleccionar ciudad...',
    enterOtherCity: 'Ingresar otra ciudad',
    enterCityOrZip: 'Ingresar ciudad o código postal...',
    
    // Filter Dialog
    reset: 'Restablecer',
    yearsShort: 'A',
    price: 'Precio',
    perHour: 'por hora',
    selectPosition: 'Seleccionar posición...',
    all: 'Todos',
    onlineOnly: 'Solo en Línea',
    premiumOnly: 'Solo Premium',

    // Navigation & Chat
    chats: 'Chats',
    newMessage: 'Nuevo Mensaje',
    noChatsYet: 'Aún sin chats',
    typeMessage: 'Escribe un mensaje...',
    sendMessage: 'Enviar',
    online: 'En línea',
    offline: 'Desconectado',
    lastSeen: 'Visto por última vez',
    typing: 'escribiendo...',
    messageNotSent: 'No se pudo enviar el mensaje',
    unauthorized: 'No autorizado',
    notLoggedIn: 'Ya no estás conectado. Redirigiendo...',
    redirecting: 'Redirigiendo...',
    anonymousUser: 'Usuario Anónimo',

    // Profile
    profileNotAvailable: 'Perfil no disponible',
    myProfile: 'Mi Perfil',
    profileUpdated: 'Perfil Actualizado',
    changesSaved: 'Tus cambios han sido guardados exitosamente.',
    errorSaving: 'Error al Guardar',
    profileUpdateFailed: 'El perfil no pudo ser actualizado.',
    back: 'Atrás',
    profilePhotos: 'Fotos del Perfil',
    basicInfo: 'Información Básica',
    editProfile: 'Editar Perfil',
    personalInfo: 'Información Personal',
    physicalDetails: 'Detalles Físicos',
    servicesOffered: 'Servicios Ofrecidos',
    availableServices: 'Servicios Disponibles',
    selectServices: 'Seleccionar Servicios',
    pricePerHour: 'Precio por Hora',
    location: 'Ubicación',
    interests: 'Intereses',
    addInterest: 'Añadir Interés',
    profileUpdated: 'Perfil Actualizado',
    profileUpdateError: 'Error al actualizar perfil',
    uploadPhoto: 'Subir Foto',
    deletePhoto: 'Eliminar Foto',
    mainPhoto: 'Foto Principal',
    additionalPhotos: 'Fotos Adicionales',

    // Settings
    settings: 'Configuración',
    premiumActive: 'Premium Activo',
    premiumUpgrade: 'Upgrade Premium',
    upgrade: 'Upgrade',
    account: 'Cuenta',
    privacy: 'Privacidad',
    notifications: 'Notificaciones',
    appearance: 'Apariencia',
    support: 'Soporte',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    language: 'Idioma',
    changePassword: 'Cambiar Contraseña',
    deleteAccount: 'Eliminar Cuenta',
    contactSupport: 'Contactar Soporte',
    faq: 'Preguntas Frecuentes',
    logout: 'Cerrar Sesión',
    pushNotifications: 'Notificaciones Push',
    soundNotifications: 'Notificaciones de Sonido',
    vibrationNotifications: 'Notificaciones de Vibración',
    chatNotifications: 'Notificaciones de Chat',
    profileViewNotifications: 'Notificaciones de Vista de Perfil',
    matchNotifications: 'Notificaciones de Match',
    profileVisibility: 'Visibilidad del Perfil',
    showOnlineStatus: 'Mostrar Estado en Línea',
    showLastSeen: 'Mostrar Última Vez Visto',
    allowMessagePreviews: 'Permitir Vistas Previas de Mensajes',
    twoFactorAuth: 'Autenticación de Dos Factores',
    dataExport: 'Exportación de Datos',
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Actualizar Premium',
    premiumActive: 'Premium Activo',

    
    // Aktionen
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    search: 'Buscar',
    
    // Status
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    noResults: 'Sin Resultados',
    
    // Optionen
    bodyTypes: {
      slim: 'Delgado',
      athletic: 'Atlético',
      average: 'Promedio',
      curvy: 'Curvilíneo',
      plusSize: 'Talla Grande',
      muscular: 'Musculoso',
    },
    
    ethnicities: {
      caucasian: 'Caucásico',
      latino: 'Latino',
      asian: 'Asiático',
      african: 'Africano',
      arabic: 'Árabe',
      mixed: 'Mixto',
    },
    
    positions: {
      top: 'Activo',
      bottom: 'Pasivo',
      versatile: 'Versátil',
    },
    
    circumcisionTypes: {
      circumcised: 'Circuncidado',
      uncircumcised: 'No Circuncidado',
      partial: 'Parcial',
    },
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    profile: 'Profil',
    chat: 'Chat',
    favorites: 'Favoris',
    more: 'Plus',
    settings: 'Paramètres',
    language: 'Langue',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Plateforme Premium TS-Escorts',
    
    // Auth
    login: 'Se Connecter',
    register: "S'inscrire",
    logout: 'Se Déconnecter',
    email: 'Email',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    username: "Nom d'Utilisateur",
    forgotPassword: 'Mot de Passe Oublié?',
    
    // Registrierung
    iAm: 'Je suis',
    transEscort: 'Trans Escort',
    transEscortDesc: 'Je propose des services',
    customer: 'Client',
    customerDesc: 'Je cherche des services',
    acceptTerms: "J'accepte les",
    termsOfUse: "Conditions d'Utilisation",
    privacyPolicy: 'Politique de Confidentialité',
    secureEncrypted: 'Sécurisé et Chiffré',
    dataSecureSSL: 'Vos données sont chiffrées SSL et stockées en sécurité',
    registering: 'Inscription...',
    loggingIn: 'Connexion...',
    
    // Profile
    editProfile: 'Modifier le Profil',
    myProfile: 'Mon Profil',
    personalInfo: 'Informations Personnelles',
    firstName: 'Prénom',
    lastName: 'Nom',
    age: 'Âge',
    bio: 'Biographie',
    location: 'Localisation',
    detectLocation: 'Détecter la Position',
    
    // Physisch
    physicalDetails: 'Détails Physiques',
    height: 'Taille',
    weight: 'Poids',
    bodyType: 'Type de Corps',
    ethnicity: 'Ethnicité',
    cockSize: 'Taille',
    circumcision: 'Circoncision',
    position: 'Position',
    
    // Services
    services: 'Services',
    interests: 'Intérêts',
    pricing: 'Tarifs',
    hourlyRate: 'Tarif Horaire',
    
    // Filter
    filter: 'Filtre',
    clearFilters: 'Effacer les Filtres',
    applyFilters: 'Appliquer les Filtres',
    ageRange: 'Tranche d\'Âge',
    priceRange: 'Gamme de Prix',
    cockSizeRange: 'Gamme de Taille',
    onlyOnline: 'En Ligne Seulement',
    onlyPremium: 'Premium Seulement',
    
    // Chat
    messages: 'Messages',
    typeMessage: 'Tapez un message...',
    sendMessage: 'Envoyer',
    photoMessage: 'Envoyer une Photo',
    online: 'En Ligne',
    offline: 'Hors Ligne',
    lastSeen: 'Vu pour la dernière fois',
    
    // Auth validation messages
    emailPlaceholder: 'votre@email.com',
    passwordPlaceholder: 'Votre mot de passe',
    invalidEmail: 'Adresse email invalide',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    usernameRequired: 'Le nom d\'utilisateur est requis',
    selectUserType: 'Veuillez sélectionner votre type de compte',
    acceptTermsRequired: 'Vous devez accepter les conditions et la politique de confidentialité',
    passwordsNoMatch: 'Les mots de passe ne correspondent pas',
    
    // Auth feedback messages  
    loginSuccess: 'Connexion réussie!',
    loginFailed: 'Échec de la connexion',
    welcomeBack: 'Bon retour',
    invalidCredentials: 'Email ou mot de passe invalide',
    
    // Settings page
    manageAccount: 'Gérez votre compte et vos préférences',
    settingSaved: 'Paramètre sauvegardé',
    privacySettingUpdated: 'Votre paramètre de confidentialité a été mis à jour',
    settingNotSaved: 'Le paramètre n\'a pas pu être sauvegardé',
    
    // Additional auth fields
    usernamePlaceholder: 'Votre nom d\'utilisateur',
    
    // Push notifications
    pushNotificationsEnabled: 'Notifications push activées',
    pushNotificationsEnabledDesc: 'Vous recevrez maintenant des notifications pour les nouveaux messages',
    permissionDenied: 'Permission refusée',
    pushNotificationsBrowserSettings: 'Les notifications push peuvent être activées dans les paramètres du navigateur',
    pushNotificationsNotActivated: 'Les notifications push n\'ont pas pu être activées',
    
    // Logout
    logoutSuccess: 'Déconnexion réussie',
    logoutSuccessDesc: 'Vous avez été déconnecté avec succès',
    
    // Premium features
    premiumBadge: 'Badge Premium',
    premiumBadgeDesc: 'Couronne dorée sur votre profil pour une meilleure visibilité',
    premiumSection: 'Section Premium',
    premiumSectionDesc: 'Apparaître dans la section séparée des Escorts Premium',
    priority: 'Priorité',
    priorityDesc: 'Classement plus élevé dans les résultats de recherche',
    moreVisibility: 'Plus de Visibilité',
    moreVisibilityDesc: 'Votre profil sera affiché plus fréquemment',
    chatPriority: 'Priorité Chat',
    chatPriorityDesc: 'Vos messages seront affichés en priorité',
    extendedReach: 'Portée Étendue',
    extendedReachDesc: 'Visible dans un rayon plus large',
    premiumUpgrade: 'Mise à niveau Premium',
    premiumUpgradeDesc: 'Passez au Premium maintenant pour seulement €9.99 pour 1 mois d\'accès Premium',
    premiumHeaderDesc: 'Augmentez votre visibilité et recevez plus de demandes avec notre accès Premium',
    premiumMember: 'Membre Premium',
    standardMember: 'Membre Standard',
    oneMonthActive: '1 mois actif',
    premiumAccess: 'Accès Premium',
    oneTimePaymentDesc: 'Paiement unique pour 1 mois Premium • Pas de renouvellement automatique',
    oneTime: 'unique',
    loginRequired: 'Connexion requise',
    loginRequiredDesc: 'Veuillez vous connecter pour activer Premium',
    redirectingToVerotel: 'Redirection vers Verotel',
    redirectingToVerotelDesc: 'Vous serez redirigé vers la page de paiement sécurisé',
    premiumAlreadyActive: 'Premium déjà actif',
    enjoyingPremiumBenefits: 'Vous profitez déjà de tous les avantages Premium',
    redirecting: 'Redirection...',
    becomePremiumNow: 'Devenir Premium maintenant',
    securePaymentVerotel: 'Paiement sécurisé via Verotel • Chiffrement SSL',
    secureAndDiscreet: 'Sécurisé et Discret',
    securePaymentDesc: 'Tous les paiements sont traités en toute sécurité via Verotel. "Verotel" apparaîtra sur votre relevé de carte de crédit - pas "TransEscorta".',
    frequentlyAskedQuestions: 'Questions Fréquemment Posées',
    autoRenewalQuestion: 'L\'accès se renouvelle-t-il automatiquement?',
    autoRenewalAnswer: 'Non, il s\'agit d\'un paiement unique pour 1 mois. Pas de renouvellement automatique.',
    paymentMethodsQuestion: 'Quelles méthodes de paiement sont acceptées?',
    paymentMethodsAnswer: 'Cartes de crédit (Visa, Mastercard), cartes de débit et autres méthodes de paiement locales via Verotel.',
    premiumDurationQuestion: 'Combien de temps l\'accès Premium est-il valide?',
    premiumDurationAnswer: 'L\'accès Premium est valide pendant exactement 1 mois (30 jours) à partir de l\'activation.',
    
    // Location & Navigation
    myLocation: 'Ma Position',
    useCurrentLocation: 'Utiliser Position Actuelle',
    detectingLocation: 'Détection de la position...',
    newEscorts: 'Nouvelles Escorts',
    escortsIn: 'Escorts à',
    premiumEscorts: 'Escorts Premium',
    standardEscorts: 'Escorts Standard',
    noEscortsFound: 'Aucune escort trouvée',
    
    // Search & Filter
    searchAndFilter: 'Recherche et Filtre',
    filterActive: 'Filtre actif',

    
    // Home Page specific
    nearbyEscorts: 'Escorts Proches',
    
    // Location Selector
    selectLocation: 'Sélectionner Position',
    activatingGPS: 'Activation GPS...',
    popularCities: 'Villes Populaires',
    allCities: 'Toutes les Villes',
    selectCity: 'Sélectionner ville...',
    enterOtherCity: 'Saisir autre ville',
    enterCityOrZip: 'Saisir ville ou code postal...',
    
    // Filter Dialog
    reset: 'Réinitialiser',
    yearsShort: 'A',
    price: 'Prix',
    perHour: 'par heure',
    selectPosition: 'Sélectionner position...',
    all: 'Tous',
    onlineOnly: 'En Ligne Seulement',
    premiumOnly: 'Premium Seulement',

    // Navigation & Chat
    chats: 'Chats',
    newMessage: 'Nouveau Message',
    noChatsYet: 'Pas encore de chats',
    typeMessage: 'Tapez un message...',
    sendMessage: 'Envoyer',
    online: 'En ligne',
    offline: 'Hors ligne',
    lastSeen: 'Vu pour la dernière fois',
    typing: 'tape...',
    messageNotSent: 'Le message n\'a pas pu être envoyé',
    unauthorized: 'Non autorisé',
    notLoggedIn: 'Vous n\'êtes plus connecté. Redirection...',
    redirecting: 'Redirection...',
    anonymousUser: 'Utilisateur Anonyme',

    // Profile
    profileNotAvailable: 'Profil non disponible',
    myProfile: 'Mon Profil',
    profileUpdated: 'Profil Mis à Jour',
    changesSaved: 'Vos modifications ont été sauvegardées avec succès.',
    errorSaving: 'Erreur de Sauvegarde',
    profileUpdateFailed: 'Le profil n\'a pas pu être mis à jour.',
    back: 'Retour',
    profilePhotos: 'Photos de Profil',
    basicInfo: 'Informations de Base',
    editProfile: 'Modifier le Profil',
    personalInfo: 'Informations Personnelles',
    physicalDetails: 'Détails Physiques',
    servicesOffered: 'Services Offerts',
    availableServices: 'Services Disponibles',
    selectServices: 'Sélectionner Services',
    pricePerHour: 'Prix par Heure',
    location: 'Emplacement',
    interests: 'Intérêts',
    addInterest: 'Ajouter Intérêt',
    profileUpdated: 'Profil Mis à Jour',
    profileUpdateError: 'Erreur lors de la mise à jour du profil',
    uploadPhoto: 'Télécharger Photo',
    deletePhoto: 'Supprimer Photo',
    mainPhoto: 'Photo Principale',
    additionalPhotos: 'Photos Supplémentaires',

    // Settings
    settings: 'Paramètres',
    premiumActive: 'Premium Actif',
    premiumUpgrade: 'Upgrade Premium',
    upgrade: 'Upgrade',
    account: 'Compte',
    privacy: 'Confidentialité',
    notifications: 'Notifications',
    appearance: 'Apparence',
    support: 'Support',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    language: 'Langue',
    changePassword: 'Changer le Mot de Passe',
    deleteAccount: 'Supprimer le Compte',
    contactSupport: 'Contacter le Support',
    faq: 'FAQ',
    logout: 'Se Déconnecter',
    pushNotifications: 'Notifications Push',
    soundNotifications: 'Notifications Sonores',
    vibrationNotifications: 'Notifications Vibratoires',
    chatNotifications: 'Notifications de Chat',
    profileViewNotifications: 'Notifications de Vue de Profil',
    matchNotifications: 'Notifications de Match',
    profileVisibility: 'Visibilité du Profil',
    showOnlineStatus: 'Afficher le Statut En Ligne',
    showLastSeen: 'Afficher Dernière Vue',
    allowMessagePreviews: 'Autoriser les Aperçus de Messages',
    twoFactorAuth: 'Authentification à Deux Facteurs',
    dataExport: 'Exportation de Données',
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Mise à Niveau Premium',

    
    // Aktionen
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    
    // Status
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    noResults: 'Aucun Résultat',
    
    // Optionen
    bodyTypes: {
      slim: 'Mince',
      athletic: 'Athlétique',
      average: 'Moyen',
      curvy: 'Pulpeux',
      plusSize: 'Grande Taille',
      muscular: 'Musclé',
    },
    
    ethnicities: {
      caucasian: 'Caucasien',
      latino: 'Latino',
      asian: 'Asiatique',
      african: 'Africain',
      arabic: 'Arabe',
      mixed: 'Mixte',
    },
    
    positions: {
      top: 'Actif',
      bottom: 'Passif',
      versatile: 'Polyvalent',
    },
    
    circumcisionTypes: {
      circumcised: 'Circoncis',
      uncircumcised: 'Non Circoncis',
      partial: 'Partiel',
    },
  },
};

export const supportedLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];