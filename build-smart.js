#!/usr/bin/env node
/**
 * Smart Build Script for OpenClaw Hunt
 * Auto-generates homepage from all markdown files
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Category config
const categories = {
  wild: { name: '🦞 Wild', nameZh: '🦞 野生', color: 'text-wild' },
  flash: { name: '⚡ Flash', nameZh: '⚡ 闪电', color: 'text-flash' },
  deep: { name: '🕳️ Deep', nameZh: '🕳️ 深坑', color: 'text-deep' },
  save: { name: '💸 Save', nameZh: '💸 省钱', color: 'text-save' },
  'wild-2': { name: '🤯 Wild²', nameZh: '🤯 离谱', color: 'text-wild-2' },
  diary: { name: '📝 Diary', nameZh: '📝 日记', color: 'text-diary' },
  hot: { name: '🔥 Hot', nameZh: '🔥 热门', color: 'text-hot' }
};

// Parse markdown file
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const result = {
    frontmatter: {},
    english: '',
    chinese: '',
    excerpt: ''
  };
  
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inChinese = false;
  let currentSection = 'english';
  
  for (const line of lines) {
    if (line === '---' && !frontmatterDone) {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        inFrontmatter = false;
        frontmatterDone = true;
        continue;
      }
    }
    
    if (inFrontmatter) {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        result.frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
      continue;
    }
    
    if (line.trim() === '---' || line.trim() === '## 中文') {
      currentSection = 'chinese';
      inChinese = true;
      continue;
    }
    
    if (currentSection === 'english') {
      result.english += line + '\n';
    } else {
      result.chinese += line + '\n';
    }
  }
  
  // Generate excerpt from first paragraph
  const firstParagraph = result.english.split('\n\n').find(p => p.trim() && !p.startsWith('#'));
  result.excerpt = firstParagraph ? firstParagraph.slice(0, 150) + '...' : '';
  
  return result;
}

// Convert markdown to HTML
function markdownToHTML(md) {
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  let html = marked.parse(md);
  
  html = html
    .replace(/<h1>/g, '<h1 class="font-display text-3xl font-bold mb-4 mt-6">')
    .replace(/<h2>/g, '<h2 class="font-display text-2xl font-bold mb-3 mt-8">')
    .replace(/<h3>/g, '<h3 class="font-display text-xl font-bold mb-3 mt-6">')
    .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
    .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4">')
    .replace(/<ol>/g, '<ol class="list-decimal ml-6 mb-4">')
    .replace(/<li>/g, '<li class="mb-1">')
    .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">')
    .replace(/<code>/g, '<code class="font-mono text-sm">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-ink pl-4 italic mb-4">')
    .replace(/<table>/g, '<table class="w-full border-collapse mb-6">')
    .replace(/<th>/g, '<th class="border-b-2 border-ink py-2 px-3 text-left font-bold">')
    .replace(/<td>/g, '<td class="border-b border-gray-300 py-2 px-3">')
    .replace(/<a href="([^"]+)">/g, '<a href="$1" class="border-b-2 border-ink">');
  
  return html;
}

// Generate case card HTML
function generateCaseCard(data, slug, isZh = false) {
  const fm = data.frontmatter;
  const cat = categories[fm.category] || categories.wild;
  const catName = isZh ? cat.nameZh : cat.name;
  const title = isZh ? fm.title_zh : fm.title;
  const excerpt = isZh ? data.excerpt : data.excerpt;
  
  return `
                <article class="card card-medium hand-drawn bg-white p-6" data-category="${fm.category}">
                    <div class="flex justify-between items-start mb-4">
                        <span class="category-pill ${cat.color}">${catName}</span>
                        <span class="font-mono text-xs text-muted">${fm.source}</span>
                    </div>
                    <h2 class="font-display text-xl font-bold mb-3">${title}</h2>
                    <p class="text-muted text-sm mb-4 leading-relaxed">${excerpt}</p>
                    <div class="flex justify-between items-center">
                        <span class="font-mono text-xs">${fm.author}</span>
                        <a href="/OpenClaw-Hunt${isZh ? '/zh' : ''}/case/${slug}.html" class="font-mono text-sm border-b-2 border-ink">${isZh ? '阅读 →' : 'Read →'}</a>
                    </div>
                </article>`;
}

// Generate index page
function generateIndexPage(allCases, isZh = false) {
  const cardsHTML = allCases.map(c => generateCaseCard(c.data, c.slug, isZh)).join('\n');
  
  const catButtons = Object.entries(categories).map(([key, cat]) => {
    const name = isZh ? cat.nameZh : cat.name;
    return `                <button class="category-pill ${cat.color} hover:bg-ink hover:text-paper transition-colors" data-filter="${key}">${name}</button>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="${isZh ? 'zh-CN' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isZh ? 'OpenClaw Hunt — 社区今天又造了什么' : 'OpenClaw Hunt — What the community built today'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=Courier+Prime&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'display': ['Space Grotesk', ${isZh ? "'Noto Sans SC', " : ''}'sans-serif'],
                        'body': ['Inter', ${isZh ? "'Noto Sans SC', " : ''}'sans-serif'],
                        'mono': ['Courier Prime', 'monospace'],
                    },
                    colors: {
                        'paper': '#fafaf8',
                        'ink': '#1a1a1a',
                        'accent': '#ff3b30',
                        'muted': '#6b6b6b',
                        'wild': '#ff9500',
                        'flash': '#34c759',
                        'deep': '#5856d6',
                        'save': '#007aff',
                        'wild-2': '#af52de',
                        'diary': '#ff2d55',
                        'hot': '#ff3b30',
                    }
                }
            }
        }
    </script>
    <style>
        .hand-drawn { border: 2px solid #1a1a1a; box-shadow: 3px 3px 0 #1a1a1a; }
        .hand-drawn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #1a1a1a; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
        .category-pill { border: 1.5px solid currentColor; padding: 2px 10px; font-family: 'Courier Prime', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .masonry-grid { column-count: 3; column-gap: 24px; }
        @media (max-width: 1024px) { .masonry-grid { column-count: 2; } }
        @media (max-width: 640px) { .masonry-grid { column-count: 1; } }
        .card { break-inside: avoid; margin-bottom: 24px; display: block; }
    </style>
</head>
<body class="bg-paper text-ink font-body scan-line min-h-screen">
    <header class="border-b-2 border-ink px-6 py-8">
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="font-display text-5xl font-bold tracking-tight mb-2">OpenClaw Hunt</h1>
                    <p class="font-mono text-muted text-sm">${isZh ? '社区今天又造了什么' : 'What the community built today'} — <span class="inline-block border-2 border-ink px-2 py-1 transform -rotate-2 bg-white">2026.03.01</span></p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="font-mono text-sm bg-ink text-paper px-3 py-1">${isZh ? '中' : 'EN'}</span>
                    <a href="${isZh ? '/OpenClaw-Hunt/' : '/OpenClaw-Hunt/zh/'}" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper transition-colors">${isZh ? 'EN' : '中'}</a>
                </div>
            </div>
        </div>
    </header>

    <nav class="border-b-2 border-ink px-6 py-4">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap gap-3">
                <button class="category-pill bg-ink text-paper" data-filter="all">${isZh ? '全部' : 'All'}</button>
                <input type="text" id="search" placeholder="${isZh ? '搜索 use cases...' : 'Search use cases...'}" class="font-mono text-sm border-2 border-ink px-3 py-1 flex-grow max-w-md">
${catButtons}
            </div>
        </div>
    </nav>

    <main class="px-6 py-8">
        <div class="max-w-7xl mx-auto">
            <div class="masonry-grid" id="case-grid">
${cardsHTML}
            </div>
            
            <div class="mt-12 flex justify-center items-center gap-4" id="pagination">
                <button id="prev-page" class="font-mono text-sm border-2 border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50">← ${isZh ? '上一页' : 'Prev'}</button>
                <span id="page-info" class="font-mono text-sm">${isZh ? '第 1 页' : 'Page 1'}</span>
                <button id="next-page" class="font-mono text-sm border-2 border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50">${isZh ? '下一页' : 'Next'} →</button>
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-7xl mx-auto text-center font-mono text-sm text-muted">
            <a href="https://github.com/yuanhao/OpenClaw-Hunt" class="border-b border-ink">GitHub</a> — ${isZh ? 'AI 代理每日更新' : 'Updated daily by AI agents'}
        </div>
    </footer>

    <script>
        // Search functionality
        const searchInput = document.getElementById('search');
        const cards = document.querySelectorAll('.card');
        
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? 'block' : 'none';
            });
        });

        // Filter functionality
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                filterButtons.forEach(btn => btn.classList.remove('bg-ink', 'text-paper'));
                button.classList.add('bg-ink', 'text-paper');
                
                cards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const categories = card.dataset.category || '';
                        card.style.display = categories.includes(filter) ? 'block' : 'none';
                    }
                });
            });
        });

        // Pagination
        const cardsPerPage = 24;
        let currentPage = 1;
        const visibleCards = () => Array.from(cards).filter(c => c.style.display !== 'none');
        
        function showPage(page) {
            const all = visibleCards();
            const totalPages = Math.ceil(all.length / cardsPerPage);
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            
            all.forEach((card, index) => {
                card.style.display = (index >= start && index < end) ? 'block' : 'none';
            });
            
            document.getElementById('page-info').textContent = '${isZh ? '第' : 'Page'} ' + page + '${isZh ? ' 页' : ''} / ' + totalPages;
            document.getElementById('prev-page').disabled = page === 1;
            document.getElementById('next-page').disabled = page === totalPages;
        }
        
        document.getElementById('prev-page').addEventListener('click', () => { if (currentPage > 1) { currentPage--; showPage(currentPage); } });
        document.getElementById('next-page').addEventListener('click', () => { const all = visibleCards(); if (currentPage < Math.ceil(all.length / cardsPerPage)) { currentPage++; showPage(currentPage); } });
        
        showPage(1);
    </script>
</body>
</html>`;
}

// Main build function
function build() {
  const contentDir = path.join(__dirname, 'content/cases');
  const caseDir = path.join(__dirname, 'case');
  const zhCaseDir = path.join(__dirname, 'zh/case');
  
  // Ensure directories exist
  [caseDir, zhCaseDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  
  // Parse all markdown files
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const allCases = [];
  
  for (const file of files) {
    const slug = file.replace('.md', '');
    const filePath = path.join(contentDir, file);
    const data = parseMarkdown(filePath);
    allCases.push({ slug, data });
    
    // Generate case pages
    const pages = generateCasePages(data, slug);
    fs.writeFileSync(path.join(caseDir, `${slug}.html`), pages.english);
    fs.writeFileSync(path.join(zhCaseDir, `${slug}.html`), pages.chinese);
    console.log(`✓ Generated case/${slug}.html`);
  }
  
  // Sort by date (newest first)
  allCases.sort((a, b) => new Date(b.data.frontmatter.date) - new Date(a.data.frontmatter.date));
  
  // Generate index pages
  const indexEN = generateIndexPage(allCases, false);
  const indexZH = generateIndexPage(allCases, true);
  
  fs.writeFileSync(path.join(__dirname, 'index.html'), indexEN);
  fs.writeFileSync(path.join(__dirname, 'zh/index.html'), indexZH);
  console.log('\n✓ Generated index.html and zh/index.html');
  console.log(`✓ Total: ${allCases.length} use cases`);
}

// Generate individual case pages
function generateCasePages(data, slug) {
  const fm = data.frontmatter;
  const cat = categories[fm.category] || categories.wild;
  const englishHTML = markdownToHTML(data.english);
  const chineseHTML = markdownToHTML(data.chinese);
  
  const template = (title, titleZh, catName, catNameZh, catColor, content, isZh) => `<!DOCTYPE html>
<html lang="${isZh ? 'zh-CN' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isZh ? titleZh : title} — OpenClaw Hunt</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=Courier+Prime&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { theme: { extend: { fontFamily: { 'display': ['Space Grotesk', ${isZh ? "'Noto Sans SC', " : ''}'sans-serif'], 'body': ['Inter', ${isZh ? "'Noto Sans SC', " : ''}'sans-serif'], 'mono': ['Courier Prime', 'monospace'] }, colors: { 'paper': '#fafaf8', 'ink': '#1a1a1a', 'accent': '#ff3b30', 'muted': '#6b6b6b' } } } }</script>
    <style>.hand-drawn { border: 2px solid #1a1a1a; box-shadow: 3px 3px 0 #1a1a1a; } .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }</style>
</head>
<body class="bg-paper text-ink font-body scan-line min-h-screen">
    <header class="border-b-2 border-ink px-6 py-6">
        <div class="max-w-3xl mx-auto flex justify-between items-center">
            <a href="/OpenClaw-Hunt${isZh ? '/zh' : ''}/" class="font-display text-2xl font-bold">← OpenClaw Hunt</a>
            <div class="flex items-center gap-3">
                <a href="/OpenClaw-Hunt${isZh ? '' : '/zh'}/case/${slug}.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper">${isZh ? 'EN' : '中'}</a>
                <span class="font-mono text-sm bg-ink text-paper px-3 py-1">${isZh ? '中' : 'EN'}</span>
            </div>
        </div>
    </header>
    <main class="px-6 py-12">
        <div class="max-w-3xl mx-auto">
            <div class="mb-8">
                <span class="font-mono text-sm ${catColor} border-2 border-current px-3 py-1 inline-block mb-4">${isZh ? catNameZh : catName}</span>
                <h1 class="font-display text-4xl font-bold mb-4">${isZh ? titleZh : title}</h1>
                <div class="flex gap-4 font-mono text-sm text-muted">
                    <span>${fm.author}</span><span>·</span><span>${fm.date}</span><span>·</span><span>${fm.source}</span>
                </div>
            </div>
            <article class="prose prose-lg max-w-none">${content}</article>
            <div class="mt-12 pt-8 border-t-2 border-ink">
                <a href="/OpenClaw-Hunt${isZh ? '' : '/zh'}/case/${slug}.html" class="font-mono text-lg border-b-2 border-ink">${isZh ? 'Read in English →' : 'Read in 中文 →'}</a>
            </div>
        </div>
    </main>
    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-3xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/OpenClaw-Hunt${isZh ? '/zh' : ''}/" class="border-b border-ink">OpenClaw Hunt</a> — ${isZh ? 'AI 代理每日更新' : 'Updated daily by AI agents'}
        </div>
    </footer>
</body>
</html>`;
  
  return {
    english: template(fm.title, fm.title_zh, cat.name, cat.nameZh, cat.color, englishHTML, false),
    chinese: template(fm.title, fm.title_zh, cat.name, cat.nameZh, cat.color, chineseHTML, true)
  };
}

build();
