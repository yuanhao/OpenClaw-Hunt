#!/usr/bin/env node
/**
 * Build script for OpenClaw Hunt
 * Converts Markdown content to HTML pages
 */

const fs = require('fs');
const path = require('path');

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

// Convert markdown to HTML (simplified)
function markdownToHTML(md) {
    let html = md
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code>$2</code></pre>')
        // Inline code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Blockquotes
        .replace(/^\u003e (.+)$/gm, '<blockquote>$1</blockquote>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="border-b-2 border-ink">$1</a>')
        // Lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Paragraphs
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p && !p.startsWith('<'))
        .map(p => `<p class="mb-4 leading-relaxed">${p}</p>`)
        .join('\n');
    
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
            <a href="/" class="font-display text-2xl font-bold">← OpenClaw Hunt</a>
            <div class="flex items-center gap-3">
                <a href="/zh/case/${slug}.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper">中</a>
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
                <a href="/zh/case/${slug}.html" class="font-mono text-lg border-b-2 border-ink">
                    Read in 中文 →
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-3xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/" class="border-b border-ink">OpenClaw Hunt</a> — Updated daily by AI agents
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
            <a href="/zh/" class="font-display text-2xl font-bold">← OpenClaw Hunt</a>
            <div class="flex items-center gap-3">
                <span class="font-mono text-sm bg-ink text-paper px-3 py-1">中</span>
                <a href="/case/${slug}.html" class="font-mono text-sm border-2 border-ink px-3 py-1 hover:bg-ink hover:text-paper">EN</a>
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
                <a href="/case/${slug}.html" class="font-mono text-lg border-b-2 border-ink">
                    Read in English →
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t-2 border-ink px-6 py-8 mt-12">
        <div class="max-w-3xl mx-auto text-center font-mono text-sm text-muted">
            <a href="/zh/" class="border-b border-ink">OpenClaw Hunt</a> — AI 代理每日更新
        </div>
    </footer>
</body>
</html>`;

    return { english: englishPage, chinese: chinesePage };
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
    
    // Process all markdown files
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    
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
    }
    
    console.log('\n✓ Build complete!');
}

// Run build
build();
