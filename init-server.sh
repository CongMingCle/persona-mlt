#!/bin/bash
# 一键初始化服务器环境
# 在服务器上首次执行: bash init-server.sh

set -e

echo "🚀 开始初始化服务器环境..."

# 1. 安装 Node.js (v18 LTS)
if ! command -v node &> /dev/null; then
    echo "📦 安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"

# 2. 安装 Nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 安装 Nginx..."
    apt-get update
    apt-get install -y nginx
fi
echo "✅ Nginx $(nginx -v 2>&1)"

# 3. 安装 PM2（用于运行 Webhook 服务进程保活）
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    npm install -g pm2
fi
echo "✅ PM2 $(pm2 --version)"

# 4. 安装 Git
if ! command -v git &> /dev/null; then
    echo "📦 安装 Git..."
    apt-get install -y git
fi
echo "✅ Git $(git --version)"

# 5. 开放防火墙端口
echo "🔓 配置防火墙..."
ufw allow 80/tcp 2>/dev/null || echo "   ufw 未启用，跳过"
ufw allow 443/tcp 2>/dev/null || echo ""

# 6. 克隆项目并构建
echo "📥 克隆项目..."
cd /root
if [ -d "persona-mlt" ]; then
    echo "   项目已存在，跳过克隆"
else
    git clone https://github.com/CongMingCle/persona-mlt.git
fi
cd persona-mlt

echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

echo ""
echo "========================================"
echo "✅ 环境初始化完成！"
echo ""
echo "下一步:"
echo "   1. bash deploy.sh              # 部署项目"
echo "   2. bash setup-webhook.sh       # 配置自动部署（可选）"
echo "========================================"
