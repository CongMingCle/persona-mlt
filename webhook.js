/**
 * GitHub Webhook 自动部署监听器
 * 
 * 安装: npm install express
 * 运行: node webhook.js
 * PM2 保活: pm2 start webhook.js --name "persona-webhook"
 * 
 * 在 GitHub 仓库 Settings > Webhooks 中配置:
 *   - Payload URL: http://8.130.187.76:9000/webhook
 *   - Content type: application/json
 *   - Secret: (自定义一个密钥，下面配置)
 *   - Events: Just the push event
 */

const express = require('express');
const crypto = require('crypto');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const PORT = 9000;
const SECRET = 'your-webhook-secret-here'; // TODO: 修改为自定义密钥
const PROJECT_DIR = path.resolve(__dirname);

// 验证签名
function verifySignature(req, secret) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  
  const payload = JSON.stringify(req.body);
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

app.use(express.json());

app.post('/webhook', (req, res) => {
  // 验证签名（如果配置了 secret）
  if (SECRET !== 'your-webhook-secret-here' && !verifySignature(req, SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 只响应 push 事件
  const event = req.headers['x-github-event'];
  if (event !== 'push') {
    return res.json({ message: `Ignored event: ${event}` });
  }

  console.log('🔔 收到 GitHub Webhook push 事件，开始部署...');

  try {
    // 执行部署
    const result = execSync('bash deploy.sh', {
      cwd: PROJECT_DIR,
      timeout: 120000, // 2分钟超时
    });
    
    console.log('✅ 部署成功');
    res.json({ 
      success: true, 
      message: 'Deployed successfully',
      output: result.toString().substring(0, 500)
    });
  } catch (err) {
    console.error('❌ 部署失败:', err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔌 Webhook 监听器运行在 http://0.0.0.0:${PORT}/webhook`);
  console.log(`📁 项目目录: ${PROJECT_DIR}`);
  console.log('');
  console.log('📋 在 GitHub 仓库 Settings > Webhooks 中配置:');
  console.log(`   Payload URL: http://8.130.187.76:${PORT}/webhook`);
  console.log('   Content type: application/json');
  console.log('   Secret: (与 webhook.js 中的 SECRET 一致)');
  console.log('   Events: Just the push event');
});
