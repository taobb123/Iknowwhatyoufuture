export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string; // 作者ID，用于关联用户
  authorType?: 'guest' | 'regular' | 'admin' | 'superAdmin'; // 作者类型
  category: string;
  boardId?: string; // 所属板块ID
  topicId?: string; // 所属主题ID
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  gameId?: number;
  gameTitle?: string;
  articleId?: string;
}

// 文章数据存储键
const ARTICLES_STORAGE_KEY = 'gamehub_articles';
const ARTICLE_ID_COUNTER_KEY = 'gamehub_article_id_counter';

// 生成唯一ID
const generateArticleId = (): string => {
  const counter = parseInt(localStorage.getItem(ARTICLE_ID_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(ARTICLE_ID_COUNTER_KEY, counter.toString());
  return `article_${counter}`;
};

// 获取所有文章
export const getAllArticles = (): Article[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const articles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
  } catch (error) {
    return [];
  }
};

// 保存所有文章
const saveAllArticles = (articles: Article[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    // 保存文章失败
  }
};

// 添加新文章
export const addArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'comments'>): Article => {
  const articles = getAllArticles();
  const newArticle: Article = {
    ...articleData,
    id: generateArticleId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    comments: 0,
  };
  
  articles.unshift(newArticle);
  saveAllArticles(articles);
  return newArticle;
};

// 更新文章
export const updateArticle = (id: string, updates: Partial<Article>): Article | null => {
  const articles = getAllArticles();
  const index = articles.findIndex(article => article.id === id);
  
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveAllArticles(articles);
  return articles[index];
};

// 根据ID获取文章
export const getArticleById = (id: string): Article | null => {
  const articles = getAllArticles();
  return articles.find(article => article.id === id) || null;
};

// 获取已发表的文章
export const getPublishedArticles = (): Article[] => {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.status === 'published');
};

// 根据分类获取文章
export const getArticlesByCategory = (category: string): Article[] => {
  if (category === '全部') {
    return getPublishedArticles();
  }
  return getPublishedArticles().filter(article => article.category === category);
};

// 删除文章
export const deleteArticle = (id: string): boolean => {
  const articles = getAllArticles();
  const index = articles.findIndex(article => article.id === id);
  
  if (index === -1) return false;
  
  articles.splice(index, 1);
  saveAllArticles(articles);
  return true;
};

// 获取所有分类
export const getAllCategories = (): string[] => {
  const articles = getAllArticles();
  const categories = new Set(articles.map(article => article.category));
  return Array.from(categories).sort();
};

// 按主题分类获取文章
export const getArticlesByTopic = (topic: string): Article[] => {
  if (topic === '全部') {
    return getAllArticlesSortedByTime();
  }
  return getAllArticles()
    .filter(article => article.category === topic)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 按时间排序获取所有文章
export const getAllArticlesSortedByTime = (): Article[] => {
  return getAllArticles().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 根据板块获取文章
export const getArticlesByBoard = (boardId: string): Article[] => {
  const publishedArticles = getPublishedArticles();
  return publishedArticles.filter(article => article.boardId === boardId);
};

// 根据主题获取文章
export const getArticlesByTopicId = (topicId: string): Article[] => {
  const publishedArticles = getPublishedArticles();
  return publishedArticles.filter(article => article.topicId === topicId);
};

// 获取文章作者显示名称
export const getArticleAuthorDisplayName = (article: Article): string => {
  if (article.authorType === 'guest') {
    return '游客';
  }
  return article.author;
};

// 搜索文章
export const searchArticles = (query: string): Article[] => {
  const publishedArticles = getPublishedArticles();
  const lowercaseQuery = query.toLowerCase();
  
  return publishedArticles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    article.author.toLowerCase().includes(lowercaseQuery)
  );
};

// 初始化示例数据
export const initializeSampleArticles = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const articles = getAllArticles();
    
    if (articles.length === 0) {
      // 重置计数器
      localStorage.setItem(ARTICLE_ID_COUNTER_KEY, '0');
      
      const sampleArticles: Article[] = [
        {
          id: generateArticleId(),
          title: 'React游戏开发完整攻略',
          content: `# React游戏开发完整攻略

从零开始学习React游戏开发，包括状态管理、组件设计、性能优化等核心概念。

## 为什么选择React开发游戏？

React不仅仅是一个用于构建用户界面的库，它也可以用来开发有趣的游戏。通过组件化的方式，我们可以创建可重用的游戏元素，让游戏开发变得更加高效。

## 核心概念

### 状态管理
- 使用useState管理游戏状态
- 使用useReducer处理复杂状态逻辑
- 使用Context API共享全局状态

### 组件设计
- 游戏角色组件
- 游戏场景组件
- UI界面组件

### 性能优化
- 使用useMemo优化计算
- 使用useCallback优化函数
- 使用React.memo优化渲染

## 实战项目

让我们通过一个简单的贪吃蛇游戏来学习React游戏开发：

\`\`\`javascript
import React, { useState, useEffect } from 'react';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 15, y: 15});
  const [direction, setDirection] = useState('RIGHT');

  // 游戏逻辑...
  
  return (
    <div className="game-container">
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
};
\`\`\`

## 总结

React游戏开发是一个有趣且富有挑战性的领域。通过合理使用React的特性，我们可以创建出既有趣又高效的游戏应用。`,
          author: '游戏大师',
          authorType: 'regular',
          category: '前端开发',
          tags: ['React', '游戏开发', 'JavaScript'],
          likes: 156,
          views: 2340,
          comments: 23,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          status: 'published',
          gameId: 1,
          gameTitle: 'React Racing',
          articleId: 'react-game-development'
        },
        {
          id: generateArticleId(),
          title: 'TypeScript在游戏项目中的应用',
          content: `# TypeScript在游戏项目中的应用

详细介绍如何在游戏开发中使用TypeScript，提升代码质量和开发效率。

## TypeScript的优势

### 类型安全
- 编译时错误检查
- 更好的IDE支持
- 减少运行时错误

### 代码可维护性
- 清晰的接口定义
- 更好的重构支持
- 团队协作更高效

## 游戏开发中的TypeScript实践

### 游戏状态管理
\`\`\typescript
interface GameState {
  score: number;
  level: number;
  player: Player;
  enemies: Enemy[];
}

const useGameState = (): GameState => {
  const [state, setState] = useState<GameState>({
    score: 0,
    level: 1,
    player: createPlayer(),
    enemies: []
  });
  
  return state;
};
\`\`\`

### 组件类型定义
\`\`\typescript
interface GameComponentProps {
  position: { x: number; y: number };
  size: { width: number; height: number };
  onCollision?: (target: GameObject) => void;
}

const GameComponent: React.FC<GameComponentProps> = ({
  position,
  size,
  onCollision
}) => {
  // 组件实现...
};
\`\`\`

## 总结

TypeScript为游戏开发带来了更好的开发体验和代码质量。`,
          author: '代码猎人',
          authorType: 'regular',
          category: '前端开发',
          tags: ['TypeScript', '游戏开发', '类型安全'],
          likes: 89,
          views: 1567,
          comments: 12,
          createdAt: '2024-01-12T00:00:00.000Z',
          updatedAt: '2024-01-12T00:00:00.000Z',
          status: 'published',
          gameId: 2,
          gameTitle: 'TypeScript Puzzle',
          articleId: 'typescript-game-project'
        },
        {
          id: generateArticleId(),
          title: 'Vue.js游戏组件设计模式',
          content: `# Vue.js游戏组件设计模式

探索Vue.js在游戏开发中的最佳实践，包括组件通信、状态管理等。

## Vue.js在游戏开发中的优势

### 响应式系统
- 自动更新UI
- 简化状态管理
- 提高开发效率

### 组件化架构
- 可重用的游戏元素
- 清晰的代码结构
- 易于维护和扩展

## 游戏组件设计模式

### 游戏对象组件
\`\`\vue
<template>
  <div 
    class="game-object"
    :style="objectStyle"
    @click="handleClick"
  >
    <img :src="sprite" :alt="name" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  position: { x: number; y: number };
  size: { width: number; height: number };
  sprite: string;
  name: string;
}

const props = defineProps<Props>();

const objectStyle = computed(() => ({
  position: 'absolute',
  left: \`\${props.position.x}px\`,
  top: \`\${props.position.y}px\`,
  width: \`\${props.size.width}px\`,
  height: \`\${props.size.height}px\`
}));

const handleClick = () => {
  // 处理点击事件
};
</script>
\`\`\`

### 游戏状态管理
\`\`\vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const score = ref(0);
const level = ref(1);
const player = ref({
  x: 0,
  y: 0,
  health: 100
});

const gameState = computed(() => ({
  score: score.value,
  level: level.value,
  player: player.value
}));
</script>
\`\`\`

## 总结

Vue.js为游戏开发提供了强大的工具和模式。`,
          author: 'Vue专家',
          authorType: 'regular',
          category: '前端开发',
          tags: ['Vue', '组件设计', '游戏开发'],
          likes: 67,
          views: 1234,
          comments: 8,
          createdAt: '2024-01-10T00:00:00.000Z',
          updatedAt: '2024-01-10T00:00:00.000Z',
          status: 'published',
          gameId: 3,
          gameTitle: 'Vue Adventure',
          articleId: 'vue-game-component'
        }
      ];
      
      saveAllArticles(sampleArticles);
    }
  } catch (error) {
    // 初始化示例文章失败
  }
};
