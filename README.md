# Ela's Command Center V3 PRO

A comprehensive social media command center for real estate professionals, built specifically for Ela Mildner-Shapiro.

## Features

- **AI Content Generation** - Powered by Gemini 3 Flash
  - Listing descriptions
  - Social media posts
  - Email campaigns
  - Bio generator
  - Hashtag generator
  - Video scripts

- **Lead Management** - Enterprise-grade CRM features
  - Lead pipeline (Kanban board)
  - AI Lead Scoring
  - Smart Lists
  - Drip campaigns
  - Task management

- **Content Library** - 100+ ready-to-post templates
- **Viral Research** - Study top realtors nationally and locally
- **Market Data** - Live Cincinnati real estate stats
- **Post Scheduler** - Plan and schedule content
- **Analytics** - Track your social media performance

## Deployment

This app is deployed on Netlify with a secure serverless function for API calls.

### Environment Variables

Add these in your Netlify dashboard under Site Settings > Environment Variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free Gemini API key at: https://aistudio.google.com/apikey

## Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- Netlify Serverless Functions
- Gemini 3 Flash API
- LocalStorage for data persistence

## Security

- API keys are stored securely in Netlify environment variables
- API calls are proxied through serverless functions
- No sensitive data is exposed in browser code

---

Built with love for Ela by Arnold
