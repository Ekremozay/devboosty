# ToolHub – Free Online Tools Platform

A fully production-ready Next.js platform for free online developer, SEO, text, image, and PDF tools. SEO-optimized, monetization-ready, and built to scale to 300+ tools.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your domain and AdSense ID

# 3. Run development server
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Homepage
│   ├── tools/
│   │   ├── page.tsx                    # All tools listing
│   │   ├── [category]/
│   │   │   ├── page.tsx                # Category page (e.g. /tools/developer)
│   │   │   └── [tool]/
│   │   │       ├── page.tsx            # Tool page (e.g. /tools/developer/json-formatter)
│   │   │       └── ToolLoader.tsx      # Dynamic component loader
│   ├── blog/
│   │   ├── page.tsx                    # Blog index
│   │   └── [slug]/page.tsx             # Blog post
│   ├── sitemap.ts                      # Auto-generated sitemap
│   ├── robots.ts                       # robots.txt
│   └── layout.tsx                      # Root layout with header/footer
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                  # Sticky navigation
│   │   ├── Footer.tsx                  # Site footer
│   │   └── AdBanner.tsx                # Google AdSense banners
│   ├── tools/                          # One component per tool
│   │   ├── JSONFormatter.tsx
│   │   ├── ImageCompressor.tsx
│   │   ├── WordCounter.tsx
│   │   ├── PDFMerge.tsx
│   │   ├── HTMLViewer.tsx
│   │   └── ... (25+ tools)
│   └── ui/
│       ├── ToolCard.tsx                # Tool card for listings
│       ├── FAQSection.tsx              # SEO FAQ accordion
│       └── RelatedTools.tsx            # Related tools widget
│
├── lib/
│   ├── tools-registry.ts               # 🔑 CENTRAL TOOL REGISTRY
│   ├── blog-registry.ts                # Blog post data
│   └── seo.ts                          # SEO utilities & schema generators
```

---

## ➕ Adding a New Tool (5 Steps)

### Step 1: Register the tool in `src/lib/tools-registry.ts`

```typescript
{
  slug: 'my-new-tool',
  category: 'developer',  // developer | text | seo | image | pdf | converter
  name: 'My New Tool',
  tagline: 'Short tagline for cards',
  description: 'Longer description used in SEO meta and on the page.',
  h1: 'My New Tool (Free & Online)',
  metaTitle: 'My New Tool – Free Online',
  metaDescription: 'Do X with our free online tool. No signup required.',
  keywords: ['keyword 1', 'keyword 2'],
  icon: '🔧',
  component: 'MyNewTool',  // Must match component filename
  popular: false,
  relatedSlugs: ['json-formatter', 'base64-encode'],
  faq: [
    { q: 'What does this tool do?', a: 'It does...' },
  ],
}
```

### Step 2: Create the React component

```bash
# Create file: src/components/tools/MyNewTool.tsx
```

```tsx
'use client';
export default function MyNewTool() {
  return <div>Your tool UI here</div>;
}
```

### Step 3: Register in ToolLoader

Add to `src/app/tools/[category]/[tool]/ToolLoader.tsx`:
```typescript
MyNewTool: dynamic(() => import('@/components/tools/MyNewTool'), { loading: () => <ToolSkeleton /> }),
```

### Step 4: Done! 🎉

Your tool now has:
- ✅ SEO-optimized page at `/tools/{category}/my-new-tool`
- ✅ Proper `<title>` and `<meta description>`
- ✅ Open Graph + Twitter Card tags
- ✅ JSON-LD structured data (WebApplication schema)
- ✅ FAQ schema (if faq array provided)
- ✅ Breadcrumb schema
- ✅ Auto-added to category page
- ✅ Auto-added to sitemap.xml
- ✅ Related tools widget
- ✅ Ad banner slots (top + bottom)
- ✅ Mobile sticky ad

---

## 🏗️ Growth Roadmap

### Week 1 – 20 Tools ✅ (included in this build)
JSON Formatter, JSON Minify, Base64 Encode/Decode, HTML Viewer, HTML Formatter, URL Encoder/Decoder, JWT Decoder, Regex Tester, Word Counter, Case Converter, Remove Line Breaks, Text Sorter, Duplicate Line Remover, Meta Tag Generator, Keyword Density, Slug Generator, Robots.txt Generator, Image Compressor, PDF Merge, PDF Split + more

### Month 1 – 100 Tools
Add these categories to the registry:
- **Developer**: UUID Generator, Hash Generator (MD5/SHA), CSS Minifier, JS Minifier, YAML to JSON, XML Formatter, Timestamp Converter, Cron Expression Parser, Color Picker, Diff Checker
- **Text**: Lorem Ipsum Generator, Text to Binary, Binary to Text, Morse Code, Reverse Text, String Escape/Unescape, Hex to Text, Spell Checker
- **Image**: Image to Base64, WebP to PNG, GIF to MP4, Image Cropper, Add Watermark, EXIF Viewer
- **PDF**: PDF to Image, PDF Rotate, Add Page Numbers, PDF Watermark
- **Finance**: Percentage Calculator, Compound Interest, Loan Calculator, Tax Calculator

### Month 3 – 300+ Tools
- Unit converters (all SI units)
- Color tools (RGB, HSL, HEX, palettes)
- Encryption tools (AES, RSA)
- Code formatters (CSS, SQL, Python)
- API testing utilities
- Network tools (IP lookup, DNS lookup)

---

## 💰 Monetization Setup

### Google AdSense
1. Sign up at https://adsense.google.com
2. Get approved (usually 2-4 weeks)
3. Add your Publisher ID to `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
   ```
4. Replace `SLOT_ID` placeholders in `AdBanner.tsx` with real slot IDs from your AdSense dashboard

### Ad Placements
- **Top banner** (leaderboard 728×90): Above tool UI
- **Bottom banner** (leaderboard): Below tool UI  
- **Mobile sticky**: Fixed bottom bar on mobile
- **Category pages**: Top and bottom of listings
- **Blog posts**: Top and bottom of content

### Premium Plan (Future)
Add these features behind a login:
- Ad-free experience
- Batch file processing
- API access
- Saved history

---

## 🔍 SEO Strategy

### Auto-generated for every tool:
- Unique `<title>` and `<meta description>`
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Canonical URL
- JSON-LD: WebApplication schema
- JSON-LD: FAQPage schema (if FAQs provided)
- JSON-LD: BreadcrumbList schema

### Blog strategy:
Add posts to `src/lib/blog-registry.ts` targeting:
- `what is [tool/format]` — informational
- `how to [task]` — how-to guides
- `[format] online` — tool landing keywords

### Internal linking:
- Related tools widget on every tool page
- Category breadcrumbs
- Footer links to popular tools
- Blog posts link to relevant tools

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Option 2: Self-hosted with Nginx
```bash
# Build
npm run build

# Start with PM2
npm i -g pm2
pm2 start npm --name "toolhub" -- start
pm2 save

# Configure Nginx (see nginx.conf)
sudo cp nginx.conf /etc/nginx/sites-available/toolhub
sudo ln -s /etc/nginx/sites-available/toolhub /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### Option 3: Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, SSG) |
| Styling | Tailwind CSS |
| Icons | Emoji (zero bundle size) |
| PDF processing | pdf-lib (client-side) |
| Image processing | Canvas API (native browser) |
| Fonts | Google Fonts (DM Sans + Syne + DM Mono) |
| Deployment | Nginx + PM2 / Vercel |
| SEO | Next.js Metadata API + JSON-LD |
| Ads | Google AdSense |

---

## 📊 Performance

- All tool pages are **statically generated at build time**
- Tool components are **dynamically imported** (code-split per tool)
- No tool code is loaded until needed → tiny initial bundle
- All processing is client-side → zero server costs
- Lighthouse scores: ~95+ Performance, 100 SEO, 100 Accessibility (target)
