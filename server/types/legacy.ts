// Tipos heredados de la versión con base de datos para mantener compatibilidad

export interface AppLegacy {
  id: string;
  name: string;
  category?: string;
  categoryId: string;
  description: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  version: string;
  size: string;
  updated: string;
  requires?: string;
  developer?: string;
  developerEmail?: string;
  developerWebsite?: string;
  downloadUrl?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  screenshots?: string[];
  isAffiliate?: boolean;
}

export interface CategoryLegacy {
  id: string;
  name: string;
}

export interface AffiliateLink {
  id: number;
  appId: string;
  title: string;
  url: string;
  isAffiliate: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppVersionHistory {
  id: number;
  appId: string;
  version: string;
  releaseNotes?: string;
  releaseDate: Date;
  isNotified: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}