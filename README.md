# Blind Watermark Web

[blind_watermark](https://github.com/guofei9987/blind_watermark) 的 Web 前端，为基于 DCT + SVD 频域算法的数字盲水印提供可视化操作界面。支持将文本、图片或二进制数据隐秘嵌入图片，肉眼不可察觉，并可抗旋转、裁剪、缩放、椒盐噪声等攻击提取。

## 技术栈

| 层级 | 技术 |
|------|------|
| 水印算法 | [blind_watermark](https://github.com/guofei9987/blind_watermark) (DCT + SVD) |
| 后端 | FastAPI |
| 前端 | Next.js 16 + React 19 + shadcn/ui + Tailwind CSS v4 |
| 包管理 | bun (前端) / pip (后端) |
| 代码规范 | Biome (前端) |

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
│   ├── biome.json           # Biome 配置
│   └── package.json
├── dev.sh                   # 一键启动脚本
└── AGENTS.md
```

## 环境搭建

### 1. 安装 Python

需要 Python 3.10 或以上版本。

```bash
# macOS (Homebrew)
brew install python@3.12

# 验证版本
python3 --version
```

### 2. 安装 bun

```bash
curl -fsSL https://bun.sh/install | bash

# 验证版本
bun --version
```

### 3. 安装系统依赖

后端 `opencv-python` 和 `PyWavelets` 需要以下系统库:

```bash
# macOS
brew install cmake

# Ubuntu / Debian
sudo apt-get install -y cmake libgl1-mesa-glx libglib2.0-0
```

### 4. 克隆项目

```bash
git clone https://github.com/<your-username>/blind_watermark_web.git
cd blind_watermark_web
```

### 5. 安装后端依赖

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 6. 安装前端依赖

```bash
cd frontend
bun install
cd ..
```

## 快速开始

### 一键启动

```bash
./dev.sh
```

启动后访问:

- 前端: http://localhost:3000
- 后端: http://localhost:8000
- API 文档: http://localhost:8000/docs

按 `q` 停止所有服务。

### 手动启动

**后端:**

```bash
cd backend
source .venv/bin/activate
./run.sh
```

**前端:**

```bash
cd frontend
bun run dev
```

## 功能说明

### 嵌入水印 (`/embed`)

1. 上传原始图片
2. 选择水印模式:
   - **字符串**: 输入要嵌入的文本
   - **图片**: 上传一张水印图片
3. 设置图片密码和水印密码（整数）
4. 选择输出格式（PNG / JPG）
5. 点击「开始嵌入」，嵌入后可下载结果并查看前后对比

嵌入完成后返回 **比特长度 (wm_bit_length)**，提取时需要此参数。

### 提取水印 (`/extract`)

1. 上传含水印的图片
2. 选择水印模式（字符串 / 图片 / 二进制）
3. 填写嵌入时返回的比特长度或水印图片尺寸
4. 填写与嵌入时一致的密码
5. 点击「开始提取」

### 水印容量

上传图片后自动计算可嵌入的比特容量，前端会实时显示容量指示器。

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/embed` | 嵌入水印 |
| POST | `/api/extract` | 提取水印 |
| POST | `/api/capacity` | 查询水印容量 |

所有接口使用 `multipart/form-data` 上传文件，单文件最大 10MB。

## 配置

前端 API 地址通过环境变量配置:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

默认连接 `http://localhost:8000`。

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

## 许可证

[GPL-3.0](LICENSE.md)
