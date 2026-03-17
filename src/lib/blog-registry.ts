// src/lib/blog-registry.ts
// Auto-generated blog post registry for SEO traffic

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  relatedTool?: string; // tool slug
  publishDate: string;
  readingTime: number;
  content: BlogSection[];
}

export interface BlogSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'code';
  content: string | string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-json',
    title: 'What is JSON? A Complete Beginner\'s Guide',
    metaTitle: 'What is JSON? A Complete Beginner\'s Guide (2024)',
    metaDescription: 'Learn what JSON is, how it works, and why it\'s the most popular data format on the web. Includes examples, syntax rules, and common use cases.',
    excerpt: 'JSON (JavaScript Object Notation) is the most widely used data format on the web. Learn what it is, how it works, and how to use it.',
    category: 'developer',
    relatedTool: 'json-formatter',
    publishDate: '2024-01-15',
    readingTime: 6,
    content: [
      { type: 'p', content: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format that\'s easy for humans to read and write and easy for machines to parse and generate. Despite its name, JSON is language-independent and is used across virtually every programming language.' },
      { type: 'h2', content: 'JSON Syntax Rules' },
      { type: 'ul', content: ['Data is in name/value pairs', 'Data is separated by commas', 'Curly braces hold objects', 'Square brackets hold arrays', 'Strings must use double quotes'] },
      { type: 'h2', content: 'A Simple JSON Example' },
      { type: 'code', content: '{\n  "name": "John Doe",\n  "age": 30,\n  "isActive": true,\n  "tags": ["developer", "designer"]\n}' },
      { type: 'h2', content: 'JSON Data Types' },
      { type: 'p', content: 'JSON supports six data types: strings, numbers, objects, arrays, booleans (true/false), and null. This covers the vast majority of data you\'ll ever need to represent.' },
      { type: 'h2', content: 'Why is JSON So Popular?' },
      { type: 'p', content: 'JSON replaced XML as the de-facto web data format because it\'s more compact, easier to read, and maps directly to data structures in nearly every programming language. REST APIs, configuration files, and databases like MongoDB all rely on JSON.' },
      { type: 'h2', content: 'Common JSON Mistakes to Avoid' },
      { type: 'ul', content: ['Using single quotes instead of double quotes', 'Leaving a trailing comma after the last item', 'Forgetting quotes around string keys', 'Using undefined or functions as values'] },
    ],
  },
  {
    slug: 'how-to-format-json',
    title: 'How to Format JSON: A Complete Guide',
    metaTitle: 'How to Format JSON: Tools, Tips & Best Practices (2024)',
    metaDescription: 'Learn how to format and beautify JSON using online tools, code editors, and command-line utilities. Includes tips for handling large files.',
    excerpt: 'Formatted JSON is easier to read and debug. Here\'s every way to format JSON, from online tools to command-line tricks.',
    category: 'developer',
    relatedTool: 'json-formatter',
    publishDate: '2024-01-20',
    readingTime: 5,
    content: [
      { type: 'p', content: 'Unformatted JSON is a nightmare to debug. A single long line of JSON with hundreds of fields is nearly impossible to read. Formatting (also called "pretty printing") adds indentation and line breaks to make the structure immediately visible.' },
      { type: 'h2', content: 'Method 1: Use an Online JSON Formatter' },
      { type: 'p', content: 'The fastest way. Just paste your JSON into an online formatter, click format, and get back beautified JSON. Our JSON formatter also validates your JSON and highlights any syntax errors.' },
      { type: 'h2', content: 'Method 2: Using JavaScript' },
      { type: 'code', content: 'const data = {"name":"John","age":30};\nconsole.log(JSON.stringify(data, null, 2));' },
      { type: 'h2', content: 'Method 3: Using Python' },
      { type: 'code', content: 'import json\ndata = \'{"name":"John","age":30}\'\nparsed = json.loads(data)\nprint(json.dumps(parsed, indent=2))' },
      { type: 'h2', content: 'Method 4: Using the Command Line (jq)' },
      { type: 'code', content: 'echo \'{"name":"John"}\' | jq .\n# Or format a file:\ncat data.json | jq .' },
      { type: 'h2', content: 'JSON Formatting Best Practices' },
      { type: 'ul', content: ['Use 2 spaces for indentation (industry standard)', 'Sort keys alphabetically for easier navigation', 'Minify JSON for production to reduce file size', 'Always validate after formatting to catch any errors'] },
    ],
  },
  {
    slug: 'base64-encode-guide',
    title: 'Base64 Encoding Explained: What It Is and How to Use It',
    metaTitle: 'Base64 Encoding Guide – What It Is, How It Works & Examples',
    metaDescription: 'A complete guide to Base64 encoding. Learn what it is, when to use it, how to encode and decode in JavaScript, Python, and online tools.',
    excerpt: 'Base64 is everywhere — in emails, APIs, and image embedding. Here\'s everything you need to know about it.',
    category: 'developer',
    relatedTool: 'base64-encode',
    publishDate: '2024-02-01',
    readingTime: 7,
    content: [
      { type: 'p', content: 'Base64 is a binary-to-text encoding scheme that encodes binary data by treating it numerically and translating it into a base-64 representation. The name comes from the 64 ASCII characters used: A-Z, a-z, 0-9, +, and /.' },
      { type: 'h2', content: 'Why Base64 Exists' },
      { type: 'p', content: 'Many systems were designed to handle only text. Email protocols (SMTP), HTTP headers, and HTML attributes all expect plain text. Base64 allows binary data (images, files, certificates) to be safely embedded in text-based systems without corruption.' },
      { type: 'h2', content: 'Common Use Cases' },
      { type: 'ul', content: ['Embedding images in HTML/CSS as data URLs', 'Encoding email attachments (MIME)', 'Storing binary data in JSON', 'Basic authentication headers in HTTP', 'Encoding cryptographic keys and certificates'] },
      { type: 'h2', content: 'Base64 in JavaScript' },
      { type: 'code', content: '// Encode\nconst encoded = btoa("Hello, World!");\n// Decode\nconst decoded = atob(encoded);' },
      { type: 'h2', content: 'Base64 vs Encryption' },
      { type: 'p', content: 'This is a critical distinction. Base64 is encoding, not encryption. Anyone can decode a Base64 string with zero effort. Never use Base64 to hide passwords or sensitive data — use proper encryption instead.' },
    ],
  },
  {
    slug: 'image-compression-guide',
    title: 'Image Compression Guide: How to Reduce Image File Size',
    metaTitle: 'Image Compression Guide 2024 – How to Reduce Image File Size',
    metaDescription: 'Learn how to compress images for the web without losing quality. Covers JPEG, PNG, WebP, and tools to reduce image file sizes.',
    excerpt: 'Large images slow down websites and frustrate users. Here\'s how to compress images effectively without sacrificing quality.',
    category: 'image',
    relatedTool: 'image-compressor',
    publishDate: '2024-02-10',
    readingTime: 8,
    content: [
      { type: 'p', content: 'Images account for the majority of bytes on most web pages. Compressing them properly can cut page load times in half and significantly improve Core Web Vitals scores.' },
      { type: 'h2', content: 'Lossy vs Lossless Compression' },
      { type: 'p', content: 'Lossy compression permanently removes some data to achieve smaller sizes. JPEG uses lossy compression. Lossless compression reduces file size without losing any data. PNG uses lossless compression. For most web images, lossy compression at quality 80-85% is undetectable to the human eye.' },
      { type: 'h2', content: 'Which Format Should You Use?' },
      { type: 'ul', content: ['JPEG: Photos and complex images with many colors', 'PNG: Images with text, logos, or transparency', 'WebP: Modern format that beats both JPEG and PNG in size', 'AVIF: Newest format, smallest sizes, less browser support'] },
      { type: 'h2', content: 'Target File Sizes' },
      { type: 'ul', content: ['Hero images: under 200KB', 'Blog post images: under 100KB', 'Thumbnails: under 30KB', 'Icons and logos: under 10KB'] },
    ],
  },
  {
    slug: 'pdf-merge-guide',
    title: 'How to Merge PDF Files: The Complete Guide',
    metaTitle: 'How to Merge PDF Files Online – Free Tools & Step-by-Step Guide',
    metaDescription: 'Learn how to merge PDF files online, on Windows, Mac, and mobile. Covers free tools, command-line methods, and best practices.',
    excerpt: 'Merging PDF files is a common task. Here\'s every way to do it — free online tools, desktop apps, and command-line methods.',
    category: 'pdf',
    relatedTool: 'pdf-merge',
    publishDate: '2024-02-15',
    readingTime: 6,
    content: [
      { type: 'p', content: 'Merging multiple PDFs into a single file is one of the most common document tasks. Whether you\'re combining invoices, reports, or form submissions, the right tool makes it effortless.' },
      { type: 'h2', content: 'Method 1: Free Online PDF Merger (Fastest)' },
      { type: 'p', content: 'Our online PDF merger lets you drag and drop multiple files, reorder them, and combine them in seconds — without uploading anything to a server.' },
      { type: 'h2', content: 'Method 2: Using Python (pypdf)' },
      { type: 'code', content: 'from pypdf import PdfMerger\nmerger = PdfMerger()\nfor pdf in ["file1.pdf", "file2.pdf"]:\n    merger.append(pdf)\nmerger.write("merged.pdf")' },
      { type: 'h2', content: 'Method 3: Mac Preview' },
      { type: 'p', content: 'Open a PDF in Preview, open the sidebar (View → Thumbnails), drag pages from another PDF\'s thumbnail view into the sidebar, then export as PDF.' },
    ],
  },
  {
    slug: 'seo-meta-tags-guide',
    title: 'SEO Meta Tags: The Complete 2024 Guide',
    metaTitle: 'SEO Meta Tags Guide 2024 – Title, Description, OG & More',
    metaDescription: 'Learn every important SEO meta tag: title, description, robots, Open Graph, Twitter Cards. Includes templates and best practices.',
    excerpt: 'Meta tags are the foundation of on-page SEO. Here\'s every tag that matters, with examples and best practices.',
    category: 'seo',
    relatedTool: 'meta-tag-generator',
    publishDate: '2024-03-01',
    readingTime: 9,
    content: [
      { type: 'p', content: 'Meta tags are HTML elements that provide metadata about a web page. While not all meta tags directly influence rankings, they dramatically affect how your page appears in search results and social media shares.' },
      { type: 'h2', content: 'The Title Tag' },
      { type: 'p', content: 'The title tag is the most important on-page SEO element. It appears as the clickable headline in search results. Best practices: 50-60 characters, include your primary keyword, make it compelling for clicks.' },
      { type: 'code', content: '<title>Free JSON Formatter Online – Fast & Secure Tool</title>' },
      { type: 'h2', content: 'Meta Description' },
      { type: 'p', content: 'The meta description appears as the snippet under your title in search results. While it doesn\'t directly affect rankings, a compelling description improves click-through rates. Keep it under 160 characters.' },
      { type: 'h2', content: 'Open Graph Tags' },
      { type: 'p', content: 'Open Graph tags control how your page appears when shared on social media platforms like Facebook and LinkedIn.' },
      { type: 'code', content: '<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Your description">\n<meta property="og:image" content="https://example.com/image.jpg">' },
      { type: 'h2', content: 'Robots Meta Tag' },
      { type: 'p', content: 'The robots meta tag tells search engines whether to index a page and follow its links. Use noindex for pages you don\'t want in search results.' },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter(p => p.category === category);
}
