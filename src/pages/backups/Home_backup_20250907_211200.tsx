import React, { useState } from 'react';

interface Game {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  isNew: boolean;
  category: string;
  iframe: string;
  controls: Array<{
    key: string;
    action: string;
  }>;
}

const games: Game[] = [
    {
      id: 1,
      title: 'Grow A Garden   Growden Io',
      image: '',
      description: 'Grow a Garden in Growden.io! In Growden.io, you can grow a garden of your dreams and unlock pets to help you grow a garden. You’ll purchase seeds from the shop, plant them on your farm, and nurture them into thriving crops. As your harvest grows, you can gather profits, discover rare finds, and take pride in showcasing your most beautiful fruits along the way. Once you earn $50,000 coins, you can use them to purchase pet eggs, where you have to wait 1 hour to unlock your pets (dogs, capybaras, r',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/grow-a-garden---growden-io/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 2,
      title: 'Idle Transport Tycoon Eqf',
      image: 'https://imgs.crazygames.com/idle-transport-tycoon-eqf_16x9/20250829043556/idle-transport-tycoon-eqf_16x9-cover?metadata=none&quality=85&width=273&fit=crop',
      description: 'Idle Transport Tycoon is a strategic idle game that puts you in charge of building a thriving transport empire. You’ll unlock new countries, link airports, and expand your network across the globe. By assembling a powerful fleet of airplanes and managing passenger flow, you shape the growth of a bustling aviation empire step by step.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/idle-transport-tycoon-eqf/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 3,
      title: 'Truck Hit Hero Isekai Arena',
      image: '',
      description: 'Truck-Hit Hero: Isekai Arena is a 2D RPG platformer inspired by classic isekai tales, where an ordinary guy wakes up in a new world as a hero. Battle through 12+ unique arenas filled with traps and enemies, mastering 30+ active abilities with swords, spears, crossbows, and magic. Collect loot, upgrade gear, and craft powerful builds to survive challenging waves of monsters and become the ultimate arena champion.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/truck-hit-hero-isekai-arena/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 4,
      title: 'Mad Guns   Battle Royale Ndd',
      image: 'https://imgs.crazygames.com/mad-guns---battle-royale-ndd_16x9/20250901024035/mad-guns---battle-royale-ndd_16x9-cover?metadata=none&quality=85&width=273&fit=crop',
      description: 'Crazy Pixel Shooter is a wacky royal battle where chaos rules and anything can be a weapon. Arm yourself with bananas, handbags, or even hamster guns as you take on zombies, giant turkeys, and wild octopuses in outrageous online modes. Explore unique maps, craft your own levels, and fight to save Mr. Cat in this explosive pixel showdown.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/mad-guns---battle-royale-ndd/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 5,
      title: 'Mr Racer Stunt Mania',
      image: 'https://imgs.crazygames.com/mr-racer-stunt-mania_16x9/20250820054755/mr-racer-stunt-mania_16x9-cover?metadata=none&quality=85&width=273&fit=crop',
      description: 'MR RACER Stunt Mania is a thrilling 3D arcade racer that blends high-speed action with jaw-dropping stunts. Tackle challenging tracks filled with ramps, obstacles, and fierce AI rivals as you unlock cars, upgrade performance, and master unique environments. With smooth controls, vibrant visuals, and endless level-based challenges, it delivers a racing experience that’s both casual and competitive.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/mr-racer-stunt-mania/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 6,
      title: 'Noob Digger Pro Drill Miner Cal',
      image: '',
      description: 'Noob Digger: Pro Drill Miner is a thrilling mining adventure where you pilot a powerful drill deep into the earth in search of treasures and secrets. Unearth valuable resources, trade for upgrades, and uncover mysterious bunkers to assemble the legendary Super Drill. Dig not just for riches—but to rebuild your dream home and win back your lost love.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/noob-digger-pro-drill-miner-cal/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 7,
      title: 'Heroes Of The Arena',
      image: 'https://imgs.crazygames.com/heroes-of-the-arena_16x9/20250901051300/heroes-of-the-arena_16x9-cover?metadata=none&quality=85&width=273&fit=crop',
      description: 'Heroes of the Arena is an RPG game where you create your own hero and forge a path through battles and adventure. You’ll team up with allies, face powerful enemies, and shape your journey by enhancing skills, unlocking pets, and joining epic clan wars. Every choice you make pushes you closer to becoming a legend.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/heroes-of-the-arena/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 8,
      title: 'Sweety Ludo',
      image: 'https://imgs.crazygames.com/sweety-ludo_16x9/20241016161929/sweety-ludo_16x9-cover?metadata=none&quality=85&width=273&fit=crop',
      description: 'Sweety Ludo is a charming blend of the traditional Ludo game with adorable 2D visuals. Challenge friends or global players in exciting multiplayer matches to collect candies and reign supreme!',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/sweety-ludo/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 9,
      title: 'Simply Prop Hunt',
      image: '',
      description: 'Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take turns disguising themselves as everyday objects or hunting down hidden props. As a prop, your goal is to blend seamlessly into the environment and avoid detection. As a hunter, you’ll need sharp eyes and quick reflexes to uncover the sneakiest disguises before time runs out. With fast and unpredictable rounds, every match is a new challenge. Outsmart your opponents, stay hidden until the final whist',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/simply-prop-hunt/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    },
    {
      id: 10,
      title: 'Space Waves',
      image: '',
      description: 'Space Waves is an arcade game where you need to control an arrow to avoid obstacles until you get to the end. There are 33 levels to the game, and you can choose any level you want to play at any time. All levels vary in difficulty and are labeled accordingly with faces; this way you get to decide how courageous you want to be.',
      features: [
        '在线游戏',
        '免费游戏'
      ],
      isNew: true,
      category: '其他',
      iframe: 'https://games.crazygames.com/en_US/space-waves/index.html',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        }
      ]
    }
  ];

const Home: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Street Racer Games</h1>
        <p>Discover amazing games and start playing instantly!</p>
      </div>
      
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card" onClick={() => handleGameClick(game)}>
            <div className="game-image">
              <img src={game.image} alt={game.title} />
              {game.isNew && <span className="new-badge">NEW</span>}
            </div>
            <div className="game-info">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-features">
                {game.features.map((feature: string, index: number) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              <div className="game-category">
                <span className="category-tag">{game.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="game-modal">
          <div className="game-modal-content">
            <div className="game-modal-header">
              <h2>{selectedGame.title}</h2>
              <button className="close-button" onClick={handleCloseGame}>×</button>
            </div>
            <div className="game-modal-body">
              <div className="game-iframe-container">
                {selectedGame.iframe.includes('<iframe') ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedGame.iframe }} />
                ) : (
                  <iframe
                    src={selectedGame.iframe}
                    title={selectedGame.title}
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                    allow="gamepad *;"
                  />
                )}
              </div>
              <div className="game-controls">
                <h3>Controls:</h3>
                <ul>
                  {selectedGame.controls.map((control: { key: string; action: string }, index: number) => (
                    <li key={index}>
                      <strong>{control.key}:</strong> {control.action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;