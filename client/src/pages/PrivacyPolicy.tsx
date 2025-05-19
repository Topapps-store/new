import React from 'react';
import { Link } from "wouter";
import { useLanguage } from "../context/StaticLanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: May 19, 2025</p>
        
        <p>
          At TopApps.store, we value your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you 
          visit our website.
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>We may collect several types of information from and about users of our website, including:</p>
        <ul>
          <li>
            <strong>Usage Data:</strong> Information about how you access and use our website, including your IP 
            address, browser type, device information, pages visited, time spent on those pages, and referral sources.
          </li>
          <li>
            <strong>Cookies and Tracking Data:</strong> We use cookies and similar tracking technologies to track 
            activity on our website and hold certain information to improve your browsing experience.
          </li>
          <li>
            <strong>App Usage Data:</strong> Information about which apps you view, download, or interact with on our platform.
          </li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <p>We may use the information we collect about you for various purposes, including:</p>
        <ul>
          <li>To provide and maintain our website</li>
          <li>To improve our website and user experience</li>
          <li>To monitor the usage of our website</li>
          <li>To detect, prevent, and address technical issues</li>
          <li>To analyze trends and better understand user preferences</li>
          <li>To deliver relevant app recommendations and advertisements</li>
        </ul>
        
        <h2>3. Cookie Policy</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit our website. We use cookies to 
          enhance your browsing experience, analyze site traffic, and personalize content. You can set your browser 
          to refuse all or some browser cookies, but this may affect the functionality of our website.
        </p>
        <p>
          We use both session cookies (which expire when you close your browser) and persistent cookies (which remain 
          on your device until you delete them or they expire).
        </p>
        
        <h2>4. Third-Party Services, Links and Charges</h2>
        <p>
          Our website contains links to third-party websites, applications, and services that are not owned or controlled 
          by TopApps.store. We have no control over and assume no responsibility for the content, privacy policies, 
          data collection practices, or conduct of any third-party websites, applications, or services.
        </p>
        <p>
          <strong>IMPORTANT DISCLAIMER REGARDING THIRD-PARTY CHARGES:</strong> TopApps.store is NOT responsible for any fees, 
          charges, subscriptions, or payments that you may incur when using third-party applications, websites, or services 
          accessed through our platform. This includes but is not limited to:
        </p>
        <ul>
          <li>App purchase costs</li>
          <li>In-app purchases</li>
          <li>Subscription fees</li>
          <li>Premium features</li>
          <li>Any other monetary transactions</li>
        </ul>
        <p>
          We strongly encourage you to carefully review the terms of service, privacy policies, and payment terms of any 
          third-party application or service before downloading, installing, or providing payment information. You are solely 
          responsible for understanding and agreeing to any charges that may apply.
        </p>
        <p>
          We may use third-party services such as Google Analytics to monitor and analyze the use of our website. These 
          services may collect information sent by your browser as part of a web page request, including your IP address 
          or other identifiers.
        </p>
        
        <h2>5. Sponsored Content and Affiliate Marketing</h2>
        <p>
          TopApps.store contains sponsored content and participates in affiliate marketing programs, which means we may receive 
          commissions on actions taken through our links (such as app downloads, purchases, or sign-ups). This helps us maintain 
          our website and provide you with free access to app information.
        </p>
        <p>
          <strong>Disclosure of Sponsored Content:</strong> We clearly label sponsored content with "AD" or "SPONSORED" tags. 
          While we strive to work with reputable partners, TopApps.store is not responsible for the content, offers, products, 
          or services provided by our sponsors or advertisers.
        </p>
        <p>
          <strong>Disclaimer of Responsibility:</strong> We do not endorse, guarantee, or assume responsibility for any product, 
          service, information, or recommendation provided by sponsors, affiliates, or advertisers. Your interactions with these 
          entities are solely between you and them.
        </p>
        
        <h2>6. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your information. However, please note that no 
          method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee 
          its absolute security.
        </p>
        
        <h2>7. International Transfers</h2>
        <p>
          Your information may be transferred to and maintained on computers located outside of your state, province, 
          country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
        </p>
        
        <h2>8. Children's Privacy</h2>
        <p>
          Our website is not intended for children under the age of 13. We do not knowingly collect personally identifiable 
          information from children under 13. If we discover that a child under 13 has provided us with personal information, 
          we will delete such information from our servers.
        </p>
        
        <h2>9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
          Policy on this page and updating the "Last updated" date.
        </p>
        
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us using our Contact page.
        </p>
        
        <div className="mt-8 border-t pt-4">
          <p>For more information, please see our:</p>
          <ul className="flex flex-col space-y-2 text-blue-600">
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
