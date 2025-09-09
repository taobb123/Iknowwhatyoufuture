export interface Game {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  isNew: boolean;
  iframe: string;
  controls: { key: string; action: string }[];
  category?: string;
  playCount?: number;
  likes?: number;
  favorites?: number;
  duration?: string;
}

export const games: Game[] = [
  {
    id: 1,
    title: "Truck Hit Hero: Isekai Arena",
    image: "https://imgs.crazygames.com/truck-hit-hero-isekai-arena_16x9/20250828051212/truck-hit-hero-isekai-arena_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Truck-Hit Hero: Isekai Arena is a 2D RPG platformer inspired by classic isekai tales, where an...",
    features: ["Move = arrow left-right keys or AD", "Jump = spacebar", "Attack = Left mouse button", "Skills = 1, 2, 3, 4", "Interact = E"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/truck-hit-hero-isekai-arena/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "adventure",
    playCount: 0,
    likes: 1094,
    favorites: 1094,
    duration: "5-10 分钟"
  },
  {
    id: 2,
    title: "Simply Prop Hunt",
    image: "https://imgs.crazygames.com/simply-prop-hunt_16x9/20250826074007/simply-prop-hunt_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take...",
    features: ["WASD / arrow keys = move", "Left-click = attack", "Move mouse = look around", "Mouse scroll = zoom in / out", "Space = jump / fly with jet (when playing as Hunter)", "3, 4, 5 = select power-up", "E = activate selected power-up", "P = pause menu"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/simply-prop-hunt/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "io",
    playCount: 0,
    likes: 5032,
    favorites: 5032,
    duration: "5-10 分钟"
  },
  {
    id: 3,
    title: "Mad GunS - Battle Royale",
    image: "https://imgs.crazygames.com/mad-guns---battle-royale-ndd_16x9/20250901024035/mad-guns---battle-royale-ndd_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Crazy Pixel Shooter is a wacky royal battle where chaos rules and anything can be a weapon. Arm...",
    features: ["WASD = move", "R = reload", "Left click = shoot", "Tab = menu"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/mad-guns---battle-royale-ndd/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "AIM"}, {"key": "Left Click", "action": "SHOOT"}, {"key": "WASD", "action": "MOVE"}],
    category: "shooting",
    playCount: 0,
    likes: 6262,
    favorites: 6262,
    duration: "5-10 分钟"
  },
  {
    id: 4,
    title: "456 Guys",
    image: "https://imgs.crazygames.com/456-guys_16x9/20250820070334/456-guys_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "456 Guys is a massive multiplayer survival game where up to 456 players compete through...",
    features: ["Move = WASD", "Walk = hold left shift", "Jump = space", "Push = E", "Emotes = [1][2][3][4]", "Quick Chat = Tab", "Exit Mouse Look &amp; return mouse pointer to screen = ESC"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/456-guys/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "casual",
    playCount: 0,
    likes: 5796,
    favorites: 5796,
    duration: "5-10 分钟"
  },
  {
    id: 5,
    title: "Fragen",
    image: "https://imgs.crazygames.com/fragen_16x9/20250620035208/fragen_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Fragen is an intense shooting FPS game where you face adrenaline-filled battles on your own or in a...",
    features: ["WASD = move", "Left mouse = shooting", "Right mouse = aim", "G =grenade", "H = use first aid kit", "C = squat", "Space =jump", "Tab = menu"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/fragen/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "shooting",
    playCount: 0,
    likes: 77803,
    favorites: 77803,
    duration: "5-10 分钟"
  },
  {
    id: 6,
    title: "Noob Digger: Pro Drill Miner",
    image: "https://imgs.crazygames.com/noob-digger-pro-drill-miner-cal_16x9/20250902025621/noob-digger-pro-drill-miner-cal_16x9-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Noob Digger: Pro Drill Miner is a thrilling mining adventure where you pilot a powerful drill deep...",
    features: ["WASD or arrow keys = move", "E or left click = interact", "F = nitro ( in mine )"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/noob-digger-pro-drill-miner-cal/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "adventure",
    playCount: 0,
    likes: 10158,
    favorites: 10158,
    duration: "5-10 分钟"
  },
  {
    id: 7,
    title: "Cell to Singularity: Mesozoic Valley",
    image: "https://imgs.crazygames.com/games/cell-to-singularity-mesozoic-valley/cover_16x9-1719334258708.png?metadata=none&quality=85&width=273&fit=crop",
    description: "Cell to Singularity: Mesozoic Valley is a clicker science-based idle game where you get to delve...",
    features: ["Use the left mouse button to click, collect, and play the game."],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/cell-to-singularity-mesozoic-valley/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "other",
    playCount: 0,
    likes: 26256,
    favorites: 26256,
    duration: "5-10 分钟"
  },
  {
    id: 8,
    title: "Simply Prop Hunt",
    image: "https://imgs.crazygames.com/simply-prop-hunt_2x3/20250826074007/simply-prop-hunt_2x3-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take...",
    features: ["WASD / arrow keys = move", "Left-click = attack", "Move mouse = look around", "Mouse scroll = zoom in / out", "Space = jump / fly with jet (when playing as Hunter)", "3, 4, 5 = select power-up", "E = activate selected power-up", "P = pause menu"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/simply-prop-hunt/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "io",
    playCount: 0,
    likes: 5032,
    favorites: 5032,
    duration: "5-10 分钟"
  },
  {
    id: 9,
    title: "Space Waves",
    image: "https://imgs.crazygames.com/space-waves_2x3/20241203031650/space-waves_2x3-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Space Waves is an arcade game where you need to control an arrow to avoid obstacles until you get...",
    features: ["在线游戏", "免费游戏"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/space-waves/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "casual",
    playCount: 0,
    likes: 3128884,
    favorites: 3128884,
    duration: "5-10 分钟"
  },
  {
    id: 10,
    title: "Bit Gun.io",
    image: "https://imgs.crazygames.com/bit-gun-io_2x3/20250818143525/bit-gun-io_2x3-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Bit Gun.io is a fast-paced multiplayer FPS where you test your tactical skills in intense 5v5...",
    features: ["WASD = move", "Space = jump", "Mouse Left-click = shoot", "Mouse Right-click = aim", "P = leaderboard, pause and settings", "G = pick up the gun", "C = crouch", "Shift = run"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/bit-gun-io/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "AIM"}, {"key": "Left Click", "action": "SHOOT"}, {"key": "WASD", "action": "MOVE"}],
    category: "shooting",
    playCount: 0,
    likes: 75931,
    favorites: 75931,
    duration: "5-10 分钟"
  },
  {
    id: 11,
    title: "EvoWars.io",
    image: "https://imgs.crazygames.com/games/evowarsio/cover_2x3-1736776369475.png?metadata=none&quality=85&width=273&fit=crop",
    description: "EvoWars.io is an IO battle game set in a top-down online battle arena. Collect orbs and battle...",
    features: ["Move your mouse = control the character&#39;s movement", "Left-click = attack", "Right-click / shift = sprint", "Space = use emoji"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/evowarsio/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "AIM"}, {"key": "Left Click", "action": "SHOOT"}, {"key": "WASD", "action": "MOVE"}],
    category: "io",
    playCount: 0,
    likes: 2134932,
    favorites: 2134932,
    duration: "5-10 分钟"
  },
  {
    id: 12,
    title: "Escape From Prison Multiplayer",
    image: "https://imgs.crazygames.com/escape-from-prison-multiplayer_2x3/20250120074825/escape-from-prison-multiplayer_2x3-cover?metadata=none&quality=85&width=273&fit=crop",
    description: "Escape From Prison Multiplayer is a thrilling multiplayer platformer game where your mission is to...",
    features: ["WASD / arrow keys = move", "Space = jump"],
    isNew: true,
    iframe: `<iframe src=\"https://games.crazygames.com/en_US/escape-from-prison-multiplayer/index.html\" style=\"width: 100%; height: 100%;\" frameborder=\"0\" allow=\"gamepad *;\"></iframe>`,
    controls: [{"key": "Mouse", "action": "INTERACT"}, {"key": "Click", "action": "PLAY"}, {"key": "Arrow Keys", "action": "MOVE"}],
    category: "action",
    playCount: 0,
    likes: 139576,
    favorites: 139576,
    duration: "5-10 分钟"
  }
];


