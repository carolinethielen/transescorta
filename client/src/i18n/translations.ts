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
  },
};