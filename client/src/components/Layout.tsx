import React from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useLanguage } from "../context/StaticLanguageContext";
import TranslatedText from "./TranslatedText";
import TranslatedParagraph from "./TranslatedParagraph";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="/apps/all">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/apps/all" ? "text-primary" : ""}`}>
                <i className="fas fa-mobile-alt mr-1"></i>
                <span className="hidden md:inline">{t('nav.apps')}</span>
              </div>
            </Link>
            <Link href="/categories/games">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/categories/games" ? "text-primary" : ""}`}>
                <i className="fas fa-gamepad mr-1"></i>
                <span className="hidden md:inline">{t('nav.games')}</span>
              </div>
            </Link>
            <Link href="/apps/add">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/apps/add" ? "text-primary" : ""}`}>
                <i className="fas fa-plus-circle mr-1"></i>
                <span className="hidden md:inline">{t('nav.addApp')}</span>
              </div>
            </Link>
          </nav>
        </div>

        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        {location === "/terms-of-service" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6"><TranslatedText text="Terms of Service" /></h1>
            
            <div className="prose max-w-none">
              <p><TranslatedText text="Last updated: May 19, 2025" /></p>
              
              <h2><TranslatedText text="1. Agreement to Terms" /></h2>
              <TranslatedParagraph
                text="By accessing our website TopApps.store, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
              />
              
              <h2><TranslatedText text="2. Use License" /></h2>
              <TranslatedParagraph
                text="Permission is granted to temporarily download one copy of the materials on TopApps.store for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"
              />
              <ul>
                <li><TranslatedText text="Modify or copy the materials" /></li>
                <li><TranslatedText text="Use the materials for any commercial purpose" /></li>
                <li><TranslatedText text="Attempt to decompile or reverse engineer any software contained on TopApps.store" /></li>
                <li><TranslatedText text="Remove any copyright or other proprietary notations from the materials" /></li>
                <li><TranslatedText text="Transfer the materials to another person or 'mirror' the materials on any other server" /></li>
              </ul>
              
              <h2><TranslatedText text="3. Disclaimer" /></h2>
              <TranslatedParagraph
                text="The materials on TopApps.store are provided on an 'as is' basis. TopApps.store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
              />
              
              <h2><TranslatedText text="4. Limitations" /></h2>
              <TranslatedParagraph
                text="In no event shall TopApps.store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TopApps.store, even if TopApps.store or a TopApps.store authorized representative has been notified orally or in writing of the possibility of such damage."
              />
              
              <h2><TranslatedText text="5. Accuracy of Materials" /></h2>
              <TranslatedParagraph
                text="The materials appearing on TopApps.store could include technical, typographical, or photographic errors. TopApps.store does not warrant that any of the materials on its website are accurate, complete or current. TopApps.store may make changes to the materials contained on its website at any time without notice. However TopApps.store does not make any commitment to update the materials."
              />
              
              <h2><TranslatedText text="6. Links and Third-Party Services" /></h2>
              <p>
                TopApps.store has not reviewed all of the sites linked to its website and is not responsible for the contents 
                of any such linked site. The inclusion of any link does not imply endorsement by TopApps.store of the site. 
                Use of any such linked website is at the user's own risk.
              </p>
              <p>
                <strong><TranslatedText text="Third-Party Liability and Charges:" /></strong> <TranslatedText text="By using TopApps.store, you expressly release us from any and all liability arising from your use of any third-party website, application, or service accessed through links on our site. We have no control over third parties and assume no responsibility for any actions, policies, or practices of any third parties you may encounter through our site." />
              </p>
              <p>
                <strong>IMPORTANT:</strong> TopApps.store is NOT responsible for any charges, subscriptions, or payments that you may incur 
                from third-party websites, applications, or services that you access through our site. This includes any charges for 
                applications, in-app purchases, premium features, subscription services, or any other monetary transactions occurring 
                on third-party platforms. You are solely responsible for reviewing and understanding the terms and conditions of any 
                third-party service before making any purchases or entering into any agreements.
              </p>
              
              <h2>7. Modifications</h2>
              <p>
                TopApps.store may revise these terms of service for its website at any time without notice. By using this 
                website you are agreeing to be bound by the then current version of these terms of service.
              </p>
              
              <h2>8. Sponsored Content and Affiliate Links</h2>
              <p>
                TopApps.store contains sponsored content and affiliate links. This means that if you click on certain links and make a purchase, 
                TopApps.store may receive a commission. This helps us maintain the website and provide you with free access 
                to our app discovery services.
              </p>
              <p>
                <strong>Disclaimer for Sponsored Content:</strong> All sponsored content and advertisements are clearly labeled with "AD" or "SPONSORED" tags. 
                While we strive to work with reputable partners, TopApps.store is not responsible for the content, accuracy, or reliability of 
                any sponsored or affiliate content. We do not endorse any products, services, or information presented in sponsored content, 
                and we are not responsible for any transactions, agreements, or any other interactions between you and our sponsors.
              </p>
              
              <h2>9. App Information and Downloads</h2>
              <p>
                TopApps.store provides information about Android applications and links to download them. We do not host these applications on our servers. 
                All downloads are directed to the original source or official app stores. We are not responsible for the content, 
                functionality, or potential risks associated with the installed applications.
              </p>
              <p>
                <strong>Application Risks and Liabilities:</strong> While we strive to provide accurate information about applications, 
                TopApps.store is not responsible for any damages that may occur from downloading, installing, or using any application 
                found through our service. This includes, but is not limited to, data loss, device damage, malware, unwanted charges, 
                or any other negative consequences that may arise from using third-party applications.
              </p>
              
              <h2>10. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
                submit to the exclusive jurisdiction of the courts in that location.
              </p>
              
              <div className="mt-8 border-t pt-4">
                <p>For more information, please see our:</p>
                <ul className="flex flex-col space-y-2 text-blue-600">
                  <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                  <li><a href="/disclaimer" className="hover:underline">Disclaimer</a></li>
                </ul>
              </div>
            </div>
          </div>
        ) : location === "/privacy-policy" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6"><TranslatedText text="Privacy Policy" /></h1>
            
            <div className="prose max-w-none">
              <p><TranslatedText text="Last updated: May 19, 2025" /></p>
              
              <TranslatedParagraph
                text="At TopApps.store, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website."
              />
              
              <h2><TranslatedText text="1. Information We Collect" /></h2>
              <TranslatedParagraph text="We may collect several types of information from and about users of our website, including:" />
              <ul>
                <li>
                  <strong><TranslatedText text="Usage Data:" /></strong> <TranslatedText text="Information about how you access and use our website, including your IP address, browser type, device information, pages visited, time spent on those pages, and referral sources." />
                </li>
                <li>
                  <strong><TranslatedText text="Cookies and Tracking Data:" /></strong> <TranslatedText text="We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve your browsing experience." />
                </li>
                <li>
                  <strong><TranslatedText text="App Usage Data:" /></strong> <TranslatedText text="Information about which apps you view, download, or interact with on our platform." />
                </li>
              </ul>
              
              <h2><TranslatedText text="2. How We Use Your Information" /></h2>
              <TranslatedParagraph text="We may use the information we collect about you for various purposes, including:" />
              <ul>
                <li><TranslatedText text="To provide and maintain our website" /></li>
                <li><TranslatedText text="To improve our website and user experience" /></li>
                <li><TranslatedText text="To monitor the usage of our website" /></li>
                <li><TranslatedText text="To detect, prevent, and address technical issues" /></li>
                <li><TranslatedText text="To analyze trends and better understand user preferences" /></li>
                <li><TranslatedText text="To deliver relevant app recommendations and advertisements" /></li>
              </ul>
              
              <h2><TranslatedText text="3. Cookie Policy" /></h2>
              <TranslatedParagraph
                text="Cookies are small text files that are placed on your device when you visit our website. We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can set your browser to refuse all or some browser cookies, but this may affect the functionality of our website."
              />
              <TranslatedParagraph
                text="We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until you delete them or they expire)."
              />
              
              <h2><TranslatedText text="4. Third-Party Services, Links and Charges" /></h2>
              <TranslatedParagraph
                text="Our website contains links to third-party websites, applications, and services that are not owned or controlled by TopApps.store. We have no control over and assume no responsibility for the content, privacy policies, data collection practices, or conduct of any third-party websites, applications, or services."
              />
              <p>
                <strong><TranslatedText text="IMPORTANT DISCLAIMER REGARDING THIRD-PARTY CHARGES:" /></strong> <TranslatedText text="TopApps.store is NOT responsible for any fees, charges, subscriptions, or payments that you may incur when using third-party applications, websites, or services accessed through our platform. This includes but is not limited to:" />
              </p>
              <ul>
                <li><TranslatedText text="App purchase costs" /></li>
                <li><TranslatedText text="In-app purchases" /></li>
                <li><TranslatedText text="Subscription fees" /></li>
                <li><TranslatedText text="Premium features" /></li>
                <li><TranslatedText text="Any other monetary transactions" /></li>
              </ul>
              <TranslatedParagraph
                text="We strongly encourage you to carefully review the terms of service, privacy policies, and payment terms of any third-party application or service before downloading, installing, or providing payment information. You are solely responsible for understanding and agreeing to any charges that may apply."
              />
              <TranslatedParagraph
                text="We may use third-party services such as Google Analytics to monitor and analyze the use of our website. These services may collect information sent by your browser as part of a web page request, including your IP address or other identifiers."
              />
              
              <h2><TranslatedText text="5. Sponsored Content and Affiliate Marketing" /></h2>
              <TranslatedParagraph
                text="TopApps.store contains sponsored content and participates in affiliate marketing programs, which means we may receive commissions on actions taken through our links (such as app downloads, purchases, or sign-ups). This helps us maintain our website and provide you with free access to app information."
              />
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
                  <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
                  <li><a href="/disclaimer" className="hover:underline">Disclaimer</a></li>
                </ul>
              </div>
            </div>
          </div>
        ) : location === "/disclaimer" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
            
            <div className="prose max-w-none">
              <TranslatedParagraph text="Last updated: May 19, 2025" />
              
              <h2><TranslatedText text="1. Website Content" /></h2>
              <TranslatedParagraph
                text="The information provided on TopApps.store is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site."
              />
              
              <h2><TranslatedText text="2. External Links and Third Parties" /></h2>
              <TranslatedParagraph
                text="TopApps.store may contain links to external websites, download sources, and third-party services that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites or services."
              />
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-bold text-xl mb-2">
                  <TranslatedText text="IMPORTANT DISCLAIMER" />
                </p>
                <div className="mb-2">
                  <TranslatedParagraph
                    text="TopApps.store is NOT responsible for the actions, content, privacy practices, or conduct of any third parties that users may access through links provided on our website. When you click on a link to a third-party website or service, you are subject to the terms and policies of that third party, not those of TopApps.store."
                  />
                </div>
                <div className="mb-2">
                  <TranslatedParagraph
                    text="WE ARE NOT RESPONSIBLE FOR ANY CHARGES, SUBSCRIPTIONS, OR FEES that you may incur when using third-party applications, websites, or services accessed through our platform. This includes any app purchase costs, in-app purchases, subscription services, premium features, or any other monetary transactions on third-party platforms."
                  />
                </div>
                <div>
                  <TranslatedParagraph
                    text="You are solely responsible for reviewing and understanding the terms and conditions of any third-party service before making any purchases or entering into any agreements. By using our site, you acknowledge this disclaimer and release us from any liability related to third-party charges."
                  />
                </div>
              </div>
              
              <h2><TranslatedText text="3. App Downloads and Sponsored Content" /></h2>
              <TranslatedParagraph
                text="TopApps.store provides information and links to download Android applications. We are not the developers of these applications and we do not host them on our servers. All app downloads are directed to the original source, official app stores, or sponsored download partners."
              />
              <div>
                <TranslatedParagraph
                  text="Sponsored Download Links: Some download links on our site are sponsored and may redirect you to third-party websites or alternative download sources. These sponsored links are clearly labeled with 'AD' or 'SPONSORED' tags. We do not endorse, control, or take responsibility for the content, services, or products offered by these sponsors."
                />
              </div>
              <TranslatedParagraph
                text="We do not guarantee the functionality, safety, or suitability of any app featured on our site. We strongly recommend that users verify the source of any application before downloading and read the app's privacy policy and terms of service."
              />
              
              <h2><TranslatedText text="4. Affiliate Marketing and Monetization" /></h2>
              <TranslatedParagraph
                text="TopApps.store contains affiliate links, sponsored content, and advertisements. This means that if you click on certain links and take actions (such as making a purchase, downloading an app, or signing up for a service), we may receive a commission or other compensation."
              />
              <TranslatedParagraph
                text="While we strive to work with reputable partners, TopApps.store is not responsible for the content, offers, products, services, or information provided by our sponsors or advertisers. We explicitly disclaim all responsibility for:"
              />
              <ul>
                <li><TranslatedText text="The quality or performance of any product or service obtained through sponsored links" /></li>
                <li><TranslatedText text="Any representation made by sponsors or advertisers" /></li>
                <li><TranslatedText text="Any transaction between you and any third-party" /></li>
                <li><TranslatedText text="Any financial obligations, subscriptions, or recurring charges that may result from your interactions with sponsored content" /></li>
              </ul>
              
              <h2><TranslatedText text="5. User Responsibility" /></h2>
              <TranslatedParagraph
                text="Users are responsible for ensuring that any app they download from links provided on TopApps.store is compatible with their device and appropriate for their needs. We recommend reading app reviews and checking system requirements before downloading any application."
              />
              <div>
                <TranslatedParagraph
                  text="Financial Responsibility: Users are solely responsible for any financial decisions, purchases, or subscriptions made through links on our website. You should carefully review all terms, conditions, and payment obligations before entering into any transaction with a third party."
                />
              </div>
              
              <h2><TranslatedText text="6. Limitation of Liability" /></h2>
              <TranslatedParagraph
                text="In no event shall TopApps.store, its owners, directors, employees, or agents be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:"
              />
              <ul>
                <li><TranslatedText text="Your access to or use of or inability to access or use the service" /></li>
                <li><TranslatedText text="Any conduct or content of any third party on the service" /></li>
                <li><TranslatedText text="Any content obtained from the service" /></li>
                <li><TranslatedText text="Unauthorized access, use or alteration of your transmissions or content" /></li>
                <li><TranslatedText text="The download or use of any application featured on our website" /></li>
                <li><TranslatedText text="Any charges, fees, or subscriptions incurred through third-party services" /></li>
                <li><TranslatedText text="Any products or services purchased or obtained through links on our site" /></li>
              </ul>
              
              <h2><TranslatedText text="7. Rights Reserved" /></h2>
              <TranslatedParagraph
                text="All trademarks, logos, and service marks displayed on TopApps.store are the property of their respective owners. References to any products, services, processes, or other information by trade name, trademark, manufacturer, supplier, or otherwise does not constitute or imply endorsement, sponsorship, or recommendation by us."
              />
              
              <h2><TranslatedText text="8. Changes to This Disclaimer" /></h2>
              <TranslatedParagraph
                text="We may update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on this page and updating the 'Last updated' date."
              />
              
              <div className="mt-8 border-t pt-4">
                <TranslatedParagraph text="For more information, please see our:" />
                <ul className="flex flex-col space-y-2 text-blue-600">
                  <li><a href="/terms-of-service" className="hover:underline"><TranslatedText text="Terms of Service" /></a></li>
                  <li><a href="/privacy-policy" className="hover:underline"><TranslatedText text="Privacy Policy" /></a></li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="bg-dark text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">TopApps.store</h3>
              <TranslatedParagraph
                text="Discover and download the best mobile applications all in one place. We aim to provide a simple way for you to find quality apps for your device."
                className="text-gray-400 text-sm max-w-xl"
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="space-x-4 mb-4 md:mb-0">
                  <a href="/terms-of-service" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    <TranslatedText text="Terms of Service" />
                  </a>
                  <a href="/privacy-policy" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    <TranslatedText text="Privacy Policy" />
                  </a>
                  <a href="/disclaimer" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    <TranslatedText text="Disclaimer" />
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    <TranslatedText text="© 2023 TopApps.store. All rights reserved." />
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-xs max-w-3xl mx-auto text-center">
                <strong><TranslatedText text="Affiliate Disclosure:" /></strong> <TranslatedText text="TopApps.store is supported by our users. Some links on our site are affiliate links, which means we may earn a commission if you click on them and make a purchase. This helps us maintain and improve our service. All recommendations are based on genuine app quality and user experience." />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
