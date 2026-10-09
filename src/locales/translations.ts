import { WilayaData, VehicleCategory } from '../types';

export const WILAYAS: WilayaData[] = [
  { code: '16', nameFr: 'Alger', nameAr: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588 },
  { code: '31', nameFr: 'Oran', nameAr: 'وهران', lat: 35.6987, lng: -0.6349 },
  { code: '25', nameFr: 'Constantine', nameAr: 'قسنطينة', lat: 36.3650, lng: 6.6147 },
  { code: '19', nameFr: 'Sétif', nameAr: 'سطيف', lat: 36.1900, lng: 5.4100 },
  { code: '09', nameFr: 'Blida', nameAr: 'البليدة', lat: 36.4700, lng: 2.8300 },
  { code: '23', nameFr: 'Annaba', nameAr: 'عنابة', lat: 36.9000, lng: 7.7600 },
  { code: '05', nameFr: 'Batna', nameAr: 'باتنة', lat: 35.5600, lng: 6.1700 },
  { code: '13', nameFr: 'Tlemcen', nameAr: 'تلمسان', lat: 34.8800, lng: -1.3200 },
  { code: '06', nameFr: 'Béjaïa', nameAr: 'بجاية', lat: 36.7500, lng: 5.0600 },
  { code: '15', nameFr: 'Tizi Ouzou', nameAr: 'تيزي وزو', lat: 36.7100, lng: 4.0500 },
  { code: '35', nameFr: 'Boumerdès', nameAr: 'بومرداس', lat: 36.7600, lng: 3.4700 },
  { code: '10', nameFr: 'Bouira', nameAr: 'البويرة', lat: 36.3800, lng: 3.9000 },
  { code: '27', nameFr: 'Mostaganem', nameAr: 'مستغانم', lat: 35.9300, lng: 0.0900 },
  { code: '22', nameFr: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', lat: 35.1900, lng: -0.6300 },
  { code: '14', nameFr: 'Tiaret', nameAr: 'تيارت', lat: 35.3700, lng: 1.3200 },
  { code: '17', nameFr: 'Djelfa', nameAr: 'الجلفة', lat: 34.6700, lng: 3.2500 },
  { code: '28', nameFr: 'M\'Sila', nameAr: 'المسيلة', lat: 35.7000, lng: 4.5400 },
  { code: '30', nameFr: 'Ouargla', nameAr: 'ورقلة / حاسي مسعود', lat: 31.9500, lng: 5.3300 },
  { code: '47', nameFr: 'Ghardaïa', nameAr: 'غرداية', lat: 32.4900, lng: 3.6700 },
  { code: '39', nameFr: 'El Oued', nameAr: 'الوادي', lat: 33.3700, lng: 6.8600 },
  { code: '07', nameFr: 'Biskra', nameAr: 'بسكرة', lat: 34.8500, lng: 5.7300 },
  { code: '08', nameFr: 'Béchar', nameAr: 'بشار', lat: 31.6200, lng: -2.2200 },
  { code: '11', nameFr: 'Tébessa', nameAr: 'تبسة', lat: 35.4000, lng: 8.1200 },
  { code: '18', nameFr: 'Jijel', nameAr: 'جيجل', lat: 36.8200, lng: 5.7700 },
  { code: '21', nameFr: 'Skikda', nameAr: 'سكيكدة', lat: 36.8800, lng: 6.9100 },
  { code: '29', nameFr: 'Mascara', nameAr: 'معسكر', lat: 35.4000, lng: 0.1400 },
  { code: '42', nameFr: 'Tipaza', nameAr: 'تيبازة', lat: 36.5900, lng: 2.4400 },
  { code: '44', nameFr: 'Aïn Defla', nameAr: 'عين الدفلى', lat: 36.2600, lng: 1.9700 },
  { code: '48', nameFr: 'Relizane', nameAr: 'غليزان', lat: 35.7400, lng: 0.5500 },
  { code: '01', nameFr: 'Adrar', nameAr: 'أدرار', lat: 27.8700, lng: -0.2900 },
  { code: '12', nameFr: 'Tébessa', nameAr: 'تبسة', lat: 35.4100, lng: 8.1200 }
];

export const ALGERIAN_HIGHWAYS = [
  'الطريق السيار شرق-غرب (A1 Autoroute Est-Ouest)',
  'الطريق الوطني رقم 1 (RN1 العابر للصحراء Trans-Saharienne)',
  'الطريق الوطني رقم 5 (RN5 الجزائر - قسنطينة)',
  'الطريق الوطني رقم 4 (RN4 الجزائر - وهران)',
  'الطريق السيار للهضاب العليا (Autoroute des Hauts Plateaux)',
  'الطريق الوطني رقم 3 (RN3 قسنطينة - ورقلة)',
  'الطريق الوطني الساحلي رقم 11 (RN11)',
  'الطريق الوطني رقم 9 (RN9 سطيف - بجاية)'
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
