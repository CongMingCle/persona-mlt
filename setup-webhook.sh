#!/bin/bash
# Webhook 自动部署 — 一键设置脚本
# ==================================
# 用法: bash setup-webhook.sh
#
# 本脚本会:
#   1. 安装 express 依赖
#   2. 提示设置 Webhook 密钥
#   3. 创建日志目录
#   4. 用 PM2 启动 Webhook 服务
#   5. 配置 PM2 开机自启
#
# 前置条件: 已完成 bash deploy.sh 部署

set -e

echo ""
echo "🚀 开始配置 Webhook 自动部署..."
echo "=================================="
echo ""

PROJECT_DIR="/var/www/persona-mlt"
cd "$PROJECT_DIR"

# ---- 1. 确认已安装 express ----
echo "📦 检查依赖..."
if node -e "require('express')" 2>/dev/null; then
  echo "   ✅ express 已安装"
else
  echo "   📥 安装 express..."
  npm install express
fi

# ---- 2. 创建日志目录 ----
echo ""
echo "📁 创建日志目录..."
mkdir -p logs

# ---- 3. 设置 Webhook 密钥 ----
echo ""
echo "🔑 Webhook 密钥配置"
echo "--------------------"
echo "当前密钥: $(grep 'SECRET:' webhook.js | head -1)"
echo ""

# 生成随机密钥
RANDOM_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "推荐密钥: ${RANDOM_SECRET}"
echo ""
echo "是否使用此随机密钥？[Y/n] "
read -r USE_RANDOM

if [[ "$USE_RANDOM" =~ ^[Nn] ]]; then
  echo "请输入自定义密钥:"
  read -r CUSTOM_SECRET
  SECRET_VALUE="${CUSTOM_SECRET}"
else
  SECRET_VALUE="${RANDOM_SECRET}"
fi

# 替换 webhook.js 中的密钥
# macOS 与 Linux sed 兼容
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/SECRET: 'your-webhook-secret-here'/SECRET: '${SECRET_VALUE}'/" webhook.js
else
  sed -i "s/SECRET: 'your-webhook-secret-here'/SECRET: '${SECRET_VALUE}'/" webhook.js
fi

echo "   ✅ 密钥已更新"

# ---- 4. 用 PM2 启动 ----
echo ""
echo "⚡ 启动 Webhook 服务..."
pm2 delete persona-webhook 2>/dev/null || true

# 使用 ecosystem.config.js 启动
pm2 start ecosystem.config.js

# 保存 PM2 配置
echo ""
echo "💾 保存 PM2 配置（开机自启）..."
pm2 save

# 打印启动状态
pm2 status persona-webhook

# ---- 5. 配置 Nginx 反向代理（可选） ----
echo ""
echo "🔌 Webhook 服务地址: http://8.130.187.76:9000/webhook"
echo ""
echo "------------------------------------------"
echo ""
echo "✅ Webhook 设置完成！"
echo ""
echo "下一步: 去 GitHub 仓库配置 Webhook"
echo ""
echo "   Settings → Webhooks → Add webhook"
echo "   ┌──────────────────────────────┐"
echo "   │ Payload URL: http://8.130.187.76:9000/webhook"
echo "   │ Content type: application/json"
echo "   │ Secret: ${SECRET_VALUE}"
echo "   │ Events: Just the push event"
echo "   └──────────────────────────────┘"
echo ""
echo "📊 管理命令:"
echo "   pm2 status                  # 查看状态"
echo "   pm2 logs persona-webhook    # 查看日志"
echo "   pm2 restart persona-webhook # 重启服务"
echo "   pm2 stop persona-webhook    # 停止服务"
echo ""

# ---- 6. 测试验证 ----
echo ""
echo "🔄 运行健康检查..."
sleep 2
HEALTH=$(curl -s http://localhost:9000/health 2>/dev/null || echo "{\"status\":\"error\"}")
echo "   响应: $HEALTH"

if echo "$HEALTH" | grep -q '"ok"'; then
  echo "   ✅ Webhook 服务运行正常！"
else
  echo "   ⚠️  健康检查未通过，请检查日志: pm2 logs persona-webhook"
fi

echo ""
echo "🎉 全部完成！"
