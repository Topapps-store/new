import React from 'react';
import { Link } from "wouter";
import { useLanguage } from "../context/StaticLanguageContext";

const Disclaimer = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: May 19, 2025</p>
        
        <h2>1. Website Content</h2>
        <p>
          The information provided on TopApps.store is for general informational purposes only. All information on the site 
          is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding 
          the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
        </p>
        
        <h2>2. External Links and Third Parties</h2>
        <p>
          TopApps.store may contain links to external websites, download sources, and third-party services that are not 
          provided, maintained by, or in any way affiliated with us. We do not guarantee the accuracy, relevance, 
          timeliness, or completeness of any information on these external websites or services.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="font-bold text-xl mb-2">IMPORTANT DISCLAIMER</p>
          <p className="mb-2">
            TopApps.store is <span className="font-bold uppercase">NOT</span> responsible for the actions, content, privacy practices, or 
            conduct of any third parties that users may access through links provided on our website. When you click on a 
            link to a third-party website or service, you are subject to the terms and policies of that third party, not 
            those of TopApps.store.
          </p>
          <p className="mb-2">
            <span className="font-bold uppercase">WE ARE NOT RESPONSIBLE FOR ANY CHARGES, SUBSCRIPTIONS, OR FEES</span> that you may incur 
            when using third-party applications, websites, or services accessed through our platform. This includes any app purchase costs, 
            in-app purchases, subscription services, premium features, or any other monetary transactions on third-party platforms.
          </p>
          <p>
            You are solely responsible for reviewing and understanding the terms and conditions of any third-party service before 
            making any purchases or entering into any agreements. By using our site, you acknowledge this disclaimer and release 
            us from any liability related to third-party charges.
          </p>
        </div>
        
        <h2>3. App Downloads and Sponsored Content</h2>
        <p>
          TopApps.store provides information and links to download Android applications. We are not the developers of these 
          applications and we do not host them on our servers. All app downloads are directed to the original source, 
          official app stores, or sponsored download partners.
        </p>
        <p>
          <strong>Sponsored Download Links:</strong> Some download links on our site are sponsored and may redirect you to third-party 
          websites or alternative download sources. These sponsored links are clearly labeled with "AD" or "SPONSORED" tags. 
          We do not endorse, control, or take responsibility for the content, services, or products offered by these sponsors.
        </p>
        <p>
          We do not guarantee the functionality, safety, or suitability of any app featured on our site. We strongly recommend 
          that users verify the source of any application before downloading and read the app's privacy policy and terms of service.
        </p>
        
        <h2>4. Affiliate Marketing and Monetization</h2>
        <p>
          TopApps.store contains affiliate links, sponsored content, and advertisements. This means that if you click on certain links 
          and take actions (such as making a purchase, downloading an app, or signing up for a service), we may receive a commission 
          or other compensation.
        </p>
        <p>
          While we strive to work with reputable partners, TopApps.store is not responsible for the content, offers, products, 
          services, or information provided by our sponsors or advertisers. We explicitly disclaim all responsibility for:
        </p>
        <ul>
          <li>The quality or performance of any product or service obtained through sponsored links</li>
          <li>Any representation made by sponsors or advertisers</li>
          <li>Any transaction between you and any third-party</li>
          <li>Any financial obligations, subscriptions, or recurring charges that may result from your interactions with sponsored content</li>
        </ul>
        
        <h2>5. User Responsibility</h2>
        <p>
          Users are responsible for ensuring that any app they download from links provided on TopApps.store is compatible with 
          their device and appropriate for their needs. We recommend reading app reviews and checking system requirements before 
          downloading any application.
        </p>
        <p>
          <strong>Financial Responsibility:</strong> Users are solely responsible for any financial decisions, purchases, or subscriptions 
          made through links on our website. You should carefully review all terms, conditions, and payment obligations before 
          entering into any transaction with a third party.
        </p>
        
        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall TopApps.store, its owners, directors, employees, or agents be liable for any indirect, incidental, 
          special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
          other intangible losses, resulting from:
        </p>
        <ul>
          <li>Your access to or use of or inability to access or use the service</li>
          <li>Any conduct or content of any third party on the service</li>
          <li>Any content obtained from the service</li>
          <li>Unauthorized access, use or alteration of your transmissions or content</li>
          <li>The download or use of any application featured on our website</li>
          <li>Any charges, fees, or subscriptions incurred through third-party services</li>
          <li>Any products or services purchased or obtained through links on our site</li>
        </ul>
        
        <h2>7. Rights Reserved</h2>
        <p>
          All trademarks, logos, and service marks displayed on TopApps.store are the property of their respective owners. 
          References to any products, services, processes, or other information by trade name, trademark, manufacturer, supplier, 
          or otherwise does not constitute or imply endorsement, sponsorship, or recommendation by us.
        </p>
        
        <h2>8. Changes to This Disclaimer</h2>
        <p>
          We may update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on 
          this page and updating the "Last updated" date.
        </p>
        
        <div className="mt-8 border-t pt-4">
          <p>For more information, please see our:</p>
          <ul className="flex flex-col space-y-2 text-blue-600">
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
