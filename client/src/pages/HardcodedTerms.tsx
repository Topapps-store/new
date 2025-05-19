import React from 'react';

const HardcodedTerms = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: May 19, 2025</p>
        
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
      </div>
    </div>
  );
};

export default HardcodedTerms;