import { Category, App } from "@shared/schema";
import { getApps } from "./apps";

// Categories data
const categories: Category[] = [
  {
    id: "sports",
    name: "Sports"
  },
  {
    id: "entertainment",
    name: "Entertainment"
  },
  {
    id: "drawing",
    name: "Drawing"
  },
  {
    id: "beauty",
    name: "Beauty"
  },
  {
    id: "editors-choice",
    name: "Editor's Choice"
  },
  {
    id: "casino",
    name: "Casino"
  },
  {
    id: "texting",
    name: "Texting"
  },
  {
    id: "lifestyle",
    name: "Lifestyle"
  },
  {
    id: "casual",
    name: "Casual"
  },
  {
    id: "maps-and-navigation",
    name: "Maps & Navigation"
  },
  {
    id: "simulation",
    name: "Simulation"
  },
  {
    id: "media-and-video",
    name: "Media & Video"
  },
  {
    id: "weather",
    name: "Weather"
  },
  {
    id: "role-playing",
    name: "Role Playing"
  },
  {
    id: "delivery-apps",
    name: "Delivery Apps"
  },
  {
    id: "video-chat",
    name: "Video Chat"
  },
  {
    id: "medical",
    name: "Medical"
  },
  {
    id: "payment",
    name: "Payment"
  },
  {
    id: "podcast",
    name: "Podcast"
  },
  {
    id: "facetime-alternative",
    name: "Facetime Alternative"
  },
  {
    id: "bitcoin",
    name: "Bitcoin"
  },
  {
    id: "libraries-and-demo",
    name: "Libraries & Demo"
  },
  {
    id: "trivia",
    name: "Trivia"
  },
  {
    id: "educational",
    name: "Educational"
  },
  {
    id: "bitcoin-wallet",
    name: "Bitcoin Wallet"
  },
  {
    id: "comics",
    name: "Comics"
  },
  {
    id: "travel",
    name: "Travel"
  },
  {
    id: "racing",
    name: "Racing"
  },
  {
    id: "motor-clubs",
    name: "Motor Clubs"
  },
  {
    id: "virtual-reality",
    name: "Virtual Reality"
  },
  {
    id: "action",
    name: "Action"
  },
  {
    id: "black-friday",
    name: "Black Friday"
  },
  {
    id: "tools",
    name: "Tools"
  },
  {
    id: "puzzle",
    name: "Puzzle"
  },
  {
    id: "travel-and-local",
    name: "Travel & Local"
  },
  {
    id: "password-manager",
    name: "Password Manager"
  },
  {
    id: "communication",
    name: "Communication"
  },
  {
    id: "package-tracker",
    name: "Package Tracker"
  },
  {
    id: "finance",
    name: "Finance"
  },
  {
    id: "movie",
    name: "Movie"
  },
  {
    id: "house-and-home",
    name: "House & Home"
  },
  {
    id: "social",
    name: "Social"
  },
  {
    id: "email",
    name: "Email"
  },
  {
    id: "printer",
    name: "Printer"
  },
  {
    id: "arcade",
    name: "Arcade"
  },
  {
    id: "auto-and-vehicles",
    name: "Auto & Vehicles"
  },
  {
    id: "music-and-audio",
    name: "Music & Audio"
  },
  {
    id: "adventure",
    name: "Adventure"
  },
  {
    id: "shopping",
    name: "Shopping"
  },
  {
    id: "games",
    name: "Games"
  },
  {
    id: "productivity",
    name: "Productivity"
  },
  {
    id: "camera",
    name: "Camera"
  },
  {
    id: "food-and-drinks",
    name: "Food & Drinks"
  },
  {
    id: "brain-training",
    name: "Brain Training"
  },
  {
    id: "video-players",
    name: "Video Players"
  },
  {
    id: "board",
    name: "Board"
  },
  {
    id: "video-calling",
    name: "Video Calling"
  },
  {
    id: "parenting",
    name: "Parenting"
  },
  {
    id: "stock-market",
    name: "Stock Market"
  },
  {
    id: "art-and-design",
    name: "Art & Design"
  },
  {
    id: "music",
    name: "Music"
  },
  {
    id: "learning-and-education",
    name: "Learning & Education"
  },
  {
    id: "business",
    name: "Business"
  },
  {
    id: "photo-editor",
    name: "Photo Editor"
  },
  {
    id: "meeting",
    name: "Meeting"
  },
  {
    id: "notes",
    name: "Notes"
  },
  {
    id: "social-tools",
    name: "Social Tools"
  },
  {
    id: "dating",
    name: "Dating"
  },
  {
    id: "web-browser",
    name: "Web Browser"
  },
  {
    id: "education",
    name: "Education"
  },
  {
    id: "photo-and-video-sharing",
    name: "Photo & Video Sharing"
  },
  {
    id: "radio",
    name: "Radio"
  },
  {
    id: "chromecast",
    name: "Chromecast"
  },
  {
    id: "strategy",
    name: "Strategy"
  },
  {
    id: "money-saving",
    name: "Money Saving"
  },
  {
    id: "ridesharing",
    name: "Ridesharing"
  },
  {
    id: "parking",
    name: "Parking"
  }
];

// Get all categories
export const getCategories = (): Category[] => {
  return categories;
};

// Get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Get apps by category
export const getAppsByCategory = (categoryId: string): App[] => {
  const allApps = getApps();
  return allApps.filter(app => app.categoryId === categoryId);
};
