import React from "react";

type SponsoredBannerProps = {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
};

const SponsoredBanner: React.FC<SponsoredBannerProps> = ({
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
}) => {
  const handleAffiliateClick = () => {
    // Track affiliate link click
    console.log("Sponsored banner clicked:", ctaLink);
    // In a real implementation, this would send tracking data to analytics
  };

  return (
    <div className="my-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
        SPONSORED
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="mb-4">{description}</p>
          <a
            href={ctaLink}
            className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={handleAffiliateClick}
            data-event="click:trackAffiliate"
          >
            <span>{ctaText}</span>
            <i className="fas fa-chevron-right ml-2"></i>
          </a>
        </div>
        <div className="md:w-1/3">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SponsoredBanner;
