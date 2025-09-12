export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  excerpt: string;
}

// 修改 glob 路径，使用正确的相对路径
const posts = import.meta.glob('./[!index]*.md', { as: 'raw', eager: true }) as Record<string, string>;

function extractFrontmatter(content: string) {
  console.log('Trying to extract frontmatter from:', content);
  // 添加调试日志
  console.log('Raw content:', content);

  // 使用更严格的正则表达式来匹配 frontmatter
  const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  
  if (!match) {
    console.error('No frontmatter found in content');
    return null;
  }

  try {
    const frontmatterStr = match[1];
    console.log('Frontmatter string:', frontmatterStr);

    const frontmatter = frontmatterStr.split('\n').reduce((acc, line) => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        // 移除引号和多余的空格
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        if (value) {
          acc[key.trim()] = value;
        }
      }
      return acc;
    }, {} as Record<string, string>);

    // 验证必需的字段
    const requiredFields = ['title', 'date', 'category', 'image'];
    const missingFields = requiredFields.filter(field => !frontmatter[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return null;
    }

    // 获取文章内容（移除 frontmatter）
    const contentWithoutFrontmatter = content.replace(/^---[\r\n]+([\s\S]*?)[\r\n]+---/, '').trim();
    
    return {
      frontmatter,
      content: contentWithoutFrontmatter
    };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  console.log('Available posts:', Object.keys(posts));
  
  const blogPosts = Object.entries(posts).map(([path, content]) => {
    console.log('Processing path:', path);
    console.log('Content:', content);
    
    const slug = path.replace(/^\.\/(.*)\.md$/, '$1');
    const parsed = extractFrontmatter(content);
    
    if (!parsed) {
      console.error(`Failed to parse frontmatter in ${path}`);
      return null;
    }

    const { frontmatter, content: postContent } = parsed;
    
    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      category: frontmatter.category,
      image: frontmatter.image,
      content: postContent,
      excerpt: frontmatter.excerpt || postContent.slice(0, 200) + '...'
    };
  }).filter(Boolean) as BlogPost[];

  return blogPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const path = `./${slug}.md`;
  const content = posts[path];
  if (!content) return null;

  const parsed = extractFrontmatter(content);
  if (!parsed) return null;

  const { frontmatter, content: postContent } = parsed;
  
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    category: frontmatter.category,
    image: frontmatter.image,
    content: postContent,
    excerpt: frontmatter.excerpt || postContent.slice(0, 200) + '...'
  };
} 