declare module 'app-store-scraper' {
  export function app(options: { id: string }): Promise<{
    id: string;
    title: string;
    description: string;
    version: string;
    developer: string;
    icon: string;
    screenshots: string[];
    score: number;
    reviews: number;
    size: string;
    updated: string;
    price: number;
    url: string;
    primaryGenre: string;
  }>;
}

declare module 'google-play-scraper' {
  export function app(options: { appId: string }): Promise<{
    title: string;
    description: string;
    version: string;
    developer: string;
    icon: string;
    score: number;
    reviews: number;
    size: string;
    updated: number;
    price: number;
    url: string;
    genre: string;
  }>;
  
  export function screenshots(options: { 
    appId: string;
    lang?: string;
    country?: string;
  }): Promise<string[]>;
}