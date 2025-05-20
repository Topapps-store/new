/**
 * Diccionario de traducciones para términos comunes
 * Esto proporciona traducciones rápidas sin necesidad de llamar a la API
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja';

type TranslationDictionary = {
  [key in SupportedLanguage]: {
    [key: string]: string;
  };
};

export const translations: TranslationDictionary = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.apps': 'Apps',
    'nav.games': 'Games',
    'nav.addApp': 'Add App',
    'nav.categories': 'Categories',
    'nav.search': 'Search',
    'nav.back': 'Back',
    
    // Search
    'search.placeholder': 'Search apps...',
    'search.noResults': 'No results found',
    
    // Home
    'home.topApps': 'Top Apps',
    'home.popularApps': 'Popular Apps',
    'home.recentApps': 'Recent Apps',
    'home.justInTime': 'Just In Time',
    'home.top10AppsLastMonth': 'Top 10 Apps Last Month',
    'home.top10JustInTimeApps': 'Top Must-Have Apps',
    'home.viewAll': 'View All',
    
    // App details
    'appDetail.description': 'Description',
    'appDetail.screenshots': 'Screenshots',
    'appDetail.information': 'Information',
    'appDetail.downloads': 'Downloads',
    'appDetail.developer': 'Developer',
    'appDetail.version': 'Version',
    'appDetail.updated': 'Updated',
    'appDetail.downloadAPK': 'Download',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Alternative Downloads',
    'appDetail.relatedApps': 'Related Apps',
    
    // Other
    'sponsored.sponsored': 'Sponsored',
    'category.allApps': 'All Apps',
    'error.generic': 'An error occurred. Please try again later.',
    'loading': 'Loading...',
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.disclaimer': 'Disclaimer',
    
    // Common app descriptions
    'app.findChargingStations': 'Find charging stations for your electric vehicle',
    'app.navigate': 'Navigate and find your way',
    'app.socialNetwork': 'Connect with friends and family',
    'app.games': 'Play exciting games',
    'app.productivity': 'Boost your productivity',
    'app.shopping': 'Shop online',
    'app.travel': 'Plan your travels',
    'app.health': 'Monitor your health',
    'app.finance': 'Manage your finances',
    'app.music': 'Listen to music',
    'app.video': 'Watch videos',
    'app.photos': 'Edit and share photos',
    'app.communication': 'Communicate with others',
    'app.education': 'Learn new skills',
    'app.weather': 'Check the weather',
    'app.news': 'Stay updated with news',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.apps': 'Aplicaciones',
    'nav.games': 'Juegos',
    'nav.addApp': 'Añadir App',
    'nav.categories': 'Categorías',
    'nav.search': 'Buscar',
    'nav.back': 'Volver',
    
    // Search
    'search.placeholder': 'Buscar apps...',
    'search.noResults': 'No se encontraron resultados',
    
    // Home
    'home.topApps': 'Apps Principales',
    'home.popularApps': 'Apps Populares',
    'home.recentApps': 'Apps Recientes',
    'home.justInTime': 'Recién Llegadas',
    'home.top10AppsLastMonth': 'Top 10 Apps del Mes',
    'home.top10JustInTimeApps': 'Apps Imprescindibles',
    'home.viewAll': 'Ver Todo',
    
    // App details
    'appDetail.description': 'Descripción',
    'appDetail.screenshots': 'Capturas',
    'appDetail.information': 'Información',
    'appDetail.downloads': 'Descargas',
    'appDetail.developer': 'Desarrollador',
    'appDetail.version': 'Versión',
    'appDetail.updated': 'Actualizado',
    'appDetail.downloadAPK': 'Descargar',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Descargas Alternativas',
    'appDetail.relatedApps': 'Apps Relacionadas',
    
    // Other
    'sponsored.sponsored': 'Patrocinado',
    'category.allApps': 'Todas las Apps',
    'error.generic': 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
    'loading': 'Cargando...',
    'footer.termsOfService': 'Términos de Servicio',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.contact': 'Contáctanos',
    'footer.disclaimer': 'Aviso Legal',
    
    // Common app descriptions
    'app.findChargingStations': 'Encuentra estaciones de carga para tu vehículo eléctrico',
    'app.navigate': 'Navega y encuentra tu camino',
    'app.socialNetwork': 'Conéctate con amigos y familiares',
    'app.games': 'Juega a juegos emocionantes',
    'app.productivity': 'Aumenta tu productividad',
    'app.shopping': 'Compra en línea',
    'app.travel': 'Planifica tus viajes',
    'app.health': 'Controla tu salud',
    'app.finance': 'Gestiona tus finanzas',
    'app.music': 'Escucha música',
    'app.video': 'Mira videos',
    'app.photos': 'Edita y comparte fotos',
    'app.communication': 'Comunícate con otros',
    'app.education': 'Aprende nuevas habilidades',
    'app.weather': 'Consulta el clima',
    'app.news': 'Mantente actualizado con las noticias',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.apps': 'Applications',
    'nav.games': 'Jeux',
    'nav.addApp': 'Ajouter',
    'nav.categories': 'Catégories',
    'nav.search': 'Rechercher',
    'nav.back': 'Retour',
    
    // Search
    'search.placeholder': 'Rechercher des apps...',
    'search.noResults': 'Aucun résultat trouvé',
    
    // Home
    'home.topApps': 'Meilleures Apps',
    'home.popularApps': 'Apps Populaires',
    'home.recentApps': 'Apps Récentes',
    'home.justInTime': 'Nouveautés',
    'home.top10AppsLastMonth': 'Top 10 Apps du Mois',
    'home.top10JustInTimeApps': 'Apps Essentielles',
    'home.viewAll': 'Voir Tout',
    
    // App details
    'appDetail.description': 'Description',
    'appDetail.screenshots': 'Captures d\'écran',
    'appDetail.information': 'Information',
    'appDetail.downloads': 'Téléchargements',
    'appDetail.developer': 'Développeur',
    'appDetail.version': 'Version',
    'appDetail.updated': 'Mis à jour',
    'appDetail.downloadAPK': 'Télécharger',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Téléchargements Alternatifs',
    'appDetail.relatedApps': 'Apps Similaires',
    
    // Other
    'sponsored.sponsored': 'Sponsorisé',
    'category.allApps': 'Toutes les Apps',
    'error.generic': 'Une erreur est survenue. Veuillez réessayer plus tard.',
    'loading': 'Chargement...',
    'footer.termsOfService': 'Conditions d\'Utilisation',
    'footer.privacyPolicy': 'Politique de Confidentialité',
    'footer.contact': 'Contactez-nous',
    'footer.disclaimer': 'Avertissement',
    
    // Common app descriptions
    'app.findChargingStations': 'Trouvez des stations de recharge pour votre véhicule électrique',
    'app.navigate': 'Naviguez et trouvez votre chemin',
    'app.socialNetwork': 'Connectez-vous avec vos amis et votre famille',
    'app.games': 'Jouez à des jeux passionnants',
    'app.productivity': 'Augmentez votre productivité',
    'app.shopping': 'Faites des achats en ligne',
    'app.travel': 'Planifiez vos voyages',
    'app.health': 'Surveillez votre santé',
    'app.finance': 'Gérez vos finances',
    'app.music': 'Écoutez de la musique',
    'app.video': 'Regardez des vidéos',
    'app.photos': 'Éditez et partagez des photos',
    'app.communication': 'Communiquez avec les autres',
    'app.education': 'Apprenez de nouvelles compétences',
    'app.weather': 'Consultez la météo',
    'app.news': 'Restez informé avec les actualités',
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.apps': 'Apps',
    'nav.games': 'Spiele',
    'nav.addApp': 'App hinzufügen',
    'nav.categories': 'Kategorien',
    'nav.search': 'Suchen',
    'nav.back': 'Zurück',
    
    // Search
    'search.placeholder': 'Apps suchen...',
    'search.noResults': 'Keine Ergebnisse gefunden',
    
    // Home
    'home.topApps': 'Top-Apps',
    'home.popularApps': 'Beliebte Apps',
    'home.recentApps': 'Neueste Apps',
    'home.justInTime': 'Gerade rechtzeitig',
    'home.top10AppsLastMonth': 'Top 10 Apps des Monats',
    'home.top10JustInTimeApps': 'Unverzichtbare Apps',
    'home.viewAll': 'Alle anzeigen',
    
    // App details
    'appDetail.description': 'Beschreibung',
    'appDetail.screenshots': 'Screenshots',
    'appDetail.information': 'Information',
    'appDetail.downloads': 'Downloads',
    'appDetail.developer': 'Entwickler',
    'appDetail.version': 'Version',
    'appDetail.updated': 'Aktualisiert',
    'appDetail.downloadAPK': 'Herunterladen',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Alternative Downloads',
    'appDetail.relatedApps': 'Ähnliche Apps',
    
    // Other
    'sponsored.sponsored': 'Gesponsert',
    'category.allApps': 'Alle Apps',
    'error.generic': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    'loading': 'Wird geladen...',
    'footer.termsOfService': 'Nutzungsbedingungen',
    'footer.privacyPolicy': 'Datenschutzrichtlinie',
    'footer.contact': 'Kontakt',
    'footer.disclaimer': 'Haftungsausschluss',
    
    // Common app descriptions
    'app.findChargingStations': 'Finden Sie Ladestationen für Ihr Elektrofahrzeug',
    'app.navigate': 'Navigieren Sie und finden Sie Ihren Weg',
    'app.socialNetwork': 'Verbinden Sie sich mit Freunden und Familie',
    'app.games': 'Spielen Sie aufregende Spiele',
    'app.productivity': 'Steigern Sie Ihre Produktivität',
    'app.shopping': 'Online einkaufen',
    'app.travel': 'Planen Sie Ihre Reisen',
    'app.health': 'Überwachen Sie Ihre Gesundheit',
    'app.finance': 'Verwalten Sie Ihre Finanzen',
    'app.music': 'Musik hören',
    'app.video': 'Videos ansehen',
    'app.photos': 'Fotos bearbeiten und teilen',
    'app.communication': 'Mit anderen kommunizieren',
    'app.education': 'Neue Fähigkeiten erlernen',
    'app.weather': 'Wetter überprüfen',
    'app.news': 'Bleiben Sie mit Nachrichten auf dem Laufenden',
  },
  
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.apps': 'App',
    'nav.games': 'Giochi',
    'nav.addApp': 'Aggiungi App',
    'nav.categories': 'Categorie',
    'nav.search': 'Cerca',
    'nav.back': 'Indietro',
    
    // Search
    'search.placeholder': 'Cerca app...',
    'search.noResults': 'Nessun risultato trovato',
    
    // Home
    'home.topApps': 'App Migliori',
    'home.popularApps': 'App Popolari',
    'home.recentApps': 'App Recenti',
    'home.justInTime': 'Appena Arrivate',
    'home.top10AppsLastMonth': 'Top 10 App del Mese',
    'home.top10JustInTimeApps': 'App Essenziali',
    'home.viewAll': 'Vedi Tutte',
    
    // App details
    'appDetail.description': 'Descrizione',
    'appDetail.screenshots': 'Screenshot',
    'appDetail.information': 'Informazioni',
    'appDetail.downloads': 'Download',
    'appDetail.developer': 'Sviluppatore',
    'appDetail.version': 'Versione',
    'appDetail.updated': 'Aggiornato',
    'appDetail.downloadAPK': 'Scarica',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Download Alternativi',
    'appDetail.relatedApps': 'App Correlate',
    
    // Other
    'sponsored.sponsored': 'Sponsorizzato',
    'category.allApps': 'Tutte le App',
    'error.generic': 'Si è verificato un errore. Riprova più tardi.',
    'loading': 'Caricamento...',
    'footer.termsOfService': 'Termini di Servizio',
    'footer.privacyPolicy': 'Informativa sulla Privacy',
    'footer.contact': 'Contattaci',
    'footer.disclaimer': 'Disclaimer',
    
    // Common app descriptions
    'app.findChargingStations': 'Trova stazioni di ricarica per il tuo veicolo elettrico',
    'app.navigate': 'Naviga e trova la tua strada',
    'app.socialNetwork': 'Connettiti con amici e familiari',
    'app.games': 'Gioca a giochi emozionanti',
    'app.productivity': 'Aumenta la tua produttività',
    'app.shopping': 'Acquista online',
    'app.travel': 'Pianifica i tuoi viaggi',
    'app.health': 'Monitora la tua salute',
    'app.finance': 'Gestisci le tue finanze',
    'app.music': 'Ascolta musica',
    'app.video': 'Guarda video',
    'app.photos': 'Modifica e condividi foto',
    'app.communication': 'Comunica con gli altri',
    'app.education': 'Impara nuove competenze',
    'app.weather': 'Controlla il meteo',
    'app.news': 'Resta aggiornato con le notizie',
  },
  
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.apps': 'Aplicativos',
    'nav.games': 'Jogos',
    'nav.addApp': 'Adicionar',
    'nav.categories': 'Categorias',
    'nav.search': 'Pesquisar',
    'nav.back': 'Voltar',
    
    // Search
    'search.placeholder': 'Pesquisar apps...',
    'search.noResults': 'Nenhum resultado encontrado',
    
    // Home
    'home.topApps': 'Apps Principais',
    'home.popularApps': 'Apps Populares',
    'home.recentApps': 'Apps Recentes',
    'home.justInTime': 'Recém-chegados',
    'home.top10AppsLastMonth': 'Top 10 Apps do Mês',
    'home.top10JustInTimeApps': 'Apps Essenciais',
    'home.viewAll': 'Ver Todos',
    
    // App details
    'appDetail.description': 'Descrição',
    'appDetail.screenshots': 'Capturas de tela',
    'appDetail.information': 'Informação',
    'appDetail.downloads': 'Downloads',
    'appDetail.developer': 'Desenvolvedor',
    'appDetail.version': 'Versão',
    'appDetail.updated': 'Atualizado',
    'appDetail.downloadAPK': 'Baixar',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Downloads Alternativos',
    'appDetail.relatedApps': 'Apps Relacionados',
    
    // Other
    'sponsored.sponsored': 'Patrocinado',
    'category.allApps': 'Todos os Apps',
    'error.generic': 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
    'loading': 'Carregando...',
    'footer.termsOfService': 'Termos de Serviço',
    'footer.privacyPolicy': 'Política de Privacidade',
    'footer.contact': 'Contate-nos',
    'footer.disclaimer': 'Aviso Legal',
    
    // Common app descriptions
    'app.findChargingStations': 'Encontre estações de carregamento para seu veículo elétrico',
    'app.navigate': 'Navegue e encontre seu caminho',
    'app.socialNetwork': 'Conecte-se com amigos e familiares',
    'app.games': 'Jogue jogos emocionantes',
    'app.productivity': 'Aumente sua produtividade',
    'app.shopping': 'Compre online',
    'app.travel': 'Planeje suas viagens',
    'app.health': 'Monitore sua saúde',
    'app.finance': 'Gerencie suas finanças',
    'app.music': 'Ouça música',
    'app.video': 'Assista vídeos',
    'app.photos': 'Edite e compartilhe fotos',
    'app.communication': 'Comunique-se com os outros',
    'app.education': 'Aprenda novas habilidades',
    'app.weather': 'Verifique o clima',
    'app.news': 'Mantenha-se atualizado com as notícias',
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.apps': 'Приложения',
    'nav.games': 'Игры',
    'nav.addApp': 'Добавить',
    'nav.categories': 'Категории',
    'nav.search': 'Поиск',
    'nav.back': 'Назад',
    
    // Search
    'search.placeholder': 'Поиск приложений...',
    'search.noResults': 'Результаты не найдены',
    
    // Home
    'home.topApps': 'Лучшие приложения',
    'home.popularApps': 'Популярные приложения',
    'home.recentApps': 'Недавние приложения',
    'home.justInTime': 'Новые поступления',
    'home.top10AppsLastMonth': 'Топ-10 приложений месяца',
    'home.top10JustInTimeApps': 'Обязательные приложения',
    'home.viewAll': 'Посмотреть все',
    
    // App details
    'appDetail.description': 'Описание',
    'appDetail.screenshots': 'Скриншоты',
    'appDetail.information': 'Информация',
    'appDetail.downloads': 'Загрузки',
    'appDetail.developer': 'Разработчик',
    'appDetail.version': 'Версия',
    'appDetail.updated': 'Обновлено',
    'appDetail.downloadAPK': 'Скачать',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': 'Альтернативные загрузки',
    'appDetail.relatedApps': 'Похожие приложения',
    
    // Other
    'sponsored.sponsored': 'Спонсировано',
    'category.allApps': 'Все приложения',
    'error.generic': 'Произошла ошибка. Пожалуйста, повторите попытку позже.',
    'loading': 'Загрузка...',
    'footer.termsOfService': 'Условия использования',
    'footer.privacyPolicy': 'Политика конфиденциальности',
    'footer.contact': 'Связаться с нами',
    'footer.disclaimer': 'Отказ от ответственности',
    
    // Common app descriptions
    'app.findChargingStations': 'Найдите зарядные станции для вашего электромобиля',
    'app.navigate': 'Навигация и поиск пути',
    'app.socialNetwork': 'Общайтесь с друзьями и семьей',
    'app.games': 'Играйте в захватывающие игры',
    'app.productivity': 'Повысьте свою продуктивность',
    'app.shopping': 'Покупки онлайн',
    'app.travel': 'Планируйте свои путешествия',
    'app.health': 'Следите за своим здоровьем',
    'app.finance': 'Управляйте своими финансами',
    'app.music': 'Слушайте музыку',
    'app.video': 'Смотрите видео',
    'app.photos': 'Редактируйте и делитесь фотографиями',
    'app.communication': 'Общайтесь с другими',
    'app.education': 'Изучайте новые навыки',
    'app.weather': 'Проверьте погоду',
    'app.news': 'Будьте в курсе новостей',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.apps': '应用',
    'nav.games': '游戏',
    'nav.addApp': '添加',
    'nav.categories': '类别',
    'nav.search': '搜索',
    'nav.back': '返回',
    
    // Search
    'search.placeholder': '搜索应用...',
    'search.noResults': '未找到结果',
    
    // Home
    'home.topApps': '热门应用',
    'home.popularApps': '流行应用',
    'home.recentApps': '最近应用',
    'home.justInTime': '新到应用',
    'home.top10AppsLastMonth': '本月前10名应用',
    'home.top10JustInTimeApps': '必备应用',
    'home.viewAll': '查看全部',
    
    // App details
    'appDetail.description': '描述',
    'appDetail.screenshots': '截图',
    'appDetail.information': '信息',
    'appDetail.downloads': '下载',
    'appDetail.developer': '开发者',
    'appDetail.version': '版本',
    'appDetail.updated': '更新时间',
    'appDetail.downloadAPK': '下载',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': '替代下载',
    'appDetail.relatedApps': '相关应用',
    
    // Other
    'sponsored.sponsored': '赞助',
    'category.allApps': '所有应用',
    'error.generic': '发生错误。请稍后再试。',
    'loading': '加载中...',
    'footer.termsOfService': '服务条款',
    'footer.privacyPolicy': '隐私政策',
    'footer.contact': '联系我们',
    'footer.disclaimer': '免责声明',
    
    // Common app descriptions
    'app.findChargingStations': '为您的电动车寻找充电站',
    'app.navigate': '导航并找到您的方向',
    'app.socialNetwork': '与朋友和家人联系',
    'app.games': '玩刺激的游戏',
    'app.productivity': '提高您的生产力',
    'app.shopping': '网上购物',
    'app.travel': '规划您的旅行',
    'app.health': '监控您的健康',
    'app.finance': '管理您的财务',
    'app.music': '听音乐',
    'app.video': '观看视频',
    'app.photos': '编辑和分享照片',
    'app.communication': '与他人交流',
    'app.education': '学习新技能',
    'app.weather': '查看天气',
    'app.news': '了解最新新闻',
  },
  
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.apps': 'アプリ',
    'nav.games': 'ゲーム',
    'nav.addApp': '追加',
    'nav.categories': 'カテゴリ',
    'nav.search': '検索',
    'nav.back': '戻る',
    
    // Search
    'search.placeholder': 'アプリを検索...',
    'search.noResults': '結果が見つかりません',
    
    // Home
    'home.topApps': 'トップアプリ',
    'home.popularApps': '人気アプリ',
    'home.recentApps': '最近のアプリ',
    'home.justInTime': '新着アプリ',
    'home.top10AppsLastMonth': '先月のトップ10アプリ',
    'home.top10JustInTimeApps': '必須アプリ',
    'home.viewAll': 'すべて表示',
    
    // App details
    'appDetail.description': '説明',
    'appDetail.screenshots': 'スクリーンショット',
    'appDetail.information': '情報',
    'appDetail.downloads': 'ダウンロード',
    'appDetail.developer': '開発者',
    'appDetail.version': 'バージョン',
    'appDetail.updated': '更新日',
    'appDetail.downloadAPK': 'ダウンロード',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.alternativeDownloads': '代替ダウンロード',
    'appDetail.relatedApps': '関連アプリ',
    
    // Other
    'sponsored.sponsored': 'スポンサー',
    'category.allApps': 'すべてのアプリ',
    'error.generic': 'エラーが発生しました。後でもう一度お試しください。',
    'loading': '読み込み中...',
    'footer.termsOfService': '利用規約',
    'footer.privacyPolicy': 'プライバシーポリシー',
    'footer.contact': 'お問い合わせ',
    'footer.disclaimer': '免責事項',
    
    // Common app descriptions
    'app.findChargingStations': '電気自動車の充電ステーションを探す',
    'app.navigate': 'ナビゲーションと道案内',
    'app.socialNetwork': '友達や家族とつながる',
    'app.games': '刺激的なゲームをプレイ',
    'app.productivity': '生産性を向上させる',
    'app.shopping': 'オンラインショッピング',
    'app.travel': '旅行を計画する',
    'app.health': '健康を監視する',
    'app.finance': '財務を管理する',
    'app.music': '音楽を聴く',
    'app.video': '動画を見る',
    'app.photos': '写真を編集して共有する',
    'app.communication': '他の人とコミュニケーションを取る',
    'app.education': '新しいスキルを学ぶ',
    'app.weather': '天気をチェックする',
    'app.news': 'ニュースを最新に保つ',
  }
};

/**
 * Obtiene una traducción del diccionario local
 * @param key Clave a traducir
 * @param language Idioma objetivo
 * @returns Texto traducido o la clave original si no se encuentra
 */
export function getTranslation(key: string, language: SupportedLanguage): string {
  // Si el idioma no está soportado, usar inglés
  const lang = Object.keys(translations).includes(language) ? language : 'en';
  
  // Buscar en el diccionario local
  if (translations[lang][key]) {
    return translations[lang][key];
  }
  
  // Si no se encuentra, devolver la traducción en inglés o la clave original
  return translations.en[key] || key;
}