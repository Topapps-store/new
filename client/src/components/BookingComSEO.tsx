import { useEffect } from 'react';

interface BookingComSEOProps {
  app: any;
}

export default function BookingComSEO({ app }: BookingComSEOProps) {

  useEffect(() => {
    // Optimize for Google Ads keywords: hotel beach, beach hotel, hotels close to the beach, booking app, download booking, booking app download
    const originalTitle = document.title;
    
    // Set optimized title with keywords
    document.title = 'Booking App Download - Beach Hotel & Hotels Close to the Beach | Booking.com';
    
    // Update meta description with all target keywords
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute('content', 
      'Download Booking app for the best beach hotel deals! Find hotels close to the beach with our booking app download. Get hotel beach reservations and beach hotel bookings instantly. Download booking app for iOS and Android to access exclusive beach hotel offers.'
    );

    // Add keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    
    metaKeywords.setAttribute('content', 
      'hotel beach, beach hotel, hotels close to the beach, booking app, download booking, booking app download, download booking app for iOS, download booking app for android'
    );

    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "name": "Booking.com: Hotels & Travel",
      "description": "Download Booking app for beach hotel bookings and hotels close to the beach. Best booking app download for iOS and Android.",
      "applicationCategory": "TravelApplication",
      "operatingSystem": ["Android", "iOS"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "keywords": "hotel beach, beach hotel, hotels close to the beach, booking app, download booking, booking app download"
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return null;
}