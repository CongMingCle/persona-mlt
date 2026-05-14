/**
 * GitHub Webhook 自动部署监听器 — 生产版本
 * ============================================
 *
 * 功能:
 *   - 监听 GitHub push 事件，自动拉取代码 → 构建 → 重载 Nginx
 *   - 健康检查端点 /health
 *   - 签名验证确保请求来自 GitHub
 *   - 完整的日志和错误处理
 *
 * 安装 (依赖已经包含在 package.json 中):
 *   npm install
 *
 * PM2 启动 (推荐):
 *   pm2 start ecosystem.config.js
 *
 * 手动启动:
 *   node webhook.js
 *
 * 在 GitHub 仓库 Settings > Webhooks 中配置:
 *   - Payload URL: http://8.130.187.76:9000/webhook
 *   - Content type: application/json
 *   - Secret: (与下方 SECRET 变量一致)
 *   - Events: Just the push event
 */

import express from 'express';
import crypto from 'crypto';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module 兼容 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 配置（根据实际情况修改）
// ============================================================
const CONFIG = {
  PORT: 9000,
  // TODO: 修改为自定义密钥！
  // 生成方法: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  SECRET: 'your-webhook-secret-here',
  PROJECT_DIR: path.resolve(__dirname),
  DEPLOY_SCRIPT: path.resolve(__dirname, 'deploy.sh'),
  LOG_FILE: path.resolve(__dirname, 'logs', 'webhook.log'),
  DEPLOY_TIMEOUT: 120_000, // 2 分钟
};

// ============================================================
// 日志系统
// ============================================================
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const line = data
    ? `${prefix} ${message} ${JSON.stringify(data)}`
    : `${prefix} ${message}`;

  console.log(line);

  // 写入日志文件
  try {
    const logDir = path.dirname(CONFIG.LOG_FILE);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(CONFIG.LOG_FILE, line + '\n');
  } catch {
    // 日志写入失败不影响主流程
  }
}

// ============================================================
// 签名验证
// ============================================================
function verifySignature(payload, signature, secret) {
  if (!secret || secret === 'your-webhook-secret-here') {
    log('WARN', 'Webhook secret 未配置，跳过签名验证（不安全！）');
    return true; // 开发模式跳过验证
  }

  if (!signature) {
    return false;
  }

  const expected = 'sha256=' +
    crypto.createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

// ============================================================
// 部署执行
// ============================================================
function runDeploy() {
  log('INFO', '开始执行部署...');

  // 检查 deploy.sh 是否存在
  if (!fs.existsSync(CONFIG.DEPLOY_SCRIPT)) {
    throw new Error(`部署脚本不存在: ${CONFIG.DEPLOY_SCRIPT}`);
  }

  const output = execSync(`bash ${CONFIG.DEPLOY_SCRIPT}`, {
    cwd: CONFIG.PROJECT_DIR,
    timeout: CONFIG.DEPLOY_TIMEOUT,
    env: { ...process.env, HOME: process.env.HOME || '/root' },
  });

  const stdout = output.toString();
  log('INFO', '部署成功', { output: stdout.substring(0, 1000) });
  return stdout;
}

// ============================================================
// Express 应用
// ============================================================
const app = express();

// —— 请求体大小限制（防止恶意请求） ——
app.use(express.json({ limit: '1mb' }));

// —— 健康检查 ——
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    project: 'malintao-portfolio',
    pid: process.pid,
  });
});

// —— Webhook 端点 ——
app.post('/webhook', (req, res) => {
  const startTime = Date.now();

  // 1. 验证签名
  const signature = req.headers['x-hub-signature-256'];
  if (!verifySignature(req.body, signature, CONFIG.SECRET)) {
    log('WARN', '签名验证失败', { ip: req.ip });
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. 只处理 push 事件
  const event = req.headers['x-github-event'];
  if (event !== 'push') {
    return res.json({ message: `Ignored event: ${event}` });
  }

  // 3. 提取推送信息
  const { ref, repository, head_commit, pusher } = req.body;
  const branch = ref ? ref.replace('refs/heads/', '') : 'unknown';
  const commitMsg = head_commit?.message?.split('\n')[0] || 'unknown';
  const author = pusher?.name || 'unknown';

  log('INFO', '收到 push 事件', {
    branch,
    commit: commitMsg,
    author,
    repo: repository?.full_name,
  });

  // 4. 只部署 master/main 分支
  if (branch !== 'master' && branch !== 'main') {
    log('INFO', `跳过非主干分支: ${branch}`);
    return res.json({ message: `Skipped non-default branch: ${branch}` });
  }

  // 5. 执行部署（异步，先返回响应）
  res.json({
    success: true,
    message: 'Deploy started',
    commit: commitMsg,
    branch,
    author,
  });

  // 6. 后台执行部署
  setImmediate(async () => {
    try {
      const output = runDeploy();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      log('INFO', `部署完成 (耗时 ${elapsed}s)`);
    } catch (err) {
      log('ERROR', '部署失败', {
        error: err.message,
        stderr: err.stderr?.toString().substring(0, 500),
      });
    }
  });
});

// —— 全局错误处理 ——
app.use((err, _req, res, _next) => {
  log('ERROR', '未捕获错误', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================
// 启动服务
// ============================================================
app.listen(CONFIG.PORT, '0.0.0.0', () => {
  log('INFO', '='.repeat(50));
  log('INFO', 'Webhook 监听器已启动');
  log('INFO', `端口: ${CONFIG.PORT}`);
  log('INFO', `项目: ${CONFIG.PROJECT_DIR}`);
  log('INFO', `日志: ${CONFIG.LOG_FILE}`);
  log('INFO', '='.repeat(50));
  log('INFO', '');
  log('INFO', '📋 GitHub Webhook 配置指引:');
  log('INFO', `   Payload URL: http://8.130.187.76:${CONFIG.PORT}/webhook`);
  log('INFO', '   Content type: application/json');
  log('INFO', '   Secret: (与 webhook.js 中的 SECRET 一致)');
  log('INFO', '   Events: Just the push event');
  log('INFO', '');
  log('INFO', `   健康检查: http://localhost:${CONFIG.PORT}/health`);
  log('INFO', '');
});
