/**
 * English-only dictionary for the application
 */

export const dictionary = {
  // Navigation
  'nav.home': 'Home',
  'nav.apps': 'Apps',
  'nav.games': 'Games',
  'nav.addApp': 'Submit App',
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
};

/**
 * Simple text translation function (English only)
 * @param key Translation key
 * @returns Translated text or the key itself if not found
 */
export function getText(key: string): string {
  return dictionary[key as keyof typeof dictionary] || key;
}