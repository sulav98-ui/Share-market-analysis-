const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Sample data keeps the app usable before real stock and AI APIs are connected.
const sampleStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 193.42,
    change: 1.24,
    changePercent: 0.65,
    volume: "54.2M",
    marketCap: "2.98T",
    trend: "Uptrend",
    risk: "Medium",
    prices: [184, 186, 185, 188, 190, 189, 193]
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 178.08,
    change: -3.81,
    changePercent: -2.09,
    volume: "89.7M",
    marketCap: "567.4B",
    trend: "Volatile",
    risk: "High",
    prices: [191, 188, 182, 185, 180, 176, 178]
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 924.79,
    change: 14.12,
    changePercent: 1.55,
    volume: "41.9M",
    marketCap: "2.28T",
    trend: "Strong uptrend",
    risk: "Medium-High",
    prices: [850, 872, 861, 889, 906, 912, 925]
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 421.53,
    change: 0.92,
    changePercent: 0.22,
    volume: "22.6M",
    marketCap: "3.13T",
    trend: "Stable uptrend",
    risk: "Medium",
    prices: [410, 413, 417, 416, 419, 420, 422]
  }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        resolve({});
      }
    });
  });
}

function serveStaticFile(req, res) {
  const requestedPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);
  const extension = path.extname(filePath);

  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript"
  };

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { message: "Page not found." });
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "text/plain"
    });
    res.end(content);
  });
}

function buildEducationalInsight(stock) {
  const opinion = stock.changePercent > 1 ? "Hold / Watch" : stock.changePercent < -1 ? "Avoid / Research More" : "Hold";
  const sentiment = stock.changePercent >= 0 ? "recent momentum is positive" : "recent momentum is weak";

  return {
    symbol: stock.symbol,
    opinion,
    reason: `${stock.name} shows a ${stock.trend.toLowerCase()} pattern in the sample data, and ${sentiment}. Beginners should compare this with company fundamentals, valuation, and current market conditions before making any decision.`,
    riskLevel: stock.risk,
    pros: [
      "Large, widely followed company with plenty of public information.",
      "Sample chart data gives a simple way to compare short-term movement."
    ],
    cons: [
      "Short-term price moves can reverse quickly.",
      "This demo does not yet include live earnings, valuation, debt, or real news data."
    ],
    disclaimer: "Educational insight only. This is not financial advice, and it does not guarantee future performance."
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, {});
    return;
  }

  if (req.method === "GET" && req.url === "/api/stocks") {
    sendJson(res, 200, sampleStocks);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/stocks/")) {
    const symbol = decodeURIComponent(req.url.split("/").pop()).toUpperCase();
    const stock = sampleStocks.find((item) => item.symbol === symbol);

    if (!stock) {
      sendJson(res, 404, { message: "Stock not found in sample data." });
      return;
    }

    sendJson(res, 200, stock);
    return;
  }

  if (req.method === "POST" && req.url === "/api/ai-insight") {
    const body = await readRequestBody(req);
    const symbol = String(body.symbol || "").toUpperCase();
    const stock = sampleStocks.find((item) => item.symbol === symbol);

    if (!stock) {
      sendJson(res, 404, { message: "Choose a sample stock first." });
      return;
    }

    sendJson(res, 200, buildEducationalInsight(stock));
    return;
  }

  serveStaticFile(req, res);
});

server.listen(PORT, () => {
  console.log(`Stock dashboard running at http://localhost:${PORT}`);
});
