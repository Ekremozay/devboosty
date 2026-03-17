// src/lib/tools-registry.ts
// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL TOOL REGISTRY
// Add a new tool here and it auto-gets: SEO page, category listing,
// related-tools widget, sitemap entry, and blog suggestions.
// ─────────────────────────────────────────────────────────────────────────────

export type ToolCategory =
  | 'developer'
  | 'text'
  | 'seo'
  | 'image'
  | 'pdf'
  | 'converter';

export interface Tool {
  slug: string;          // URL slug: /tools/{category}/{slug}
  category: ToolCategory;
  name: string;          // Display name
  tagline: string;       // Short tagline used in cards
  description: string;   // Longer description for SEO meta
  h1: string;            // H1 heading on the tool page
  metaTitle: string;     // <title> tag
  metaDescription: string;
  keywords: string[];
  icon: string;          // emoji icon
  component: string;     // React component filename (no extension)
  popular?: boolean;
  new?: boolean;
  relatedSlugs?: string[];
  faq?: { q: string; a: string }[];
}

export const TOOLS: Tool[] = [
  // ── DEVELOPER ──────────────────────────────────────────────────────────────
  {
    slug: 'json-formatter',
    category: 'developer',
    name: 'JSON Formatter',
    tagline: 'Format, beautify & validate JSON instantly',
    description: 'Free online JSON formatter and validator. Beautify minified JSON, fix errors, and explore your data with syntax highlighting.',
    h1: 'JSON Formatter Tool (Free & Online)',
    metaTitle: 'Free JSON Formatter Online – Fast, Secure & No Signup',
    metaDescription: 'Format and beautify JSON instantly with our free online JSON formatter. Validate JSON errors, syntax highlight, and minify – no signup required.',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'format json online', 'pretty print json'],
    icon: '{}',
    component: 'JSONFormatter',
    popular: true,
    relatedSlugs: ['json-minify', 'base64-encode', 'html-formatter'],
    faq: [
      { q: 'What is a JSON formatter?', a: 'A JSON formatter (also called a JSON beautifier) takes compact or minified JSON and adds proper indentation, line breaks, and spacing to make it human-readable.' },
      { q: 'Is this JSON formatter free?', a: 'Yes, completely free with no registration required. All processing happens in your browser — your data never leaves your device.' },
      { q: 'Can it validate JSON errors?', a: 'Yes. The formatter highlights syntax errors and tells you exactly which line and character is causing the problem.' },
      { q: 'What is the maximum file size?', a: 'There is no hard limit since processing is client-side, but very large files (50MB+) may be slow depending on your device.' },
    ],
  },
  {
    slug: 'json-minify',
    category: 'developer',
    name: 'JSON Minify',
    tagline: 'Strip whitespace from JSON to reduce file size',
    description: 'Minify and compress JSON by removing all unnecessary whitespace. Perfect for production APIs and reducing payload sizes.',
    h1: 'JSON Minifier / Compressor (Free Online)',
    metaTitle: 'JSON Minify Online – Compress & Minify JSON Free',
    metaDescription: 'Minify JSON by removing whitespace and comments. Reduce JSON file size instantly — free, fast, and no signup needed.',
    keywords: ['json minify', 'json compress', 'minify json online', 'json uglify'],
    icon: '⚡',
    component: 'JSONMinify',
    relatedSlugs: ['json-formatter', 'base64-encode'],
    faq: [
      { q: 'What does JSON minify do?', a: 'It removes all unnecessary whitespace (spaces, tabs, newlines) from JSON, reducing the file size without changing the data structure.' },
      { q: 'Why minify JSON?', a: 'Minified JSON is faster to transfer over networks and reduces bandwidth costs for APIs and web applications.' },
    ],
  },
  {
    slug: 'base64-encode',
    category: 'developer',
    name: 'Base64 Encode / Decode',
    tagline: 'Encode and decode Base64 strings instantly',
    description: 'Free online Base64 encoder and decoder. Convert text or files to Base64 and back. Supports UTF-8 strings and binary data.',
    h1: 'Base64 Encode & Decode Tool (Free Online)',
    metaTitle: 'Base64 Encoder Decoder Online – Free & Instant',
    metaDescription: 'Encode text or files to Base64 and decode Base64 strings back to plain text. Free, instant, no signup — works entirely in your browser.',
    keywords: ['base64 encode', 'base64 decode', 'base64 encoder', 'base64 decoder online', 'encode base64'],
    icon: '🔐',
    component: 'Base64Tool',
    popular: true,
    relatedSlugs: ['url-encoder', 'jwt-decoder', 'html-viewer'],
    faq: [
      { q: 'What is Base64 encoding?', a: 'Base64 is a binary-to-text encoding scheme that represents binary data using 64 ASCII characters. It\'s widely used in email attachments, data URLs, and API authentication.' },
      { q: 'Is Base64 the same as encryption?', a: 'No. Base64 is encoding, not encryption. It\'s easily reversible and provides no security. Never use it to hide sensitive data.' },
      { q: 'Can I encode files with this tool?', a: 'Yes. Use the "File" tab to upload any file and get its Base64 representation, useful for embedding images in CSS or HTML.' },
    ],
  },
  {
    slug: 'html-viewer',
    category: 'developer',
    name: 'HTML Viewer',
    tagline: 'Preview HTML code in real-time in your browser',
    description: 'Free online HTML viewer with live preview. Paste HTML code and see it rendered instantly. Great for testing snippets and email templates.',
    h1: 'HTML Viewer & Live Preview Tool (Free Online)',
    metaTitle: 'HTML Viewer Online – Live Preview HTML Code Free',
    metaDescription: 'Preview HTML code instantly in your browser. Paste any HTML and see a live rendered preview — free online HTML viewer, no signup required.',
    keywords: ['html viewer', 'html preview', 'html renderer online', 'live html preview', 'test html online'],
    icon: '</> ',
    component: 'HTMLViewer',
    popular: true,
    relatedSlugs: ['html-formatter', 'json-formatter', 'base64-encode'],
    faq: [
      { q: 'What is an HTML viewer?', a: 'An HTML viewer renders raw HTML code as a visual web page, so you can see exactly how it would look in a browser without creating a file.' },
      { q: 'Can I test JavaScript in the HTML viewer?', a: 'Yes. The live preview renders HTML, CSS, and JavaScript just like a browser would.' },
      { q: 'Is this tool safe for sensitive HTML?', a: 'All rendering happens locally in your browser using a sandboxed iframe. No code is sent to any server.' },
    ],
  },
  {
    slug: 'html-formatter',
    category: 'developer',
    name: 'HTML Formatter',
    tagline: 'Beautify and indent HTML code automatically',
    description: 'Format and beautify messy HTML with proper indentation. Great for cleaning up code from editors or CMS exports.',
    h1: 'HTML Formatter & Beautifier (Free Online)',
    metaTitle: 'HTML Formatter Online – Beautify & Indent HTML Free',
    metaDescription: 'Beautify and format HTML code online with proper indentation. Clean up messy HTML in one click — free, no signup required.',
    keywords: ['html formatter', 'html beautifier', 'format html online', 'indent html', 'html pretty print'],
    icon: '🎨',
    component: 'HTMLFormatter',
    relatedSlugs: ['html-viewer', 'json-formatter'],
    faq: [
      { q: 'What does HTML formatting do?', a: 'It adds consistent indentation and line breaks to HTML, making it easier to read and maintain.' },
    ],
  },
  {
    slug: 'url-encoder',
    category: 'developer',
    name: 'URL Encoder / Decoder',
    tagline: 'Encode and decode URL components instantly',
    description: 'Encode special characters in URLs and decode percent-encoded strings. Essential for working with query parameters and API calls.',
    h1: 'URL Encoder & Decoder Tool (Free Online)',
    metaTitle: 'URL Encoder Decoder Online – Percent Encode URLs Free',
    metaDescription: 'Encode and decode URLs and query string parameters online. Convert special characters to percent encoding — free, instant, no signup.',
    keywords: ['url encoder', 'url decoder', 'percent encode url', 'url encode online', 'decode url online'],
    icon: '🔗',
    component: 'URLEncoderDecoder',
    relatedSlugs: ['base64-encode', 'jwt-decoder'],
    faq: [
      { q: 'What is URL encoding?', a: 'URL encoding (percent encoding) converts characters that are not allowed in URLs into a % followed by two hexadecimal digits.' },
    ],
  },
  {
    slug: 'jwt-decoder',
    category: 'developer',
    name: 'JWT Decoder',
    tagline: 'Decode and inspect JWT tokens instantly',
    description: 'Decode JSON Web Tokens (JWT) to inspect their header, payload, and signature. Debug authentication issues quickly.',
    h1: 'JWT Decoder Tool – Decode & Inspect JWTs Online',
    metaTitle: 'JWT Decoder Online – Decode JSON Web Tokens Free',
    metaDescription: 'Decode and inspect JWT tokens online. View the header, payload, and expiration of any JSON Web Token — free, no signup, works in your browser.',
    keywords: ['jwt decoder', 'decode jwt', 'json web token decoder', 'jwt inspector', 'jwt parser online'],
    icon: '🔑',
    component: 'JWTDecoder',
    relatedSlugs: ['base64-encode', 'url-encoder'],
    faq: [
      { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It consists of a header, payload, and signature, separated by dots.' },
      { q: 'Is it safe to decode my JWT here?', a: 'Yes. All decoding is done locally in your browser using JavaScript. Your token is never sent to any server.' },
    ],
  },
  {
    slug: 'regex-tester',
    category: 'developer',
    name: 'Regex Tester',
    tagline: 'Test and debug regular expressions live',
    description: 'Test regular expressions with live match highlighting. Supports flags, capture groups, and detailed match information.',
    h1: 'Regex Tester & Debugger (Free Online)',
    metaTitle: 'Regex Tester Online – Test Regular Expressions Free',
    metaDescription: 'Test and debug regular expressions online with live match highlighting. Supports all JavaScript regex flags — free, no signup required.',
    keywords: ['regex tester', 'regular expression tester', 'test regex online', 'regex debugger', 'regex checker'],
    icon: '🔍',
    component: 'RegexTester',
    relatedSlugs: ['json-formatter', 'url-encoder'],
    faq: [
      { q: 'What regex flavor does this support?', a: 'This tester uses JavaScript (ECMAScript) regular expression syntax, which supports flags: g, i, m, s, u, y.' },
    ],
  },

  // ── TEXT ───────────────────────────────────────────────────────────────────
  {
    slug: 'word-counter',
    category: 'text',
    name: 'Word Counter',
    tagline: 'Count words, characters, sentences & reading time',
    description: 'Free online word counter that counts words, characters, sentences, paragraphs, and estimates reading time. Perfect for essays, blog posts, and social media.',
    h1: 'Word Counter Tool – Count Words & Characters Free',
    metaTitle: 'Word Counter Online – Count Words, Characters & Reading Time',
    metaDescription: 'Count words, characters, sentences, and paragraphs instantly. Get reading time estimates for your text — free online word counter, no signup.',
    keywords: ['word counter', 'character counter', 'word count online', 'count words free', 'reading time calculator'],
    icon: '📝',
    component: 'WordCounter',
    popular: true,
    relatedSlugs: ['case-converter', 'remove-line-breaks', 'text-sorter'],
    faq: [
      { q: 'How is reading time calculated?', a: 'Reading time is calculated based on an average reading speed of 200 words per minute, which is typical for most adults.' },
      { q: 'Does it count spaces as characters?', a: 'We show both: characters with spaces and characters without spaces. Toggle between them using the display options.' },
      { q: 'What\'s the maximum text length?', a: 'There is no limit. The counter processes text entirely in your browser with no server upload.' },
    ],
  },
  {
    slug: 'case-converter',
    category: 'text',
    name: 'Case Converter',
    tagline: 'Convert text to UPPER, lower, Title, or camelCase',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    h1: 'Case Converter Tool – Convert Text Case Online Free',
    metaTitle: 'Case Converter Online – UPPER, lower, Title, camelCase & More',
    metaDescription: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case and more. Free online case converter — instant, no signup required.',
    keywords: ['case converter', 'text case converter', 'uppercase converter', 'lowercase converter', 'camelcase converter'],
    icon: 'Aa',
    component: 'CaseConverter',
    relatedSlugs: ['word-counter', 'text-sorter'],
    faq: [
      { q: 'What cases are supported?', a: 'UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.' },
    ],
  },
  {
    slug: 'remove-line-breaks',
    category: 'text',
    name: 'Remove Line Breaks',
    tagline: 'Strip newlines and format paragraphs cleanly',
    description: 'Remove unwanted line breaks from text, PDFs, or emails. Join lines into paragraphs or a single line instantly.',
    h1: 'Remove Line Breaks from Text (Free Online Tool)',
    metaTitle: 'Remove Line Breaks Online – Strip Newlines From Text Free',
    metaDescription: 'Remove unwanted line breaks from text instantly. Clean up copied PDF text, emails, or documents — free, online, no signup required.',
    keywords: ['remove line breaks', 'strip newlines', 'remove newlines online', 'join lines tool'],
    icon: '↩',
    component: 'RemoveLineBreaks',
    relatedSlugs: ['word-counter', 'text-sorter', 'duplicate-line-remover'],
    faq: [
      { q: 'Why does copied PDF text have extra line breaks?', a: 'PDFs store text with hard line breaks at the end of each line. Our tool joins them back into flowing paragraphs.' },
    ],
  },
  {
    slug: 'text-sorter',
    category: 'text',
    name: 'Text Sorter',
    tagline: 'Sort lines alphabetically, numerically, or randomly',
    description: 'Sort lines of text alphabetically (A-Z or Z-A), by length, numerically, or randomly. Remove duplicates while sorting.',
    h1: 'Text Sorter – Sort Lines Alphabetically Online Free',
    metaTitle: 'Text Sorter Online – Sort Lines Alphabetically or Numerically',
    metaDescription: 'Sort lines of text alphabetically, numerically, by length, or randomly. Remove duplicates while sorting — free online tool, no signup.',
    keywords: ['text sorter', 'sort lines alphabetically', 'sort text online', 'alphabetize list online'],
    icon: '🔤',
    component: 'TextSorter',
    relatedSlugs: ['duplicate-line-remover', 'word-counter'],
    faq: [],
  },
  {
    slug: 'duplicate-line-remover',
    category: 'text',
    name: 'Duplicate Line Remover',
    tagline: 'Remove duplicate lines from any text instantly',
    description: 'Find and remove duplicate lines from text lists, code, CSV data, or any content. Case-sensitive or insensitive matching.',
    h1: 'Remove Duplicate Lines from Text (Free Online)',
    metaTitle: 'Duplicate Line Remover Online – Remove Duplicate Lines Free',
    metaDescription: 'Remove duplicate lines from text instantly. Case-sensitive or insensitive matching — free online duplicate remover, no signup required.',
    keywords: ['duplicate line remover', 'remove duplicate lines', 'deduplicate text', 'remove duplicates online'],
    icon: '🗑️',
    component: 'DuplicateLineRemover',
    relatedSlugs: ['text-sorter', 'remove-line-breaks'],
    faq: [],
  },

  // ── SEO ────────────────────────────────────────────────────────────────────
  {
    slug: 'meta-tag-generator',
    category: 'seo',
    name: 'Meta Tag Generator',
    tagline: 'Generate SEO meta tags for any webpage',
    description: 'Generate complete HTML meta tags including title, description, Open Graph, Twitter Cards, and robots directives. Copy and paste ready.',
    h1: 'Meta Tag Generator – Free SEO Meta Tags Tool',
    metaTitle: 'Meta Tag Generator Online – Free SEO Meta Tags Generator',
    metaDescription: 'Generate SEO meta tags, Open Graph tags, and Twitter Cards for your website. Copy-paste ready HTML — free online meta tag generator.',
    keywords: ['meta tag generator', 'seo meta tags', 'open graph generator', 'twitter card generator', 'html meta tags'],
    icon: '🏷️',
    component: 'MetaTagGenerator',
    popular: true,
    relatedSlugs: ['slug-generator', 'robots-txt-generator', 'keyword-density'],
    faq: [
      { q: 'What meta tags are most important for SEO?', a: 'The title tag and meta description are most critical. Open Graph tags (og:title, og:description, og:image) are essential for social sharing.' },
      { q: 'How long should a meta description be?', a: 'Google typically displays 155–160 characters. Keep your description under 160 characters to avoid truncation in search results.' },
    ],
  },
  {
    slug: 'keyword-density',
    category: 'seo',
    name: 'Keyword Density Checker',
    tagline: 'Analyze keyword frequency in your content',
    description: 'Check keyword density and frequency in any text. Find over-used or under-used keywords to optimize your content for SEO.',
    h1: 'Keyword Density Checker (Free SEO Tool)',
    metaTitle: 'Keyword Density Checker Online – Free SEO Analysis Tool',
    metaDescription: 'Analyze keyword frequency and density in your content. Find the most common words and phrases — free keyword density checker, no signup.',
    keywords: ['keyword density checker', 'keyword frequency', 'keyword analyzer', 'seo keyword tool', 'content analysis'],
    icon: '📊',
    component: 'KeywordDensity',
    relatedSlugs: ['meta-tag-generator', 'word-counter'],
    faq: [],
  },
  {
    slug: 'slug-generator',
    category: 'seo',
    name: 'Slug Generator',
    tagline: 'Convert titles to SEO-friendly URL slugs',
    description: 'Generate clean, SEO-friendly URL slugs from article titles. Handles special characters, accents, and multiple languages.',
    h1: 'URL Slug Generator – Create SEO-Friendly Slugs Free',
    metaTitle: 'Slug Generator Online – Create SEO-Friendly URL Slugs Free',
    metaDescription: 'Convert article titles and headings to SEO-friendly URL slugs. Handles special characters and accents — free slug generator, no signup.',
    keywords: ['slug generator', 'url slug generator', 'seo slug', 'permalink generator', 'url friendly slug'],
    icon: '🐌',
    component: 'SlugGenerator',
    relatedSlugs: ['meta-tag-generator', 'url-encoder'],
    faq: [],
  },
  {
    slug: 'robots-txt-generator',
    category: 'seo',
    name: 'Robots.txt Generator',
    tagline: 'Generate a robots.txt file for your website',
    description: 'Create a valid robots.txt file to control search engine crawling. Supports multiple user agents, allow/disallow rules, and sitemaps.',
    h1: 'Robots.txt Generator (Free Online SEO Tool)',
    metaTitle: 'Robots.txt Generator Online – Create robots.txt Free',
    metaDescription: 'Generate a robots.txt file for your website in seconds. Control which pages search engines can crawl — free robots.txt generator, no signup.',
    keywords: ['robots txt generator', 'create robots.txt', 'robots.txt file generator', 'seo robots txt'],
    icon: '🤖',
    component: 'RobotsTxtGenerator',
    relatedSlugs: ['meta-tag-generator', 'slug-generator'],
    faq: [
      { q: 'What is robots.txt?', a: 'Robots.txt is a text file at the root of your domain that tells search engine crawlers which pages or files they can or cannot request from your site.' },
    ],
  },

  // ── IMAGE ──────────────────────────────────────────────────────────────────
  {
    slug: 'image-compressor',
    category: 'image',
    name: 'Image Compressor',
    tagline: 'Compress images without visible quality loss',
    description: 'Free online image compressor. Reduce JPEG, PNG, and WebP file sizes by up to 80% without noticeable quality loss. Batch compress up to 20 images.',
    h1: 'Image Compressor – Compress Images Online Free',
    metaTitle: 'Image Compressor Online – Compress JPEG, PNG & WebP Free',
    metaDescription: 'Compress JPEG, PNG, and WebP images online without losing quality. Reduce file size by up to 80% — free image compressor, no signup required.',
    keywords: ['image compressor', 'compress image online', 'reduce image size', 'jpeg compressor', 'png compressor'],
    icon: '🗜️',
    component: 'ImageCompressor',
    popular: true,
    relatedSlugs: ['jpg-to-png', 'png-to-webp', 'image-resizer'],
    faq: [
      { q: 'How much can images be compressed?', a: 'JPEG images can often be reduced by 40-80% with minimal quality loss. PNG files benefit from lossless compression, typically 10-30% reduction.' },
      { q: 'Are my images uploaded to a server?', a: 'No. All compression happens locally in your browser using the Canvas API and browser-image-compression library. Your images never leave your device.' },
      { q: 'What formats are supported?', a: 'JPEG, JPG, PNG, and WebP are fully supported.' },
      { q: 'Can I compress multiple images at once?', a: 'Yes, drag and drop up to 20 images at once for batch compression.' },
    ],
  },
  {
    slug: 'jpg-to-png',
    category: 'image',
    name: 'JPG to PNG Converter',
    tagline: 'Convert JPEG images to PNG with transparency support',
    description: 'Convert JPG/JPEG images to PNG format online. Preserve quality and add transparency support. Fast, free, and no signup required.',
    h1: 'JPG to PNG Converter (Free Online)',
    metaTitle: 'JPG to PNG Converter Online – Convert JPEG to PNG Free',
    metaDescription: 'Convert JPG images to PNG format online. Free, fast, and no quality loss — JPG to PNG converter with transparency support, no signup.',
    keywords: ['jpg to png', 'jpeg to png converter', 'convert jpg to png online', 'jpg png converter'],
    icon: '🖼️',
    component: 'ImageConverter',
    relatedSlugs: ['png-to-webp', 'image-compressor'],
    faq: [],
  },
  {
    slug: 'png-to-webp',
    category: 'image',
    name: 'PNG to WebP Converter',
    tagline: 'Convert PNG images to modern WebP format',
    description: 'Convert PNG images to WebP format for smaller file sizes and faster websites. WebP offers 25-34% smaller files than PNG.',
    h1: 'PNG to WebP Converter (Free Online)',
    metaTitle: 'PNG to WebP Converter Online – Convert PNG to WebP Free',
    metaDescription: 'Convert PNG images to WebP format online. WebP files are 25-34% smaller than PNG — free PNG to WebP converter, no signup required.',
    keywords: ['png to webp', 'convert png to webp', 'webp converter', 'png webp online'],
    icon: '✨',
    component: 'ImageConverter',
    relatedSlugs: ['jpg-to-png', 'image-compressor'],
    faq: [],
  },
  {
    slug: 'image-resizer',
    category: 'image',
    name: 'Image Resizer',
    tagline: 'Resize images to exact dimensions online',
    description: 'Resize images to any dimension online. Maintain aspect ratio, crop, or stretch. Supports JPEG, PNG, and WebP.',
    h1: 'Image Resizer – Resize Images Online Free',
    metaTitle: 'Image Resizer Online – Resize Images to Any Size Free',
    metaDescription: 'Resize images to any dimension online. Maintain aspect ratio or set custom dimensions — free image resizer, no signup required.',
    keywords: ['image resizer', 'resize image online', 'change image size', 'image dimensions tool'],
    icon: '📐',
    component: 'ImageResizer',
    relatedSlugs: ['image-compressor', 'jpg-to-png'],
    faq: [],
  },

  // ── PDF ────────────────────────────────────────────────────────────────────
  {
    slug: 'pdf-merge',
    category: 'pdf',
    name: 'PDF Merge',
    tagline: 'Combine multiple PDF files into one document',
    description: 'Merge multiple PDF files into a single document online. Drag to reorder pages, set custom order, and download instantly. 100% free.',
    h1: 'PDF Merge Tool – Combine PDF Files Online Free',
    metaTitle: 'PDF Merge Online – Combine Multiple PDFs Into One Free',
    metaDescription: 'Merge multiple PDF files into one document online. Drag to reorder, combine, and download — free PDF merger tool, no signup required.',
    keywords: ['pdf merge', 'merge pdf online', 'combine pdf files', 'pdf combiner', 'join pdf files'],
    icon: '📎',
    component: 'PDFMerge',
    popular: true,
    relatedSlugs: ['pdf-split', 'pdf-compressor', 'pdf-to-word'],
    faq: [
      { q: 'How many PDFs can I merge at once?', a: 'You can merge up to 20 PDF files at once. For larger batches, merge in groups and then combine the results.' },
      { q: 'Is PDF merging secure?', a: 'Yes. PDF processing is done entirely in your browser using pdf-lib. Your files are never uploaded to any server.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes. Drag and drop the files to set the order before merging.' },
    ],
  },
  {
    slug: 'pdf-split',
    category: 'pdf',
    name: 'PDF Split',
    tagline: 'Split a PDF into separate pages or ranges',
    description: 'Split a PDF file into individual pages or custom page ranges. Extract specific pages from large PDF documents.',
    h1: 'PDF Split Tool – Split PDF Pages Online Free',
    metaTitle: 'PDF Split Online – Extract Pages from PDF Free',
    metaDescription: 'Split a PDF into individual pages or custom ranges online. Extract pages from PDF documents — free PDF splitter, no signup required.',
    keywords: ['pdf split', 'split pdf online', 'extract pdf pages', 'pdf page extractor', 'split pdf free'],
    icon: '✂️',
    component: 'PDFSplit',
    relatedSlugs: ['pdf-merge', 'pdf-compressor'],
    faq: [],
  },
  {
    slug: 'pdf-compressor',
    category: 'pdf',
    name: 'PDF Compressor',
    tagline: 'Reduce PDF file size without losing quality',
    description: 'Compress PDF files to reduce their size for email or upload. Maintains readable quality for most documents.',
    h1: 'PDF Compressor – Reduce PDF File Size Online Free',
    metaTitle: 'PDF Compressor Online – Compress PDF Files Free',
    metaDescription: 'Compress and reduce PDF file size online. Ideal for email attachments and uploads — free PDF compressor, no signup required.',
    keywords: ['pdf compressor', 'compress pdf online', 'reduce pdf size', 'pdf file size reducer'],
    icon: '📉',
    component: 'PDFCompressor',
    relatedSlugs: ['pdf-merge', 'pdf-split'],
    faq: [],
  },
  {
    slug: 'pdf-to-word',
    category: 'pdf',
    name: 'PDF to Word',
    tagline: 'Convert PDF documents to editable Word files',
    description: 'Convert PDF files to editable Word documents (.docx). Preserves formatting and text for further editing.',
    h1: 'PDF to Word Converter (Free Online)',
    metaTitle: 'PDF to Word Converter Online – Convert PDF to DOCX Free',
    metaDescription: 'Convert PDF files to editable Word documents online. Preserve formatting and extract text — free PDF to Word converter, no signup.',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word online', 'pdf word converter free'],
    icon: '📄',
    component: 'PDFToWord',
    relatedSlugs: ['pdf-merge', 'pdf-split', 'pdf-compressor'],
    faq: [
      { q: 'How accurate is the PDF to Word conversion?', a: 'Accuracy depends on the PDF type. Text-based PDFs convert very well. Scanned PDFs require OCR and may have some formatting differences.' },
    ],
  },

  // ── CONVERTER ──────────────────────────────────────────────────────────────
  {
    slug: 'cm-to-inch',
    category: 'converter',
    name: 'cm to inch Converter',
    tagline: 'Convert centimeters to inches instantly',
    description: 'Convert centimeters to inches with a simple, accurate calculator. Includes a reference table for common values.',
    h1: 'cm to inch Converter (Free Online Calculator)',
    metaTitle: 'cm to inches Converter – Convert Centimeters to Inches Online',
    metaDescription: 'Convert centimeters to inches online instantly. Accurate cm to inch calculator with formula explanation — free, no signup required.',
    keywords: ['cm to inches', 'centimeter to inch', 'cm inch converter', 'convert cm to inches'],
    icon: '📏',
    component: 'UnitConverter',
    relatedSlugs: ['kg-to-lbs', 'celsius-to-fahrenheit'],
    faq: [
      { q: 'How many inches is 1 cm?', a: '1 centimeter equals 0.393701 inches. Conversely, 1 inch equals 2.54 centimeters.' },
    ],
  },
  {
    slug: 'kg-to-lbs',
    category: 'converter',
    name: 'kg to lbs Converter',
    tagline: 'Convert kilograms to pounds instantly',
    description: 'Convert kilograms to pounds accurately. Includes formula, reference table, and reverse conversion.',
    h1: 'kg to lbs Converter (Free Online Calculator)',
    metaTitle: 'kg to lbs Converter – Convert Kilograms to Pounds Online Free',
    metaDescription: 'Convert kilograms to pounds online instantly. Accurate kg to lbs calculator with formula — free, no signup required.',
    keywords: ['kg to lbs', 'kilograms to pounds', 'kg lbs converter', 'convert kg to pounds'],
    icon: '⚖️',
    component: 'UnitConverter',
    relatedSlugs: ['cm-to-inch', 'celsius-to-fahrenheit'],
    faq: [],
  },
  {
    slug: 'celsius-to-fahrenheit',
    category: 'converter',
    name: 'Celsius to Fahrenheit',
    tagline: 'Convert temperature between °C and °F',
    description: 'Convert Celsius to Fahrenheit and Fahrenheit to Celsius instantly. Includes the formula and a reference chart.',
    h1: 'Celsius to Fahrenheit Converter (Free Online)',
    metaTitle: 'Celsius to Fahrenheit Converter Online – °C to °F Free',
    metaDescription: 'Convert Celsius to Fahrenheit online instantly. Accurate temperature converter with formula and chart — free, no signup required.',
    keywords: ['celsius to fahrenheit', 'celsius fahrenheit converter', 'c to f converter', 'temperature converter online'],
    icon: '🌡️',
    component: 'UnitConverter',
    relatedSlugs: ['cm-to-inch', 'kg-to-lbs'],
    faq: [
      { q: 'What is the formula for Celsius to Fahrenheit?', a: '°F = (°C × 9/5) + 32. For example, 100°C = (100 × 9/5) + 32 = 212°F.' },
    ],
  },
  {
    slug: 'timestamp-converter',
    category: 'converter',
    name: 'Timestamp Converter',
    tagline: 'Convert Unix timestamps to human-readable dates',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds, multiple timezones, ISO 8601, and relative time.',
    h1: 'Unix Timestamp Converter (Free & Online)',
    metaTitle: 'Unix Timestamp Converter Online – Free Epoch Time Converter',
    metaDescription: 'Convert Unix timestamps to readable dates and back online. Supports seconds, milliseconds, timezones, ISO 8601 — free timestamp converter, no signup.',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'date to timestamp', 'unix time converter', 'epoch time'],
    icon: '⏱️',
    component: 'TimestampConverter',
    new: true,
    relatedSlugs: ['cm-to-inch', 'kg-to-lbs'],
    faq: [
      { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC (the Unix epoch). It is used universally in programming to represent a specific moment in time.' },
      { q: 'What is the difference between seconds and milliseconds timestamps?', a: 'Unix timestamps in seconds are 10 digits (e.g. 1705276800). Millisecond timestamps are 13 digits (e.g. 1705276800000). This converter detects both automatically.' },
    ],
  },

  // ── DEVELOPER (additional) ──────────────────────────────────────────────
  {
    slug: 'css-minifier',
    category: 'developer',
    name: 'CSS Minifier',
    tagline: 'Minify CSS to reduce file size instantly',
    description: 'Free online CSS minifier. Remove comments, whitespace, and redundant code from CSS files to reduce file size for faster page loads.',
    h1: 'CSS Minifier – Minify CSS Online Free',
    metaTitle: 'CSS Minifier Online – Compress & Minify CSS Free',
    metaDescription: 'Minify and compress CSS online. Remove comments and whitespace to reduce file size — free CSS minifier, no signup required.',
    keywords: ['css minifier', 'minify css', 'compress css', 'css compressor', 'css minify online'],
    icon: '🎨',
    component: 'CSSMinifier',
    new: true,
    relatedSlugs: ['js-minifier', 'json-minify', 'html-formatter'],
    faq: [
      { q: 'What does CSS minification do?', a: 'CSS minification removes comments, whitespace, and unnecessary characters from your CSS code without changing how it functions. This reduces file size and improves page load time.' },
      { q: 'Is minified CSS valid CSS?', a: 'Yes. Minified CSS is 100% valid and produces identical visual output to the original. Browsers parse both identically.' },
    ],
  },
  {
    slug: 'js-minifier',
    category: 'developer',
    name: 'JS Minifier',
    tagline: 'Minify JavaScript by removing comments & whitespace',
    description: 'Free online JavaScript minifier. Remove comments and unnecessary whitespace from JS files to reduce bundle size.',
    h1: 'JavaScript Minifier – Minify JS Online Free',
    metaTitle: 'JS Minifier Online – Compress & Minify JavaScript Free',
    metaDescription: 'Minify JavaScript online. Remove comments and whitespace to reduce file size — free JS minifier tool, no signup required.',
    keywords: ['js minifier', 'javascript minifier', 'minify javascript', 'compress js', 'js compressor online'],
    icon: '📦',
    component: 'JSMinifier',
    new: true,
    relatedSlugs: ['css-minifier', 'json-minify', 'json-formatter'],
    faq: [
      { q: 'What does JS minification do?', a: 'JS minification removes comments, extra whitespace, and newlines from JavaScript code. This reduces file size, improving page load speeds without changing functionality.' },
      { q: 'Should I minify JavaScript for production?', a: 'Yes. Minification is a standard step in production builds. For advanced optimization (variable renaming, dead code elimination), use a build tool like webpack, esbuild, or Rollup.' },
    ],
  },
  {
    slug: 'color-converter',
    category: 'developer',
    name: 'Color Converter',
    tagline: 'Convert between HEX, RGB, and HSL color formats',
    description: 'Free online color converter. Convert colors between HEX, RGB, and HSL formats instantly. Includes a color picker, presets, and copy-ready CSS values.',
    h1: 'Color Converter – HEX to RGB to HSL Online',
    metaTitle: 'Color Converter Online – HEX to RGB to HSL Free',
    metaDescription: 'Convert colors between HEX, RGB, and HSL formats online. Includes color picker and CSS copy values — free color converter, no signup.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'color format converter', 'css color'],
    icon: '🎨',
    component: 'ColorConverter',
    new: true,
    popular: true,
    relatedSlugs: ['css-minifier', 'meta-tag-generator'],
    faq: [
      { q: 'What is HEX color?', a: 'HEX (hexadecimal) color is a 6-digit code that represents a color using values 00-FF for red, green, and blue channels. Example: #0ea5e9 is a sky blue.' },
      { q: 'What is HSL color?', a: 'HSL stands for Hue, Saturation, and Lightness. It is a more human-intuitive way to describe colors — hue (0-360°), saturation (0-100%), and lightness (0-100%).' },
    ],
  },
];

// ── CATEGORY METADATA ─────────────────────────────────────────────────────────
export const CATEGORIES: Record<ToolCategory, {
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  color: string;
}> = {
  developer: {
    name: 'Developer Tools',
    description: 'JSON, Base64, HTML, URL, JWT and more tools for developers',
    metaTitle: 'Free Online Developer Tools – JSON, Base64, HTML & More',
    metaDescription: 'Free online developer tools including JSON formatter, Base64 encoder, HTML viewer, URL encoder, JWT decoder, and regex tester.',
    icon: '⚙️',
    color: 'from-blue-500 to-cyan-500',
  },
  text: {
    name: 'Text Tools',
    description: 'Word counter, case converter, and text manipulation tools',
    metaTitle: 'Free Online Text Tools – Word Counter, Case Converter & More',
    metaDescription: 'Free online text tools: word counter, case converter, remove line breaks, text sorter, and duplicate line remover.',
    icon: '📝',
    color: 'from-emerald-500 to-teal-500',
  },
  seo: {
    name: 'SEO Tools',
    description: 'Meta tag generator, keyword checker, slug generator & more',
    metaTitle: 'Free Online SEO Tools – Meta Tags, Keywords & Slug Generator',
    metaDescription: 'Free SEO tools: meta tag generator, keyword density checker, slug generator, and robots.txt generator.',
    icon: '🔍',
    color: 'from-orange-500 to-amber-500',
  },
  image: {
    name: 'Image Tools',
    description: 'Compress, convert, and resize images online for free',
    metaTitle: 'Free Online Image Tools – Compress, Convert & Resize Images',
    metaDescription: 'Free image tools: image compressor, JPG to PNG, PNG to WebP converter, and image resizer.',
    icon: '🖼️',
    color: 'from-purple-500 to-pink-500',
  },
  pdf: {
    name: 'PDF Tools',
    description: 'Merge, split, compress, and convert PDF files online',
    metaTitle: 'Free Online PDF Tools – Merge, Split & Compress PDFs',
    metaDescription: 'Free PDF tools: PDF merger, splitter, compressor, and PDF to Word converter. No signup required.',
    icon: '📄',
    color: 'from-red-500 to-rose-500',
  },
  converter: {
    name: 'Converter Tools',
    description: 'Unit converters: cm↔inch, kg↔lbs, Celsius↔Fahrenheit',
    metaTitle: 'Free Online Unit Converters – cm, kg, Temperature & More',
    metaDescription: 'Free unit converters: cm to inches, kg to lbs, Celsius to Fahrenheit. Accurate, instant, and no signup required.',
    icon: '🔄',
    color: 'from-indigo-500 to-violet-500',
  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function getAllTools(): Tool[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter(t => t.category === category);
}

export function getRelatedTools(tool: Tool): Tool[] {
  if (!tool.relatedSlugs?.length) {
    return TOOLS.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);
  }
  return tool.relatedSlugs
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter(Boolean) as Tool[];
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter(t => t.popular);
}
