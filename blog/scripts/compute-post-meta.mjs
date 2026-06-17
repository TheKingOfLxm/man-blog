// 计算每篇文章阅读时长/字数，回写 src/data/posts.json。
// 用法：在 blog/ 目录执行  node scripts/compute-post-meta.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const postsPath = path.join(root, 'src', 'data', 'posts.json');
const postsDir = path.join(root, 'public', 'posts');

const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

for (const post of posts) {
  const mdPath = path.join(postsDir, `${post.id}.md`);
  const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  // 去代码块与行内代码
  const noCode = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  // 去 markdown 语法
  const text = noCode
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\([\s\S]*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_~\-|]/g, ' ');
  const cjk = (text.match(/[一-龥]/g) || []).length;
  const latinWords = (text.match(/[A-Za-z]+/g) || []).length;
  post.wordCount = cjk + latinWords;
  post.readingTime = Math.max(1, Math.ceil(cjk / 400 + latinWords / 200));
}

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n');
console.log('已更新阅读时长：');
for (const p of posts) console.log(`  ${p.id}: ${p.readingTime} 分钟 / ${p.wordCount} 字`);
