declare module 'google-play-scraper' {
  export function app(options: { appId: string, lang?: string, country?: string }): Promise<{
    title: string;
    description: string;
    descriptionHTML: string;
    summary: string;
    installs: string;
    minInstalls: number;
    score: number;
    scoreText: string;
    ratings: number;
    reviews: number;
    histogram: { [key: string]: number };
    price: number;
    free: boolean;
    currency: string;
    priceText: string;
    offersIAP: boolean;
    size: string;
    androidVersion: string;
    androidVersionText: string;
    developer: string;
    developerId: string;
    developerEmail: string;
    developerWebsite: string;
    developerAddress: string;
    genre: string;
    genreId: string;
    icon: string;
    headerImage: string;
    screenshots: string[];
    video: string;
    videoImage: string;
    contentRating: string;
    adSupported: boolean;
    released: string;
    updated: string;
    version: string;
    recentChanges: string;
    url: string;
  }>;
  
  export function screenshots(options: {
    appId: string,
    lang?: string,
    country?: string
  }): Promise<string[]>;
}