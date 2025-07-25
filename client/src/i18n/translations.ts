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