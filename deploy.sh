#!/bin/bash
# 马林滔个人主页 - 生产部署脚本
# 用法: bash deploy.sh

set -e

PROJECT_DIR="/root/persona-mlt"
NGINX_CONF_DIR="/etc/nginx/conf.d"
SITE_DOMAIN="8.130.187.76"   # 当前使用IP，域名实名后改为您的域名

echo "🚀 开始部署..."

# 1. 拉取最新代码
if [ -d "$PROJECT_DIR" ]; then
    echo "📥 拉取最新代码..."
    cd "$PROJECT_DIR"
    git pull origin master
else
    echo "📥 首次克隆代码..."
    git clone https://github.com/CongMingCle/persona-mlt.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install --production

# 3. 构建生产版本
echo "🔨 构建项目..."
npm run build

# 4. 配置 Nginx（如果配置不存在）
NGINX_CONF="$NGINX_CONF_DIR/persona-mlt.conf"
if [ ! -f "$NGINX_CONF" ]; then
    echo "📝 配置 Nginx..."
    cat > "$NGINX_CONF" << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    root /root/persona-mlt/dist;
    index index.html;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存
    location /images/ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由: 所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX_EOF

    # 软链接到 sites-enabled（如果适用）
    if [ -d "/etc/nginx/sites-enabled" ]; then
        ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/persona-mlt
    fi
fi

# 5. 重启 Webhook 服务（如果存在）
echo "🔄 重启 Webhook 服务..."
if pm2 list 2>/dev/null | grep -q persona-webhook; then
    pm2 restart persona-webhook
    echo "   ✅ Webhook 服务已重启"
fi

# 6. 重载 Nginx
echo "🔄 重载 Nginx..."
nginx -t && nginx -s reload

echo "✅ 部署完成！"
echo "🌐 访问地址: http://$SITE_DOMAIN"
