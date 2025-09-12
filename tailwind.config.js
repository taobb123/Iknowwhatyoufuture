/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#E5E7EB', // 更亮的文本颜色 (gray-200)
            h1: {
              color: '#FFFFFF',
              fontSize: '2.25em',
              marginTop: '2em',
              marginBottom: '1em',
              fontWeight: '700',
              position: 'relative',
              paddingLeft: '1rem',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '15%',
                height: '70%',
                width: '4px',
                backgroundColor: '#EF4444', // red-500
                borderRadius: '2px',
              },
            },
            h2: {
              color: '#FFFFFF',
              fontSize: '1.875em',
              marginTop: '1.75em',
              marginBottom: '0.875em',
              fontWeight: '600',
              position: 'relative',
              paddingLeft: '1rem',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '15%',
                height: '70%',
                width: '3px',
                backgroundColor: '#EF4444', // red-500
                borderRadius: '2px',
              },
            },
            h3: {
              color: '#FFFFFF',
              fontSize: '1.5em',
              marginTop: '1.5em',
              marginBottom: '0.75em',
              fontWeight: '600',
            },
            h4: {
              color: '#FFFFFF',
              fontSize: '1.25em',
              marginTop: '1.25em',
              marginBottom: '0.625em',
              fontWeight: '600',
            },
            p: {
              color: '#E5E7EB', // 更亮的段落文本颜色
              fontSize: '1.125rem', // 更大的字体
              lineHeight: '1.75', // 更大的行高
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            strong: {
              color: '#FFFFFF',
              fontWeight: '600',
            },
            blockquote: {
              color: '#F3F4F6', // 更亮的引用文本颜色 (gray-100)
              borderLeftColor: '#EF4444',
              fontStyle: 'normal',
              backgroundColor: 'rgba(255, 255, 255, 0.05)', // 轻微的白色背景
              padding: '1rem 1.5rem',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#1F2937', // 更深的代码块背景色 (gray-800)
              color: '#F3F4F6',
              padding: '1.25rem',
              borderRadius: '0.5rem',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            code: {
              color: '#F3F4F6',
              backgroundColor: '#374151', // gray-700
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            ul: {
              color: '#E5E7EB',
              listStyleType: 'none',
              position: 'relative',
              '& > li': {
                paddingLeft: '1.5em',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '0',
                  width: '0.375em',
                  height: '0.375em',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  marginTop: '0.625em',
                },
              },
            },
            ol: {
              color: '#E5E7EB',
              '& > li::marker': {
                color: '#EF4444',
              },
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li > p': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            a: {
              color: '#F87171', // 更亮的链接颜色 (red-400)
              textDecoration: 'none',
              '&:hover': {
                color: '#FCA5A5', // 更亮的悬停颜色 (red-300)
                textDecoration: 'underline',
              },
            },
            hr: {
              borderColor: '#374151', // gray-700
              marginTop: '3em',
              marginBottom: '3em',
            },
            table: {
              fontSize: '0.875em',
            },
            'thead th': {
              color: '#FFFFFF',
              fontWeight: '600',
              borderBottomColor: '#4B5563', // gray-600
            },
            'tbody td': {
              color: '#E5E7EB',
              borderBottomColor: '#374151', // gray-700
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
