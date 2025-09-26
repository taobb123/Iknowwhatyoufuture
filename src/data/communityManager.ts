// 社区结构数据模型

export interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  topicCount: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  boardId: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  articleCount: number;
}

// 数据存储键
const BOARDS_STORAGE_KEY = 'gamehub_boards';
const TOPICS_STORAGE_KEY = 'gamehub_topics';
const BOARD_ID_COUNTER_KEY = 'gamehub_board_id_counter';
const TOPIC_ID_COUNTER_KEY = 'gamehub_topic_id_counter';

// 生成唯一ID
const generateBoardId = (): string => {
  const counter = parseInt(localStorage.getItem(BOARD_ID_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(BOARD_ID_COUNTER_KEY, counter.toString());
  return `board_${counter}`;
};

const generateTopicId = (): string => {
  const counter = parseInt(localStorage.getItem(TOPIC_ID_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(TOPIC_ID_COUNTER_KEY, counter.toString());
  return `topic_${counter}`;
};

// 板块管理
export const getAllBoards = (): Board[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const boards = localStorage.getItem(BOARDS_STORAGE_KEY);
    return boards ? JSON.parse(boards) : [];
  } catch (error) {
    console.error('获取板块数据失败:', error);
    return [];
  }
};

const saveAllBoards = (boards: Board[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    console.log('保存板块数据:', boards);
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
    console.log('板块数据保存成功');
  } catch (error) {
    console.error('保存板块失败:', error);
    throw error;
  }
};

export const addBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>): Board => {
  console.log('addBoard: 开始创建板块', boardData);
  const boards = getAllBoards();
  
  if (boards.some(board => board.name === boardData.name)) {
    throw new Error('板块名称已存在');
  }
  
  const newBoard: Board = {
    ...boardData,
    id: generateBoardId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topicCount: 0,
  };
  
  boards.push(newBoard);
  saveAllBoards(boards);
  console.log('addBoard: 板块创建完成', newBoard);
  return newBoard;
};

export const updateBoard = (boardId: string, boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>): Board => {
  console.log('updateBoard: 开始更新板块', boardId, boardData);
  const boards = getAllBoards();
  const boardIndex = boards.findIndex(b => b.id === boardId);
  
  if (boardIndex === -1) {
    throw new Error(`板块 ${boardId} 不存在`);
  }
  
  const existingBoard = boards[boardIndex];
  const updatedBoard: Board = {
    ...existingBoard,
    ...boardData,
    updatedAt: new Date().toISOString()
  };
  
  boards[boardIndex] = updatedBoard;
  saveAllBoards(boards);
  console.log('updateBoard: 板块更新成功', updatedBoard);
  return updatedBoard;
};

export const deleteBoard = (boardId: string): void => {
  console.log('deleteBoard: 开始删除板块', boardId);
  const boards = getAllBoards();
  const boardIndex = boards.findIndex(b => b.id === boardId);
  
  if (boardIndex === -1) {
    throw new Error(`板块 ${boardId} 不存在`);
  }
  
  boards.splice(boardIndex, 1);
  saveAllBoards(boards);
  console.log('deleteBoard: 板块删除成功');
};

// 主题管理
export const getAllTopics = (): Topic[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const topics = localStorage.getItem(TOPICS_STORAGE_KEY);
    return topics ? JSON.parse(topics) : [];
  } catch (error) {
    console.error('获取主题数据失败:', error);
    return [];
  }
};

const saveAllTopics = (topics: Topic[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    console.log('保存主题数据:', topics);
    localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
    console.log('主题数据保存成功');
  } catch (error) {
    console.error('保存主题失败:', error);
    throw error;
  }
};

export const addTopic = (topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>): Topic => {
  console.log('addTopic: 开始创建主题', topicData);
  const topics = getAllTopics();
  
  if (topics.some(topic => topic.name === topicData.name)) {
    throw new Error('主题名称已存在');
  }
  
  const newTopic: Topic = {
    ...topicData,
    id: generateTopicId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleCount: 0,
  };
  
  topics.push(newTopic);
  saveAllTopics(topics);
  console.log('addTopic: 主题创建完成', newTopic);
  return newTopic;
};

export const updateTopic = (topicId: string, topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>): Topic => {
  console.log('updateTopic: 开始更新主题', topicId, topicData);
  const topics = getAllTopics();
  const topicIndex = topics.findIndex(t => t.id === topicId);
  
  if (topicIndex === -1) {
    throw new Error(`主题 ${topicId} 不存在`);
  }
  
  const existingTopic = topics[topicIndex];
  const updatedTopic: Topic = {
    ...existingTopic,
    ...topicData,
    updatedAt: new Date().toISOString()
  };
  
  topics[topicIndex] = updatedTopic;
  saveAllTopics(topics);
  console.log('updateTopic: 主题更新成功', updatedTopic);
  return updatedTopic;
};

export const deleteTopic = (topicId: string): void => {
  console.log('deleteTopic: 开始删除主题', topicId);
  const topics = getAllTopics();
  const topicIndex = topics.findIndex(t => t.id === topicId);
  
  if (topicIndex === -1) {
    throw new Error(`主题 ${topicId} 不存在`);
  }
  
  topics.splice(topicIndex, 1);
  saveAllTopics(topics);
  console.log('deleteTopic: 主题删除成功');
};

// 获取社区统计信息
export const getCommunityStats = () => {
  const boards = getAllBoards();
  const topics = getAllTopics();
  
  return {
    totalBoards: boards.length,
    activeBoards: boards.filter(board => board.isActive).length,
    totalTopics: topics.length,
    activeTopics: topics.filter(topic => topic.isActive).length,
  };
};

// 初始化默认板块和主题
export const initializeDefaultCommunity = (): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('社区初始化: 服务端环境，跳过初始化');
      return;
    }
    
    const boards = getAllBoards();
    const topics = getAllTopics();
    
    console.log('社区初始化检查:', {
      boards: boards.length,
      topics: topics.length
    });
    
    if (boards.length > 0 && topics.length > 0) {
      console.log('社区初始化: 已有数据，跳过初始化');
      return;
    }
    
    console.log('社区初始化: 开始创建默认数据');
    
    // 创建默认板块
    const defaultBoards = [
      {
        name: '游戏攻略',
        description: '分享各种游戏的攻略和技巧',
        icon: '🎮',
        color: 'from-blue-600 to-purple-600',
        order: 1,
        isActive: true,
      },
      {
        name: '技术讨论',
        description: '讨论游戏开发和技术相关话题',
        icon: '💻',
        color: 'from-green-600 to-teal-600',
        order: 2,
        isActive: true,
      },
      {
        name: '社区活动',
        description: '社区活动和用户交流',
        icon: '🎉',
        color: 'from-orange-600 to-red-600',
        order: 3,
        isActive: true,
      },
    ];
    
    // 添加默认板块
    const createdBoards: Board[] = [];
    for (const boardData of defaultBoards) {
      try {
        const board = addBoard(boardData);
        createdBoards.push(board);
        console.log('创建板块成功:', board.name, board.id);
      } catch (error) {
        console.error('创建板块失败:', boardData.name, error);
      }
    }
    
    // 创建默认主题
    const defaultTopics = [
      {
        name: '新手入门',
        description: '适合新手的游戏攻略',
        boardId: createdBoards[0]?.id || '',
        icon: '🌟',
        color: 'from-yellow-500 to-orange-500',
        order: 1,
        isActive: true,
      },
      {
        name: '高级技巧',
        description: '高级玩家分享的技巧',
        boardId: createdBoards[0]?.id || '',
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        order: 2,
        isActive: true,
      },
      {
        name: '前端开发',
        description: '前端技术讨论',
        boardId: createdBoards[1]?.id || '',
        icon: '🎨',
        color: 'from-cyan-500 to-blue-500',
        order: 1,
        isActive: true,
      },
      {
        name: '后端开发',
        description: '后端技术讨论',
        boardId: createdBoards[1]?.id || '',
        icon: '⚙️',
        color: 'from-gray-500 to-slate-500',
        order: 2,
        isActive: true,
      },
      {
        name: '活动公告',
        description: '社区活动公告',
        boardId: createdBoards[2]?.id || '',
        icon: '📢',
        color: 'from-red-500 to-pink-500',
        order: 1,
        isActive: true,
      },
      {
        name: '用户交流',
        description: '用户之间的交流讨论',
        boardId: createdBoards[2]?.id || '',
        icon: '💬',
        color: 'from-green-500 to-teal-500',
        order: 2,
        isActive: true,
      },
    ];
    
    // 添加默认主题
    for (const topicData of defaultTopics) {
      if (topicData.boardId) {
        try {
          const topic = addTopic(topicData);
          console.log('创建主题成功:', topic.name, topic.id);
        } catch (error) {
          console.error('创建主题失败:', topicData.name, error);
        }
      }
    }
    
    console.log('社区初始化完成:', {
      createdBoards: getAllBoards().length,
      createdTopics: getAllTopics().length
    });
    
  } catch (error) {
    console.error('初始化默认社区数据失败:', error);
  }
};

// 强制初始化社区数据（用于调试）
export const forceInitializeCommunity = (): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('强制初始化: 服务端环境，跳过初始化');
      return;
    }
    
    console.log('强制初始化: 清除现有数据并重新初始化');
    
    // 清除现有数据
    localStorage.removeItem(BOARDS_STORAGE_KEY);
    localStorage.removeItem(TOPICS_STORAGE_KEY);
    localStorage.removeItem(BOARD_ID_COUNTER_KEY);
    localStorage.removeItem(TOPIC_ID_COUNTER_KEY);
    
    // 重新初始化
    initializeDefaultCommunity();
    
  } catch (error) {
    console.error('强制初始化失败:', error);
  }
};