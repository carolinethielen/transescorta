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
    clearFilters: 'Filter löschen',
    applyFilters: 'Filter anwenden',
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
    premiumEscorts: 'Premium Escorts',
    newEscorts: 'Neue Escorts',
    nearbyEscorts: 'Escorts in der Nähe',
    
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
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
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
    premiumEscorts: 'Premium Escorts',
    newEscorts: 'New Escorts',
    nearbyEscorts: 'Nearby Escorts',
    
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
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Upgrade Premium',
    premiumActive: 'Premium Ativo',
    premiumEscorts: 'Escorts Premium',
    newEscorts: 'Novos Escorts',
    nearbyEscorts: 'Escorts Próximos',
    
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
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Actualizar Premium',
    premiumActive: 'Premium Activo',
    premiumEscorts: 'Escorts Premium',
    newEscorts: 'Nuevos Escorts',
    nearbyEscorts: 'Escorts Cercanos',
    
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
    
    // Premium
    premium: 'Premium',
    upgradePremium: 'Mise à Niveau Premium',
    premiumActive: 'Premium Actif',
    premiumEscorts: 'Escorts Premium',
    newEscorts: 'Nouveaux Escorts',
    nearbyEscorts: 'Escorts Proches',
    
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