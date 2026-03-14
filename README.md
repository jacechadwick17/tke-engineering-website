# TKE Engineering & Design Website

A modern React website for TKE Engineering & Design with Decap CMS integration for easy content management.

## Features

- ⚡ React + TypeScript + Vite
- 🎨 Tailwind CSS + shadcn/ui
- 📝 Decap CMS for content editing
- 🎬 GSAP animations
- 📱 Fully responsive

## Content Management

The website uses Decap CMS for easy content editing. Content is stored in:

- `/public/content/jobs/` - Job openings
- `/public/content/projects/` - Project showcases
- `/public/content/services/` - Service descriptions
- `/public/content/settings.json` - Company info

### Accessing the CMS

Once deployed to Netlify, access the CMS at: `https://your-site.netlify.app/admin/`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This site is configured for Netlify deployment with Decap CMS.

## Client Editing Instructions

### Option 1: Netlify CMS (Recommended)

1. Go to `https://your-site.netlify.app/admin/`
2. Log in with your credentials
3. Edit content in the visual editor
4. Click "Publish" to save changes

### Option 2: Direct File Editing

1. Edit files in `/public/content/`
2. Commit and push changes
3. Site will automatically rebuild

## Support

For technical support, contact your web developer.
