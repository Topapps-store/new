import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing our website TopApps.store, you agree to be bound by these Terms and Conditions and all applicable 
          laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
        
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on TopApps.store for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
          under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software contained on TopApps.store</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
        
        <h2>3. Disclaimer</h2>
        <p>
          The materials on TopApps.store are provided on an 'as is' basis. TopApps.store makes no warranties, 
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
          of intellectual property or other violation of rights.
        </p>
        
        <h2>4. Limitations</h2>
        <p>
          In no event shall TopApps.store or its suppliers be liable for any damages (including, without limitation, 
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability to 
          use the materials on TopApps.store, even if TopApps.store or a TopApps.store authorized representative has 
          been notified orally or in writing of the possibility of such damage.
        </p>
        
        <h2>5. Accuracy of Materials</h2>
        <p>
          The materials appearing on TopApps.store could include technical, typographical, or photographic errors. 
          TopApps.store does not warrant that any of the materials on its website are accurate, complete or current. 
          TopApps.store may make changes to the materials contained on its website at any time without notice. However 
          TopApps.store does not make any commitment to update the materials.
        </p>
        
        <h2>6. Links</h2>
        <p>
          TopApps.store has not reviewed all of the sites linked to its website and is not responsible for the contents 
          of any such linked site. The inclusion of any link does not imply endorsement by TopApps.store of the site. 
          Use of any such linked website is at the user's own risk.
        </p>
        
        <h2>7. Modifications</h2>
        <p>
          TopApps.store may revise these terms of service for its website at any time without notice. By using this 
          website you are agreeing to be bound by the then current version of these terms of service.
        </p>
        
        <h2>8. Affiliate Disclosure</h2>
        <p>
          TopApps.store contains affiliate links. This means that if you click on certain links and make a purchase, 
          TopApps.store may receive a commission. This helps us maintain the website and provide you with free access 
          to our app download services. All affiliate links are clearly labeled with "AD" or "SPONSORED" tags.
        </p>
        
        <h2>9. App Downloads</h2>
        <p>
          TopApps.store provides links to download Android applications. We do not host these applications on our servers. 
          All downloads are directed to the original source or official app stores. We are not responsible for the content, 
          functionality, or potential risks associated with the installed applications.
        </p>
        
        <h2>10. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
          submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
