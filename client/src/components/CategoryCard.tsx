import { Link } from "wouter";
import { Category } from "@shared/schema";

type CategoryCardProps = {
  category: Category;
};

const getCategoryIcon = (id: string) => {
  const iconMap: { [key: string]: string } = {
    sports: "fas fa-running",
    entertainment: "fas fa-film",
    drawing: "fas fa-paint-brush",
    beauty: "fas fa-spa",
    "editors-choice": "fas fa-award",
    casino: "fas fa-dice",
    texting: "fas fa-comments",
    lifestyle: "fas fa-heart",
    casual: "fas fa-puzzle-piece",
    "maps-and-navigation": "fas fa-map-marked-alt",
    simulation: "fas fa-vr-cardboard",
    "media-and-video": "fas fa-photo-video",
    weather: "fas fa-cloud-sun",
    "role-playing": "fas fa-hat-wizard",
    "delivery-apps": "fas fa-truck",
    "video-chat": "fas fa-video",
    medical: "fas fa-heartbeat",
    payment: "fas fa-credit-card",
    podcast: "fas fa-podcast",
    "facetime-alternative": "fas fa-video",
    bitcoin: "fab fa-bitcoin",
    "libraries-and-demo": "fas fa-book",
    trivia: "fas fa-question",
    educational: "fas fa-graduation-cap",
    "bitcoin-wallet": "fas fa-wallet",
    comics: "fas fa-book-open",
    travel: "fas fa-plane",
    racing: "fas fa-flag-checkered",
    "motor-clubs": "fas fa-car",
    "virtual-reality": "fas fa-vr-cardboard",
    action: "fas fa-bolt",
    "black-friday": "fas fa-tags",
    tools: "fas fa-tools",
    puzzle: "fas fa-puzzle-piece",
    "travel-and-local": "fas fa-compass",
    "password-manager": "fas fa-key",
    communication: "fas fa-comments",
    "package-tracker": "fas fa-box",
    finance: "fas fa-dollar-sign",
    movie: "fas fa-film",
    "house-and-home": "fas fa-home",
    social: "fas fa-users",
    email: "fas fa-envelope",
    printer: "fas fa-print",
    arcade: "fas fa-gamepad",
    "auto-and-vehicles": "fas fa-car",
    "music-and-audio": "fas fa-music",
    adventure: "fas fa-mountain",
    shopping: "fas fa-shopping-cart",
    games: "fas fa-gamepad",
    productivity: "fas fa-tasks",
    camera: "fas fa-camera",
    "food-and-drinks": "fas fa-utensils",
    "brain-training": "fas fa-brain",
    "video-players": "fas fa-play",
    board: "fas fa-chess-board",
    "video-calling": "fas fa-video",
    parenting: "fas fa-baby",
    "stock-market": "fas fa-chart-line",
    "art-and-design": "fas fa-palette",
    music: "fas fa-music",
    "learning-and-education": "fas fa-book",
    business: "fas fa-briefcase",
    "photo-editor": "fas fa-edit",
    meeting: "fas fa-handshake",
    notes: "fas fa-sticky-note",
    "social-tools": "fas fa-share-alt",
    dating: "fas fa-heart",
    "web-browser": "fas fa-globe",
    education: "fas fa-school",
    "photo-and-video-sharing": "fas fa-share-alt",
    radio: "fas fa-broadcast-tower",
    chromecast: "fas fa-tv",
    strategy: "fas fa-chess",
    "money-saving": "fas fa-piggy-bank",
    ridesharing: "fas fa-taxi",
    parking: "fas fa-parking"
  };

  return iconMap[id] || "fas fa-mobile-alt";
};

const getRandomColorClass = (id: string) => {
  const colorClasses = [
    "bg-blue-100 text-blue-500",
    "bg-purple-100 text-purple-500",
    "bg-indigo-100 text-indigo-500",
    "bg-pink-100 text-pink-500",
    "bg-yellow-100 text-yellow-500",
    "bg-red-100 text-red-500",
    "bg-teal-100 text-teal-500",
    "bg-green-100 text-green-500",
    "bg-orange-100 text-orange-500"
  ];
  
  // Use a hash function to always return the same color for the same ID
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorClasses[hash % colorClasses.length];
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const iconClass = getCategoryIcon(category.id);
  const colorClass = getRandomColorClass(category.id);
  
  return (
    <Link href={`/categories/${category.id}`} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 flex items-center justify-center ${colorClass} rounded-lg mr-3`}>
        <i className={iconClass}></i>
      </div>
      <span>{category.name}</span>
    </Link>
  );
};

export default CategoryCard;
