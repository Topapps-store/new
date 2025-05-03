import React from 'react';

const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
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
        <p>
          <strong>Important:</strong> TopApps.store is NOT responsible for the actions, content, privacy practices, or 
          conduct of any third parties that users may access through links provided on our website. When you click on a 
          link to a third-party website or service, you are subject to the terms and policies of that third party, not 
          those of TopApps.store. We strongly recommend reviewing the terms of service and privacy policies of any 
          third-party websites or services before using them.
        </p>
        
        <h2>3. App Downloads</h2>
        <p>
          TopApps.store provides information and links to download Android applications. We are not the developers of these 
          applications and we do not host them on our servers. All app downloads are directed to the original source or 
          official app stores.
        </p>
        <p>
          We do not guarantee the functionality, safety, or suitability of any app featured on our site. We strongly recommend 
          that users verify the source of any application before downloading and read the app's privacy policy and terms of service.
        </p>
        
        <h2>4. Affiliate Marketing</h2>
        <p>
          Some of the links on TopApps.store are affiliate links. This means that if you click on the link and purchase an item, 
          we may receive a commission at no additional cost to you. All affiliate links are clearly marked with "AD" or "SPONSORED" 
          tags.
        </p>
        <p>
          While we strive to recommend only quality products and services, we are not responsible for the quality, performance, 
          or suitability of any product or service that you purchase through our affiliate links.
        </p>
        
        <h2>5. User Responsibility</h2>
        <p>
          Users are responsible for ensuring that any app they download from links provided on TopApps.store is compatible with 
          their device and appropriate for their needs. We recommend reading app reviews and checking system requirements before 
          downloading any application.
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
        </ul>
        
        <h2>7. Rights Reserved</h2>
        <p>
          All trademarks, logos, and service marks displayed on TopApps.store are the property of their respective owners. 
          References to any products, services, processes, or other information by trade name, trademark, manufacturer, supplier, 
          or otherwise does not constitute or imply endorsement, sponsorship, or recommendation by us.
        </p>
        
        <h2>8. No Responsibility for Third Party Actions</h2>
        <p>
          TopApps.store explicitly disclaims all responsibility and liability for any actions, conduct, content, transactions, 
          communications, or any other activities that occur as a result of your interactions with any third parties that you 
          access through our website. This includes but is not limited to:
        </p>
        <ul>
          <li>App developers whose applications you download</li>
          <li>Advertisers and affiliate partners whose links you click</li>
          <li>App stores or download platforms you visit</li>
          <li>Any other external websites or services you access via links on our site</li>
        </ul>
        <p>
          We do not endorse, verify, monitor, or have any control over these third parties. Any harm, damage, loss, or any 
          negative consequences that result from your interactions with third parties are solely between you and those third 
          parties. By using TopApps.store, you acknowledge and agree that you are choosing to interact with these third 
          parties at your own risk.
        </p>
        
        <h2>9. Changes to This Disclaimer</h2>
        <p>
          We may update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on 
          this page and updating the "Last updated" date.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
