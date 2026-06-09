# Blind Watermark Web

[![Deploy](https://github.com/ChouChiu/blind_watermark_web/actions/workflows/deploy.yml/badge.svg)](https://github.com/ChouChiu/blind_watermark_web/actions/workflows/deploy.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE.md)

基于 [blind_watermark](https://github.com/guofei9987/blind_watermark) (DCT + SVD) 频域算法的数字盲水印 Web 应用。将文本、图片或二进制数据隐秘嵌入图片，嵌入后肉眼无法察觉，并可抵抗旋转、裁剪、缩放、椒盐噪声等攻击进行提取。

## 功能

| 功能 | 说明 |
|------|------|
| 嵌入水印 | 支持字符串和图片两种水印模式，设置密码后一键嵌入 |
| 提取水印 | 支持字符串、图片、二进制三种模式提取，需填写嵌入时的比特长度和密码 |
| 容量检测 | 上传图片后自动计算可嵌入的比特容量，实时显示 |
| 前后对比 | 嵌入完成后提供原图与结果图的滑动对比 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 水印算法 | [blind_watermark](https://github.com/guofei9987/blind_watermark) (DCT + SVD) |
| 后端 | FastAPI + Python 3.10+ |
| 前端 | Next.js 16 + React 19 + shadcn/ui + Tailwind CSS v4 |
| 包管理 | bun (前端) / pip (后端) |
| 代码规范 | Biome (前端) |
| 部署 | Docker Compose + GitHub Actions CI/CD |

## 项目结构

```
blind_watermark_web/
├── backend/                 # FastAPI 后端
│   ├── main.py              # 应用入口
│   ├── routers/
│   │   └── watermark.py     # API 路由 (/api/embed, /api/extract, /api/capacity)
│   ├── services/
│   │   └── watermark_service.py  # 水印嵌入/提取核心逻辑
│   ├── requirements.txt
│   └── run.sh
├── frontend/                # Next.js 前端
│   ├── app/
│   │   ├── page.tsx         # 首页
│   │   ├── embed/page.tsx   # 嵌入水印页面
│   │   └── extract/page.tsx # 提取水印页面
│   ├── components/          # UI 组件
│   ├── lib/api.ts           # API 客户端
│   └── package.json
├── docker-compose.yml       # 生产部署配置
├── deploy.sh                # 手动部署脚本
├── dev.sh                   # 一键启动脚本
└── AGENTS.md
```

## 快速开始

### 环境要求

- Python 3.10+
- [bun](https://bun.sh/) (前端包管理器)
- cmake (macOS: `brew install cmake`，Ubuntu: `sudo apt-get install cmake libgl1-mesa-glx libglib2.0-0`)

### 安装与启动

```bash
# 1. 克隆项目
git clone https://github.com/<your-username>/blind_watermark_web.git
cd blind_watermark_web

# 2. 安装后端依赖
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 3. 安装前端依赖
cd frontend
bun install
cd ..

# 4. 一键启动
./dev.sh
```

启动后访问:

- 前端: http://localhost:3000
- 后端: http://localhost:8000
- API 文档: http://localhost:8000/docs

按 `q` 停止所有服务。

### 手动启动

```bash
# 后端
cd backend && source .venv/bin/activate && ./run.sh

# 前端 (另一个终端)
cd frontend && bun run dev
```

## 开发命令

```bash
# 前端
bun run dev        # 启动开发服务器
bun run build      # 生产构建
bun run lint       # Biome 代码检查
bun run format     # Biome 自动修复

# 后端
cd backend && ./run.sh   # 启动 uvicorn (热重载)
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/embed` | 嵌入水印 (multipart/form-data，单文件最大 10MB) |
| POST | `/api/extract` | 提取水印 (multipart/form-data，单文件最大 10MB) |
| POST | `/api/capacity` | 查询水印容量 |

嵌入完成后返回 `wm_bit_length` (比特长度)，提取时需要此参数。

## 配置

前端 API 地址通过环境变量配置:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

后端 CORS 白名单:

```bash
# docker-compose.yml 或环境变量
CORS_ORIGINS=http://localhost:3000,http://localhost:3080,https://bww.wwchun.top
```

## Docker 部署

### 本地 Docker 部署

```bash
docker compose up --build -d
```

- 前端: http://localhost:3080
- 后端: http://localhost:8001

### 手动部署到 VPS

```bash
./deploy.sh
```

该脚本将项目打包 (排除 `.venv`、`node_modules`、`.next`、`.git`)，通过 SCP 传输到 VPS，然后执行 `docker compose up --build`。

### CI/CD 自动部署

推送到 `main` 分支后，GitHub Actions 自动 SSH 到 VPS 执行部署:

1. `git fetch origin main && git reset --hard origin/main`
2. `docker compose build --no-cache frontend`
3. `docker compose up -d --remove-orphans`

生产地址: https://bww.wwchun.top

## 许可证

[GPL-3.0](LICENSE.md)
