import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';

function StyledFooter() {
  const { currentTheme } = useTheme();
  const location = useLocation();
  
  // 在文章编辑页面隐藏Footer
  if (location.pathname.startsWith('/article-edit/')) {
    return null;
  }

  // 动态样式
  const footerStyles = {
    backgroundColor: currentTheme.components.footer.background,
    borderColor: currentTheme.components.footer.border,
  };

  const brandStyles = {
    color: currentTheme.components.footer.brand.color,
    fontSize: currentTheme.components.footer.brand.fontSize,
  };

  const textStyles = {
    color: currentTheme.components.footer.text,
  };

  const textSecondaryStyles = {
    color: currentTheme.components.footer.textSecondary,
  };

  const linkStyles = {
    color: currentTheme.components.footer.link.color,
    '--hover-color': currentTheme.components.footer.link.hover,
  } as React.CSSProperties;

  const borderStyles = {
    borderColor: currentTheme.components.footer.border,
  };

  return (
    <footer className="border-t" style={footerStyles}>
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* 中文内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4" style={brandStyles}>
              Iknowwhatyoufuture
            </h3>
            <p className="mb-4" style={textSecondaryStyles}>
              游戏攻略社区，分享最优质的游戏开发经验和技巧，帮助开发者提升技能。
            </p>
            <div className="flex space-x-4">
              <button 
                className="transition-colors hover:text-white"
                style={textSecondaryStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.components.footer.link.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.components.footer.textSecondary;
                }}
              >
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button 
                className="transition-colors hover:text-white"
                style={textSecondaryStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.components.footer.link.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.components.footer.textSecondary;
                }}
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={brandStyles}>
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  常见问题
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  排行榜
                </Link>
              </li>
            </ul>
          </div>

          {/* 法律信息 */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={brandStyles}>
              法律信息
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  服务条款
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  联系我们
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t mt-8 pt-8 text-center" style={borderStyles}>
          <p style={textSecondaryStyles}>
            © 2025 Iknowwhatyoufuture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default StyledFooter;
