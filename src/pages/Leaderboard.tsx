import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, Clock, Target, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  time: string;
  game: string;
  rank: number;
  avatar: string;
  country: string;
  achievements: string[];
  lastPlayed: string;
}

interface GameStats {
  gameName: string;
  totalPlayers: number;
  averageScore: number;
  bestTime: string;
  topPlayer: string;
}

function Leaderboard() {
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const leaderboardData: LeaderboardEntry[] = [
    {
      id: 1,
      playerName: 'SpeedDemon99',
      score: 125000,
      time: '1:23.45',
      game: 'Turbo Racing 3',
      rank: 1,
      avatar: '🏎️',
      country: '🇺🇸',
      achievements: ['Speed King', 'Perfect Lap', 'Turbo Master'],
      lastPlayed: '2 hours ago'
    },
    {
      id: 2,
      playerName: 'DriftKing',
      score: 118500,
      time: '1:25.12',
      game: 'Drift Hunters',
      rank: 2,
      avatar: '🌪️',
      country: '🇯🇵',
      achievements: ['Drift Master', 'Combo King', 'Style Points'],
      lastPlayed: '4 hours ago'
    },
    {
      id: 3,
      playerName: 'FormulaPro',
      score: 112000,
      time: '1:26.78',
      game: 'Formula Racing 3D',
      rank: 3,
      avatar: '🏁',
      country: '🇬🇧',
      achievements: ['Pole Position', 'Smooth Operator', 'Speed Demon'],
      lastPlayed: '1 day ago'
    },
    {
      id: 4,
      playerName: 'HillClimber',
      score: 108750,
      time: '2:15.30',
      game: 'Hill Climb Racing',
      rank: 4,
      avatar: '⛰️',
      country: '🇦🇺',
      achievements: ['Mountain Climber', 'Coin Collector', 'Physics Master'],
      lastPlayed: '3 hours ago'
    },
    {
      id: 5,
      playerName: 'StuntMaster',
      score: 105200,
      time: '0:28.45',
      game: 'Moto X3M',
      rank: 5,
      avatar: '🤸',
      country: '🇧🇷',
      achievements: ['Stunt Master', 'Speed Racer', 'Crash Survivor'],
      lastPlayed: '6 hours ago'
    },
    {
      id: 6,
      playerName: 'CityRacer',
      score: 102300,
      time: '1:28.90',
      game: 'City Racing 3D',
      rank: 6,
      avatar: '🏙️',
      country: '🇩🇪',
      achievements: ['Urban Legend', 'Traffic Master', 'Night Rider'],
      lastPlayed: '5 hours ago'
    },
    {
      id: 7,
      playerName: 'NeonRider',
      score: 99500,
      time: '1:30.15',
      game: 'Neon Drive',
      rank: 7,
      avatar: '💫',
      country: '🇰🇷',
      achievements: ['Cyberpunk', 'Power Collector', 'Obstacle Master'],
      lastPlayed: '1 day ago'
    },
    {
      id: 8,
      playerName: 'RallyChamp',
      score: 96800,
      time: '1:32.45',
      game: 'Rally Point 3',
      rank: 8,
      avatar: '🏆',
      country: '🇫🇮',
      achievements: ['Rally Master', 'Weather Warrior', 'Terrain King'],
      lastPlayed: '2 days ago'
    },
    {
      id: 9,
      playerName: 'OffRoader',
      score: 94100,
      time: '1:35.20',
      game: 'Buggy Off-Road Racing',
      rank: 9,
      avatar: '🚙',
      country: '🇨🇦',
      achievements: ['Desert King', 'Rock Crawler', 'Sand Master'],
      lastPlayed: '4 hours ago'
    },
    {
      id: 10,
      playerName: 'CartoonRacer',
      score: 91500,
      time: '1:37.80',
      game: 'Cartoon Mini Racing',
      rank: 10,
      avatar: '🎮',
      country: '🇫🇷',
      achievements: ['Family Fun', 'Color Master', 'Casual King'],
      lastPlayed: '3 days ago'
    }
  ];

  const gameStats: GameStats[] = [
    {
      gameName: 'Turbo Racing 3',
      totalPlayers: 15420,
      averageScore: 87500,
      bestTime: '1:23.45',
      topPlayer: 'SpeedDemon99'
    },
    {
      gameName: 'Drift Hunters',
      totalPlayers: 12350,
      averageScore: 82000,
      bestTime: '1:25.12',
      topPlayer: 'DriftKing'
    },
    {
      gameName: 'Formula Racing 3D',
      totalPlayers: 18750,
      averageScore: 78000,
      bestTime: '1:26.78',
      topPlayer: 'FormulaPro'
    },
    {
      gameName: 'Hill Climb Racing',
      totalPlayers: 22100,
      averageScore: 65000,
      bestTime: '2:15.30',
      topPlayer: 'HillClimber'
    },
    {
      gameName: 'Moto X3M',
      totalPlayers: 16800,
      averageScore: 72000,
      bestTime: '0:28.45',
      topPlayer: 'StuntMaster'
    }
  ];

  const filteredData = leaderboardData.filter(entry => {
    const gameMatch = selectedGame === 'all' || entry.game === selectedGame;
    const timeMatch = timeFilter === 'all' || 
      (timeFilter === 'today' && entry.lastPlayed.includes('hour')) ||
      (timeFilter === 'week' && (entry.lastPlayed.includes('day') || entry.lastPlayed.includes('hour')));
    return gameMatch && timeMatch;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-700';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600"
          alt="Leaderboard"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <Trophy className="inline-block w-12 h-12 mr-4 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Compete with the best racers worldwide. See who's dominating the tracks!
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Game Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameStats.map((stat, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">{stat.gameName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Players:</span>
                    <span className="text-white font-bold">{stat.totalPlayers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Score:</span>
                    <span className="text-white font-bold">{stat.averageScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Time:</span>
                    <span className="text-red-500 font-bold">{stat.bestTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Player:</span>
                    <span className="text-yellow-500 font-bold">{stat.topPlayer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Game:</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              >
                <option value="all">All Games</option>
                <option value="Turbo Racing 3">Turbo Racing 3</option>
                <option value="Drift Hunters">Drift Hunters</option>
                <option value="Formula Racing 3D">Formula Racing 3D</option>
                <option value="Hill Climb Racing">Hill Climb Racing</option>
                <option value="Moto X3M">Moto X3M</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time Period:</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Top Players</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Player</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Game</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Achievements</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Played</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData.map((entry) => (
                    <tr key={entry.id} className={`hover:bg-gray-700 transition-colors ${getRankColor(entry.rank)}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{entry.avatar}</span>
                          <div>
                            <div className="font-bold text-white">{entry.playerName}</div>
                            <div className="text-sm text-gray-400">{entry.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{entry.game}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="font-bold text-white">{entry.score.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-red-500 font-bold">{entry.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {entry.achievements.slice(0, 2).map((achievement, index) => (
                            <span key={index} className="bg-gray-600 text-xs px-2 py-1 rounded">
                              {achievement}
                            </span>
                          ))}
                          {entry.achievements.length > 2 && (
                            <span className="text-gray-400 text-xs">+{entry.achievements.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{entry.lastPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start playing now and see if you can make it to the top of the leaderboard!
          </p>
          <button 
            className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-bold transition-colors"
            onClick={() => {
              const gamesSection = document.getElementById('games');
              gamesSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Play Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Leaderboard;



