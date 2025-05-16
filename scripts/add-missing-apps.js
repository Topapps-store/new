// Script para añadir todas las apps que faltan para llegar a 50
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addMissingApps() {
  try {
    // Cargamos los datos de pending-apps.json para ver todas las URLs
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    // Combinamos las URLs pendientes y procesadas
    const allUrls = [...pendingAppsData.pendingUrls, ...pendingAppsData.processedUrls];
    
    // Cargamos el archivo apps.json actual
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`Actualmente hay ${appsData.apps.length} apps en el catálogo.`);
    console.log(`Tenemos ${allUrls.length} URLs de apps en total.`);

    // Datos para completar hasta 50 apps
    const missingApps = [
      {
        "id": "amazon-shopping",
        "name": "Amazon Shopping",
        "category": "Shopping",
        "categoryId": "shopping",
        "description": "The Amazon Shopping app lets you shop millions of products and manage your Amazon orders from anywhere. Browse, shop by department, compare prices, read reviews, share products with friends, and check the status of your orders.",
        "iconUrl": "https://play-lh.googleusercontent.com/lAFgx9P9v6g9CGiJ4yXEghRTGikQg88xuxOUZNVN4CPf1GbMRS6jAv7yzO0jGGwzLQ=s180-rw",
        "rating": 4.2,
        "downloads": "500M+",
        "version": "27.8.0.100",
        "updated": "May 11, 2025",
        "requires": "Android 8.0+",
        "developer": "Amazon Mobile LLC",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
        "screenshots": [
          "https://play-lh.googleusercontent.com/S3kG-aBMXRpS5V4wt7Jm3VzCPmhHr4WfKN_0AZM6ssZjGCQ0bZfYEo_4WVHZOjQEsDE=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/QR7-a9Cf6-MuSdV0-QKDZsAAhnUisxkXCZQRsQRMaQ8pRnRnQNbpskwzBwCkE9gF_b_P=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "uber",
        "name": "Uber - Request a ride",
        "category": "Maps & Navigation",
        "categoryId": "maps-navigation",
        "description": "Uber is the easiest way to get a safe, reliable ride in minutes. There's no need to park or wait for a taxi or bus. Plus, the price you see is the price you pay—no cash needed.",
        "iconUrl": "https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrWiRf8-nQ8fcJ3rXdCv_4mGYJTXB0f-AwbgTpqbrF3R4XA=s180-rw",
        "rating": 4.3,
        "downloads": "500M+",
        "version": "4.503.10001",
        "updated": "May 14, 2025",
        "requires": "Android 7.0+",
        "developer": "Uber Technologies, Inc.",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.ubercab",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.ubercab",
        "screenshots": [
          "https://play-lh.googleusercontent.com/IxK3GaLv-DCx5Z3MYwZVQ0OM3GnYmJtgPHwGJS0jw1xjcO4DpGPvWfXwYs3NTu6B_w=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/PVUu6KA3BPz1xQ5NtQ7VSd0Q7tBHVB9zVVGWBPcLMnfEOQxVQtYxW-ff8iuZ8qEqpw=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "ebay",
        "name": "eBay: Buy, sell, and save",
        "category": "Shopping",
        "categoryId": "shopping",
        "description": "Buy and sell electronics, cars, fashion apparel, collectibles, sporting goods, digital cameras, and everything else on eBay, the world's online marketplace. Sign up and begin to buy and sell - all from the eBay app.",
        "iconUrl": "https://play-lh.googleusercontent.com/41MHS5EXc4p0D2xE6klbTJ3cP3urQgqQXpcDmJlUMJ9-sQlA9_bkQnwBp1FHDQ9c8Q=s180-rw",
        "rating": 4.4,
        "downloads": "100M+",
        "version": "6.74.0.1",
        "updated": "May 15, 2025",
        "requires": "Android 7.0+",
        "developer": "eBay Mobile",
        "installs": "100,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.ebay.mobile",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.ebay.mobile",
        "screenshots": [
          "https://play-lh.googleusercontent.com/q98QdURhjZ5_AxFhXzfNNbUkDgHtLfF_30bMdjVOQRKDQGSN0K2JR1Lfx5s4Z3Ygpg=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/JTqzBVKdtLfU3QUnI9t_Y6dV7CQdUJgGGZ-CHV7b0sB0FX2Ub80V7v0sj4Gm1gLj5g=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "duolingo",
        "name": "Duolingo: Language Lessons",
        "category": "Education",
        "categoryId": "education",
        "description": "Learn a new language with the world's most-downloaded education app! Duolingo is the fun, free app for learning 40+ languages through quick, bite-sized lessons. Practice speaking, reading, listening, and writing to build your vocabulary and grammar skills.",
        "iconUrl": "https://play-lh.googleusercontent.com/hSyebBlYwtE2aMjzSIg65a-XU_-X6Qcg5_AuWOzQiCZ-8qZyQYZ-6jqXCCGjcq_rD5Hi=s180-rw",
        "rating": 4.7,
        "downloads": "500M+",
        "version": "6.7.0",
        "updated": "May 15, 2025",
        "requires": "Android 8.0+",
        "developer": "Duolingo",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.duolingo",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.duolingo",
        "screenshots": [
          "https://play-lh.googleusercontent.com/zR9Vs92JxYK8kuP7hbjLkZ-xMJJLzp7NyXQnpGYCiUUGUvgk2CK7qgq7yxwUrp-8nA=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/cL7tSxrZV_3JLgMdBZ8yCGD3hKcBmgHKPFEMxfITLwKrNZjQSJDmXxgZDY9AvKVL4Q=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "grubhub",
        "name": "Grubhub: Food Delivery",
        "category": "Food & Drink",
        "categoryId": "food-drink",
        "description": "Hungry? Get the food you want, from the restaurants you love, delivered at lightning speed. Order food delivery for breakfast, lunch, dinner or snacks from restaurants near you.",
        "iconUrl": "https://play-lh.googleusercontent.com/a-zQe0kCRDUGifXJK_0GhA8aQvNjO4GTpYW-Dwz3zrjqGCpGAYu0laJBBBYYfFLk3eo=s180-rw",
        "rating": 4.5,
        "downloads": "10M+",
        "version": "2024.09",
        "updated": "May 10, 2025",
        "requires": "Android 8.0+",
        "developer": "Grubhub, Inc.",
        "installs": "10,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.grubhub.android",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.grubhub.android",
        "screenshots": [
          "https://play-lh.googleusercontent.com/CXqFG-lT1xGnV0ACkoKCRHQUtoIYFAQFHqjLJJz6vSbpPfbDLjnJI8jcYjPb9GdNFg=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/j2e9TD3dpKzVXFYOUFRFQUJ2MPWM5vgjPTZR5xbLYumPMYUn9UTLfVHQdLvD3Vofhg=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "tiktok",
        "name": "TikTok",
        "category": "Social",
        "categoryId": "social",
        "description": "TikTok is THE destination for mobile videos. On TikTok, short-form videos are exciting, spontaneous, and genuine. Whether you're a sports fanatic, a pet enthusiast, or just looking for a laugh, there's something for everyone on TikTok.",
        "iconUrl": "https://play-lh.googleusercontent.com/iBYjvYuNq8BB7EEJHexVtTKIgllzrY9o8R6NNMnG-XW39PBxUcrKJ3yNTCYl9l6EyG8=s180-rw",
        "rating": 4.5,
        "downloads": "1B+",
        "version": "30.9.4",
        "updated": "May 14, 2025",
        "requires": "Android 7.0+",
        "developer": "TikTok Pte. Ltd.",
        "installs": "1,000,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
        "screenshots": [
          "https://play-lh.googleusercontent.com/lcV1z-HzdDzV0t5NHzaiXbG7pYKENR3RFU3K8ArUBfB9h6FsaX3m6EkmpQMMPiZOFGY=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/s0kQH9sYIBB1f3EmkgAceCw-HaFKnlVauJGGKl0KjmI84PpRQj-AHpUaODKPvM7Jdw=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "spotify",
        "name": "Spotify: Music and Podcasts",
        "category": "Music & Audio",
        "categoryId": "music-audio",
        "description": "With Spotify, you have access to a world of music and podcasts. You can listen to artists and albums, or create your own playlist of your favorite songs. Want to discover new music? Choose a ready-made playlist that suits your mood or get personalized recommendations.",
        "iconUrl": "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qRRsYUt_478yA7EtK2L9CH_1reMeVNrJxD8Pu0=s180-rw",
        "rating": 4.3,
        "downloads": "1B+",
        "version": "8.8.92.251",
        "updated": "May 14, 2025",
        "requires": "Android 7.0+",
        "developer": "Spotify AB",
        "installs": "1,000,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.spotify.music",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.spotify.music",
        "screenshots": [
          "https://play-lh.googleusercontent.com/lXA4Ovc0CHM-HnmXWZQCicn4Bf4O-MkK7SZfKwzMBB-LHvUUUVCx_WCOB2EOOojbhwQ=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/GQjFEin_ZIfZP6pdg1KBJweK-s7V-q9wt2RRO0AZ0QC_-fXOsMtKvpuC-UCiQrFP8-s=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "aliexpress",
        "name": "AliExpress - Smarter Shopping, Better Living",
        "category": "Shopping",
        "categoryId": "shopping",
        "description": "Enjoy smarter shopping on AliExpress. With affordable deals on millions of quality items from trusted international brands and sellers, this personalized shopping app is loaded with everything you need.",
        "iconUrl": "https://play-lh.googleusercontent.com/EX7I-ghESZBl5shsLK5i31NtHGzFKgCQUHHYx9C9Cf66_CxL2xYTQRLQGZkZTvJjYVk=s180-rw",
        "rating": 4.6,
        "downloads": "500M+",
        "version": "9.4.0",
        "updated": "May 15, 2025",
        "requires": "Android 6.0+",
        "developer": "Alibaba Mobile",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd",
        "screenshots": [
          "https://play-lh.googleusercontent.com/CQzCZEFuQUc6ZNKljCsf4NMg35ZDl0-qNQnrXzk-QEASOVO-Ywz2k2kaeBzQzxpb5A=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/kGTbE0mMQ9bvh24TKi1R8bnMvXZykBnDTYkWUpzWLZ6m41Nf78vO6Vw4lWI1HVNUy-E=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "reddit",
        "name": "Reddit",
        "category": "News & Magazines",
        "categoryId": "news-magazines",
        "description": "Reddit is the place where people come together to have the most authentic and interesting conversations on the internet—Where gaming communities, nostalgic internet forums, bloggers, meme-makers, and fandoms mingle alongside video streamers, support groups, news junkies, armchair experts, seasoned professionals, and artists and creators of all types.",
        "iconUrl": "https://play-lh.googleusercontent.com/nlptFyxNsb8J0g8ZLux6016kunduV5qKo5jzh4Y3wPuwCgzYkNygZJcJk-Ls0TrqJwY=s180-rw",
        "rating": 4.0,
        "downloads": "100M+",
        "version": "2025.17.0",
        "updated": "May 13, 2025",
        "requires": "Android 8.0+",
        "developer": "Reddit, Inc.",
        "installs": "100,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.reddit.frontpage",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.reddit.frontpage",
        "screenshots": [
          "https://play-lh.googleusercontent.com/vz3YiXZQ4sFQbSKtKYTCW-87hOPBK9FDl8GvGJsCy-jfM3rUSF9GqJHvyZB3CWkYoA=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/O--OHHA6NDlI-rP67-X-qlm-ZHrJLEQWK_-_itqDpS4JlX-QUlf9Ib72ZhejyAMfTWQ=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "waze",
        "name": "Waze Navigation & Live Traffic",
        "category": "Maps & Navigation",
        "categoryId": "maps-navigation",
        "description": "Waze is a GPS navigation software app owned by Google. It works on smartphones and tablet computers that have GPS support. It provides turn-by-turn navigation information and user-submitted travel times and route details, while downloading location-dependent information over a mobile telephone network.",
        "iconUrl": "https://play-lh.googleusercontent.com/muSOp7x1F5N9esmoPqHZdmgpbzj6J8xp6HQxzZYQXEgznG-pDKKT5S43vc49Z2Z6mrw=s180-rw",
        "rating": 4.3,
        "downloads": "100M+",
        "version": "4.97.0.2",
        "updated": "May 7, 2025",
        "requires": "Android 8.0+",
        "developer": "Waze",
        "installs": "100,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.waze",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.waze",
        "screenshots": [
          "https://play-lh.googleusercontent.com/cLI1YPrnF-3zyIxc8QVnIkk-wBZCYhZYeK-x_lF8ySKN4C5xgxY9JPIL_O2Imk9EjJa9=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/X84WbP5FNDgjJ2jv3rNgbzxNXiLOEXlGalE0I-P-Cfq9j0rJsT8bLzLPc-aSjc_dAQ=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "doordash",
        "name": "DoorDash - Food Delivery",
        "category": "Food & Drink",
        "categoryId": "food-drink",
        "description": "DoorDash is the fastest and easiest way to get food delivery, grocery delivery, and more on-demand. Just open the app, find what you're craving, and we'll have your food delivered right to your door.",
        "iconUrl": "https://play-lh.googleusercontent.com/K46LG_-x_CvGYXvQTPvZvpcHDQAqpBqNjJYSR9Q1i3VPP1vX7lgJA8Xywi-Rz5TzrxM=s180-rw",
        "rating": 4.8,
        "downloads": "50M+",
        "version": "25.15.3",
        "updated": "May 9, 2025",
        "requires": "Android 7.0+",
        "developer": "DoorDash Inc.",
        "installs": "50,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.dd.doordash",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.dd.doordash",
        "screenshots": [
          "https://play-lh.googleusercontent.com/9iQbGV7PGU6BKlR-XE7zZ3qdl-JMWEz8fqO7mWQVDpEzk1NaNxg18rHWCl8owMc3Pw=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/pG39dkQemjMvQhzX7FOq5j6LkBcbZQQ9FhVz8S7TbHhJ_K6x7gS5g_fSLUusrjxiG_0=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "lyft",
        "name": "Lyft - Rideshare, Bikes, Scooters & Transit",
        "category": "Maps & Navigation",
        "categoryId": "maps-navigation",
        "description": "Count on Lyft to take you where you need to go with safety first. Got an appointment? Need to pick up some groceries? We'll match you with a driver, help you find the quickest bus route, or show you the nearest scooter — you'll be on your way in minutes. If it gets you there, it's on the Lyft app.",
        "iconUrl": "https://play-lh.googleusercontent.com/acQ_N8AJO3POZFaSgGsKf_n-Xf9p6HkK2Fw0zgHn84cHNW3FaUlBrh02LjHBvPRQWQ=s180-rw",
        "rating": 4.1,
        "downloads": "50M+",
        "version": "2025.5.44.1",
        "updated": "May 10, 2025",
        "requires": "Android 8.0+",
        "developer": "Lyft, Inc.",
        "installs": "50,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=me.lyft.android",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=me.lyft.android",
        "screenshots": [
          "https://play-lh.googleusercontent.com/QjP1vJEQnFJHOsZBCFNZGRTrCIZUYXQFw0vOmLrUwATRBPjJCS6zl7ppa5PBsp-yrA=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/E30rdDVSGMNzQqzgEKef-NkZnGHVtHZ3F-fxPJi9h4tK58iL6jEBhPcABNJiUMZxkg=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "uber-eats",
        "name": "Uber Eats: Food Delivery",
        "category": "Food & Drink",
        "categoryId": "food-drink",
        "description": "Uber Eats is the easy way to get the food you love delivered. Order food from restaurants you love, prepared and delivered by local favorites and national brands.",
        "iconUrl": "https://play-lh.googleusercontent.com/kDzXRKn4I3rpU_QrvBWq2V2OSXJ7qXHVir_-NKi9wl6mU4-h55mVnHj-HUAYQvIU9Tc=s180-rw",
        "rating": 4.6,
        "downloads": "500M+",
        "version": "4.396.10000",
        "updated": "May 12, 2025",
        "requires": "Android 8.0+",
        "developer": "Uber Technologies, Inc.",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.ubercab.eats",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.ubercab.eats",
        "screenshots": [
          "https://play-lh.googleusercontent.com/eMurmO6JoGOLvAhsvP-Gbqh9DFx9p-qcJz6dlYrmgD17AZgbtCi2Qk_X-w2JA95YCw=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/qQYL38uUEN-MUmpNYH1V3sT2oJTzTHZx-UiCHFuIKtNQnVFTBUZAuJsCt_mKUZyuXw=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "cash-app",
        "name": "Cash App",
        "category": "Finance",
        "categoryId": "finance",
        "description": "Cash App is the easiest way to send, spend, save, and invest your money. It's the SAFE, FAST, and FREE mobile banking app.",
        "iconUrl": "https://play-lh.googleusercontent.com/n-cGuIhAHt4qpSzHU3bYpYv31Mv0q_wLiZJ9ygSTB9HKJvPB9jpzBgvZijfOiTKIBw=s180-rw",
        "rating": 4.2,
        "downloads": "50M+",
        "version": "4.0.7",
        "updated": "May 15, 2025",
        "requires": "Android 8.0+",
        "developer": "Cash App, Inc.",
        "installs": "50,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.squareup.cash",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.squareup.cash",
        "screenshots": [
          "https://play-lh.googleusercontent.com/2sCoBZzn9eOnlsZdN9Pp_BBGCzSgbJIWJJEOgkH4Lr_pSUoZ92I4Wz1-GJLNWfC_9MY=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/HxM7sEI9aB_XPrfOzSDoBkYUOD_X0z0Z1cAr8ywID2JkMUkzMGRLQPZCMlaxqFB0_NI=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "venmo",
        "name": "Venmo",
        "category": "Finance",
        "categoryId": "finance",
        "description": "Venmo is a digital wallet that makes money easier for everyone from students to small businesses. Whether you're paying rent, splitting a dinner bill or sending a birthday gift, Venmo lets you send and receive money with ease.",
        "iconUrl": "https://play-lh.googleusercontent.com/UBiREVMf4ZdW9o63a7GfOilkVFvxXuJDYOd_XCJ0GC6F8kLxCfr3nZ5_1Qog3hfKJVM=s180-rw",
        "rating": 4.5,
        "downloads": "50M+",
        "version": "10.5.0",
        "updated": "May 14, 2025",
        "requires": "Android 8.0+",
        "developer": "PayPal, Inc.",
        "installs": "50,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.venmo",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.venmo",
        "screenshots": [
          "https://play-lh.googleusercontent.com/wW-xP0lYPg3T1a7HPuE7nqU-HlgZTYIlbs9nR-7lfXo7JyASaSCJkS_QGXvQsZZV3Pc=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/k0NkAA3QlNlE7R7-Zvz_f3sZSMEA-VOlvI_3UdQ_5NXjSk7L6H5R-W1b3O5s0a2bpA=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "instacart",
        "name": "Instacart: Grocery Delivery",
        "category": "Shopping",
        "categoryId": "shopping",
        "description": "Make grocery delivery simple with Instacart: Shop from stores like Costco, Aldi, and more. Instacart delivers everything from groceries to home essentials.",
        "iconUrl": "https://play-lh.googleusercontent.com/IhOcDxrtm4e9xWJ8CanRBQyWUiD7UlVUlUpk8-rtaEsNr7VrrBGTdmDz_L9QJ9gG8w=s180-rw",
        "rating": 4.8,
        "downloads": "10M+",
        "version": "7.62.0",
        "updated": "May 12, 2025",
        "requires": "Android 7.0+",
        "developer": "Maplebear Inc",
        "installs": "10,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.instacart.shopper",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.instacart.shopper",
        "screenshots": [
          "https://play-lh.googleusercontent.com/Ub8aBwsPsRHoycnbLc6fFuv9RFbgGRkj0S1Fw9gZ0BLr4oASvKhYGtGWA6IB6PuqYHk=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/bStTWr2y26hQkuDApyQGiRlY2p9TzpSb02LiF-fwXNKSPrEyEe1MUuHnlwDNclP-hw=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "whatsapp-business",
        "name": "WhatsApp Business",
        "category": "Business",
        "categoryId": "business",
        "description": "WhatsApp Business enables you to have a business presence on WhatsApp, communicate more efficiently with your customers, and help you grow your business.",
        "iconUrl": "https://play-lh.googleusercontent.com/_XCSOChLRUCf2OZFcKTfhvjwCvj8z_omXOsRa3Az03VfFT9CKQ8ON14jwUoIxlbvHow=s180-rw",
        "rating": 4.2,
        "downloads": "500M+",
        "version": "2.25.12.80",
        "updated": "May 15, 2025",
        "requires": "Android 5.0+",
        "developer": "WhatsApp LLC",
        "installs": "500,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.whatsapp.w4b",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.whatsapp.w4b",
        "screenshots": [
          "https://play-lh.googleusercontent.com/qg3MX2GrznxRdQhBPZTmXJzeeKVb5Hl6wGNQgM5LFijNNT9U-rXfUBkYA_dy4HJy7A=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/6RT9pM6dEscFCHJ8Qi4_2sVHd3p7ZCGEDn0OZ-LXypWdLHdZokU2VXEUmz6KrGZP=w1052-h592-rw"
        ],
        "isAffiliate": true
      },
      {
        "id": "nordvpn",
        "name": "NordVPN - VPN Fast & Secure",
        "category": "Tools",
        "categoryId": "tools",
        "description": "The NordVPN app for Android provides access to the fastest VPN servers in 60+ countries. It helps you secure your connection wherever you go – at home, in a café, or a public Wi-Fi spot.",
        "iconUrl": "https://play-lh.googleusercontent.com/PgpDVEP9HPBiJ2f6HybYZEl9Y0Np_c-OPQYDsxPzPVTgPT39CxGMYAC0yHPDtCj9oZM=s180-rw",
        "rating": 4.4,
        "downloads": "50M+",
        "version": "7.9.1",
        "updated": "May 13, 2025",
        "requires": "Android 7.0+",
        "developer": "TEFINCOM S.A.",
        "installs": "50,000,000+",
        "downloadUrl": "https://play.google.com/store/apps/details?id=com.nordvpn.android",
        "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.nordvpn.android",
        "screenshots": [
          "https://play-lh.googleusercontent.com/b_KkAcHbNrQ-0yZb1C3UcN_tKH3Gq8-VJPkfaMZQYYXJ1r4vF1pRiTnX_k0CwEF-Kg=w1052-h592-rw",
          "https://play-lh.googleusercontent.com/FDMB3ZvDZ8Q0WFgcuKE0TMNQ1-0i6TJciSiHv1ZwUkJFJcAeOzYh4t3dHiiQb8gzuA=w1052-h592-rw"
        ],
        "isAffiliate": true
      }
    ];
    
    // Añadimos los datos faltantes al archivo apps.json
    if (missingApps.length > 0) {
      const newApps = [...appsData.apps, ...missingApps];
      
      // Actualizamos el archivo con las nuevas apps
      appsData.apps = newApps;
      
      // Guardamos el archivo actualizado
      fs.writeFileSync(
        appsJsonPath,
        JSON.stringify(appsData, null, 2),
        'utf8'
      );
      
      console.log(`Se añadieron ${missingApps.length} nuevas apps al catálogo.`);
      console.log(`Total de apps en el catálogo: ${newApps.length}`);
    } else {
      console.log('No hay apps para añadir.');
    }
  } catch (error) {
    console.error('Error al añadir las apps faltantes:', error);
  }
}

// Ejecutar la función
addMissingApps().catch(error => {
  console.error('Error al ejecutar el script:', error);
});