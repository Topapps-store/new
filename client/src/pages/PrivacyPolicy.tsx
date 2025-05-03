import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>
          At TopApps.store, we value your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you 
          visit our website.
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>We may collect several types of information from and about users of our website, including:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> This includes information such as your name, email address, 
            and other identifiable information that you provide when subscribing to our newsletter or contacting us.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you access and use our website, including your IP 
            address, browser type, device information, pages visited, time spent on those pages, and referral sources.
          </li>
          <li>
            <strong>Cookies and Tracking Data:</strong> We use cookies and similar tracking technologies to track 
            activity on our website and hold certain information to improve your browsing experience.
          </li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <p>We may use the information we collect about you for various purposes, including:</p>
        <ul>
          <li>To provide and maintain our website</li>
          <li>To notify you about changes to our website or services</li>
          <li>To allow you to participate in interactive features when you choose to do so</li>
          <li>To improve our website and user experience</li>
          <li>To monitor the usage of our website</li>
          <li>To detect, prevent, and address technical issues</li>
          <li>To send you newsletters, promotions, and other information about apps that may be of interest to you</li>
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
        
        <h2>4. Third-Party Services and Links</h2>
        <p>
          Our website may contain links to third-party websites, applications, or services that are not owned or controlled 
          by TopApps.store. We have no control over and assume no responsibility for the content, privacy policies, 
          data collection practices, or conduct of any third-party websites, applications, or services.
        </p>
        <p>
          <strong>Important notice regarding third parties:</strong> When you leave our website by clicking on any external link 
          (including app download links, affiliate links, and advertiser links), you are subject to the privacy policies and 
          terms of service of those third parties. We strongly encourage you to review the privacy policies of any third-party 
          site or service before providing any personal information or downloading any content.
        </p>
        <p>
          TopApps.store is not liable for any privacy practices, data breaches, or other actions of third parties that you 
          access through our website. Your interactions with these third parties are solely between you and them.
        </p>
        <p>
          We may use third-party services such as Google Analytics to monitor and analyze the use of our website. These 
          services may collect information sent by your browser as part of a web page request, including your IP address 
          or other identifiers.
        </p>
        
        <h2>5. Affiliate Marketing</h2>
        <p>
          TopApps.store participates in affiliate marketing programs, which means we may receive commissions on purchases 
          made through our links to retailer sites. This does not affect the price you pay for products or services. To 
          provide this service, we may share certain non-personal information with affiliate networks to track the effectiveness 
          of our marketing efforts.
        </p>
        
        <h2>6. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, please note that no 
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
          If you have any questions about this Privacy Policy, please contact us at privacy@topapps.store.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
