import React from "react";

type StarRatingProps = {
  rating: number; // value from 0 to 5
  showScore?: boolean;
};

const StarRating: React.FC<StarRatingProps> = ({ rating = 0, showScore = false }) => {
  // Asegurarse de que el rating es un número válido
  const validRating = isNaN(rating) ? 0 : Math.max(0, Math.min(5, rating));
  
  // Get full stars
  const fullStars = Math.floor(validRating);
  // Get half stars (if remainder is >= 0.3 and < 0.8)
  const halfStar = validRating % 1 >= 0.3 && validRating % 1 < 0.8;
  // Get empty stars
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

  return (
    <div className="flex items-center text-accent">
      {Array.from({ length: fullStars }, (_, i) => (
        <i key={`full-${i}`} className="fas fa-star text-sm"></i>
      ))}
      
      {halfStar && <i className="fas fa-star-half-alt text-sm"></i>}
      
      {Array.from({ length: emptyStars }, (_, i) => (
        <i key={`empty-${i}`} className="far fa-star text-sm"></i>
      ))}
      
      {showScore && <span className="ml-1 text-gray-600">{validRating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
