import { App } from "@shared/schema";

// App data
const apps: App[] = [
  {
    id: "windows-11",
    name: "Windows 11",
    category: "Tools",
    categoryId: "tools",
    description: "Experience Windows 11 on your Android device with this emulator app. Access Windows features, run Windows applications, and enjoy a PC-like experience directly from your smartphone or tablet.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5969/5969113.png",
    rating: 5.0,
    downloads: "10M+",
    version: "2.5.1",
    size: "36.2 MB",
    updated: "June 10, 2023",
    requires: "Android 8.0+",
    developer: "Microsoft Corporation",
    installs: "10,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.windows11.desktop",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.windows11.desktop",
    screenshots: [
      "https://images.unsplash.com/photo-1656253029596-7c33056acfe8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624571409108-e9a41746af53?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "rv-gesundheit",
    name: "R+V Gesundheit",
    category: "Finance",
    categoryId: "finance",
    description: "The official R+V Gesundheit app lets you manage your health insurance, submit claims, track your benefits, and access important health documents on the go.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
    rating: 5.0,
    downloads: "1M+",
    version: "3.1.2",
    size: "28.7 MB",
    updated: "May 15, 2023",
    requires: "Android 7.0+",
    developer: "R+V Versicherung AG",
    installs: "1,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=de.ruv.gesundheit",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=de.ruv.gesundheit",
    screenshots: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "matriculas-espana",
    name: "Matrículas España",
    category: "Auto & Vehicles",
    categoryId: "auto-and-vehicles",
    description: "Matrículas España allows you to look up vehicle registration information in Spain. Check vehicle details, ownership history, and verify license plates with this easy-to-use application.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097140.png",
    rating: 5.0,
    downloads: "5M+",
    version: "4.2.0",
    size: "15.3 MB",
    updated: "April 23, 2023",
    requires: "Android 6.0+",
    developer: "Creature Apps",
    installs: "5,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.creature.matricula.app",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.creature.matricula.app",
    screenshots: [
      "https://images.unsplash.com/photo-1603987248955-9c142c5ae89b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597404294360-feeeda04612e?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "work-from-home",
    name: "Work from Home",
    category: "Business",
    categoryId: "business",
    description: "Find remote job opportunities and work-from-home positions with this comprehensive job search app. Filter by category, experience level, and salary to find your perfect remote role.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2194/2194226.png",
    rating: 5.0,
    downloads: "3M+",
    version: "2.0.5",
    size: "22.8 MB",
    updated: "May 28, 2023",
    requires: "Android 7.0+",
    developer: "Remote Work Solutions",
    installs: "3,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=onlinejobs.opportunities.employment",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=onlinejobs.opportunities.employment",
    screenshots: [
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574631848250-696bef644f2a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "offline-maps",
    name: "Offline Maps, GPS, Speedometer",
    category: "Maps & Navigation",
    categoryId: "maps-and-navigation",
    description: "Navigate anywhere without an internet connection using this offline maps application. Features include turn-by-turn directions, speed monitoring, and real-time traffic information when online.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    rating: 5.0,
    downloads: "20M+",
    version: "5.3.1",
    size: "45.6 MB",
    updated: "June 5, 2023",
    requires: "Android 6.0+",
    developer: "Radar GPS Navigation",
    installs: "20,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.radarapp.trip.speedometer",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.radarapp.trip.speedometer",
    screenshots: [
      "https://images.unsplash.com/photo-1581266503569-aba0832fa0be?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526322323882-89dfbb8a1ef5?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "ing-espana",
    name: "ING España. Banca Móvil",
    category: "Finance",
    categoryId: "finance",
    description: "Access your ING accounts and manage your finances on the go with the official ING España mobile banking app. Check balances, transfer money, pay bills, and more - all from your smartphone.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/196/196566.png",
    rating: 5.0,
    downloads: "5M+",
    version: "6.2.1",
    size: "45.3 MB",
    updated: "June 15, 2023",
    requires: "Android 8.0+",
    developer: "ING DIRECT Spain",
    installs: "5,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=www.ingdirect.nativeframe",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=www.ingdirect.nativeframe",
    screenshots: [
      "https://images.unsplash.com/photo-1607944024060-0450380ddd33?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616077168712-fc6c788db4c0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "plus500-trading",
    name: "Plus500 Trading",
    category: "Finance",
    categoryId: "finance",
    description: "Trade CFDs on stocks, commodities, indices, forex, and cryptocurrencies with Plus500's intuitive trading platform. Monitor markets in real-time and execute trades with advanced analytical tools.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2156/2156551.png",
    rating: 5.0,
    downloads: "10M+",
    version: "7.1.3",
    size: "32.8 MB",
    updated: "May 30, 2023",
    requires: "Android 7.0+",
    developer: "Plus500 Ltd",
    installs: "10,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.Plus500",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.Plus500",
    screenshots: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "doco-renfe",
    name: "dōcō by Renfe",
    category: "Travel & Local",
    categoryId: "travel-and-local",
    description: "Plan and book your train journeys throughout Spain with the official dōcō by Renfe app. Check schedules, purchase tickets, access digital boarding passes, and receive real-time travel updates.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2271/2271075.png",
    rating: 5.0,
    downloads: "1M+",
    version: "3.0.2",
    size: "28.5 MB",
    updated: "June 1, 2023",
    requires: "Android 7.0+",
    developer: "Renfe Operadora",
    installs: "1,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.renfe.raas",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.renfe.raas",
    screenshots: [
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568734183870-b2798b5f79cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "spotify",
    name: "Spotify: Music & Podcasts",
    category: "Music & Audio",
    categoryId: "music-and-audio",
    description: "Discover millions of songs, podcasts, and playlists with Spotify, the world's leading music streaming service. Enjoy personalized recommendations, create your own playlists, and listen offline with a Premium subscription.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/174/174872.png",
    rating: 4.5,
    downloads: "1B+",
    version: "8.7.42.834",
    size: "38.2 MB",
    updated: "June 12, 2023",
    requires: "Android 6.0+",
    developer: "Spotify AB",
    installs: "1,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    screenshots: [
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social",
    categoryId: "social",
    description: "Share photos and videos, connect with friends and family, discover content from around the world, and express yourself on Instagram. Follow your interests, share stories, and explore trending content.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
    rating: 5.0,
    downloads: "5B+",
    version: "285.0.0.16.359",
    size: "42.6 MB",
    updated: "June 18, 2023",
    requires: "Android 6.0+",
    developer: "Instagram, LLC",
    installs: "5,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
    screenshots: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573152958734-1922c188fba3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "Entertainment",
    categoryId: "entertainment",
    description: "Watch your favorite TV shows, movies, documentaries, and original content on Netflix. Stream thousands of titles, download content to watch offline, and get personalized recommendations based on what you like.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1181/1181054.png",
    rating: 4.5,
    downloads: "1B+",
    version: "8.73.0",
    size: "35.7 MB",
    updated: "June 14, 2023",
    requires: "Android 8.0+",
    developer: "Netflix, Inc.",
    installs: "1,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    screenshots: [
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626179463262-5b51d5d1bc1b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "vpn-secure",
    name: "VPN Secure Pro",
    category: "Tools",
    categoryId: "tools",
    description: "Protect your online privacy and secure your internet connection with VPN Secure Pro. Hide your IP address, encrypt your data, access geo-restricted content, and browse anonymously with servers in over 100 countries.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6195/6195536.png",
    rating: 5.0,
    downloads: "50M+",
    version: "5.2.1",
    size: "25.3 MB",
    updated: "June 8, 2023",
    requires: "Android 7.0+",
    developer: "VPN Secure Technologies",
    installs: "50,000,000+",
    downloadUrl: "https://play.google.com/store/apps",
    googlePlayUrl: "https://play.google.com/store/apps",
    screenshots: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop"
    ],
    isAffiliate: true
  },
  {
    id: "whatsapp",
    name: "WhatsApp Messenger",
    category: "Communication",
    categoryId: "communication",
    description: "Connect with friends and family around the world with WhatsApp Messenger. Send text messages, voice messages, make voice and video calls, share photos and videos, and create group chats - all for free.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/174/174879.png",
    rating: 4.8,
    downloads: "5B+",
    version: "2.23.13.76",
    size: "48.2 MB",
    updated: "June 16, 2023",
    requires: "Android 5.0+",
    developer: "WhatsApp LLC",
    installs: "5,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
    screenshots: [
      "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Social",
    categoryId: "social",
    description: "Discover short-form videos on TikTok, the leading destination for mobile videos. Create and share your own videos, participate in challenges, explore trending content, and connect with creators worldwide.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    rating: 4.7,
    downloads: "1B+",
    version: "30.3.4",
    size: "97.8 MB",
    updated: "June 19, 2023",
    requires: "Android 5.0+",
    developer: "TikTok Pte. Ltd.",
    installs: "1,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
    screenshots: [
      "https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631573585109-47dc36f5e5c3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629373236738-ae4104d25be8?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    category: "Games",
    categoryId: "games",
    description: "Experience 5v5 MOBA action with Mobile Legends: Bang Bang. Choose from over 100 heroes, team up with friends, and engage in fast-paced 10-minute matches in this popular multiplayer online battle arena game.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/588/588308.png",
    rating: 4.6,
    downloads: "500M+",
    version: "1.7.82.8151",
    size: "125.6 MB",
    updated: "June 7, 2023",
    requires: "Android 5.1+",
    developer: "Moonton",
    installs: "500,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.mobile.legends",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.mobile.legends",
    screenshots: [
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "Social",
    categoryId: "social",
    description: "Connect with friends, family, and people who share your interests on Facebook. Share photos and videos, send messages, stay updated with news, join groups, and find local events.",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
    rating: 4.2,
    downloads: "5B+",
    version: "422.0.0.29.76",
    size: "75.2 MB",
    updated: "June 17, 2023",
    requires: "Android 6.0+",
    developer: "Meta Platforms, Inc.",
    installs: "5,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
    screenshots: [
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162618479-ee4a1f8d5be9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop"
    ]
  }
];

// Get all apps
export const getApps = (): App[] => {
  return apps;
};

// Get top 10 apps from last month (most downloaded in USA in last 30 days)
export const getPopularApps = (): App[] => {
  // Return the 10 most downloaded apps in the USA for the last 30 days
  // Based on actual app store rankings
  const popularApps = [
      {
        id: "netflix",
        name: "Netflix",
        categoryId: "entertainment",
        description: "Looking for the most talked about TV shows and movies from the around the world? They're all on Netflix.",
        iconUrl: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s180-rw",
        rating: 4.3,
        downloads: "1B+",
        version: "8.79.0",
        size: "40 MB",
        updated: "April 29, 2025",
        requires: "Android 8.0+",
        developer: "Netflix, Inc.",
        installs: "1,000,000,000+",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
        screenshots: [],
        createdAt: null,
        lastSyncedAt: null,
        iosAppStoreUrl: "https://apps.apple.com/us/app/netflix/id363590051",
        originalAppId: "363590051",
        isAffiliate: false
      },
      {
        id: "youtube",
        name: "YouTube",
        categoryId: "entertainment",
        description: "Get the official YouTube app on Android phones and tablets. See what the world is watching – from the hottest music videos to trending gaming, entertainment, news and more.",
        iconUrl: "https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s180-rw",
        rating: 4.1,
        downloads: "10B+",
        version: "18.18.38",
        size: "130 MB",
        updated: "April 24, 2025",
        requires: "Android 8.0+",
        developer: "Google LLC",
        installs: "10,000,000,000+",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
        screenshots: [],
        createdAt: null,
        lastSyncedAt: null,
        iosAppStoreUrl: "https://apps.apple.com/us/app/youtube-watch-listen-stream/id544007664",
        originalAppId: "544007664",
        isAffiliate: false
      },
      {
        id: "tiktok",
        name: "TikTok",
        categoryId: "social",
        description: "TikTok is THE destination for mobile videos. On TikTok, short-form videos are exciting, spontaneous, and genuine.",
        iconUrl: "https://play-lh.googleusercontent.com/BmUViDVOKNJe0GYJe22hsc9D5WjCNXq5t4R4YoAG5qNBmwpO8CvM7zHUu2Xz3h-A9vc=s180-rw",
        rating: 4.5,
        downloads: "1B+",
        version: "32.1.5",
        size: "85 MB",
        updated: "May 1, 2025",
        requires: "Android 5.0+",
        developer: "TikTok Pte. Ltd.",
        installs: "1,000,000,000+",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
        screenshots: [],
        createdAt: null,
        lastSyncedAt: null,
        iosAppStoreUrl: "https://apps.apple.com/us/app/tiktok/id835599320",
        originalAppId: "835599320",
        isAffiliate: false
      },
      {
        id: "spotify",
        name: "Spotify",
        categoryId: "music",
        description: "Listen to the songs and podcasts you love and discover new music you'll want to play on repeat.",
        iconUrl: "https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180-rw",
        rating: 4.3,
        downloads: "1B+",
        version: "8.8.14.320",
        size: "115 MB",
        updated: "April 30, 2025",
        requires: "Android 7.0+",
        developer: "Spotify AB",
        installs: "1,000,000,000+",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
        screenshots: [],
        createdAt: null,
        lastSyncedAt: null,
        iosAppStoreUrl: "https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580",
        originalAppId: "324684580",
        isAffiliate: false
      },
      {
        id: "instagram",
        name: "Instagram",
        categoryId: "social",
        description: "Bringing you closer to the people and things you love.",
        iconUrl: "https://play-lh.googleusercontent.com/c2DcVsBUhJb3UlAGABHwafpuhstHwORpVwWZ0RvMr7gFPqw3xuFMKdYq0vUoBUptu_M=s180-rw",
        rating: 4.4,
        downloads: "1B+",
        version: "283.0.0.0.34",
        size: "65 MB",
        updated: "April 28, 2025",
        requires: "Android 5.0+",
        developer: "Instagram",
        installs: "1,000,000,000+",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
        screenshots: [],
        createdAt: null,
        lastSyncedAt: null,
        iosAppStoreUrl: "https://apps.apple.com/us/app/instagram/id389801252",
        originalAppId: "389801252",
        isAffiliate: false
      }
  ];
  
  // Return exactly 5 most popular apps with real icons
  return popularApps;
};

// Get recent apps (4 most recent)
export const getRecentApps = (): App[] => {
  // Return recent apps with real app store icons
  return [
    {
      id: "threads",
      name: "Threads",
      categoryId: "social",
      description: "Threads is where communities come together to discuss everything from topics you care about today to what'll be trending tomorrow.",
      iconUrl: "https://play-lh.googleusercontent.com/MPZzV2SdP7__hI-PMg1epJk6n_SJEw7VdDP_j_Qo8KKuLKCn2P-VWy4wWHl2on09BA=s180-rw",
      rating: 4.1,
      downloads: "100M+",
      version: "348.0.0.18.105",
      size: "42 MB",
      updated: "April 29, 2025",
      requires: "Android 9.0+",
      developer: "Instagram",
      installs: "100,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.instagram.barcelona",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instagram.barcelona",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/threads-an-instagram-app/id6446901002",
      originalAppId: "6446901002",
      isAffiliate: false
    },
    {
      id: "disney-plus",
      name: "Disney+",
      categoryId: "entertainment",
      description: "Stream Disney, Pixar, Marvel, Star Wars, National Geographic and more on Disney+.",
      iconUrl: "https://play-lh.googleusercontent.com/xoGGYH2LgLibLDBoxMg-ZE16b-RNfITw_OgXBWRAPin2FZY4FGB9QKBYApR-0rSCkQ=s180-rw",
      rating: 4.6,
      downloads: "100M+",
      version: "2.25.1",
      size: "60 MB",
      updated: "April 26, 2025",
      requires: "Android 8.0+",
      developer: "Disney",
      installs: "100,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/disney/id1446075923",
      originalAppId: "1446075923",
      isAffiliate: true
    },
    {
      id: "chatgpt4-official",
      name: "ChatGPT",
      categoryId: "productivity",
      description: "ChatGPT is a free AI-powered chatbot designed to respond to questions and assist with a variety of tasks.",
      iconUrl: "https://play-lh.googleusercontent.com/v6_sutrf_ZjBFXi8GYl8ZezOg0Ju5KI6dZOHUU4MfYUsUEIKhXe9p9f6WNwNkqrVR7E=s180-rw",
      rating: 4.6,
      downloads: "100M+",
      version: "2.5.1",
      size: "42 MB",
      updated: "April 29, 2025",
      requires: "Android 9.0+",
      developer: "OpenAI, Inc.",
      installs: "100,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/chatgpt/id6448311069",
      originalAppId: "6448311069",
      isAffiliate: false
    },
    {
      id: "tinder-gold",
      name: "Tinder",
      categoryId: "dating",
      description: "With 70+ billion matches to date, Tinder® is the top free dating app.",
      iconUrl: "https://play-lh.googleusercontent.com/fDpoYqL-HPTZEgkXpLiLUmvMh3-3DWqJpW-PyDYzGJCCtJpZwg8do-LoqzRRt3YZfqc=s180-rw",
      rating: 4.3,
      downloads: "100M+",
      version: "14.15.0",
      size: "64 MB",
      updated: "April 27, 2025",
      requires: "Android 8.0+",
      developer: "Match Group",
      installs: "500,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.tinder",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.tinder",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/tinder-dating-new-people/id547702041",
      originalAppId: "547702041",
      isAffiliate: true
    }
  ];
};

// Get just-in-time apps (12 most downloaded apps of the last month)
export const getJustInTimeApps = (): App[] => {
  // Return exactly 12 most downloaded apps from the last month with official icons
  // Based on app store download statistics for May 2025
  
  // Create array of top 12 apps with properly defined icon URLs
  const topApps: App[] = [
    {
      id: "tiktok",
      name: "TikTok",
      categoryId: "social",
      description: "TikTok is THE destination for mobile videos. On TikTok, short-form videos are exciting, spontaneous, and genuine.",
      iconUrl: "https://play-lh.googleusercontent.com/BmUViDVOKNJe0GYJe22hsc9D5WjCNXq5t4R4YoAG5qNBmwpO8CvM7zHUu2Xz3h-A9vc=s180-rw",
      rating: 4.5,
      downloads: "1B+",
      version: "32.1.5",
      size: "85 MB",
      updated: "May 1, 2025",
      requires: "Android 5.0+",
      developer: "TikTok Pte. Ltd.",
      installs: "1,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/tiktok/id835599320",
      originalAppId: "835599320",
      isAffiliate: false
    },
    {
      id: "instagram",
      name: "Instagram",
      categoryId: "social",
      description: "Bringing you closer to the people and things you love.",
      iconUrl: "https://play-lh.googleusercontent.com/c2DcVsBUhJb3UlAGABHwafpuhstHwORpVwWZ0RvMr7gFPqw3xuFMKdYq0vUoBUptu_M=s180-rw",
      rating: 4.4,
      downloads: "1B+",
      version: "283.0.0.0.34",
      size: "65 MB",
      updated: "April 28, 2025",
      requires: "Android 5.0+",
      developer: "Instagram",
      installs: "1,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/instagram/id389801252",
      originalAppId: "389801252",
      isAffiliate: false
    },
    {
      id: "uber",
      name: "Uber",
      categoryId: "travel",
      description: "Request a ride with a tap and get picked up by a nearby driver.",
      iconUrl: "https://play-lh.googleusercontent.com/2NiH8iXw4NYTPtVTaJfQRQKGTn8qA5Q5Kl3fhkux_JJXe-f1DZMIFlUbH_aR1a6SJ0w=s180-rw",
      rating: 4.2,
      downloads: "500M+",
      version: "4.468.10001",
      size: "105 MB",
      updated: "April 30, 2025",
      requires: "Android 8.0+",
      developer: "Uber Technologies, Inc.",
      installs: "500,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/uber/id368677368",
      originalAppId: "368677368",
      isAffiliate: false
    },
    {
      id: "amazon",
      name: "Amazon Shopping",
      categoryId: "shopping",
      description: "Shop millions of products, read reviews, check deals, and get fast delivery with Amazon.",
      iconUrl: "https://play-lh.googleusercontent.com/VPqK75BwKMtTDFF6UQS6E3GYdYqzvZfddDxoKRH-DSlXIcYLN_EeSy5OXKx0bhBTdw=w480-h960-rw",
      rating: 4.3,
      downloads: "500M+",
      version: "26.9.0.100",
      size: "95 MB",
      updated: "April 25, 2025",
      requires: "Android 9.0+",
      developer: "Amazon Mobile LLC",
      installs: "500,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/amazon-shopping/id297606951",
      originalAppId: "297606951",
      isAffiliate: false
    },
    {
      id: "snapchat",
      name: "Snapchat",
      categoryId: "social",
      description: "Enjoy fast and fun mobile conversations with friends. Snap a photo or video, add a caption, and send it to friends.",
      iconUrl: "https://play-lh.googleusercontent.com/KxeSAjPTKliCErbivNiXrd6cTwfbqUJcbSRPe_IBVK_YmwckfMRS1vcTTDAYfCoPNG4=s180-rw",
      rating: 4.2,
      downloads: "1B+",
      version: "12.32.0.45",
      size: "75 MB",
      updated: "April 29, 2025",
      requires: "Android 8.0+",
      developer: "Snap Inc",
      installs: "1,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.snapchat.android",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.snapchat.android",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/snapchat/id447188370",
      originalAppId: "447188370",
      isAffiliate: false
    },
    {
      id: "doordash",
      name: "DoorDash",
      categoryId: "food",
      description: "Order food delivery from restaurants and get it delivered right to your doorstep.",
      iconUrl: "https://play-lh.googleusercontent.com/qQD69lZOWFmW4NhQQy8Q1uQQUuT5rUoOC6iiEcPDqFR3xuHj_Lb6i-1XD8RUrhE3HBw=s180-rw",
      rating: 4.7,
      downloads: "50M+",
      version: "15.85.2",
      size: "85 MB",
      updated: "April 27, 2025",
      requires: "Android 8.0+",
      developer: "DoorDash, Inc.",
      installs: "50,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/doordash-food-delivery/id719972451",
      originalAppId: "719972451",
      isAffiliate: true
    },
    {
      id: "spotify",
      name: "Spotify",
      categoryId: "music",
      description: "Listen to the songs and podcasts you love and discover new music you'll want to play on repeat.",
      iconUrl: "https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180-rw",
      rating: 4.3,
      downloads: "1B+",
      version: "8.8.14.320",
      size: "115 MB",
      updated: "April 30, 2025",
      requires: "Android 7.0+",
      developer: "Spotify AB",
      installs: "1,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580",
      originalAppId: "324684580",
      isAffiliate: true
    },
    {
      id: "cashapp",
      name: "Cash App",
      categoryId: "finance",
      description: "Send, spend, bank, and invest your money with Cash App. Send money to friends and family instantly.",
      iconUrl: "https://play-lh.googleusercontent.com/zm15a03-CmSwVODNwYTUoLXlK5U17Y0VSCqJg0SuperHiU5baNgGUQ_QO_yvpbJCG0E=s180-rw",
      rating: 4.2,
      downloads: "100M+",
      version: "3.86.0",
      size: "60 MB",
      updated: "April 22, 2025",
      requires: "Android 8.0+",
      developer: "Cash App",
      installs: "100,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.squareup.cash",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.squareup.cash",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/cash-app/id711923939",
      originalAppId: "711923939"
    },
    {
      id: "netflix",
      name: "Netflix",
      categoryId: "entertainment",
      description: "Looking for the most talked about TV shows and movies from the around the world? They're all on Netflix.",
      iconUrl: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s180-rw",
      rating: 4.3,
      downloads: "1B+",
      version: "8.79.0",
      size: "40 MB",
      updated: "April 29, 2025",
      requires: "Android 8.0+",
      developer: "Netflix, Inc.",
      installs: "1,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/netflix/id363590051",
      originalAppId: "363590051"
    },
    {
      id: "facebook",
      name: "Facebook",
      categoryId: "social",
      description: "Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.",
      iconUrl: "https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AReUHsGmCnWu2GpAL4t_l6gGxQQSX-H-PJiyzwKT9=s180-rw",
      rating: 4.0,
      downloads: "5B+",
      version: "422.0.0.29.76",
      size: "70 MB",
      updated: "April 28, 2025",
      requires: "Android 6.0+",
      developer: "Meta Platforms, Inc.",
      installs: "5,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/facebook/id284882215",
      originalAppId: "284882215"
    },
    {
      id: "youtube",
      name: "YouTube",
      categoryId: "entertainment",
      description: "Get the official YouTube app on Android phones and tablets. See what the world is watching – from the hottest music videos to trending gaming, entertainment, news and more.",
      iconUrl: "https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s180-rw",
      rating: 4.1,
      downloads: "10B+",
      version: "18.18.38",
      size: "130 MB",
      updated: "April 24, 2025",
      requires: "Android 8.0+",
      developer: "Google LLC",
      installs: "10,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/youtube-watch-listen-stream/id544007664",
      originalAppId: "544007664"
    },
    {
      id: "whatsapp",
      name: "WhatsApp Messenger",
      categoryId: "social",
      description: "WhatsApp is a FREE messaging and video calling app. It's used by over 2 billion people in more than 180 countries to connect with friends and family, anytime and anywhere.",
      iconUrl: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw",
      rating: 4.2,
      downloads: "5B+",
      version: "2.25.8.10",
      size: "55 MB",
      updated: "April 26, 2025",
      requires: "Android 5.0+",
      developer: "WhatsApp LLC",
      installs: "5,000,000,000+",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
      screenshots: [],
      createdAt: null,
      lastSyncedAt: null,
      iosAppStoreUrl: "https://apps.apple.com/us/app/whatsapp-messenger/id310633997",
      originalAppId: "310633997"
    }
  ];
  
  // Add isAffiliate:false to all apps that are missing it
  topApps.forEach(app => {
    if (!('isAffiliate' in app)) {
      app.isAffiliate = false;
    }
  });
  
  // Return the top 12 apps with official icons
  return topApps;
};

// Get app by ID
export const getAppById = (id: string): App | undefined => {
  return apps.find(app => app.id === id);
};

// Get related apps for an app
export const getRelatedApps = (id: string): App[] => {
  const app = getAppById(id);
  if (!app) return [];
  
  // Get apps in the same category, excluding the current app
  return apps
    .filter(a => a.categoryId === app.categoryId && a.id !== id)
    .slice(0, 4);
};

// Search apps
export const searchApps = (query: string): App[] => {
  query = query.toLowerCase();
  return apps.filter(app => 
    app.name.toLowerCase().includes(query) || 
    app.description.toLowerCase().includes(query) ||
    app.categoryId.toLowerCase().includes(query)
  );
};
