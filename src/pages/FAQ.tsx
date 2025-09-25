import React from 'react';

function FAQ() {
  const faqs = [
    {
      question: "How do I start playing the games?",
      answer: "Simply click on the 'Play Now' button on any game card. The game will open in a full-screen modal where you can start playing immediately. No downloads or installations required!"
    },
    {
      question: "Are the games free to play?",
      answer: "Yes, all our games are completely free to play directly in your browser."
    },
    {
      question: "What are the system requirements?",
      answer: "Our games are browser-based and work on most modern devices. You need a stable internet connection and an updated web browser (Chrome, Firefox, Safari, or Edge recommended)."
    },
    {
      question: "Can I play on mobile devices?",
      answer: "Yes, our games are optimized for both desktop and mobile devices. However, the experience might vary depending on your device and screen size."
    },
    {
      question: "How do I save my progress?",
      answer: "Game progress is automatically saved in your browser. Make sure not to clear your browser data if you want to keep your progress."
    },
    {
      question: "Is there multiplayer support?",
      answer: "Some of our games feature multiplayer modes. Check the game description for specific features."
    },
    {
      question: "How do I report a bug?",
      answer: "If you encounter any issues, please contact our support team through the contact form or email us at support@streetracers.com."
    },
    {
      question: "Are there regular updates?",
      answer: "Yes, we regularly update our games with new features, improvements, and bug fixes. Keep an eye on our game hub for the latest updates."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;