import { WilayaData, VehicleCategory } from '../types';

export const WILAYAS: WilayaData[] = [
  { code: '16', nameFr: 'Alger', nameAr: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588 },
  { code: '31', nameFr: 'Oran', nameAr: 'وهران', lat: 35.6987, lng: -0.6349 },
  { code: '01', nameFr: 'Adrar', nameAr: 'أدرار', lat: 27.87, lng: -0.29 },
  { code: '02', nameFr: 'Chlef', nameAr: 'الشلف', lat: 36.165, lng: 1.334 },
  { code: '03', nameFr: 'Laghouat', nameAr: 'الأغواط', lat: 33.8, lng: 2.865 },
  { code: '04', nameFr: 'Oum El Bouaghi', nameAr: 'أم البواقي', lat: 35.875, lng: 7.113 },
  { code: '05', nameFr: 'Batna', nameAr: 'باتنة', lat: 35.555, lng: 6.174 },
  { code: '06', nameFr: 'Béjaïa', nameAr: 'بجاية', lat: 36.751, lng: 5.056 },
  { code: '07', nameFr: 'Biskra', nameAr: 'بسكرة', lat: 34.85, lng: 5.728 },
  { code: '08', nameFr: 'Béchar', nameAr: 'بشار', lat: 31.617, lng: -2.217 },
  { code: '09', nameFr: 'Blida', nameAr: 'البليدة', lat: 36.47, lng: 2.83 },
  { code: '10', nameFr: 'Bouira', nameAr: 'البويرة', lat: 36.375, lng: 3.9 },
  { code: '11', nameFr: 'Tamanrasset', nameAr: 'تمنراست', lat: 22.785, lng: 5.523 },
  { code: '12', nameFr: 'Tébessa', nameAr: 'تبسة', lat: 35.404, lng: 8.124 },
  { code: '13', nameFr: 'Tlemcen', nameAr: 'تلمسان', lat: 34.878, lng: -1.315 },
  { code: '14', nameFr: 'Tiaret', nameAr: 'تيارت', lat: 35.371, lng: 1.317 },
  { code: '15', nameFr: 'Tizi Ouzou', nameAr: 'تيزي وزو', lat: 36.717, lng: 4.05 },
  { code: '17', nameFr: 'Djelfa', nameAr: 'الجلفة', lat: 34.67, lng: 3.263 },
  { code: '18', nameFr: 'Jijel', nameAr: 'جيجل', lat: 36.82, lng: 5.766 },
  { code: '19', nameFr: 'Sétif', nameAr: 'سطيف', lat: 36.19, lng: 5.41 },
  { code: '20', nameFr: 'Saïda', nameAr: 'سعيدة', lat: 34.83, lng: 0.15 },
  { code: '21', nameFr: 'Skikda', nameAr: 'سكيكدة', lat: 36.876, lng: 6.909 },
  { code: '22', nameFr: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', lat: 35.19, lng: -0.63 },
  { code: '23', nameFr: 'Annaba', nameAr: 'عنابة', lat: 36.9, lng: 7.766 },
  { code: '24', nameFr: 'Guelma', nameAr: 'قالمة', lat: 36.462, lng: 7.426 },
  { code: '25', nameFr: 'Constantine', nameAr: 'قسنطينة', lat: 36.365, lng: 6.615 },
  { code: '26', nameFr: 'Médéa', nameAr: 'المدية', lat: 36.264, lng: 2.75 },
  { code: '27', nameFr: 'Mostaganem', nameAr: 'مستغانم', lat: 35.93, lng: 0.09 },
  { code: '28', nameFr: 'M\'Sila', nameAr: 'المسيلة', lat: 35.7, lng: 4.54 },
  { code: '29', nameFr: 'Mascara', nameAr: 'معسكر', lat: 35.396, lng: 0.14 },
  { code: '30', nameFr: 'Ouargla', nameAr: 'ورقلة / حاسي مسعود', lat: 31.95, lng: 5.33 },
  { code: '32', nameFr: 'El Bayadh', nameAr: 'البيض', lat: 33.68, lng: 1.02 },
  { code: '33', nameFr: 'Illizi', nameAr: 'إليزي', lat: 26.5, lng: 8.48 },
  { code: '34', nameFr: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', lat: 36.073, lng: 4.761 },
  { code: '35', nameFr: 'Boumerdès', nameAr: 'بومرداس', lat: 36.766, lng: 3.477 },
  { code: '36', nameFr: 'El Tarf', nameAr: 'الطارف', lat: 36.767, lng: 8.314 },
  { code: '37', nameFr: 'Tindouf', nameAr: 'تندوف', lat: 27.67, lng: -8.147 },
  { code: '38', nameFr: 'Tissemsilt', nameAr: 'تيسمسيلت', lat: 35.607, lng: 1.81 },
  { code: '39', nameFr: 'El Oued', nameAr: 'الوادي', lat: 33.368, lng: 6.867 },
  { code: '40', nameFr: 'Khenchela', nameAr: 'خنشلة', lat: 35.435, lng: 7.143 },
  { code: '41', nameFr: 'Souk Ahras', nameAr: 'سوق أهراس', lat: 36.286, lng: 7.951 },
  { code: '42', nameFr: 'Tipaza', nameAr: 'تيبازة', lat: 36.589, lng: 2.447 },
  { code: '43', nameFr: 'Mila', nameAr: 'ميلة', lat: 36.45, lng: 6.264 },
  { code: '44', nameFr: 'Aïn Defla', nameAr: 'عين الدفلى', lat: 36.264, lng: 1.968 },
  { code: '45', nameFr: 'Naâma', nameAr: 'النعامة', lat: 33.267, lng: -0.317 },
  { code: '46', nameFr: 'Aïn Témouchent', nameAr: 'عين تموشنت', lat: 35.298, lng: -1.14 },
  { code: '47', nameFr: 'Ghardaïa', nameAr: 'غرداية', lat: 32.49, lng: 3.67 },
  { code: '48', nameFr: 'Relizane', nameAr: 'غليزان', lat: 35.737, lng: 0.556 },
  { code: '49', nameFr: 'Timimoun', nameAr: 'تيميمون', lat: 29.26, lng: 0.23 },
  { code: '50', nameFr: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', lat: 21.33, lng: 0.95 },
  { code: '51', nameFr: 'Ouled Djellal', nameAr: 'أولاد جلال', lat: 34.43, lng: 5.07 },
  { code: '52', nameFr: 'Béni Abbès', nameAr: 'بني عباس', lat: 30.13, lng: -2.17 },
  { code: '53', nameFr: 'In Salah', nameAr: 'عين صالح', lat: 27.2, lng: 2.48 },
  { code: '54', nameFr: 'In Guezzam', nameAr: 'عين قزام', lat: 19.57, lng: 5.77 },
  { code: '55', nameFr: 'Touggourt', nameAr: 'تقرت', lat: 33.1, lng: 6.06 },
  { code: '56', nameFr: 'Djanet', nameAr: 'جانت', lat: 24.55, lng: 9.48 },
  { code: '57', nameFr: 'El M\'Ghair', nameAr: 'المغير', lat: 33.95, lng: 5.92 },
  { code: '58', nameFr: 'El Meniaa', nameAr: 'المنيعة', lat: 30.58, lng: 2.88 },
  { code: '59', nameFr: 'Aflou', nameAr: 'أفلو', lat: 34.11, lng: 2.1 },
  { code: '60', nameFr: 'Barika', nameAr: 'بريكة', lat: 35.39, lng: 5.37 },
  { code: '61', nameFr: 'Ksar Chellala', nameAr: 'قصر الشلالة', lat: 35.22, lng: 2.32 },
  { code: '62', nameFr: 'Messaad', nameAr: 'مسعد', lat: 34.16, lng: 3.5 },
  { code: '63', nameFr: 'Aïn Oussara', nameAr: 'عين وسارة', lat: 35.45, lng: 2.91 },
  { code: '64', nameFr: 'Bou Saâda', nameAr: 'بوسعادة', lat: 35.21, lng: 4.18 },
  { code: '65', nameFr: 'El Abiodh Sidi Cheikh', nameAr: 'الأبيض سيدي الشيخ', lat: 32.89, lng: 0.55 },
  { code: '66', nameFr: 'El Kantara', nameAr: 'القنطرة', lat: 35.22, lng: 5.7 },
  { code: '67', nameFr: 'Bir El Ater', nameAr: 'بئر العاتر', lat: 34.75, lng: 8.06 },
  { code: '68', nameFr: 'Ksar El Boukhari', nameAr: 'قصر البخاري', lat: 35.88, lng: 2.75 },
  { code: '69', nameFr: 'El Aricha', nameAr: 'العريشة', lat: 34.22, lng: -1.28 }
];

export const ALGERIAN_HIGHWAYS = [
  'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
  'الطريق الوطني رقم 1 (RN1 العابر للصحراء Trans-Saharienne)',
  'الطريق الوطني رقم 2 (RN2 وهران - عين تموشنت - تلمسان)',
  'الطريق الوطني رقم 3 (RN3 سكيكدة - قسنطينة - باتنة - بسكرة - تقرت - ورقلة - إليزي)',
  'الطريق الوطني رقم 4 (RN4 الجزائر - وهران)',
  'الطريق الوطني رقم 5 (RN5 الجزائر - قسنطينة)',
  'الطريق الوطني رقم 6 (RN6 طريق الواحات: وهران - بشار - أدرار)',
  'الطريق الوطني رقم 7 (RN7 غليزان - معسكر - سيدي بلعباس - تلمسان)',
  'الطريق الوطني رقم 22 (RN22 تلمسان - العريشة - النعامة)',
  'الطريق الوطني رقم 44 (RN44 سكيكدة - عنابة - الطارف)',
  'الطريق الوطني رقم 50 (RN50 بشار - تندوف)',
  'الطريق الوطني رقم 51 (RN51 تيميمون - المنيعة - ورقلة)',
  'الطريق الساحلي RN11 (وهران - مستغانم - تيبازة - الجزائر)',
  'الطريق الوطني رقم 9 (RN9 سطيف - بجاية)',
  'الطريق السيار للهضاب العليا (Autoroute des Hauts Plateaux)'
];

export const VEHICLE_CATEGORIES_INFO: Record<VehicleCategory, {
  nameAr: string;
  nameFr: string;
  typeAr: string;
  maxWeightAr: string;
  fixedCommissionDzd: number;
  iconType: string;
  descriptionAr: string;
}> = {
  B_LIGHT: {
    nameAr: 'صنف B النفعي',
    nameFr: 'Catégorie B Utilitaire',
    typeAr: 'شاحنات صغيرة ونفعية',
    maxWeightAr: 'حمولة ≤ 3.5 طن (هاربيل، ماستر، جامبي)',
    fixedCommissionDzd: 500,
    iconType: 'van',
    descriptionAr: 'للطرود، الأجهزة الكهرومنزلية، السلع الخفيفة والبضائع التجارية السريعة'
  },
  C1: {
    nameAr: 'صنف C1 (شاحنة متوسطة)',
    nameFr: 'Catégorie C1 Poids Moyen',
    typeAr: 'شاحنات نقل بضائع',
    maxWeightAr: 'من 3.5 طن إلى 19 طن (PTAC)',
    fixedCommissionDzd: 1200,
    iconType: 'truck_medium',
    descriptionAr: 'نقل مواد البناء، الشحنات الصناعية، والمحاصيل الزراعية'
  },
  C2: {
    nameAr: 'صنف C2 (شاحنة كبرى)',
    nameFr: 'Catégorie C2 Poids Lourd',
    typeAr: 'شاحنات نقل ثقيل',
    maxWeightAr: 'أكثر من 19 طن (PTAC)',
    fixedCommissionDzd: 2000,
    iconType: 'truck_heavy',
    descriptionAr: 'حمولات صناعية ثقيلة، منصات لوجستية، وشحن بين الولايات الكبرى'
  },
  E_TRAILER: {
    nameAr: 'صنف E (شاحنة بمقطورة)',
    nameFr: 'Catégorie E Semi-Remorque',
    typeAr: 'شاحنة + مقطورة > 750 كغ',
    maxWeightAr: 'شبه مقطورة سيمي رومورك (حتى 40 طن)',
    fixedCommissionDzd: 2500,
    iconType: 'trailer',
    descriptionAr: 'حاويات الموانئ، شحنات الحبوب، والحديد والصلب على الطرق السريعة'
  },
  PORTE_CHAR: {
    nameAr: 'بورت شار (Porte-char)',
    nameFr: 'Porte-Char & Engins',
    typeAr: 'نقل الجرافات والعتاد الثقيل',
    maxWeightAr: 'عتاد أشغال عمومية، رافعات وجرافات',
    fixedCommissionDzd: 3500,
    iconType: 'crane',
    descriptionAr: 'مخصصة لنقل آلات الأشغال العمومية والعتاد الهندسي الثقيل'
  },
  B_PASSENGER: {
    nameAr: 'نقل الأشخاص (صنف B)',
    nameFr: 'Transport Personnes (Cat. B)',
    typeAr: 'سيارات سياحية ونفعية',
    maxWeightAr: 'حد أقصى 9 أشخاص',
    fixedCommissionDzd: 400,
    iconType: 'passengers_small',
    descriptionAr: 'تنقل الأفراد، رحلات العودة التشاركية بين الولايات'
  },
  D_BUS: {
    nameAr: 'حافلات جماعية (صنف D)',
    nameFr: 'Autobus & Minibus (Cat. D)',
    typeAr: 'حافلات النقل الجماعي',
    maxWeightAr: 'أكثر من 9 ركاب (ميكروباص / حافلة)',
    fixedCommissionDzd: 1500,
    iconType: 'bus',
    descriptionAr: 'نقل عمال الورشات، وفود رياضية، ورحلات العودة الجماعية'
  }
};

export const CLIENT_PREMIUM_BENEFITS = [
  {
    id: 1,
    titleAr: 'أولوية الظهور للناقلين',
    titleFr: 'Priorité de visibilité',
    descAr: 'تظهر طلباتك فوراً في أعلى نتائج البحث لدى جميع السائقين المتاحين على خط سيرك.',
    descFr: 'Vos demandes s\'affichent en tête de liste pour tous les transporteurs de votre trajet.'
  },
  {
    id: 2,
    titleAr: 'إشعارات فورية مباشرة',
    titleFr: 'Alertes Push instantanées',
    descAr: 'تنبيه لحظي على هاتفك بمجرد تسجيل أي ناقل لرحلة عودة تطابق حمولتك.',
    descFr: 'Alerte instantanée dès qu\'un transporteur déclare un retour à vide compatible.'
  },
  {
    id: 3,
    titleAr: 'إلغاء مجاني ومرن',
    titleFr: 'Annulation gratuite',
    descAr: 'إمكانية إلغاء الطلب في أي وقت دون أي رسوم أو قيود عند تغير جدولك.',
    descFr: 'Annulation flexible sans frais à tout moment si votre planning change.'
  },
  {
    id: 4,
    titleAr: 'دعم هاتفي ذو أولوية 24/7',
    titleFr: 'Support prioritaire 24/7',
    descAr: 'خط اتصال مباشر مع فريق دعم رايح جاي للمتابعة والمساعدة في أي ظرف.',
    descFr: 'Ligne directe avec l\'équipe d\'assistance Rayeh Jay en continu.'
  },
  {
    id: 5,
    titleAr: 'تقارير وفواتير شهرية',
    titleFr: 'Rapports mensuels & factures',
    descAr: 'كشف حساب رقمي شامل لجميع عمليات النقل وتوفير المصاريف للشركات والتجار.',
    descFr: 'Rapports détaillés et facturation mensuelle pour entreprises et commerçants.'
  }
];

export const TRANSLATIONS = {
  ar: {
    appName: 'رايح جاي',
    tagline: 'منصة ربط أصحاب الحمولات بالناقلين العائدين في الجزائر',
    problemSolved: 'حل معضلة الرحلة الفارغة — الزبون يبحث ويتصل، والسائق يملأ شاحنته العائدة!',
    clientMode: 'وضع الزبون (صاحب الحمولة)',
    driverMode: 'وضع السائق (الناقل)',
    securityNotice: 'كل هذه المعلومات تُخزّن في الخادم لحمايتك وحماية الزبون 🔒',
    searchReturnTrip: 'ابحث عن ناقل عائد على طريقك',
    fromWilaya: 'ولاية الانطلاق (موقعي)',
    toWilaya: 'ولاية الوصول (وجهتي)',
    cargoTypePlaceholder: 'ما نوع المنقول؟ (بضاعة، آلات، أثاث، ركاب...)',
    smartSuggestBtn: 'اقتراح ذكي لنوع العربة',
    searchBtn: 'ابحث عن ناقلين عائدين',
    callBtn: 'اتصال',
    waitingDriverConfirm: 'في انتظار تأكيد الناقل...',
    waitingClientCall: 'في انتظار اتصال الزبون...',
    driverAccepted: 'تم قبول طلبك! رقم هاتف الناقل:',
    acceptBtn: 'أقبل الطلب',
    rejectBtn: 'اعتذار',
    fixedCommissionNote: 'عمولة ثابتة حسب نوع العربة يلتزم بدفعها السائق فقط بعد تأكيد التنفيذ',
    restModeTitle: 'أنت في وقت راحتك، استفد منه ☕',
    restModeDesc: 'لقد أتممت رحلتك بنجاح. لن تظهر في قائمة الزبائن حتى ترتاح وتستعيد طاقتك لسلامة الطريق.',
    delayReasonLabel: 'هل طرأ تأخير؟ اذكر السبب',
    delayAutoUpdateNote: 'سيتم تحديث وقت الوصول التقديري تلقائياً لدى الزبائن',
    alongRouteOption: 'أنقل لأي أحد على طول طريقي / في كل اتجاه',
    candidateListTitle: 'السائقون المرشحون العائدون (ضمن دائرة 30 كم أو على المسار)',
    noCandidates: 'لا يوجد ناقل عائد يطابق البحث حالياً. جرب البحث في ولاية مجاورة أو تفعيل خيار طول الطريق.',
    navHome: 'الرئيسية',
    navMap: 'على طريقي',
    navMyTrips: 'رحلاتي وطلباتي',
    navProfile: 'حسابي والتوثيق',
    cockpitViewToggle: 'عرض مقصورة السيارة',
    fullscreenToggle: 'عرض ملء الشاشة'
  },
  fr: {
    appName: 'Rayeh Jay',
    tagline: 'Fret de retour & transport en Algérie',
    problemSolved: 'Zéro retour à vide — Le client recherche et contacte le chauffeur de retour !',
    clientMode: 'Mode Client (Expéditeur)',
    driverMode: 'Mode Chauffeur (Transporteur)',
    securityNotice: 'Toutes ces données sont stockées de façon sécurisée sur le serveur pour votre protection 🔒',
    searchReturnTrip: 'Trouver un transporteur de retour sur votre route',
    fromWilaya: 'Wilaya de départ (Ma position)',
    toWilaya: 'Wilaya d\'arrivée (Destination)',
    cargoTypePlaceholder: 'Nature du chargement (fret, engins, passagers...)',
    smartSuggestBtn: 'Suggestion intelligente du véhicule',
    searchBtn: 'Trouver des transporteurs',
    callBtn: 'Appeler',
    waitingDriverConfirm: 'En attente de confirmation du transporteur...',
    waitingClientCall: 'En attente d\'appel du client...',
    driverAccepted: 'Demande acceptée ! Numéro du transporteur :',
    acceptBtn: 'Accepter',
    rejectBtn: 'Refuser',
    fixedCommissionNote: 'Commission forfaitaire fixe par type de véhicule, payée par le chauffeur après accord',
    restModeTitle: 'Vous êtes en période de repos méritée ☕',
    restModeDesc: 'Mission achevée. Votre profil est masqué jusqu\'à la fin de votre temps de repos pour votre sécurité.',
    delayReasonLabel: 'Un retard sur la route ? Indiquez la raison',
    delayAutoUpdateNote: 'L\'heure estimée d\'arrivée (ETA) s\'actualise automatiquement',
    alongRouteOption: 'Prendre du fret tout le long de mon itinéraire',
    candidateListTitle: 'Transporteurs de retour éligibles (rayon 30 km ou sur le trajet)',
    noCandidates: 'Aucun transporteur disponible sur ce trajet. Élargissez votre recherche.',
    navHome: 'Accueil',
    navMap: 'Sur ma route',
    navMyTrips: 'Mes Trajets',
    navProfile: 'Profil & Sécurité',
    cockpitViewToggle: 'Vue Habitacle Cockpit',
    fullscreenToggle: 'Vue Plein Écran'
  }
};
