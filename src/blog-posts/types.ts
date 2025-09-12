export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  excerpt: string;
}

// 定义 markdown 文件的类型
declare module '*.md' {
  const content: string;
  export default content;
} 