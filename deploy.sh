#!/bin/bash
set -e

VPS="root@ssh.wwchun.top"
REMOTE_DIR="/opt/blind-watermark-web"

echo "📦 打包..."
tar --exclude='.venv' --exclude='__pycache__' --exclude='node_modules' \
    --exclude='.next' --exclude='.git' --exclude='*.pyc' \
    -czf /tmp/bww-deploy.tar.gz -C "$(dirname "$0")" .

echo "📤 上传..."
scp -o StrictHostKeyChecking=no /tmp/bww-deploy.tar.gz ${VPS}:${REMOTE_DIR}/

echo "🔄 部署..."
ssh -o StrictHostKeyChecking=no ${VPS} << 'REMOTE'
cd /opt/blind-watermark-web
tar xzf bww-deploy.tar.gz
rm bww-deploy.tar.gz
docker compose up --build -d --remove-orphans
docker image prune -f
REMOTE

rm /tmp/bww-deploy.tar.gz
echo "✅ 部署完成: https://bww.wwchun.top"
