# Iknowwhatyoufuture - Browser Racing Game Portal

## 🌟 Introduction

Iknowwhatyoufuture is a modern, responsive web template for creating a gaming portal with iframe game embedding, blog system, and SEO optimization. Built with React, TypeScript, and Tailwind CSS.

### Online Demo: https://streetracer.online

![landing page](banner.png)

## ✨ Features

- 🎮 Easy game integration via iframes
- 🎯 Customizable game cards and descriptions
- 📱 Fully responsive design for all devices
- 🌙 Dark theme optimized for gaming
- ⚡ Performance-first architecture
- 🎨 Modern UI with smooth animations
- 🖥️ Fullscreen game support
- 📰 Built-in blog system with Markdown
- 🔍 SEO optimized
- 📄 FAQ and policy pages included
- 🌐 Internationalization ready

## 🛠️ Tech Stack

- React 18
- TypeScript 5
- Tailwind CSS 3
- Vite 5
- React Router 6
- Lucide Icons
- Markdown Support

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone git@github.com:zhangchenchen/street-racer.git
```

2. Install dependencies:
```bash
cd street-racer
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 📝 Customizing Games

Add your games by modifying the `games` array in `src/pages/Home.tsx`:

```typescript
const games = [
  {
    id: 1,
    title: "Game Title",
    description: "Game description",
    image: "/game-image.webp",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    isNew: true,
    iframe: '<iframe src="game-url" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
    controls: [
      {
        key: "←↓↑→",
        action: "DRIVING"
      },
      {
        key: "SPACE",
        action: "BRAKE"
      }
    ]
  }
];
```

## 📚 Blog System

Blog posts are stored in `src/blog-posts` directory using Markdown format:

```markdown
---
title: "Article Title"
date: "2025-02-15"
category: "Category"
image: "/article-image.webp"
excerpt: "Article excerpt..."
---

Article content...
```

## 🔧 Configuration

### SEO Optimization
- Update `public/sitemap.xml` for site mapping
- Edit `public/robots.txt` for crawler rules
- Modify meta tags in `index.html`

### Styling
- Customize theme in `tailwind.config.js`
- Add custom CSS in `src/styles`

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Built files will be in the `dist` directory.

## 🌐 Deployment

Supports multiple deployment platforms:

- Vercel
- Netlify
- GitHub Pages
- Traditional hosting

## 📄 Project Structure

```
street-racer/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── blog-posts/    # Markdown blog posts
│   ├── styles/        # Style files
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── dist/             # Build output
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

## 📧 Contact

For questions or suggestions, please reach out via:

- GitHub Issues
- Email: pekingzcc@gmail.com
- Twitter: [@YourTwitter](https://twitter.com/GeorgePekingzcc)
