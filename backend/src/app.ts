import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import enquiriesRouter from "./routes/enquiries.routes";
import { errorHandler } from "./middleware/errorhandler";
import { env } from "./config/env";

const app = express();

app.use(helmet());

app.use(cors({
  origin: env.CORS_ORIGIN,
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DroneTV — Backend API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 2rem;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #68d391;
      background: rgba(104, 211, 145, 0.15);
      border: 1px solid rgba(104, 211, 145, 0.3);
      border-radius: 999px;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff; }
    p { font-size: 0.95rem; color: #8b949e; line-height: 1.5; margin-bottom: 1.5rem; }
    .endpoints { list-style: none; margin-bottom: 1.5rem; }
    .endpoints li {
      padding: 0.6rem 0.8rem;
      margin-bottom: 0.5rem;
      background: #0d1117;
      border: 1px solid #21262d;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
    }
    .endpoints a { color: #58a6ff; text-decoration: none; font-family: monospace; }
    .endpoints a:hover { text-decoration: underline; }
    .method {
      display: inline-block;
      padding: 0.15rem 0.4rem;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 4px;
      font-family: monospace;
    }
    .get { background: rgba(56, 139, 253, 0.2); color: #58a6ff; }
    .post { background: rgba(46, 160, 67, 0.2); color: #3fb950; }
    .links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .btn {
      display: inline-block;
      padding: 0.55rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #ffffff;
      background: #238636;
      border-radius: 6px;
      text-decoration: none;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid #30363d;
      color: #c9d1d9;
    }
    .btn-outline:hover { background: #21262d; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">● Live &amp; Operational</span>
    <h1>DroneTV Backend API</h1>
    <p>Operational REST API service powering the DroneTV AI Chatbot and Lead Management Platform.</p>
    <ul class="endpoints">
      <li>
        <span><span class="method get">GET</span> <a href="/api/health">/api/health</a></span>
        <span style="color: #8b949e; font-size: 0.8rem;">Health Probe</span>
      </li>
      <li>
        <span><span class="method get">GET</span> <a href="/api/enquiries">/api/enquiries</a></span>
        <span style="color: #8b949e; font-size: 0.8rem;">List Enquiries</span>
      </li>
      <li>
        <span><span class="method get">GET</span> <a href="/api/enquiries/stats">/api/enquiries/stats</a></span>
        <span style="color: #8b949e; font-size: 0.8rem;">Lead Stats</span>
      </li>
      <li>
        <span><span class="method post">POST</span> <a href="/api/enquiries">/api/enquiries</a></span>
        <span style="color: #8b949e; font-size: 0.8rem;">Create Enquiry</span>
      </li>
    </ul>
    <div class="links">
      <a class="btn" href="https://full-stack-chatbot-task-divyal-surs.vercel.app" target="_blank">Open Frontend App →</a>
      <a class="btn btn-outline" href="https://github.com/divyal-11/FullStack_Chatbot_Task_Divyal_Surse" target="_blank">GitHub Repo</a>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.json({
    name: "DroneTV AI Assistant & Enquiries API",
    status: "online",
    version: "1.0.0",
    health: "/api/health",
    enquiries: "/api/enquiries",
    stats: "/api/enquiries/stats",
    frontend: "https://full-stack-chatbot-task-divyal-surs.vercel.app",
    documentation: "https://github.com/divyal-11/FullStack_Chatbot_Task_Divyal_Surse/blob/main/API.md",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    status: "online",
    endpoints: {
      health: "/api/health",
      enquiries: "/api/enquiries",
      stats: "/api/enquiries/stats",
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/enquiries", enquiriesRouter);

app.use(errorHandler);

export default app;