export type SupportedLanguage = 'fr' | 'en' | 'es' | 'it';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  proficiencyNote: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'fr', label: 'Français', nativeName: 'Français', proficiencyNote: 'Natif' },
  { code: 'en', label: 'English', nativeName: 'English', proficiencyNote: 'Niveau B2' },
  { code: 'es', label: 'Español', nativeName: 'Español', proficiencyNote: 'Niveau A2' },
  { code: 'it', label: 'Italiano', nativeName: 'Italiano', proficiencyNote: 'Niveau A1' },
];

export const CV_PDF_PATH = '/assets/aistudio/CV_Alternance_sept_2026__2__30ce1690.pdf';

export interface ExperienceItem {
  id: string;
  period: string;
  company: string;
  location: string;
  contractType: Record<SupportedLanguage, string>;
  role: Record<SupportedLanguage, string>;
  highlights: Record<SupportedLanguage, string[]>;
}

export interface EducationItem {
  id: string;
  period: string;
  institution: string;
  location: string;
  degree: Record<SupportedLanguage, string>;
  details: Record<SupportedLanguage, string>;
}

export interface UiCopy {
  nav: {
    assistant: string;
    experience: string;
    education: string;
    profile: string;
    viewCv: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subtitle: string;
    languageLabel: string;
    startVoice: string;
    endVoice: string;
    connecting: string;
    muteMic: string;
    unmuteMic: string;
  };
  highlights: {
    label: string;
    value: string;
  }[];
  studio: {
    title: string;
    ready: string;
    connecting: string;
    listening: string;
    speaking: string;
    muted: string;
    emptyTitle: string;
    emptyBody: string;
    inputPlaceholder: string;
    sendLabel: string;
    userLabel: string;
    assistantLabel: string;
    prompts: string[];
  };
  sections: {
    experienceTitle: string;
    experienceLead: string;
    educationTitle: string;
    educationLead: string;
    profileTitle: string;
    languagesHeading: string;
    toolsHeading: string;
    strengthsHeading: string;
    interestsHeading: string;
  };
  modal: {
    title: string;
    download: string;
    close: string;
  };
  footer: {
    note: string;
    contactLabel: string;
  };
}

export const UI_COPY: Record<SupportedLanguage, UiCopy> = {
  fr: {
    nav: {
      assistant: 'Assistante',
      experience: 'Expériences',
      education: 'Formations',
      profile: 'Profil',
      viewCv: 'CV PDF',
    },
    hero: {
      kicker: 'Paris · Communication de marque & Événementiel',
      headline: 'L’assistante vocale dédiée au parcours de Lisa Coigdarens.',
      subtitle:
        'Actuellement en alternance à La Banque de France dans le cadre de son Master à Sup de Pub Paris. Échangez de vive voix en français, anglais, espagnol ou italien pour découvrir ses expériences, formations et disponibilités.',
      languageLabel: 'Langue de conversation',
      startVoice: 'Démarrer la conversation vocale',
      endVoice: 'Terminer la session',
      connecting: 'Connexion audio…',
      muteMic: 'Couper le micro',
      unmuteMic: 'Activer le micro',
    },
    highlights: [
      { label: 'Poste actuel', value: 'La Banque de France · Alternance' },
      { label: 'Formation', value: 'Sup de Pub Paris · Master 1' },
      { label: 'Langues parlées', value: 'FR · EN · ES · IT' },
      { label: 'Certification', value: 'Mode & Luxe · LVMH' },
    ],
    studio: {
      title: 'Studio vocal en direct',
      ready: 'Prête à vous écouter',
      connecting: 'Initialisation de la ligne…',
      listening: 'À l’écoute',
      speaking: 'En train de répondre',
      muted: 'Micro en sourdine',
      emptyTitle: 'Posez votre question de vive voix ou choisissez un sujet',
      emptyBody:
        'L’assistante vocale répond instantanément avec une voix professionnelle et maîtrise l’ensemble du CV de Lisa.',
      inputPlaceholder: 'Écrire une question en FR, EN, ES ou IT…',
      sendLabel: 'Envoyer',
      userLabel: 'Vous',
      assistantLabel: 'Assistante de Lisa',
      prompts: [
        'Présentez-moi les missions de Lisa à La Banque de France.',
        'Quelle a été son expérience en radio et community management à Pau ?',
        'Parlez-moi de son échange universitaire à Bali et de ses langues.',
      ],
    },
    sections: {
      experienceTitle: '01. Expériences professionnelles',
      experienceLead: 'Communication institutionnelle, gestion événementielle et animation média.',
      educationTitle: '02. Formations académiques',
      educationLead: 'Un parcours structuré entre stratégie des marques, médias et ouverture internationale.',
      profileTitle: '03. Langues, outils & repères',
      languagesHeading: 'Langues maîtrisées',
      toolsHeading: 'Outils & Environnements',
      strengthsHeading: 'Qualités professionnelles',
      interestsHeading: 'Centres d’intérêt',
    },
    modal: {
      title: 'Curriculum Vitae — Lisa Coigdarens',
      download: 'Télécharger le PDF',
      close: 'Fermer',
    },
    footer: {
      note: 'Lisa Coigdarens · Master Manager de Communication de Marque · Paris',
      contactLabel: 'Contact direct',
    },
  },
  en: {
    nav: {
      assistant: 'Assistant',
      experience: 'Experience',
      education: 'Education',
      profile: 'Profile',
      viewCv: 'Resume PDF',
    },
    hero: {
      kicker: 'Paris · Brand Communication & Event Management',
      headline: 'The dedicated voice assistant for Lisa Coigdarens.',
      subtitle:
        'Currently in a work-study role at La Banque de France alongside her Master’s at Sup de Pub Paris. Speak live in French, English, Spanish, or Italian to explore her background, projects, and availability.',
      languageLabel: 'Conversation language',
      startVoice: 'Start Voice Conversation',
      endVoice: 'End Session',
      connecting: 'Connecting audio…',
      muteMic: 'Mute microphone',
      unmuteMic: 'Unmute microphone',
    },
    highlights: [
      { label: 'Current Role', value: 'La Banque de France · Work-Study' },
      { label: 'Degree', value: 'Sup de Pub Paris · Master 1' },
      { label: 'Languages', value: 'FR · EN · ES · IT' },
      { label: 'Credential', value: 'Fashion & Luxury · LVMH' },
    ],
    studio: {
      title: 'Live Voice Studio',
      ready: 'Ready when you are',
      connecting: 'Opening audio channel…',
      listening: 'Listening',
      speaking: 'Speaking',
      muted: 'Microphone muted',
      emptyTitle: 'Speak naturally or select a topic below',
      emptyBody:
        'Lisa’s assistant responds in real time with a poised, professional voice across four languages.',
      inputPlaceholder: 'Type a message in EN, FR, ES, or IT…',
      sendLabel: 'Send',
      userLabel: 'You',
      assistantLabel: 'Lisa’s Assistant',
      prompts: [
        'Walk me through Lisa’s communication & events work at La Banque de France.',
        'Tell me about her radio hosting and community management role in Pau.',
        'What did she study during her exchange in Bali and at Sup de Pub?',
      ],
    },
    sections: {
      experienceTitle: '01. Professional Experience',
      experienceLead: 'Institutional communication, event logistics, and media production.',
      educationTitle: '02. Academic Background',
      educationLead: 'Brand strategy, media studies, and international perspective.',
      profileTitle: '03. Languages, Tools & Interests',
      languagesHeading: 'Languages',
      toolsHeading: 'Software & Platforms',
      strengthsHeading: 'Core Strengths',
      interestsHeading: 'Interests',
    },
    modal: {
      title: 'Curriculum Vitae — Lisa Coigdarens',
      download: 'Download PDF',
      close: 'Close',
    },
    footer: {
      note: 'Lisa Coigdarens · Brand Communication & Event Strategy · Paris',
      contactLabel: 'Direct contact',
    },
  },
  es: {
    nav: {
      assistant: 'Asistente',
      experience: 'Experiencia',
      education: 'Formación',
      profile: 'Perfil',
      viewCv: 'CV PDF',
    },
    hero: {
      kicker: 'París · Comunicación de Marca y Eventos',
      headline: 'La asistente de voz dedicada a la trayectoria de Lisa Coigdarens.',
      subtitle:
        'Actualmente en alternancia en La Banque de France como parte de su Máster en Sup de Pub Paris. Converse en tiempo real en francés, inglés, español o italiano para conocer su perfil.',
      languageLabel: 'Idioma de la conversación',
      startVoice: 'Iniciar conversación de voz',
      endVoice: 'Finalizar sesión',
      connecting: 'Conectando audio…',
      muteMic: 'Silenciar micrófono',
      unmuteMic: 'Activar micrófono',
    },
    highlights: [
      { label: 'Puesto actual', value: 'La Banque de France · Alternancia' },
      { label: 'Formación', value: 'Sup de Pub Paris · Máster 1' },
      { label: 'Idiomas', value: 'FR · EN · ES · IT' },
      { label: 'Certificación', value: 'Moda y Lujo · LVMH' },
    ],
    studio: {
      title: 'Estudio de voz en vivo',
      ready: 'Lista para conversar',
      connecting: 'Abriendo canal de audio…',
      listening: 'Escuchando',
      speaking: 'Respondiendo',
      muted: 'Micrófono silenciado',
      emptyTitle: 'Hable con naturalidad o elija un tema',
      emptyBody:
        'La asistente de Lisa responde en directo con voz profesional sobre su experiencia y formación.',
      inputPlaceholder: 'Escriba una pregunta en ES, FR, EN o IT…',
      sendLabel: 'Enviar',
      userLabel: 'Usted',
      assistantLabel: 'Asistente de Lisa',
      prompts: [
        '¿Cuáles son las funciones de Lisa en La Banque de France?',
        'Cuénteme sobre su experiencia como locutora de radio en Pau.',
        '¿Qué estudió en Sup de Pub Paris y en su intercambio en Bali?',
      ],
    },
    sections: {
      experienceTitle: '01. Experiencia profesional',
      experienceLead: 'Comunicación institucional, coordinación de eventos y medios.',
      educationTitle: '02. Formación académica',
      educationLead: 'Estrategia de marcas, medios y proyección internacional.',
      profileTitle: '03. Idiomas, herramientas y perfil',
      languagesHeading: 'Idiomas',
      toolsHeading: 'Herramientas digitales',
      strengthsHeading: 'Cualidades',
      interestsHeading: 'Intereses',
    },
    modal: {
      title: 'Curriculum Vitae — Lisa Coigdarens',
      download: 'Descargar PDF',
      close: 'Cerrar',
    },
    footer: {
      note: 'Lisa Coigdarens · Estrategia de Marca y Eventos · París',
      contactLabel: 'Contacto directo',
    },
  },
  it: {
    nav: {
      assistant: 'Assistente',
      experience: 'Esperienze',
      education: 'Formazione',
      profile: 'Profilo',
      viewCv: 'CV PDF',
    },
    hero: {
      kicker: 'Parigi · Comunicazione di Brand ed Eventi',
      headline: 'L’assistente vocale dedicata al profilo di Lisa Coigdarens.',
      subtitle:
        'Attualmente in alternanza presso La Banque de France nell’ambito del Master a Sup de Pub Paris. Parli dal vivo in francese, inglese, spagnolo o italiano per scoprire il suo percorso.',
      languageLabel: 'Lingua della conversazione',
      startVoice: 'Avvia conversazione vocale',
      endVoice: 'Termina sessione',
      connecting: 'Connessione audio…',
      muteMic: 'Disattiva microfono',
      unmuteMic: 'Attiva microfono',
    },
    highlights: [
      { label: 'Ruolo attuale', value: 'La Banque de France · Alternanza' },
      { label: 'Formazione', value: 'Sup de Pub Paris · Master 1' },
      { label: 'Lingue', value: 'FR · EN · ES · IT' },
      { label: 'Certificazione', value: 'Moda e Lusso · LVMH' },
    ],
    studio: {
      title: 'Studio vocale dal vivo',
      ready: 'Pronta ad ascoltare',
      connecting: 'Apertura canale audio…',
      listening: 'In ascolto',
      speaking: 'Sta rispondendo',
      muted: 'Microfono disattivato',
      emptyTitle: 'Parli liberamente o scelga un argomento',
      emptyBody:
        'L’assistente di Lisa risponde in tempo reale con tono professionale sulle sue esperienze e competenze.',
      inputPlaceholder: 'Scriva un messaggio in IT, FR, EN o ES…',
      sendLabel: 'Invia',
      userLabel: 'Lei',
      assistantLabel: 'Assistente di Lisa',
      prompts: [
        'Quali sono le responsabilità di Lisa presso La Banque de France?',
        'Mi racconti la sua esperienza radiofonica e social media a Pau.',
        'Qual è il suo percorso tra Sup de Pub Paris e lo scambio a Bali?',
      ],
    },
    sections: {
      experienceTitle: '01. Esperienze professionali',
      experienceLead: 'Comunicazione istituzionale, organizzazione eventi e media.',
      educationTitle: '02. Formazione accademica',
      educationLead: 'Strategia di brand, media e respiro internazionale.',
      profileTitle: '03. Lingue, strumenti e interessi',
      languagesHeading: 'Lingue',
      toolsHeading: 'Strumenti digitali',
      strengthsHeading: 'Punti di forza',
      interestsHeading: 'Interessi',
    },
    modal: {
      title: 'Curriculum Vitae — Lisa Coigdarens',
      download: 'Scarica PDF',
      close: 'Chiudi',
    },
    footer: {
      note: 'Lisa Coigdarens · Strategia di Marca ed Eventi · Parigi',
      contactLabel: 'Contatto diretto',
    },
  },
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'banque-de-france',
    period: '16/06/2026 — 14/08/2026',
    company: 'La Banque de France',
    location: 'Paris',
    contractType: {
      fr: 'Stage & Alternance',
      en: 'Internship & Work-Study',
      es: 'Prácticas y Alternancia',
      it: 'Stage e Alternanza',
    },
    role: {
      fr: 'Assistante communication et événementiel',
      en: 'Communication & Events Assistant',
      es: 'Asistente de comunicación y eventos',
      it: 'Assistente comunicazione ed eventi',
    },
    highlights: {
      fr: [
        'Création de contenus de communication (newsletters, supports internes et externes).',
        'Conception de supports visuels (présentations, documents) dans le respect de la charte graphique.',
        'Participation à l’organisation et à la coordination d’événements internes et externes.',
        'Gestion des relations prestataires : rédaction de briefs, analyse de devis, suivi des productions.',
        'Gestion de projets via Teams et SharePoint, suivi des priorités et respect des délais.',
      ],
      en: [
        'Created communication materials including newsletters and internal/external deliverables.',
        'Designed visual presentations and documents strictly aligned with brand guidelines.',
        'Coordinated and supported internal and external institutional events.',
        'Managed vendor relationships: writing briefs, evaluating quotes, and overseeing production.',
        'Tracked project milestones and deadlines using collaborative tools (Teams, SharePoint).',
      ],
      es: [
        'Creación de contenidos de comunicación (newsletters, soportes internos y externos).',
        'Diseño de presentaciones y documentos respetando la identidad gráfica.',
        'Coordinación y organización de eventos internos y externos.',
        'Relación con proveedores: redacción de briefs, análisis de presupuestos y seguimiento.',
        'Gestión de proyectos con Teams y SharePoint cumpliendo plazos y prioridades.',
      ],
      it: [
        'Creazione di contenuti di comunicazione (newsletter, supporti interni ed esterni).',
        'Progettazione di presentazioni e documenti nel rispetto delle linee guida grafiche.',
        'Organizzazione e coordinamento di eventi interni ed esterni.',
        'Gestione dei fornitori: stesura di brief, analisi dei preventivi e controllo produzione.',
        'Gestione progetti su Teams e SharePoint con attenzione a priorità e scadenze.',
      ],
    },
  },
  {
    id: 'uppa',
    period: '14/10/2024 — 30/06/2025',
    company: 'Université de Pau et des Pays de l’Adour (UPPA)',
    location: 'Pau',
    contractType: {
      fr: 'Service Civique',
      en: 'Civic Service',
      es: 'Servicio Cívico',
      it: 'Servizio Civico',
    },
    role: {
      fr: 'Community Manager et Animatrice Radio',
      en: 'Community Manager & Radio Host',
      es: 'Community Manager y Locutora de Radio',
      it: 'Community Manager e Conduttrice Radio',
    },
    highlights: {
      fr: [
        'Gestion des réseaux sociaux : création de stories et posts pour promouvoir les émissions.',
        'Couverture d’événements et interviews de professionnels pour enrichir le contenu éditorial.',
        'Recherche, simplification et synthèse d’informations pour une diffusion claire et accessible.',
        'Animation d’émissions de radio quotidiennes et bimensuelles.',
      ],
      en: [
        'Managed social media channels, creating stories and posts to promote radio broadcasts.',
        'Covered campus events and interviewed professionals to enrich on-air programming.',
        'Researched, synthesized, and simplified complex topics for clear audience delivery.',
        'Hosted daily and bi-monthly live radio shows.',
      ],
      es: [
        'Gestión de redes sociales: creación de stories y publicaciones para promocionar programas.',
        'Cobertura de eventos y entrevistas a profesionales para enriquecer la programación.',
        'Investigación y síntesis de información para una difusión clara y accesible.',
        'Conducción de programas de radio diarios y quincenales.',
      ],
      it: [
        'Gestione dei social media: creazione di storie e post per promuovere le trasmissioni.',
        'Copertura di eventi e interviste a professionisti per arricchire i contenuti.',
        'Ricerca e sintesi delle informazioni per una comunicazione chiara e accessibile.',
        'Conduzione di programmi radiofonici quotidiani e bisettimanali.',
      ],
    },
  },
  {
    id: 'crea-sud',
    period: '07/05/2023 — 07/07/2023',
    company: 'Créa Sud Communication',
    location: 'Lescar',
    contractType: {
      fr: 'Stage',
      en: 'Internship',
      es: 'Prácticas',
      it: 'Stage',
    },
    role: {
      fr: 'Chargée de communication et projet événementiel',
      en: 'Communication & Event Project Coordinator',
      es: 'Encargada de comunicación y proyectos de eventos',
      it: 'Addetta alla comunicazione e progetti eventi',
    },
    highlights: {
      fr: [
        'Préparation et conception d’événements pour TotalEnergies et le CALAC (salon des maires des Landes).',
        'Planification et coordination logistique : conférences, salons, séminaires, remise de trophées E-py (Pyrénées Presse) et colloques au Palais Beaumont à Pau.',
        'Mise en place de missions stratégiques et réflexions adaptées aux besoins clients.',
        'Rédaction de newsletters, contenus réseaux sociaux et relationnel client.',
      ],
      en: [
        'Designed and prepared events for TotalEnergies and CALAC (Landes Mayors Trade Show).',
        'Coordinated event logistics for conferences, trade shows, seminars, the E-py Awards (Pyrénées Presse), and symposiums at Palais Beaumont in Pau.',
        'Contributed to strategic planning aligned with client objectives.',
        'Drafted newsletters, social media content, and managed direct client relations.',
      ],
      es: [
        'Preparación y diseño de eventos para TotalEnergies y CALAC (salón de alcaldes de las Landas).',
        'Logística de conferencias, ferias, seminarios, premios E-py y coloquios en el Palais Beaumont de Pau.',
        'Desarrollo de misiones estratégicas adaptadas a las necesidades del cliente.',
        'Redacción de newsletters, contenidos para redes sociales y atención al cliente.',
      ],
      it: [
        'Ideazione e preparazione di eventi per TotalEnergies e CALAC.',
        'Pianificazione logistica di conferenze, fiere, seminari, premi E-py e convegni al Palais Beaumont di Pau.',
        'Sviluppo di attività strategiche in base alle esigenze aziendali.',
        'Redazione di newsletter, contenuti social e gestione diretta dei clienti.',
      ],
    },
  },
];

export const EDUCATIONS: EducationItem[] = [
  {
    id: 'sup-de-pub',
    period: '2026 — 2028',
    institution: 'Sup de Pub',
    location: 'Paris (75)',
    degree: {
      fr: 'Master 1 Stratégies des Marques et des Médias — Stratégie Événementielle',
      en: 'Master 1 Brand & Media Strategy — Event Strategy',
      es: 'Máster 1 Estrategias de Marcas y Medios — Estrategia de Eventos',
      it: 'Master 1 Strategie di Marca e Media — Strategia Eventi',
    },
    details: {
      fr: 'Échange universitaire à l’Universitas Warmadewa à Bali (septembre à décembre 2025).',
      en: 'University exchange semester at Universitas Warmadewa in Bali (September – December 2025).',
      es: 'Intercambio universitario en Universitas Warmadewa en Bali (septiembre a diciembre de 2025).',
      it: 'Scambio universitario presso l’Universitas Warmadewa a Bali (settembre – dicembre 2025).',
    },
  },
  {
    id: 'avignon',
    period: '2021 — 2024',
    institution: 'Université Hannah Arendt',
    location: 'Avignon (84)',
    degree: {
      fr: 'Licence Information-Communication — Mention Assez bien',
      en: 'Bachelor’s in Information & Communication — Honours',
      es: 'Grado en Información y Comunicación — Notable',
      it: 'Laurea in Informazione e Comunicazione — Con merito',
    },
    details: {
      fr: 'Marketing, stratégie de communication, PAO, analyse d’image, sémiologie, anthropologie, économie de la culture. Réalisations : podcasts musicaux, couvertures et magazines, newsletters, affiches publicitaires et pochettes d’albums.',
      en: 'Coursework in marketing, communication strategy, DTP, visual analysis, semiotics, anthropology, and cultural economics. Produced music podcasts, magazine covers, newsletters, advertising posters, and album artwork.',
      es: 'Marketing, estrategia de comunicación, diseño editorial, análisis de imagen, semiología y economía de la cultura. Proyectos: podcasts musicales, portadas de revistas, newsletters y carteles publicitarios.',
      it: 'Marketing, strategia di comunicazione, grafica editoriale, analisi dell’immagine, semiologia e antropologia. Progetti: podcast musicali, copertine di riviste, newsletter e manifesti pubblicitari.',
    },
  },
  {
    id: 'bac',
    period: '2020',
    institution: 'Lycée Albert Camus',
    location: 'Mourenx (64)',
    degree: {
      fr: 'Baccalauréat Général — Spécialités Anglais et Sciences Politiques',
      en: 'French General Baccalaureate — English & Political Science',
      es: 'Bachillerato General — Especialidades Inglés y Ciencias Políticas',
      it: 'Diploma di Maturità Generale — Inglese e Scienze Politiche',
    },
    details: {
      fr: 'Mention Assez bien.',
      en: 'Graduated with Honours (Mention Assez bien).',
      es: 'Mención Notable (Mention Assez bien).',
      it: 'Conseguito con merito (Mention Assez bien).',
    },
  },
];

export const PROFILE_LISTS = {
  languages: [
    { name: 'Français', level: 'Langue maternelle / Native' },
    { name: 'Anglais / English', level: 'Niveau B2' },
    { name: 'Espagnol / Español', level: 'Niveau A2' },
    { name: 'Italien / Italiano', level: 'Niveau A1' },
  ],
  tools: [
    'Canva & PAO',
    'Microsoft Office (Word, Excel, PowerPoint)',
    'Google Suite (Docs, Sheets, Slides)',
    'Teams & SharePoint',
    'Réseaux sociaux & LinkedIn',
    'SketchUp (Modélisation 3D)',
  ],
  strengths: {
    fr: ['Créative', 'Rigoureuse', 'Autonome', 'Organisée', 'Polyvalente', 'Esprit d’équipe'],
    en: ['Creative', 'Rigorous', 'Autonomous', 'Organized', 'Versatile', 'Team-oriented'],
    es: ['Creativa', 'Rigurosa', 'Autónoma', 'Organizada', 'Polivalente', 'Trabajo en equipo'],
    it: ['Creativa', 'Rigorosa', 'Autonoma', 'Organizzata', 'Versatile', 'Spirito di squadra'],
  },
  interests: {
    fr: [
      'Mode et luxe (Certification LVMH)',
      'Musique (Pop, Rap)',
      'Lecture',
      'Voyages (Bali, Crète, Turquie)',
      'Sport (Escalade et ski)',
    ],
    en: [
      'Fashion & Luxury (LVMH Certified)',
      'Music (Pop, Rap)',
      'Reading',
      'Travel (Bali, Crete, Turkey)',
      'Sports (Climbing & Skiing)',
    ],
    es: [
      'Moda y lujo (Certificación LVMH)',
      'Música (Pop, Rap)',
      'Lectura',
      'Viajes (Bali, Creta, Turquía)',
      'Deporte (Escalada y esquí)',
    ],
    it: [
      'Moda e lusso (Certificazione LVMH)',
      'Musica (Pop, Rap)',
      'Lettura',
      'Viaggi (Bali, Creta, Turchia)',
      'Sport (Arrampicata e sci)',
    ],
  },
};

export const CONTACT_INFO = {
  name: 'Lisa Coigdarens',
  phone: '06.24.17.71.27',
  email: 'lisa.coigdarens@sfr.fr',
  city: 'Paris, France',
};
