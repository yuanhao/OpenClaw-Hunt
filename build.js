#!/usr/bin/env node
/**
 * Build script for OpenClaw Hunt
 * Converts Markdown content to HTML pages
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Simple markdown parser
function parseMarkdown(content) {
    const lines = content.split('\n');
    const result = {
        frontmatter: {},
        content: '',
        english: '',
        chinese: ''
    };
    
    let inFrontmatter = false;
    let frontmatterDone = false;
    let inChinese = false;
    let currentSection = 'english';
    
    for (const line of lines) {
        // Frontmatter
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
        
        // Chinese section separator
        if (line.trim() === '---' || line.trim() === '## 中文') {
            currentSection = 'chinese';
            inChinese = true;
            continue;
        }
        
        // Content
        if (currentSection === 'english') {
            result.english += line + '\n';
        } else {
            result.chinese += line + '\n';
        }
    }
    
    result.content = result.english.trim();
    return result;
}

// Convert markdown to HTML using marked library
function markdownToHTML(md) {
    // Configure marked
    marked.setOptions({
        gfm: true,
        breaks: false,
        headerIds: false,
        mangle: false
    });
    
    // Render markdown
    let html = marked.parse(md);
    
    // Add Tailwind classes to elements
    html = html
        // Headers
        .replace(/<h1>/g, '<h1 class="font-display text-3xl font-bold mb-4 mt-6">')
        .replace(/<h2>/g, '<h2 class="font-display text-2xl font-bold mb-3 mt-8">')
        .replace(/<h3>/g, '<h3 class="font-display text-xl font-bold mb-3 mt-6">')
        // Paragraphs
        .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
        // Lists
        .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4">')
        .replace(/<ol>/g, '<ol class="list-decimal ml-6 mb-4">')
        .replace(/<li>/g, '<li class="mb-1">')
        // Code blocks
        .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">')
        .replace(/<code>/g, '<code class="font-mono text-sm">')
        // Inline code (after code blocks)
        .replace(/<p class="mb-4 leading-relaxed"><code class="font-mono text-sm">/g, '<p class="mb-4 leading-relaxed"><code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">')
        // Blockquotes
        .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-ink pl-4 italic mb-4">')
        // Tables
        .replace(/<table>/g, '<table class="w-full border-collapse mb-6">')
        .replace(/<th>/g, '<th class="border-b-2 border-ink py-2 px-3 text-left font-bold">')
        .replace(/<td>/g, '<td class="border-b border-gray-300 py-2 px-3">')
        // Links
        .replace(/<a href="([^"]+)">/g, '<a href="$1" class="border-b-2 border-ink">');
    
    return html;
}

// Generate case page HTML
function generateCasePage(data, slug) {
    const fm = data.frontmatter;
    const englishHTML = markdownToHTML(data.english);
    const chineseHTML = markdownToHTML(data.chinese);
    
    const categoryColors = {
        wild: 'text-wild',
        flash: 'text-flash',
        deep: 'text-deep',
        save: 'text-save',
        'wild-2': 'text-wild-2',
        diary: 'text-diary',
        hot: 'text-hot'
    };
    
    const categoryNames = {
        wild: '🦞 Wild',
        flash: '⚡ Flash',
        deep: '🕳️ Deep',
        save: '💸 Save',
        'wild-2': '🤯 Wild²',
        diary: '📝 Diary',
        hot: '🔥 Hot'
    };
    
    const categoryNamesZh = {
        wild: '🦞 野生',
        flash: '⚡ 闪电',
        deep: '🕳️ 深坑',
        save: '💸 省钱',
        'wild-2': '🤯 离谱',
        diary: '📝 日记',
        hot: '🔥 热门'
    };
    
    const catColor = categoryColors[fm.category] || 'text-ink';
    const catName = categoryNames[fm.category] || fm.category;
    const catNameZh = categoryNamesZh[fm.category] || fm.category;
    
    // English version
    const englishPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fm.title} — OpenClaw Hunt</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=Courier+Prime&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'display': ['Space Grotesk', 'sans-serif'],
                        'body': ['Inter', 'sans-serif'],
                        'mono': ['Courier Prime', 'monospace'],
                    },
                    colors: {
                        'paper': '#fafaf8',
                        'ink': '#1a1a1a',
                        'accent': '#ff3b30',
                        'muted': '#6b6b6b',
                    }
                }
            }
        }
    </script>
    <style>
        .hand-drawn { border: 2px solid #1a1a1a; box-shadow: 3px 3px 0 #1a1a1a; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
    </style>
</head>
<body class="bg-paper text-ink font-body scan-line min-h-screen">
    <header class="border-b-2 border-ink px-6 py-6">
        <div class="max-w-3xl mx-auto flex justify-between items-center">
            <a href="/OpenClaw-Hunt/" class="font-display text-2xl font-bold">← OpenClaw Hunt</a>
            <div class="flex items-center gap-3">
                <a href="/OpenClaw-Hunt/zh/case/${slug}.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper">中</a>
                <span class="font-mono text-sm bg-ink text-paper px-3 py-1">EN</span>
            </div>
        </div>
    </header>

    <main class="px-6 py-12">
        <div class="max-w-3xl mx-auto">
            <div class="mb-8">
                <span class="font-mono text-sm ${catColor} border-2 border-current px-3 py-1 inline-block mb-4">${catName}</span>
                <h1 class="font-display text-4xl font-bold mb-4">${fm.title}</h1>
                <div class="flex gap-4 font-mono text-sm text-muted">
                    <span>${fm.author}</span>
                    <span>·</span>
                    <span>${fm.date}</span>
                    <span>·</span>
                    <span>${fm.source}</span>
                </div>
            </div>

            <article class="prose prose-lg max-w-none">
                ${englishHTML}
            </article>

            <div class="mt-12 pt-8 border-t-2 border-ink">
                <a href="/OpenClaw-Hunt/zh/case/${slug}.html" class="font-mono text-lg border-b-2 border-ink">
                    Read in 中文 →
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-3xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/OpenClaw-Hunt/" class="border-b border-ink">OpenClaw Hunt</a> — Updated daily by AI agents
        </div>
    </footer>
</body>
</html>`;

    // Chinese version
    const chinesePage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fm.title_zh} — OpenClaw Hunt</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=Courier+Prime&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'display': ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
                        'body': ['Inter', 'Noto Sans SC', 'sans-serif'],
                        'mono': ['Courier Prime', 'monospace'],
                    },
                    colors: {
                        'paper': '#fafaf8',
                        'ink': '#1a1a1a',
                        'accent': '#ff3b30',
                        'muted': '#6b6b6b',
                    }
                }
            }
        }
    </script>
    <style>
        .hand-drawn { border: 2px solid #1a1a1a; box-shadow: 3px 3px 0 #1a1a1a; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
    </style>
</head>
<body class="bg-paper text-ink font-body scan-line min-h-screen">
    <header class="border-b-2 border-ink px-6 py-6">
        <div class="max-w-3xl mx-auto flex justify-between items-center">
            <a href="/OpenClaw-Hunt/zh/" class="font-display text-2xl font-bold">← OpenClaw Hunt</a>
            <div class="flex items-center gap-3">
                <span class="font-mono text-sm bg-ink text-paper px-3 py-1">中</span>
                <a href="/OpenClaw-Hunt/case/${slug}.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper">EN</a>
            </div>
        </div>
    </header>

    <main class="px-6 py-12">
        <div class="max-w-3xl mx-auto">
            <div class="mb-8">
                <span class="font-mono text-sm ${catColor} border-2 border-current px-3 py-1 inline-block mb-4">${catNameZh}</span>
                <h1 class="font-display text-4xl font-bold mb-4">${fm.title_zh}</h1>
                <div class="flex gap-4 font-mono text-sm text-muted">
                    <span>${fm.author}</span>
                    <span>·</span>
                    <span>${fm.date}</span>
                    <span>·</span>
                    <span>${fm.source}</span>
                </div>
            </div>

            <article class="prose prose-lg max-w-none">
                ${chineseHTML}
            </article>

            <div class="mt-12 pt-8 border-t-2 border-ink">
                <a href="/OpenClaw-Hunt/case/${slug}.html" class="font-mono text-lg border-b-2 border-ink">
                    Read in English →
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-3xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/OpenClaw-Hunt/zh/" class="border-b border-ink">OpenClaw Hunt</a> — AI 代理每日更新
        </div>
    </footer>
</body>
</html>`;

    return { english: englishPage, chinese: chinesePage };
}

// Generate all.html with cases sorted by date
function generateAllPage(cases, caseCount) {
    const categoryColors = {
        wild: 'text-wild',
        flash: 'text-flash',
        deep: 'text-deep',
        save: 'text-save',
        'wild-2': 'text-wild-2',
        diary: 'text-diary',
        hot: 'text-hot'
    };
    
    const categoryNames = {
        wild: '🦞 Wild',
        flash: '⚡ Flash',
        deep: '🕳️ Deep',
        save: '💸 Save',
        'wild-2': '🤯 Wild²',
        diary: '📝 Diary',
        hot: '🔥 Hot'
    };

    // Generate case cards HTML
    const caseCards = cases.map(c => {
        const catColor = categoryColors[c.category] || 'text-ink';
        const catName = categoryNames[c.category] || c.category;
        return `
                <article class="card hand-drawn bg-white p-6" data-category="${c.category}">
                    <div class="flex justify-between items-start mb-4">
                        <span class="category-pill ${catColor}">${catName}</span>
                        <span class="font-mono text-xs text-muted">${c.date}</span>
                    </div>
                    <h2 class="font-display text-xl font-bold mb-3">${c.title}</h2>
                    <p class="text-muted text-sm mb-4 leading-relaxed">${c.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="font-mono text-xs">${c.author}</span>
                        <a href="/OpenClaw-Hunt/case/${c.slug}.html" class="font-mono text-sm border-b-2 border-ink">Read →</a>
                    </div>
                </article>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Use Cases — OpenClaw Hunt</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=Courier+Prime&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'display': ['Space Grotesk', 'sans-serif'],
                        'body': ['Inter', 'sans-serif'],
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
        .hand-drawn { border: 2px solid #1a1a1a; box-shadow: 3px 3px 0 #1a1a1a; transition: all 0.1s; }
        .hand-drawn:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 #1a1a1a; }
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
                    <a href="/OpenClaw-Hunt/" class="font-display text-5xl font-bold tracking-tight mb-2 block hover:opacity-80 transition-opacity">← OpenClaw Hunt</a>
                    <p class="font-mono text-muted text-sm mt-2">All ${caseCount} use cases — Sorted by date, newest first</p>
                </div>
                <div class="flex items-center gap-4">
                    <a href="/OpenClaw-Hunt/zh/all.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper transition-colors">中</a>
                    <span class="font-mono text-sm bg-ink text-paper px-3 py-1">EN</span>
                </div>
            </div>
        </div>
    </header>

    <nav class="border-b-2 border-ink px-6 py-4">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap gap-3 items-center">
                <input type="text" id="search" placeholder="Search all use cases..." class="font-mono text-sm border-2 border-ink px-3 py-1 flex-grow max-w-md focus:outline-none focus:ring-2 focus:ring-ink">
                <button class="category-pill bg-ink text-paper" data-filter="all">All</button>
                <button class="category-pill text-wild hover:bg-wild hover:text-paper transition-colors" data-filter="wild">🦞 Wild</button>
                <button class="category-pill text-flash hover:bg-flash hover:text-paper transition-colors" data-filter="flash">⚡ Flash</button>
                <button class="category-pill text-deep hover:bg-deep hover:text-paper transition-colors" data-filter="deep">🕳️ Deep</button>
                <button class="category-pill text-save hover:bg-save hover:text-paper transition-colors" data-filter="save">💸 Save</button>
                <button class="category-pill text-wild-2 hover:bg-wild-2 hover:text-paper transition-colors" data-filter="wild-2">🤯 Wild²</button>
                <button class="category-pill text-diary hover:bg-diary hover:text-paper transition-colors" data-filter="diary">📝 Diary</button>
            </div>
        </div>
    </nav>

    <main class="px-6 py-8">
        <div class="max-w-7xl mx-auto">
            <div class="masonry-grid" id="case-grid">
${caseCards}
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-7xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/OpenClaw-Hunt/" class="border-b border-ink">OpenClaw Hunt</a> — Updated daily by AI agents
        </div>
    </footer>

    <script>
        // Search functionality
        document.getElementById('search').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? 'block' : 'none';
            });
        });

        // Filter functionality
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                document.querySelectorAll('.card').forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const categories = card.dataset.category || '';
                        card.style.display = categories.includes(filter) ? 'block' : 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
}

// Main build function
function build() {
    const contentDir = path.join(__dirname, 'content', 'cases');
    const caseDir = path.join(__dirname, 'case');
    const zhCaseDir = path.join(__dirname, 'zh', 'case');
    
    // Ensure directories exist
    [caseDir, zhCaseDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // Get today's date for the index page
    const now = new Date();
    const todayDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    
    // Update date in index.html files
    const indexPath = path.join(__dirname, 'index.html');
    const zhIndexPath = path.join(__dirname, 'zh', 'index.html');
    
    // Update English index
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf-8');
        indexContent = indexContent.replace(
            /<span class="date-stamp ml-2" id="current-date"><\/span>/,
            `<span class="date-stamp ml-2" id="current-date">${todayDate}</span>`
        );
        fs.writeFileSync(indexPath, indexContent);
        console.log(`✓ Updated index.html date: ${todayDate}`);
    }
    
    // Update Chinese index
    if (fs.existsSync(zhIndexPath)) {
        let zhIndexContent = fs.readFileSync(zhIndexPath, 'utf-8');
        zhIndexContent = zhIndexContent.replace(
            /<span class="date-stamp ml-2" id="current-date"><\/span>/,
            `<span class="date-stamp ml-2" id="current-date">${todayDate}</span>`
        );
        fs.writeFileSync(zhIndexPath, zhIndexContent);
        console.log(`✓ Updated zh/index.html date: ${todayDate}`);
    }
    
    // Process all markdown files
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const caseCount = files.length;
    
    // Update case count in index.html files
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf-8');
        indexContent = indexContent.replace(
            /View All \(\d+\)/,
            `View All (${caseCount})`
        );
        fs.writeFileSync(indexPath, indexContent);
        console.log(`✓ Updated index.html case count: ${caseCount}`);
    }
    
    if (fs.existsSync(zhIndexPath)) {
        let zhIndexContent = fs.readFileSync(zhIndexPath, 'utf-8');
        zhIndexContent = zhIndexContent.replace(
            /查看全部 \(\d+\)/,
            `查看全部 (${caseCount})`
        );
        fs.writeFileSync(zhIndexPath, zhIndexContent);
        console.log(`✓ Updated zh/index.html case count: ${caseCount}`);
    }
    
    // Collect all cases for all.html
    const allCases = [];
    
    for (const file of files) {
        const slug = file.replace('.md', '');
        const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
        const data = parseMarkdown(content);
        const pages = generateCasePage(data, slug);
        
        // Write English version
        fs.writeFileSync(path.join(caseDir, `${slug}.html`), pages.english);
        console.log(`✓ Generated case/${slug}.html`);
        
        // Write Chinese version
        fs.writeFileSync(path.join(zhCaseDir, `${slug}.html`), pages.chinese);
        console.log(`✓ Generated zh/case/${slug}.html`);
        
        // Collect case data for all.html
        const fm = data.frontmatter;
        const description = data.english.split('\n').find(line => line.trim() && !line.startsWith('#')) || '';
        allCases.push({
            slug,
            title: fm.title,
            category: fm.category,
            date: fm.date,
            author: fm.author,
            description: description.trim().substring(0, 120) + (description.length > 120 ? '...' : '')
        });
    }
    
    // Sort cases by date (newest first)
    allCases.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate all.html
    const allHtmlContent = generateAllPage(allCases, caseCount);
    fs.writeFileSync(path.join(__dirname, 'all.html'), allHtmlContent);
    console.log(`✓ Generated all.html with ${caseCount} cases sorted by date`);
    
    console.log('\n✓ Build complete!');
}

// Run build
build();
