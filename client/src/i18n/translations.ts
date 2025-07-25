// Clean translations file without duplicates
export interface Translations {
  // Navigation
  home: string;
  profile: string;
  myProfile: string;
  chat: string;
  chats: string;
  favorites: string;
  more: string;
  settings: string;
  language: string;
  
  // Brand
  appName: string;
  appDescription: string;
  
  // Auth
  login: string;
  register: string;
  logout: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  forgotPassword: string;
  
  // Chat & Messages
  messages: string;
  noChatsYet: string;
  messageInputPlaceholder: string;
  newMessage: string;
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
  editProfile: string;
  personalInfo: string;
  firstName: string;
  lastName: string;
  age: string;
  bio: string;
  location: string;
  physicalDetails: string;
  height: string;
  weight: string;
  bodyType: string;
  ethnicity: string;
  cockSize: string;
  circumcision: string;
  position: string;
  services: string;
  interests: string;
  profileUpdated: string;
  
  // Settings  
  account: string;
  privacy: string;
  notifications: string;
  appearance: string;
  support: string;
  darkMode: string;
  lightMode: string;
  changePassword: string;
  deleteAccount: string;
  contactSupport: string;
  faq: string;
  pushNotifications: string;
  
  // Premium
  premium: string;
  premiumActive: string;
  premiumUpgrade: string;
  premiumAccess: string;
  premiumEscorts: string;
  
  // Actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  back: string;
  next: string;
  
  // Status
  loading: string;
  error: string;
  success: string;
  
  // Misc
  all: string;
  filter: string;
  clearFilters: string;
  applyFilters: string;
  newEscorts: string;
  nearbyEscorts: string;
  
  // Additional Settings translations
  settingSaved: string;
  privacySettingUpdated: string;
  settingNotSaved: string;
  pushNotificationsEnabled: string;
  pushNotificationsEnabledDesc: string;
  permissionDenied: string;
  pushNotificationsBrowserSettings: string;
  pushNotificationsNotActivated: string;
  logoutSuccess: string;
  logoutSuccessDesc: string;
  transEscort: string;
  customer: string;
  upgrade: string;
  
  // Profile translations
  profileNotAvailable: string;
  
  // Chat translations
  typeMessagePlaceholder: string;
  
  // Profile Edit translations
  backButton: string;
  profileImages: string;
  servicesOffered: string;
  
  // Additional UI translations needed
  myLocation: string;
  useCurrentLocation: string;
  detectingLocation: string;
  contact: string;
  newEscortsSection: string;
  premiumEscortsSection: string;
  registerTitle: string;
  loginTitle: string;
  welcomeBack: string;
  loginSuccess: string;
  loginFailed: string;
  invalidCredentials: string;
  escortsIn: string;
  noEscortsFound: string;
  
  // Premium page translations
  loginRequired: string;
  loginRequiredDesc: string;
  redirectingToVerotel: string;
  redirectingToVerotelDesc: string;
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
  
  // Register page translations  
  registerSuccess: string;
  registerFailed: string;
  confirmEmail: string;
  errorOccurred: string;
  invalidEmail: string;
  passwordMinLength: string;
  usernameRequired: string;
  userTypeRequired: string;
  passwordMismatch: string;
  
  // Register Form Labels
  iAm: string;
  transEscortOption: string;
  customerOption: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  createAccount: string;
  alreadyHaveAccount: string;
  
  // Filter Dialog
  filters: string;
  ageRange: string;
  priceRange: string;
  cockSizeRange: string;
  position: string;
  bodyType: string;
  ethnicity: string;
  circumcision: string;
  services: string;
  onlineOnly: string;
  premiumOnly: string;
  applyFilters: string;
  clearFilters: string;
}

export const supportedLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const translations: Record<string, Translations> = {
  de: {
    // Navigation
    home: 'Home',
    profile: 'Profil',
    myProfile: 'Mein Profil',
    chat: 'Chat',
    chats: 'Chats',
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
    
    // Chat & Messages
    messages: 'Nachrichten',
    noChatsYet: 'Noch keine Chats',
    messageInputPlaceholder: 'Nachricht eingeben...',
    newMessage: 'Neue Nachricht',
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
    editProfile: 'Profil bearbeiten',
    personalInfo: 'Persönliche Informationen',
    firstName: 'Vorname',
    lastName: 'Nachname',
    age: 'Alter',
    bio: 'Über mich',
    location: 'Standort',
    physicalDetails: 'Körperliche Merkmale',
    height: 'Größe',
    weight: 'Gewicht',
    bodyType: 'Körpertyp',
    ethnicity: 'Herkunft',
    cockSize: 'Schwanzgröße',
    circumcision: 'Beschneidung',
    position: 'Position',
    services: 'Services',
    interests: 'Interessen',
    profileUpdated: 'Profil aktualisiert',
    
    // Settings
    account: 'Konto',
    privacy: 'Privatsphäre',
    notifications: 'Benachrichtigungen',
    appearance: 'Darstellung',
    support: 'Support',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    changePassword: 'Passwort ändern',
    deleteAccount: 'Konto löschen',
    contactSupport: 'Support kontaktieren',
    faq: 'Häufige Fragen',
    pushNotifications: 'Push-Benachrichtigungen',
    
    // Premium
    premium: 'Premium',
    premiumActive: 'Premium aktiv',
    premiumUpgrade: 'Premium Upgrade',
    premiumAccess: 'Premium Zugang',
    premiumEscorts: 'Premium Escorts',
    
    // Actions
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    back: 'Zurück',
    next: 'Weiter',
    
    // Status
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolgreich',
    
    // Misc
    all: 'Alle',
    filter: 'Filter',
    clearFilters: 'Filter löschen',
    applyFilters: 'Filter anwenden',
    newEscorts: 'Neue Escorts',
    nearbyEscorts: 'Escorts in der Nähe',
    
    // Additional Settings translations
    settingSaved: 'Einstellung gespeichert',
    privacySettingUpdated: 'Privatsphäre-Einstellung aktualisiert',
    settingNotSaved: 'Einstellung konnte nicht gespeichert werden',
    pushNotificationsEnabled: 'Push-Benachrichtigungen aktiviert',
    pushNotificationsEnabledDesc: 'Du erhältst jetzt Benachrichtigungen für neue Nachrichten',
    permissionDenied: 'Berechtigung verweigert',
    pushNotificationsBrowserSettings: 'Push-Benachrichtigungen können in den Browser-Einstellungen aktiviert werden',
    pushNotificationsNotActivated: 'Push-Benachrichtigungen konnten nicht aktiviert werden',
    logoutSuccess: 'Erfolgreich abgemeldet',
    logoutSuccessDesc: 'Du wurdest erfolgreich abgemeldet',
    transEscort: 'Trans Escort',
    customer: 'Kunde',
    upgrade: 'Upgrade',
    
    // Profile translations
    profileNotAvailable: 'Profil nicht verfügbar',
    
    // Chat translations
    typeMessagePlaceholder: 'Nachricht schreiben...',
    
    // Profile Edit translations
    backButton: 'Zurück',
    profileImages: 'Profilbilder',
    servicesOffered: 'Angebotene Services',
    
    // Additional UI translations needed
    myLocation: 'Mein Standort',
    useCurrentLocation: 'Aktuellen Standort verwenden',
    detectingLocation: 'Standort wird ermittelt...',
    contact: 'Kontakt',
    newEscortsSection: 'Neue Escorts',
    premiumEscortsSection: 'Premium Escorts',
    registerTitle: 'Registrieren',
    loginTitle: 'Anmelden',
    welcomeBack: 'Willkommen zurück',
    loginSuccess: 'Anmeldung erfolgreich!',
    loginFailed: 'Anmeldung fehlgeschlagen',
    invalidCredentials: 'Ungültige E-Mail oder Passwort',
    escortsIn: 'Escorts in',
    noEscortsFound: 'Keine Escorts gefunden',
    
    // Premium page translations
    loginRequired: 'Anmeldung erforderlich',
    loginRequiredDesc: 'Bitte melde dich an, um Premium zu aktivieren.',
    redirectingToVerotel: 'Weiterleitung zu Verotel',
    redirectingToVerotelDesc: 'Du wirst zur sicheren Zahlungsseite weitergeleitet.',
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
    
    // Register page translations  
    registerSuccess: 'Registrierung erfolgreich!',
    registerFailed: 'Registrierung fehlgeschlagen',
    confirmEmail: 'Bitte bestätige deine E-Mail-Adresse.',
    errorOccurred: 'Ein Fehler ist aufgetreten.',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    passwordMinLength: 'Passwort muss mindestens 8 Zeichen lang sein',
    usernameRequired: 'Benutzername ist erforderlich',
    userTypeRequired: 'Benutzertyp ist erforderlich',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    
    // Register Form Labels
    iAm: 'Ich bin...',
    transEscortOption: 'Trans* Escort',
    customerOption: 'Kunde (Mann)',
    firstName: 'Vorname',
    lastName: 'Nachname',
    emailAddress: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    createAccount: 'Konto erstellen',
    alreadyHaveAccount: 'Bereits ein Konto?',
    
    // Filter Dialog
    filters: 'Filter',
    ageRange: 'Altersbereich',
    priceRange: 'Preisbereich',
    cockSizeRange: 'Schwanzgröße',
    position: 'Position',
    bodyType: 'Körpertyp',
    ethnicity: 'Ethnizität',
    circumcision: 'Beschneidung',
    services: 'Services',
    onlineOnly: 'Nur Online',
    premiumOnly: 'Nur Premium',
    applyFilters: 'Filter anwenden',
    clearFilters: 'Filter löschen',
  },
  
  en: {
    // Navigation
    home: 'Home',
    profile: 'Profile',
    myProfile: 'My Profile',
    chat: 'Chat',
    chats: 'Chats',
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
    
    // Chat & Messages
    messages: 'Messages',
    noChatsYet: 'No chats yet',
    messageInputPlaceholder: 'Type a message...',
    newMessage: 'New Message',
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
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    bio: 'Bio',
    location: 'Location',
    physicalDetails: 'Physical Details',
    height: 'Height',
    weight: 'Weight',
    bodyType: 'Body Type',
    ethnicity: 'Ethnicity',
    cockSize: 'Size',
    circumcision: 'Circumcision',
    position: 'Position',
    services: 'Services',
    interests: 'Interests',
    profileUpdated: 'Profile Updated',
    
    // Settings
    account: 'Account',
    privacy: 'Privacy',
    notifications: 'Notifications',
    appearance: 'Appearance',
    support: 'Support',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    contactSupport: 'Contact Support',
    faq: 'FAQ',
    pushNotifications: 'Push Notifications',
    
    // Premium
    premium: 'Premium',
    premiumActive: 'Premium Active',
    premiumUpgrade: 'Premium Upgrade',
    premiumAccess: 'Premium Access',
    premiumEscorts: 'Premium Escorts',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    
    // Status
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Misc
    all: 'All',
    filter: 'Filter',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
    newEscorts: 'New Escorts',
    nearbyEscorts: 'Nearby Escorts',
    
    // Additional Settings translations
    settingSaved: 'Setting Saved',
    privacySettingUpdated: 'Privacy Setting Updated',
    settingNotSaved: 'Setting Could Not Be Saved',
    pushNotificationsEnabled: 'Push Notifications Enabled',
    pushNotificationsEnabledDesc: 'You will now receive notifications for new messages',
    permissionDenied: 'Permission Denied',
    pushNotificationsBrowserSettings: 'Push notifications can be enabled in browser settings',
    pushNotificationsNotActivated: 'Push notifications could not be activated',
    logoutSuccess: 'Successfully Logged Out',
    logoutSuccessDesc: 'You have been successfully logged out',
    transEscort: 'Trans Escort',
    customer: 'Customer',
    upgrade: 'Upgrade',
    
    // Profile translations
    profileNotAvailable: 'Profile Not Available',
    
    // Chat translations
    typeMessagePlaceholder: 'Type a message...',
    
    // Profile Edit translations
    backButton: 'Back',
    profileImages: 'Profile Images',
    servicesOffered: 'Services Offered',
    
    // Additional UI translations needed
    myLocation: 'My Location',
    useCurrentLocation: 'Use Current Location',
    detectingLocation: 'Detecting Location...',
    contact: 'Contact',
    newEscortsSection: 'New Escorts',
    premiumEscortsSection: 'Premium Escorts',
    registerTitle: 'Register',
    loginTitle: 'Login',
    welcomeBack: 'Welcome Back',
    loginSuccess: 'Login Successful!',
    loginFailed: 'Login Failed',
    invalidCredentials: 'Invalid Email or Password',
    escortsIn: 'Escorts in',
    noEscortsFound: 'No Escorts Found',
    
    // Premium page translations
    loginRequired: 'Login Required',
    loginRequiredDesc: 'Please login to activate Premium.',
    redirectingToVerotel: 'Redirecting to Verotel',
    redirectingToVerotelDesc: 'You will be redirected to the secure payment page.',
    premiumBadge: 'Premium Badge',
    premiumBadgeDesc: 'Golden crown in your profile for better visibility',
    premiumSection: 'Premium Section',
    premiumSectionDesc: 'Appear in the separate Premium Escorts section',
    priority: 'Priority',
    priorityDesc: 'Higher ranking in search results',
    moreVisibility: 'More Visibility',
    moreVisibilityDesc: 'Your profile will be shown more often',
    chatPriority: 'Chat Priority',
    chatPriorityDesc: 'Your messages will be displayed preferentially',
    extendedReach: 'Extended Reach',
    extendedReachDesc: 'Visible in larger radius',
    
    // Register page translations  
    registerSuccess: 'Registration Successful!',
    registerFailed: 'Registration Failed',
    confirmEmail: 'Please confirm your email address.',
    errorOccurred: 'An error occurred.',
    invalidEmail: 'Invalid email address',
    passwordMinLength: 'Password must be at least 8 characters long',
    usernameRequired: 'Username is required',
    userTypeRequired: 'User type is required',
    passwordMismatch: 'Passwords do not match',
    
    // Register Form Labels
    iAm: 'I am...',
    transEscortOption: 'Trans* Escort',
    customerOption: 'Customer (Man)',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    
    // Filter Dialog
    filters: 'Filters',
    ageRange: 'Age Range',
    priceRange: 'Price Range',
    cockSizeRange: 'Size Range',
    position: 'Position',
    bodyType: 'Body Type',
    ethnicity: 'Ethnicity',
    circumcision: 'Circumcision',
    services: 'Services',
    onlineOnly: 'Online Only',
    premiumOnly: 'Premium Only',
    applyFilters: 'Apply Filters',
    clearFilters: 'Clear Filters',
  },
  
  pt: {
    // Navigation
    home: 'Início',
    profile: 'Perfil',
    myProfile: 'Meu Perfil',
    chat: 'Chat',
    chats: 'Chats',
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
    
    // Chat & Messages
    messages: 'Mensagens',
    noChatsYet: 'Ainda não há chats',
    messageInputPlaceholder: 'Digite uma mensagem...',
    newMessage: 'Nova Mensagem',
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
    editProfile: 'Editar Perfil',
    personalInfo: 'Informações Pessoais',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    age: 'Idade',
    bio: 'Biografia',
    location: 'Localização',
    physicalDetails: 'Detalhes Físicos',
    height: 'Altura',
    weight: 'Peso',
    bodyType: 'Tipo Corporal',
    ethnicity: 'Etnia',
    cockSize: 'Tamanho',
    circumcision: 'Circuncisão',
    position: 'Posição',
    services: 'Serviços',
    interests: 'Interesses',
    profileUpdated: 'Perfil Atualizado',
    
    // Settings
    account: 'Conta',
    privacy: 'Privacidade',
    notifications: 'Notificações',
    appearance: 'Aparência',
    support: 'Suporte',
    darkMode: 'Modo Escuro',
    lightMode: 'Modo Claro',
    changePassword: 'Alterar Senha',
    deleteAccount: 'Excluir Conta',
    contactSupport: 'Contatar Suporte',
    faq: 'FAQ',
    pushNotifications: 'Notificações Push',
    
    // Premium
    premium: 'Premium',
    premiumActive: 'Premium Ativo',
    premiumUpgrade: 'Upgrade Premium',
    premiumAccess: 'Acesso Premium',
    premiumEscorts: 'Escorts Premium',
    
    // Actions
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    back: 'Voltar',
    next: 'Próximo',
    
    // Status
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    
    // Misc
    all: 'Todos',
    filter: 'Filtro',
    clearFilters: 'Limpar Filtros',
    applyFilters: 'Aplicar Filtros',
    newEscorts: 'Novos Escorts',
    nearbyEscorts: 'Escorts Próximos',
    
    // Additional Settings translations
    settingSaved: 'Configuração Salva',
    privacySettingUpdated: 'Configuração de Privacidade Atualizada',
    settingNotSaved: 'Configuração Não Pôde Ser Salva',
    pushNotificationsEnabled: 'Notificações Push Ativadas',
    pushNotificationsEnabledDesc: 'Você receberá notificações para novas mensagens',
    permissionDenied: 'Permissão Negada',
    pushNotificationsBrowserSettings: 'Notificações push podem ser ativadas nas configurações do navegador',
    pushNotificationsNotActivated: 'Notificações push não puderam ser ativadas',
    logoutSuccess: 'Logout Realizado com Sucesso',
    logoutSuccessDesc: 'Você foi desconectado com sucesso',
    transEscort: 'Trans Escort',
    customer: 'Cliente',
    upgrade: 'Upgrade',
    
    // Profile translations
    profileNotAvailable: 'Perfil Não Disponível',
    
    // Chat translations
    typeMessagePlaceholder: 'Digite uma mensagem...',
    
    // Profile Edit translations
    backButton: 'Voltar',
    profileImages: 'Imagens do Perfil',
    servicesOffered: 'Serviços Oferecidos',
    
    // Additional UI translations needed
    myLocation: 'Minha Localização',
    useCurrentLocation: 'Usar Localização Atual',
    detectingLocation: 'Detectando Localização...',
    contact: 'Contato',
    newEscortsSection: 'Novos Escorts',
    premiumEscortsSection: 'Escorts Premium',
    registerTitle: 'Registrar',
    loginTitle: 'Entrar',
    welcomeBack: 'Bem-vindo de Volta',
    loginSuccess: 'Login Realizado com Sucesso!',
    loginFailed: 'Falha no Login',
    invalidCredentials: 'Email ou Senha Inválidos',
    escortsIn: 'Escorts em',
    noEscortsFound: 'Nenhum Escort Encontrado',
    
    // Premium page translations
    loginRequired: 'Login Necessário',
    loginRequiredDesc: 'Por favor, faça login para ativar o Premium.',
    redirectingToVerotel: 'Redirecionando para Verotel',
    redirectingToVerotelDesc: 'Você será redirecionado para a página de pagamento seguro.',
    premiumBadge: 'Distintivo Premium',
    premiumBadgeDesc: 'Coroa dourada no seu perfil para melhor visibilidade',
    premiumSection: 'Seção Premium',
    premiumSectionDesc: 'Apareça na seção separada de Escorts Premium',
    priority: 'Prioridade',
    priorityDesc: 'Classificação mais alta nos resultados de busca',
    moreVisibility: 'Mais Visibilidade',
    moreVisibilityDesc: 'Seu perfil será exibido mais frequentemente',
    chatPriority: 'Prioridade de Chat',
    chatPriorityDesc: 'Suas mensagens serão exibidas preferencialmente',
    extendedReach: 'Alcance Estendido',
    extendedReachDesc: 'Visível em raio maior',
    
    // Register page translations  
    registerSuccess: 'Registro Bem-sucedido!',
    registerFailed: 'Falha no Registro',
    confirmEmail: 'Por favor, confirme seu endereço de email.',
    errorOccurred: 'Ocorreu um erro.',
    invalidEmail: 'Endereço de email inválido',
    passwordMinLength: 'A senha deve ter pelo menos 8 caracteres',
    usernameRequired: 'Nome de usuário é obrigatório',
    userTypeRequired: 'Tipo de usuário é obrigatório',
    passwordMismatch: 'As senhas não coincidem',
    
    // Register Form Labels
    iAm: 'Eu sou...',
    transEscortOption: 'Trans* Escort',
    customerOption: 'Cliente (Homem)',
    firstName: 'Primeiro Nome',
    lastName: 'Sobrenome',
    emailAddress: 'Endereço de Email',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    createAccount: 'Criar Conta',
    alreadyHaveAccount: 'Já tem uma conta?',
    
    // Filter Dialog
    filters: 'Filtros',
    ageRange: 'Faixa Etária',
    priceRange: 'Faixa de Preço',
    cockSizeRange: 'Faixa de Tamanho',
    position: 'Posição',
    bodyType: 'Tipo de Corpo',
    ethnicity: 'Etnia',
    circumcision: 'Circuncisão',
    services: 'Serviços',
    onlineOnly: 'Apenas Online',
    premiumOnly: 'Apenas Premium',
    applyFilters: 'Aplicar Filtros',
    clearFilters: 'Limpar Filtros',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    profile: 'Perfil',
    myProfile: 'Mi Perfil',
    chat: 'Chat',
    chats: 'Chats',
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
    
    // Chat & Messages
    messages: 'Mensajes',
    noChatsYet: 'Aún no hay chats',
    messageInputPlaceholder: 'Escribe un mensaje...',
    newMessage: 'Nuevo Mensaje',
    typeMessage: 'Escribe un mensaje...',
    sendMessage: 'Enviar',
    online: 'En Línea',
    offline: 'Desconectado',
    lastSeen: 'Visto por última vez',
    typing: 'escribiendo...',
    messageNotSent: 'El mensaje no se pudo enviar',
    unauthorized: 'No autorizado',
    notLoggedIn: 'Ya no estás conectado. Redirigiendo...',
    redirecting: 'Redirigiendo...',
    anonymousUser: 'Usuario Anónimo',
    
    // Profile
    editProfile: 'Editar Perfil',
    personalInfo: 'Información Personal',
    firstName: 'Nombre',
    lastName: 'Apellido',
    age: 'Edad',
    bio: 'Biografía',
    location: 'Ubicación',
    physicalDetails: 'Detalles Físicos',
    height: 'Altura',
    weight: 'Peso',
    bodyType: 'Tipo de Cuerpo',
    ethnicity: 'Etnia',
    cockSize: 'Tamaño',
    circumcision: 'Circuncisión',
    position: 'Posición',
    services: 'Servicios',
    interests: 'Intereses',
    profileUpdated: 'Perfil Actualizado',
    
    // Settings
    account: 'Cuenta',
    privacy: 'Privacidad',
    notifications: 'Notificaciones',
    appearance: 'Apariencia',
    support: 'Soporte',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    changePassword: 'Cambiar Contraseña',
    deleteAccount: 'Eliminar Cuenta',
    contactSupport: 'Contactar Soporte',
    faq: 'FAQ',
    pushNotifications: 'Notificaciones Push',
    
    // Premium
    premium: 'Premium',
    premiumActive: 'Premium Activo',
    premiumUpgrade: 'Actualización Premium',
    premiumAccess: 'Acceso Premium',
    premiumEscorts: 'Escorts Premium',
    
    // Actions
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    
    // Status
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Misc
    all: 'Todos',
    filter: 'Filtro',
    clearFilters: 'Limpiar Filtros',
    applyFilters: 'Aplicar Filtros',
    newEscorts: 'Nuevos Escorts',
    nearbyEscorts: 'Escorts Cercanos',
    
    // Additional Settings translations
    settingSaved: 'Configuración Guardada',
    privacySettingUpdated: 'Configuración de Privacidad Actualizada',
    settingNotSaved: 'No Se Pudo Guardar la Configuración',
    pushNotificationsEnabled: 'Notificaciones Push Activadas',
    pushNotificationsEnabledDesc: 'Ahora recibirás notificaciones para nuevos mensajes',
    permissionDenied: 'Permiso Denegado',
    pushNotificationsBrowserSettings: 'Las notificaciones push se pueden activar en la configuración del navegador',
    pushNotificationsNotActivated: 'No se pudieron activar las notificaciones push',
    logoutSuccess: 'Sesión Cerrada Exitosamente',
    logoutSuccessDesc: 'Has cerrado sesión exitosamente',
    transEscort: 'Trans Escort',
    customer: 'Cliente',
    upgrade: 'Actualizar',
    
    // Profile translations
    profileNotAvailable: 'Perfil No Disponible',
    
    // Chat translations
    typeMessagePlaceholder: 'Escribe un mensaje...',
    
    // Profile Edit translations
    backButton: 'Atrás',
    profileImages: 'Imágenes del Perfil',
    servicesOffered: 'Servicios Ofrecidos',
    
    // Additional UI translations needed
    myLocation: 'Mi Ubicación',
    useCurrentLocation: 'Usar Ubicación Actual',
    detectingLocation: 'Detectando Ubicación...',
    contact: 'Contacto',
    newEscortsSection: 'Nuevos Escorts',
    premiumEscortsSection: 'Escorts Premium',
    registerTitle: 'Registrarse',
    loginTitle: 'Iniciar Sesión',
    welcomeBack: 'Bienvenido de Vuelta',
    loginSuccess: 'Inicio de Sesión Exitoso!',
    loginFailed: 'Fallo en el Inicio de Sesión',
    invalidCredentials: 'Email o Contraseña Inválidos',
    escortsIn: 'Escorts en',
    noEscortsFound: 'No se Encontraron Escorts',
    
    // Premium page translations
    loginRequired: 'Inicio de Sesión Requerido',
    loginRequiredDesc: 'Por favor inicia sesión para activar Premium.',
    redirectingToVerotel: 'Redirigiendo a Verotel',
    redirectingToVerotelDesc: 'Serás redirigido a la página de pago seguro.',
    premiumBadge: 'Insignia Premium',
    premiumBadgeDesc: 'Corona dorada en tu perfil para mejor visibilidad',
    premiumSection: 'Sección Premium',
    premiumSectionDesc: 'Aparece en la sección separada de Escorts Premium',
    priority: 'Prioridad',
    priorityDesc: 'Mayor clasificación en resultados de búsqueda',
    moreVisibility: 'Más Visibilidad',
    moreVisibilityDesc: 'Tu perfil se mostrará más frecuentemente',
    chatPriority: 'Prioridad de Chat',
    chatPriorityDesc: 'Tus mensajes se mostrarán preferencialmente',
    extendedReach: 'Alcance Extendido',
    extendedReachDesc: 'Visible en radio mayor',
    
    // Register page translations  
    registerSuccess: 'Registro Exitoso!',
    registerFailed: 'Fallo en el Registro',
    confirmEmail: 'Por favor confirma tu dirección de correo.',
    errorOccurred: 'Ocurrió un error.',
    invalidEmail: 'Dirección de correo inválida',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    usernameRequired: 'El nombre de usuario es requerido',
    userTypeRequired: 'El tipo de usuario es requerido',
    passwordMismatch: 'Las contraseñas no coinciden',
    
    // Register Form Labels
    iAm: 'Soy...',
    transEscortOption: 'Trans* Escort',
    customerOption: 'Cliente (Hombre)',
    firstName: 'Nombre',
    lastName: 'Apellido',
    emailAddress: 'Dirección de Correo',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    createAccount: 'Crear Cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    
    // Filter Dialog
    filters: 'Filtros',
    ageRange: 'Rango de Edad',
    priceRange: 'Rango de Precio',
    cockSizeRange: 'Rango de Tamaño',
    position: 'Posición',
    bodyType: 'Tipo de Cuerpo',
    ethnicity: 'Etnia',
    circumcision: 'Circuncisión',
    services: 'Servicios',
    onlineOnly: 'Solo En Línea',
    premiumOnly: 'Solo Premium',
    applyFilters: 'Aplicar Filtros',
    clearFilters: 'Limpiar Filtros',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    profile: 'Profil',
    myProfile: 'Mon Profil',
    chat: 'Chat',
    chats: 'Chats',
    favorites: 'Favoris',
    more: 'Plus',
    settings: 'Paramètres',
    language: 'Langue',
    
    // Brand
    appName: 'TransEscorta',
    appDescription: 'Plateforme Premium TS-Escorts',
    
    // Auth
    login: 'Se Connecter',
    register: 'S\'inscrire',
    logout: 'Se Déconnecter',
    email: 'Email',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    username: 'Nom d\'Utilisateur',
    forgotPassword: 'Mot de Passe Oublié?',
    
    // Chat & Messages
    messages: 'Messages',
    noChatsYet: 'Pas encore de chats',
    messageInputPlaceholder: 'Tapez un message...',
    newMessage: 'Nouveau Message',
    typeMessage: 'Tapez un message...',
    sendMessage: 'Envoyer',
    online: 'En Ligne',
    offline: 'Hors Ligne',
    lastSeen: 'Vu pour la dernière fois',
    typing: 'tape...',
    messageNotSent: 'Le message n\'a pas pu être envoyé',
    unauthorized: 'Non autorisé',
    notLoggedIn: 'Vous n\'êtes plus connecté. Redirection...',
    redirecting: 'Redirection...',
    anonymousUser: 'Utilisateur Anonyme',
    
    // Profile
    editProfile: 'Modifier le Profil',
    personalInfo: 'Informations Personnelles',
    firstName: 'Prénom',
    lastName: 'Nom',
    age: 'Âge',
    bio: 'Biographie',
    location: 'Localisation',
    physicalDetails: 'Détails Physiques',
    height: 'Taille',
    weight: 'Poids',
    bodyType: 'Type de Corps',
    ethnicity: 'Ethnicité',
    cockSize: 'Taille',
    circumcision: 'Circoncision',
    position: 'Position',
    services: 'Services',
    interests: 'Intérêts',
    profileUpdated: 'Profil Mis à Jour',
    
    // Settings
    account: 'Compte',
    privacy: 'Confidentialité',
    notifications: 'Notifications',
    appearance: 'Apparence',
    support: 'Support',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    changePassword: 'Changer le Mot de Passe',
    deleteAccount: 'Supprimer le Compte',
    contactSupport: 'Contacter le Support',
    faq: 'FAQ',
    pushNotifications: 'Notifications Push',
    
    // Premium
    premium: 'Premium',
    premiumActive: 'Premium Actif',
    premiumUpgrade: 'Mise à niveau Premium',
    premiumAccess: 'Accès Premium',
    premiumEscorts: 'Escorts Premium',
    
    // Actions
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    
    // Status
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Misc
    all: 'Tous',
    filter: 'Filtre',
    clearFilters: 'Effacer les Filtres',
    applyFilters: 'Appliquer les Filtres',
    newEscorts: 'Nouveaux Escorts',
    nearbyEscorts: 'Escorts à Proximité',
    
    // Additional Settings translations
    settingSaved: 'Paramètre Sauvegardé',
    privacySettingUpdated: 'Paramètre de Confidentialité Mis à Jour',
    settingNotSaved: 'Le Paramètre N\'a Pas Pu Être Sauvegardé',
    pushNotificationsEnabled: 'Notifications Push Activées',
    pushNotificationsEnabledDesc: 'Vous recevrez maintenant des notifications pour les nouveaux messages',
    permissionDenied: 'Permission Refusée',
    pushNotificationsBrowserSettings: 'Les notifications push peuvent être activées dans les paramètres du navigateur',
    pushNotificationsNotActivated: 'Les notifications push n\'ont pas pu être activées',
    logoutSuccess: 'Déconnexion Réussie',
    logoutSuccessDesc: 'Vous avez été déconnecté avec succès',
    transEscort: 'Trans Escort',
    customer: 'Client',
    upgrade: 'Mise à Niveau',
    
    // Profile translations
    profileNotAvailable: 'Profil Non Disponible',
    
    // Chat translations
    typeMessagePlaceholder: 'Tapez un message...',
    
    // Profile Edit translations
    backButton: 'Retour',
    profileImages: 'Images du Profil',
    servicesOffered: 'Services Offerts',
    
    // Additional UI translations needed
    myLocation: 'Ma Localisation',
    useCurrentLocation: 'Utiliser la Localisation Actuelle',
    detectingLocation: 'Détection de la Localisation...',
    contact: 'Contact',
    newEscortsSection: 'Nouveaux Escorts',
    premiumEscortsSection: 'Escorts Premium',
    registerTitle: 'S\'inscrire',
    loginTitle: 'Se Connecter',
    welcomeBack: 'Bon Retour',
    loginSuccess: 'Connexion Réussie!',
    loginFailed: 'Échec de la Connexion',
    invalidCredentials: 'Email ou Mot de Passe Invalide',
    escortsIn: 'Escorts à',
    noEscortsFound: 'Aucun Escort Trouvé',
    
    // Premium page translations
    loginRequired: 'Connexion Requise',
    loginRequiredDesc: 'Veuillez vous connecter pour activer Premium.',
    redirectingToVerotel: 'Redirection vers Verotel',
    redirectingToVerotelDesc: 'Vous serez redirigé vers la page de paiement sécurisée.',
    premiumBadge: 'Badge Premium',
    premiumBadgeDesc: 'Couronne dorée dans votre profil pour une meilleure visibilité',
    premiumSection: 'Section Premium',
    premiumSectionDesc: 'Apparaître dans la section séparée des Escorts Premium',
    priority: 'Priorité',
    priorityDesc: 'Classement plus élevé dans les résultats de recherche',
    moreVisibility: 'Plus de Visibilité',
    moreVisibilityDesc: 'Votre profil sera affiché plus souvent',
    chatPriority: 'Priorité de Chat',
    chatPriorityDesc: 'Vos messages seront affichés de manière préférentielle',
    extendedReach: 'Portée Étendue',
    extendedReachDesc: 'Visible dans un rayon plus large',
    
    // Register page translations  
    registerSuccess: 'Inscription Réussie!',
    registerFailed: 'Échec de l\'Inscription',
    confirmEmail: 'Veuillez confirmer votre adresse email.',
    errorOccurred: 'Une erreur s\'est produite.',
    invalidEmail: 'Adresse email invalide',
    passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
    usernameRequired: 'Le nom d\'utilisateur est requis',
    userTypeRequired: 'Le type d\'utilisateur est requis',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    
    // Register Form Labels
    iAm: 'Je suis...',
    transEscortOption: 'Trans* Escort',
    customerOption: 'Client (Homme)',
    firstName: 'Prénom',
    lastName: 'Nom de Famille',
    emailAddress: 'Adresse Email',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    createAccount: 'Créer un Compte',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    
    // Filter Dialog
    filters: 'Filtres',
    ageRange: 'Tranche d\'Âge',
    priceRange: 'Gamme de Prix',
    cockSizeRange: 'Gamme de Taille',
    position: 'Position',
    bodyType: 'Type de Corps',
    ethnicity: 'Ethnie',
    circumcision: 'Circoncision',
    services: 'Services',
    onlineOnly: 'En Ligne Seulement',
    premiumOnly: 'Premium Seulement',
    applyFilters: 'Appliquer les Filtres',
    clearFilters: 'Effacer les Filtres',
  },
};