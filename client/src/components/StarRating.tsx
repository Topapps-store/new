import React from "react";

type StarRatingProps = {
  rating: number; // value from 0 to 5
  showScore?: boolean;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, showScore = false }) => {
  // Get full stars
  const fullStars = Math.floor(rating);
  // Get half stars (if remainder is >= 0.3 and < 0.8)
  const halfStar = rating % 1 >= 0.3 && rating % 1 < 0.8;
  // Get empty stars
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-accent">
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star text-sm"></i>
      ))}
      
      {halfStar && <i className="fas fa-star-half-alt text-sm"></i>}
      
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star text-sm"></i>
      ))}
      
      {showScore && <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
