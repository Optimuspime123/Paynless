# PAYNLESS | Money, Simplified.

> **ShowcaseX Hackathon Project**  
> **Built by:** Saswatayu Sengupta

## What is PAYNLESS?

PAYNLESS is an AI-powered financial dashboard that brings your entire financial life into a single interface. No more switching between your banking app, subscription tracker, and portfolio manager.

The interface follows a futuristic neo-brutalist design philosophy. It's built with Google's Gemini AI, which means you don't just look at your data. You talk to it.

## The Problem

Modern personal finance is fragmented. We have one app for banking, another for tracking subscriptions, a third for crypto, maybe a fourth for stocks. Each time we want to understand our financial picture, we're hopping between tabs and mental math.

On top of that, most finance apps are passive. They show you charts and numbers, but when you need to log an expense or update your balance, it's forms and dropdowns and too many clicks.

## How PAYNLESS Solves This

**One Place for Everything**  
Your wallet balance, transactions, subscriptions, and investment portfolio sit on a unified dashboard. You see your spending and earnings at a glance without opening five different apps.

**AI-Powered Actions**  
Instead of manually filling out forms, tell the AI: "I spent ₹500 on groceries yesterday" or "Remove that duplicate transaction." It understands natural language and executes the action.

**Multimodal Receipt Scanning**  
Upload a photo of a receipt or bill. Gemini's Image Understanding lets it extract the merchant name, amount, and date, then suggests adding it as a transaction. No manual data entry required.

**Subscription Visibility**  
All your recurring costs are visible in one section. In the demo we have : Netflix, Spotify, Discord Nitro, Claude Pro. It helps you catch those subscriptions you forgot you were paying for.

## Google AI Integration

The heart of PAYNLESS runs on **Gemini 3.0 Flash** through a serverless backend. This isn't simply another chatbot, it's an AI agent which can monitor and modify your financial states as needed. It can perform actions like adding transactions, updating your balance, and managing your subscriptions.

### What the AI Can Do

**Structured Actions**  
The AI returns JSON with structured fields. When it decides to add a transaction, it provides the name, amount, type (income/expense), and a suggested icon. The frontend parses this and updates your data immediately.

**Context-Aware Conversations**  
Every message to the AI includes your current balance, recent transactions, and active subscriptions. Ask "Can I afford a new Netflix subscription?" and it calculates based on your actual numbers.

**Balance Updates**  
Tell the AI "Set my balance to ₹15,000" or "I deposited ₹2,000" and it updates accordingly.

**Transaction Management**  
Add new income or expenses through natural conversation. Remove incorrect entries by describing which one to delete.

**Image Understanding**  
Attach a photo of a receipt, and Gemini Vision reads it, extracting the relevant details and suggesting the appropriate entry.

## Tech Stack

### Frontend
- HTML5 and CSS3 with a custom "Neo-Glassmorphism" design system
- Vanilla JavaScript (ES6+) for performance without framework overhead
- CSS variables for seamless dark/light theme switching
- Phosphor Icons for consistent iconography

### AI & Backend
- Google Gemini API via the `@google/genai` SDK
- Vercel Serverless Functions handling API requests
- Prompt engineering with strict output schemas

### Tools & Libraries
- Browser Image Compression for optimizing uploaded images before AI processing
- Local Storage for client-side data persistence (privacy-first for this MVP)

## Features

- **Unified Dashboard** showing balance, spending, and earnings in real time
- **Transaction Timeline** with chronological income and expense history
- **Subscription Tracker** for managing recurring service costs
- **Portfolio View** toggling between crypto (BTC, ETH, SOL) and stocks (AAPL, TSLA) with trend visualizations
- **Dynamic Theming** with futuristic dark mode and clean light mode
- **Responsive Design** optimized for both mobile and desktop
- **Matrix Background Animation** and glitch effects for a cyberpunk aesthetic

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
   Or deploy to Vercel for production.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Project Structure

```
├── index.html          # Landing page 
├── dash.html           # Main dashboard interface
├── style.css           # Complete styling with theme support
├── script.js           # Dashboard logic and AI integration
├── landing.js          # Landing page animations
├── api/
│   └── chat.js         # Vercel serverless function for Gemini AI
├── logo.png            # PAYNLESS logo
└── vercel.json         # Deployment configuration
```

## License

MIT License - See [LICENSE](./LICENSE) for details.
