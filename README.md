# StockWise Dashboard

A beginner-friendly full-stack stock market dashboard. The current version uses sample stock data so you can run and edit the app before connecting real APIs.

## What Is Included

- Home page with market overview
- Searchable stock dashboard
- Stock detail view with price, daily change, volume, market cap, trend, risk, and chart
- Browser watchlist saved in `localStorage`
- Educational AI-style investment assistant
- Clear disclaimer: insights are educational only and not financial advice

## Project Structure

```text
stock-market-dashboard/
  public/
    index.html      Frontend page
    styles.css      Responsive dashboard styling
    app.js          Frontend behavior and chart drawing
  server.js         Node backend with sample API routes
  package.json      Project scripts
  .env.example      Future API key placeholders
```

## Run The App

Install Node.js from `https://nodejs.org` if `node` is not available in your terminal.

```bash
node server.js
```

Then open:

```text
http://localhost:3000
```

## API Routes

```text
GET  /api/stocks
GET  /api/stocks/:symbol
POST /api/ai-insight
```

## Connecting Real APIs Later

1. Copy `.env.example` to `.env`.
2. Add your stock API key, such as `FINNHUB_API_KEY` or `ALPHA_VANTAGE_API_KEY`.
3. Add `OPENAI_API_KEY`.
4. Replace the sample data in `server.js` with real API calls.
5. Keep the AI prompt educational. Do not ask it to guarantee results or provide personalized financial advice.

## Safety Note

The AI assistant should only provide educational opinions such as Buy / Hold / Avoid-style learning signals, risk level, pros and cons, and a disclaimer. It should not promise returns or tell users what they must buy or sell.
