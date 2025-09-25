import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Gamepad2 } from 'lucide-react';
import { games } from '../data/gamesData';

interface SearchBoxProps {
  onQueryChange?: (query: string) => void;
}

interface SearchResult {
  id: number;
  title: string;
  type: 'game';
  category?: string;
  description?: string;
}

function SearchBox({ onQueryChange }: SearchBoxProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 搜索逻辑
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchResults: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // 搜索游戏
    games.forEach(game => {
      if (
        game.title.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
      ) {
        searchResults.push({
          id: game.id,
          title: game.title,
          type: 'game',
          category: game.category,
          description: game.description
        });
      }
    });


    setResults(searchResults.slice(0, 8)); // 限制结果数量
    setSelectedIndex(0);
    setShowResults(true);
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    }
  };

  // 处理搜索结果点击
  const handleResultClick = (result: SearchResult) => {
    // 添加到搜索历史
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    // 根据结果类型导航
    if (result.type === 'game') {
      // 导航到游戏详情页
      navigate(`/games/${result.id}`);
    }

    // 清空搜索框
    setQuery('');
    setShowResults(false);
  };

  // 处理搜索历史点击
  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  // 清除搜索历史
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 搜索输入框 */}
      <div className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
        <Search className="w-4 h-4 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder="搜索游戏、文章..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <div className="text-xs bg-gray-600 px-2 py-1 rounded">
          Ctrl+K
        </div>
      </div>

      {/* 搜索结果下拉框 */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            // 显示搜索历史
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  最近搜索
                </h3>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    清除
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p className="text-gray-400 text-sm">暂无搜索历史</p>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((recent, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(recent)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-600"
                    >
                      {recent}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : results.length > 0 ? (
            // 显示搜索结果
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full text-left p-3 rounded flex items-center ${
                    index === selectedIndex 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="mr-3">
                    {result.type === 'game' ? (
                      <Gamepad2 className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Search className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.title}</div>
                    {result.category && (
                      <div className="text-sm text-gray-500">{result.category}</div>
                    )}
                    {result.description && (
                      <div className="text-sm text-gray-400 truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // 无搜索结果
            <div className="p-4 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>未找到相关结果</p>
            </div>
          )}
          
          {/* 快捷键提示 */}
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t">
            <div className="flex justify-between">
              <span>↑↓ 选择 • Enter 确认 • Esc 关闭</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
