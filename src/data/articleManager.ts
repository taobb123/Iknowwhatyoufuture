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

// 添加王者荣耀文章
export const addWangzheArticle = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const articles = getAllArticles();
    
    // 检查是否已经存在王者荣耀文章
    const existingWangzheArticle = articles.find(article => 
      article.title === '王者荣耀赵云最强出装攻略'
    );
    
    if (!existingWangzheArticle) {
      const wangzheArticle: Article = {
        id: generateArticleId(),
        title: '王者荣耀赵云最强出装攻略',
        content: `# 王者荣耀赵云最强出装攻略

赵云作为王者荣耀中的经典战士英雄，以其灵活的位移和强大的爆发能力深受玩家喜爱。本文将详细介绍赵云的最强出装方案，帮助你在排位赛中carry全场！

## 英雄定位分析

### 赵云的核心特点
- **高机动性**：拥有多段位移技能
- **爆发伤害**：技能连招伤害极高
- **生存能力**：被动技能提供免伤效果
- **团战能力**：大招范围控制，适合开团

### 技能机制
- **被动-龙鸣**：生命值越低，免伤效果越强
- **一技能-惊雷之龙**：位移+强化普攻
- **二技能-破云之龙**：多段伤害+回血
- **三技能-天翔之龙**：范围击飞+标记

## 最强出装方案

### 核心出装（推荐）

\`\`\`
1. 暗影战斧
2. 抵抗之靴
3. 宗师之力
4. 破军
5. 名刀·司命
6. 碎星锤
\`\`\`

### 出装详解

#### 1. 暗影战斧（第一件）
- **属性加成**：85攻击力 + 15%冷却缩减 + 500生命值
- **被动效果**：普攻有30%概率减速敌人
- **选择理由**：提供攻击力、冷却缩减和生命值，是赵云的核心装备

#### 2. 抵抗之靴（第二件）
- **属性加成**：110法术防御 + 35%韧性
- **选择理由**：减少控制时间，提高生存能力

#### 3. 宗师之力（第三件）
- **属性加成**：60攻击力 + 20%暴击率 + 400法力值 + 400生命值
- **被动效果**：使用技能后下次普攻额外造成100%物理伤害
- **选择理由**：完美契合赵云的一技能机制，大幅提升爆发

#### 4. 破军（第四件）
- **属性加成**：180攻击力
- **被动效果**：对生命值低于50%的敌人额外造成30%伤害
- **选择理由**：高攻击力加成，配合赵云的高爆发

#### 5. 名刀·司命（第五件）
- **属性加成**：60攻击力 + 5%冷却缩减
- **被动效果**：受到致命伤害时免疫伤害1秒
- **选择理由**：提供保命能力，配合被动技能

#### 6. 碎星锤（第六件）
- **属性加成**：80攻击力 + 10%冷却缩减
- **被动效果**：+40%物理穿透
- **选择理由**：后期打坦克必备，提供高额穿透

## 铭文搭配

### 推荐铭文：狩猎+鹰眼+异变

\`\`\`
红色铭文：异变 × 10
- 物理攻击 +2
- 物理穿透 +3.6

绿色铭文：鹰眼 × 10  
- 物理攻击 +0.9
- 物理穿透 +6.4

蓝色铭文：狩猎 × 10
- 攻击速度 +1%
- 移速 +1%
\`\`\`

### 铭文效果
- **总属性**：物理攻击 +29，物理穿透 +100，攻击速度 +10%，移速 +10%
- **选择理由**：高额物理穿透，提升前期伤害；移速加成提高机动性

## 技能加点

### 加点顺序
1. **主二副一**：优先升级二技能，提高伤害和回血
2. **有大点大**：三技能是核心控制技能
3. **一技能最后**：主要用于位移和强化普攻

### 连招技巧

#### 基础连招：3-1-2-A
1. **三技能**：天翔之龙起手，击飞敌人
2. **一技能**：惊雷之龙跟进，强化普攻
3. **二技能**：破云之龙输出，多段伤害
4. **普攻**：利用宗师之力被动

#### 进阶连招：1-3-2-A-1
1. **一技能**：位移接近敌人
2. **三技能**：天翔之龙控制
3. **二技能**：破云之龙输出
4. **普攻**：强化普攻
5. **一技能**：追击或撤退

## 对线技巧

### 前期（1-4级）
- **猥琐发育**：利用二技能清兵，保持血量
- **寻找机会**：配合打野gank，利用控制技能
- **注意走位**：避免被消耗，保持被动层数

### 中期（5-12级）
- **游走支援**：利用高机动性支援其他路
- **团战切入**：寻找后排，利用大招开团
- **资源争夺**：积极参与小龙、暴君团战

### 后期（13-15级）
- **团战定位**：先手开团或后手收割
- **目标选择**：优先击杀敌方C位
- **保命意识**：利用名刀和被动技能

## 团战思路

### 开团时机
- **敌方站位密集**：大招能命中多个敌人
- **己方状态良好**：确保后续输出
- **关键技能冷却**：敌方核心技能在CD

### 团战位置
- **侧翼切入**：避免正面冲突
- **后排威胁**：优先击杀射手、法师
- **控制链配合**：与队友技能衔接

## 克制关系

### 赵云克制的英雄
- **射手类**：后羿、鲁班七号等无位移射手
- **法师类**：安琪拉、妲己等脆皮法师
- **刺客类**：兰陵王、阿轲等脆皮刺客

### 克制赵云的英雄
- **控制类**：东皇太一、张良等强控英雄
- **坦克类**：项羽、白起等肉盾英雄
- **灵活类**：韩信、李白等机动性更强的英雄

## 实战注意事项

### 常见错误
1. **盲目开团**：没有考虑队友位置和状态
2. **技能浪费**：一技能用于赶路而非战斗
3. **装备选择**：不根据局势调整出装
4. **位置选择**：团战站位过于激进

### 进阶技巧
1. **技能预判**：提前预判敌人走位
2. **装备切换**：根据局势更换装备
3. **视野控制**：利用草丛和视野优势
4. **心理博弈**：利用技能威慑敌人

## 总结

赵云是一个需要操作和意识的英雄，正确的出装只是基础，更重要的是：

- **技能连招**：熟练掌握各种连招技巧
- **团战意识**：找准切入时机和位置
- **装备理解**：根据局势灵活调整出装
- **经验积累**：多练习，提高操作熟练度

掌握这套出装和技巧，相信你也能在王者峡谷中carry全场！记住，最强的不是装备，而是使用装备的人！

---

*本文基于当前版本（S32赛季）分析，具体数值可能随版本更新而变化，请以游戏内实际数据为准。*`,
        author: '王者攻略大师',
        authorType: 'regular',
        category: '王者荣耀',
        tags: ['王者荣耀', '赵云', '出装', '攻略', '战士'],
        likes: 0,
        views: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        gameId: 4,
        gameTitle: '王者荣耀',
        articleId: 'wangzhe-zhaoyun-build'
      };
      
      articles.push(wangzheArticle);
      saveAllArticles(articles);
      console.log('王者荣耀赵云攻略文章已添加');
    }
  } catch (error) {
    console.error('添加王者荣耀文章失败:', error);
  }
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
          title: '王者荣耀赵云最强出装攻略',
          content: `# 王者荣耀赵云最强出装攻略

赵云作为王者荣耀中的经典战士英雄，以其灵活的位移和强大的爆发能力深受玩家喜爱。本文将详细介绍赵云的最强出装方案，帮助你在排位赛中carry全场！

## 英雄定位分析

### 赵云的核心特点
- **高机动性**：拥有多段位移技能
- **爆发伤害**：技能连招伤害极高
- **生存能力**：被动技能提供免伤效果
- **团战能力**：大招范围控制，适合开团

### 技能机制
- **被动-龙鸣**：生命值越低，免伤效果越强
- **一技能-惊雷之龙**：位移+强化普攻
- **二技能-破云之龙**：多段伤害+回血
- **三技能-天翔之龙**：范围击飞+标记

## 最强出装方案

### 核心出装（推荐）

\`\`\`
1. 暗影战斧
2. 抵抗之靴
3. 宗师之力
4. 破军
5. 名刀·司命
6. 碎星锤
\`\`\`

### 出装详解

#### 1. 暗影战斧（第一件）
- **属性加成**：85攻击力 + 15%冷却缩减 + 500生命值
- **被动效果**：普攻有30%概率减速敌人
- **选择理由**：提供攻击力、冷却缩减和生命值，是赵云的核心装备

#### 2. 抵抗之靴（第二件）
- **属性加成**：110法术防御 + 35%韧性
- **选择理由**：减少控制时间，提高生存能力

#### 3. 宗师之力（第三件）
- **属性加成**：60攻击力 + 20%暴击率 + 400法力值 + 400生命值
- **被动效果**：使用技能后下次普攻额外造成100%物理伤害
- **选择理由**：完美契合赵云的一技能机制，大幅提升爆发

#### 4. 破军（第四件）
- **属性加成**：180攻击力
- **被动效果**：对生命值低于50%的敌人额外造成30%伤害
- **选择理由**：高攻击力加成，配合赵云的高爆发

#### 5. 名刀·司命（第五件）
- **属性加成**：60攻击力 + 5%冷却缩减
- **被动效果**：受到致命伤害时免疫伤害1秒
- **选择理由**：提供保命能力，配合被动技能

#### 6. 碎星锤（第六件）
- **属性加成**：80攻击力 + 10%冷却缩减
- **被动效果**：+40%物理穿透
- **选择理由**：后期打坦克必备，提供高额穿透

## 铭文搭配

### 推荐铭文：狩猎+鹰眼+异变

\`\`\`
红色铭文：异变 × 10
- 物理攻击 +2
- 物理穿透 +3.6

绿色铭文：鹰眼 × 10  
- 物理攻击 +0.9
- 物理穿透 +6.4

蓝色铭文：狩猎 × 10
- 攻击速度 +1%
- 移速 +1%
\`\`\`

### 铭文效果
- **总属性**：物理攻击 +29，物理穿透 +100，攻击速度 +10%，移速 +10%
- **选择理由**：高额物理穿透，提升前期伤害；移速加成提高机动性

## 技能加点

### 加点顺序
1. **主二副一**：优先升级二技能，提高伤害和回血
2. **有大点大**：三技能是核心控制技能
3. **一技能最后**：主要用于位移和强化普攻

### 连招技巧

#### 基础连招：3-1-2-A
1. **三技能**：天翔之龙起手，击飞敌人
2. **一技能**：惊雷之龙跟进，强化普攻
3. **二技能**：破云之龙输出，多段伤害
4. **普攻**：利用宗师之力被动

#### 进阶连招：1-3-2-A-1
1. **一技能**：位移接近敌人
2. **三技能**：天翔之龙控制
3. **二技能**：破云之龙输出
4. **普攻**：强化普攻
5. **一技能**：追击或撤退

## 对线技巧

### 前期（1-4级）
- **猥琐发育**：利用二技能清兵，保持血量
- **寻找机会**：配合打野gank，利用控制技能
- **注意走位**：避免被消耗，保持被动层数

### 中期（5-12级）
- **游走支援**：利用高机动性支援其他路
- **团战切入**：寻找后排，利用大招开团
- **资源争夺**：积极参与小龙、暴君团战

### 后期（13-15级）
- **团战定位**：先手开团或后手收割
- **目标选择**：优先击杀敌方C位
- **保命意识**：利用名刀和被动技能

## 团战思路

### 开团时机
- **敌方站位密集**：大招能命中多个敌人
- **己方状态良好**：确保后续输出
- **关键技能冷却**：敌方核心技能在CD

### 团战位置
- **侧翼切入**：避免正面冲突
- **后排威胁**：优先击杀射手、法师
- **控制链配合**：与队友技能衔接

## 克制关系

### 赵云克制的英雄
- **射手类**：后羿、鲁班七号等无位移射手
- **法师类**：安琪拉、妲己等脆皮法师
- **刺客类**：兰陵王、阿轲等脆皮刺客

### 克制赵云的英雄
- **控制类**：东皇太一、张良等强控英雄
- **坦克类**：项羽、白起等肉盾英雄
- **灵活类**：韩信、李白等机动性更强的英雄

## 实战注意事项

### 常见错误
1. **盲目开团**：没有考虑队友位置和状态
2. **技能浪费**：一技能用于赶路而非战斗
3. **装备选择**：不根据局势调整出装
4. **位置选择**：团战站位过于激进

### 进阶技巧
1. **技能预判**：提前预判敌人走位
2. **装备切换**：根据局势更换装备
3. **视野控制**：利用草丛和视野优势
4. **心理博弈**：利用技能威慑敌人

## 总结

赵云是一个需要操作和意识的英雄，正确的出装只是基础，更重要的是：

- **技能连招**：熟练掌握各种连招技巧
- **团战意识**：找准切入时机和位置
- **装备理解**：根据局势灵活调整出装
- **经验积累**：多练习，提高操作熟练度

掌握这套出装和技巧，相信你也能在王者峡谷中carry全场！记住，最强的不是装备，而是使用装备的人！

---

*本文基于当前版本（S32赛季）分析，具体数值可能随版本更新而变化，请以游戏内实际数据为准。*`,
          author: '王者攻略大师',
          authorType: 'regular',
          category: '王者荣耀',
          tags: ['王者荣耀', '赵云', '出装', '攻略', '战士'],
          likes: 0,
          views: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'published',
          gameId: 4,
          gameTitle: '王者荣耀',
          articleId: 'wangzhe-zhaoyun-build'
        },
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
