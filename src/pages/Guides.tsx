import React, { useState } from 'react';
import { ChevronRight, Trophy, Clock, Target, Zap, Star } from 'lucide-react';

interface GameGuide {
  id: number;
  title: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  category: string;
  tips: string[];
  strategies: string[];
  controls: { key: string; action: string }[];
  achievements: { name: string; description: string; icon: string }[];
}

function Guides() {
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);

  const gameGuides: GameGuide[] = [
    {
      id: 1,
      title: 'Turbo Racing 3 - Complete Guide',
      image: '/night-city-racing-cover.avif',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      category: 'City Racing',
      tips: [
        'Master the art of drifting around sharp corners to maintain speed',
        'Use turbo boost strategically - save it for straight sections',
        'Learn the traffic patterns to anticipate vehicle movements',
        'Practice the Shanghai track layout to memorize optimal racing lines',
        'Use the handbrake for tight turns and quick direction changes'
      ],
      strategies: [
        'Start with conservative driving to learn the track layout',
        'Focus on maintaining momentum through corners rather than braking hard',
        'Use turbo boost on long straight sections for maximum effect',
        'Study AI opponent behavior to predict their moves',
        'Practice the final lap multiple times to perfect your approach'
      ],
      controls: [
        { key: 'Arrow Keys', action: 'Steering and acceleration' },
        { key: 'X', action: 'Turbo boost activation' },
        { key: 'Space', action: 'Emergency brake' }
      ],
      achievements: [
        { name: 'Speed Demon', description: 'Complete a lap under 45 seconds', icon: '🏁' },
        { name: 'Traffic Master', description: 'Finish without hitting any vehicles', icon: '🚗' },
        { name: 'Turbo King', description: 'Use turbo boost 10 times in one race', icon: '⚡' }
      ]
    },
    {
      id: 2,
      title: 'Drift Hunters - Drifting Mastery',
      image: '/car-racing.webp',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      category: 'Drift Racing',
      tips: [
        'Start with lower speed to learn the drift mechanics',
        'Use the handbrake to initiate drifts, then counter-steer',
        'Maintain throttle control during long drifts',
        'Practice on different car models to find your preferred style',
        'Watch your drift angle - too sharp loses speed, too shallow loses points'
      ],
      strategies: [
        'Begin with the tutorial mode to understand scoring system',
        'Focus on maintaining consistent drift chains for higher scores',
        'Learn to link drifts together for combo multipliers',
        'Experiment with different entry speeds for various corners',
        'Master the art of counter-steering to control drift direction'
      ],
      controls: [
        { key: 'Arrow Keys', action: 'Steering and acceleration' },
        { key: 'Space', action: 'Handbrake for drift initiation' },
        { key: 'Shift', action: 'Nitro boost for speed bursts' }
      ],
      achievements: [
        { name: 'Drift Master', description: 'Achieve 1000+ points in a single drift', icon: '🌪️' },
        { name: 'Combo King', description: 'Link 5 consecutive drifts', icon: '🔗' },
        { name: 'Speed Drifter', description: 'Complete a drift at 100+ mph', icon: '💨' }
      ]
    },
    {
      id: 3,
      title: 'Hill Climb Racing - Physics Mastery',
      image: '/uphill-climb.webp',
      difficulty: 'Beginner',
      estimatedTime: '10-15 minutes',
      category: 'Physics Racing',
      tips: [
        'Balance your car carefully on steep inclines',
        'Use momentum to overcome obstacles rather than brute force',
        'Collect coins for vehicle upgrades - they make a huge difference',
        'Learn to use the handbrake for controlled descents',
        'Practice on different terrains to understand physics variations'
      ],
      strategies: [
        'Start with the basic car and gradually upgrade components',
        'Focus on engine upgrades first for better acceleration',
        'Learn the optimal speed for each type of terrain',
        'Use the landscape to your advantage for jumps and momentum',
        'Don\'t rush - patience often leads to better results'
      ],
      controls: [
        { key: 'Arrow Keys', action: 'Acceleration and braking' },
        { key: 'Space', action: 'Handbrake for controlled stops' },
        { key: 'Shift', action: 'Nitro boost for extra power' }
      ],
      achievements: [
        { name: 'Mountain Climber', description: 'Reach the top of Mountain track', icon: '⛰️' },
        { name: 'Coin Collector', description: 'Collect 100 coins in a single run', icon: '🪙' },
        { name: 'Physics Master', description: 'Complete 5 tracks without flipping', icon: '⚖️' }
      ]
    },
    {
      id: 4,
      title: 'Formula Racing 3D - Precision Driving',
      image: '/3d-formula.jpg',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      category: 'Formula Racing',
      tips: [
        'Master the racing line - outside, inside, outside through corners',
        'Use smooth steering inputs to maintain traction',
        'Brake in a straight line before entering corners',
        'Learn to trail brake for better corner entry speed',
        'Practice throttle control on corner exits'
      ],
      strategies: [
        'Study each track layout before attempting time trials',
        'Focus on consistency rather than speed initially',
        'Use the ghost car feature to compare your lines',
        'Practice the Monaco track for technical driving skills',
        'Learn to read the track surface for optimal grip'
      ],
      controls: [
        { key: 'Arrow Keys', action: 'Steering and acceleration' },
        { key: 'Space', action: 'Brake pedal' },
        { key: 'Shift', action: 'Turbo boost for straight sections' }
      ],
      achievements: [
        { name: 'Pole Position', description: 'Set the fastest lap time', icon: '🥇' },
        { name: 'Smooth Operator', description: 'Complete a lap without any corrections', icon: '🎯' },
        { name: 'Speed Demon', description: 'Reach 200+ mph on a straight', icon: '🏎️' }
      ]
    },
    {
      id: 5,
      title: 'Moto X3M - Stunt Mastery',
      image: '/uphill-climb.webp',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      category: 'Stunt Racing',
      tips: [
        'Learn to control your bike in mid-air for better landings',
        'Use the ramps to gain height and distance',
        'Practice wheelies and stoppies for style points',
        'Time your jumps to avoid obstacles and hazards',
        'Master the art of controlled crashes to minimize damage'
      ],
      strategies: [
        'Start with easier tracks to learn basic bike physics',
        'Focus on completing levels first, then work on speed',
        'Use the rewind feature to practice difficult sections',
        'Learn to use the bike\'s momentum to your advantage',
        'Practice different landing techniques for various surfaces'
      ],
      controls: [
        { key: 'Arrow Keys', action: 'Balance and steering' },
        { key: 'Space', action: 'Accelerate and wheelie' },
        { key: 'Shift', action: 'Brake and stoppie' }
      ],
      achievements: [
        { name: 'Stunt Master', description: 'Perform 10 different stunts', icon: '🤸' },
        { name: 'Speed Racer', description: 'Complete a level in under 30 seconds', icon: '⚡' },
        { name: 'Crash Survivor', description: 'Complete 5 levels without major crashes', icon: '🛡️' }
      ]
    }
  ];

  const selectedGuideData = selectedGuide ? gameGuides.find(guide => guide.id === selectedGuide) : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900';
      case 'Advanced': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600"
          alt="Game Guides"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Game <span className="text-red-500">Guides</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Master every racing game with our comprehensive guides. From beginner tips to advanced strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Game</h2>
            <p className="text-gray-400">Select a game to view detailed guides, tips, and strategies.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameGuides.map((guide) => (
              <div 
                key={guide.id} 
                className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setSelectedGuide(guide.id)}
              >
                <div className="relative">
                  <img src={guide.image} alt={guide.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gray-900 bg-opacity-75 px-3 py-1 rounded-full text-sm">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                  <div className="flex items-center text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{guide.estimatedTime}</span>
                  </div>
                  <div className="flex items-center text-red-500 hover:text-red-400">
                    <span>View Guide</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Modal */}
      {selectedGuide && selectedGuideData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedGuideData.title}</h3>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(selectedGuideData.difficulty)}`}>
                    {selectedGuideData.difficulty}
                  </span>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{selectedGuideData.estimatedTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-8">
                {/* Tips Section */}
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-500" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-2">
                    {selectedGuideData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-3 mt-1">•</span>
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategies Section */}
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Advanced Strategies
                  </h4>
                  <ul className="space-y-2">
                    {selectedGuideData.strategies.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-3 mt-1">•</span>
                        <span className="text-gray-300">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Controls Section */}
                <div>
                  <h4 className="text-xl font-bold mb-4">Controls</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGuideData.controls.map((control, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="bg-gray-700 p-2 rounded min-w-[100px] text-center">
                          <span className="text-gray-300 font-mono">{control.key}</span>
                        </div>
                        <span className="text-gray-300">{control.action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements Section */}
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Achievements to Unlock
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGuideData.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{achievement.icon}</span>
                          <h5 className="font-bold text-white">{achievement.name}</h5>
                        </div>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guides;



