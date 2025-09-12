import React from 'react';

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-400">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. No Data Collection</h2>
            <p className="mb-4">At Iknowwhatyoufuture, we are committed to your privacy. We do not:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Collect personal information</li>
              <li>Track user behavior</li>
              <li>Use cookies for tracking</li>
              <li>Store any user data</li>
              <li>Share information with third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Browser Storage</h2>
            <p className="mb-4">Our games operate entirely within your browser:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Use only temporary browser storage for game functionality</li>
              <li>Clear all data when you close your browser</li>
              <li>Don't persist any information between sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Content</h2>
            <p>Our website may include:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Embedded game frames from trusted gaming platforms</li>
              <li>Images from secure content delivery networks</li>
              <li>Standard web fonts and icons</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Children's Privacy</h2>
            <p>Our service:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Is suitable for all ages</li>
              <li>Doesn't collect any user information</li>
              <li>Doesn't require account creation</li>
              <li>Doesn't enable user-to-user communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access our services without providing personal information</li>
              <li>Play our games anonymously</li>
              <li>Clear your browser data at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Updates to Policy</h2>
            <p>Any changes to this privacy policy will be posted on this page with an updated revision date.</p>
          </section>

          <section className="border-t border-gray-800 pt-8 mt-12">
            <p className="text-sm">Last updated: February 15, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;