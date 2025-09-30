import React, { useState, useEffect } from 'react';
import { testLocalStoragePerformance, checkCurrentDataSize } from '../utils/performanceTest';

const PerformanceTest: React.FC = () => {
  const [currentSize, setCurrentSize] = useState<number>(0);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // 检查当前数据大小
    const size = checkCurrentDataSize();
    setCurrentSize(size);
  }, []);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    try {
      const results = testLocalStoragePerformance();
      setTestResults(results);
    } catch (error) {
      console.error('性能测试失败:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getPerformanceStatus = (size: number) => {
    if (size > 5000) {
      return { status: 'warning', message: '⚠️ 数据量较大，建议迁移到数据库', color: 'text-red-600' };
    } else if (size > 1000) {
      return { status: 'caution', message: '🟡 数据量中等，建议监控性能', color: 'text-yellow-600' };
    } else {
      return { status: 'good', message: '✅ 数据量合理，性能良好', color: 'text-green-600' };
    }
  };

  const performanceStatus = getPerformanceStatus(currentSize);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🚀 localStorage 性能测试
          </h1>

          {/* 当前数据状态 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              当前数据状态
            </h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">总数据大小:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {(currentSize / 1024).toFixed(2)} KB
                </span>
              </div>
              <div className={`text-lg font-medium ${performanceStatus.color}`}>
                {performanceStatus.message}
              </div>
            </div>
          </div>

          {/* 性能测试按钮 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              性能压力测试
            </h2>
            <button
              onClick={runPerformanceTest}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? '测试中...' : '开始性能测试'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              测试不同数据量下的读写性能
            </p>
          </div>

          {/* 测试结果 */}
          {testResults && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                测试结果
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        数据量
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        用户写入
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        用户读取
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        文章写入
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        文章读取
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        文章大小
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(testResults).map(([size, data]: [string, any]) => (
                      <tr key={size}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {size}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {data.users.writeTime.toFixed(2)}ms
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {data.users.readTime.toFixed(2)}ms
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {data.articles.writeTime.toFixed(2)}ms
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {data.articles.readTime.toFixed(2)}ms
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(data.articles.dataSize / 1024).toFixed(2)}KB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 性能建议 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              💡 性能优化建议
            </h3>
            <ul className="text-blue-700 space-y-1">
              <li>• 如果数据量超过 1MB，建议迁移到数据库</li>
              <li>• 考虑实现数据分页加载，避免一次性加载所有数据</li>
              <li>• 定期清理无用的缓存数据</li>
              <li>• 使用 IndexedDB 替代 localStorage（支持更大存储）</li>
              <li>• 实现数据压缩和去重机制</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest;


