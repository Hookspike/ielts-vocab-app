# 雅思词汇学习网站 - IELTS Vocabulary Learning App

一个现代化的雅思词汇学习应用，支持闪卡学习、测验练习和进度追踪。

## 功能特性

- **单词列表**: 浏览和搜索7939个雅思核心词汇
- **音标显示**: 自动获取并显示单词的国际音标（IPA）
- **真人发音**: 优先使用Free Dictionary API的真实音频，提供自然的人类发音
- **闪卡学习**: 翻转卡片学习单词，标记掌握程度
- **测验练习**: 随机测验，检验学习成果
- **进度追踪**: 自动保存学习进度到本地存储

## 国外单词学习方法

英语母语者和专业学习者常用的单词记忆方法：

### 1. 间隔重复法 (Spaced Repetition)
- **原理**: 根据遗忘曲线，在即将忘记的时点复习
- **应用**: Anki、Quizlet等应用使用此方法
- **效果**: 长期记忆效果最佳

### 2. 语境学习法 (Contextual Learning)
- **原理**: 在真实语境中学习单词，而非孤立记忆
- **方法**: 阅读英文文章、观看英文视频、听英文播客
- **优势**: 理解单词用法和搭配

### 3. 词根词缀法 (Root Words & Affixes)
- **原理**: 学习词根、前缀、后缀
- **例子**: "tele-" (远) + "phone" (声音) = telephone
- **效果**: 可批量记忆相关词汇

### 4. 主题分类法 (Thematic Grouping)
- **原理**: 按主题分类学习相关词汇
- **例子**: 学习"环境"主题时，同时学习pollution, climate, ecosystem等
- **优势**: 建立词汇网络

### 5. 多感官学习法 (Multi-sensory Learning)
- **视觉**: 看单词拼写、图像联想
- **听觉**: 听发音、听例句
- **动觉**: 书写、造句
- **效果**: 调动多种感官，记忆更深刻

### 6. 主动使用法 (Active Usage)
- **原理**: 主动使用单词而非被动记忆
- **方法**: 用新单词造句、写作、对话
- **效果**: 从"认识"到"掌握"

### 7. 词族学习法 (Word Families)
- **原理**: 学习同一词族的不同形式
- **例子**: happy, happiness, happily, unhappy
- **效果**: 扩展词汇量，理解词性变化

### 8. 联想记忆法 (Association)
- **声音联想**: 单词发音与母语词汇相似
- **图像联想**: 单词与具体图像关联
- **故事联想**: 将单词编入故事中

### 推荐学习资源
- **Anki**: 间隔重复软件
- **Quizlet**: 在线闪卡平台
- **Vocabulary.com**: 语境学习网站
- **Merriam-Webster**: 权威词典
- **BBC Learning English**: 真实语境学习

## 技术栈

- React 18
- Vite
- TailwindCSS
- Lucide Icons
- Free Dictionary API (免费获取音标)
- Web Speech API (浏览器内置语音合成)
- Nginx (生产环境)

## 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

## 部署到 Fly.io

### 自动部署（推荐）

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

脚本会自动：
- 检查并安装 flyctl
- 登录 Fly.io
- 创建应用（如果不存在）
- 构建并部署

### 手动部署

#### 前置要求

1. 安装 Fly.io CLI
```bash
curl -L https://fly.io/install.sh | sh
```

2. 登录 Fly.io
```bash
flyctl auth login
```

#### 部署步骤

1. 创建应用（首次部署）
```bash
flyctl apps create ielts-vocab-app --region sin
```

2. 部署应用
```bash
flyctl deploy
```

3. 打开应用
```bash
flyctl open
```

### 费用说明（免费额度）

Fly.io 免费额度：
- 每月 3 个 shared-cpu-1x VM
- 每月 3GB 存储空间
- 每月 160GB 出站流量

本应用配置（优化免费使用）：
- 1 个 shared-cpu-1x VM（256MB 内存）
- 自动休眠：空闲时自动停止机器
- 自动启动：有请求时自动启动
- 并发限制：软限制200请求，硬限制500请求
- **预计月费用：$0（完全免费）**

### GitHub Actions 自动部署（推荐）

无需本地安装 flyctl，通过 GitHub 自动部署：

1. **创建 GitHub 仓库**
   - 将代码推送到 GitHub

2. **配置 Secrets**
   - 在 GitHub 仓库设置中添加 Secret：
   - 名称：`FLY_API_TOKEN`
   - 值：运行 `flyctl auth token` 获取

3. **自动部署**
   - 推送代码到 `main` 分支自动触发部署
   - 或在 GitHub Actions 页面手动触发

**优势：**
- 无需本地安装 flyctl
- 代码推送即自动部署
- 完全自动化
- 免费使用 GitHub Actions

## 项目结构

```
.
├── public/              # 静态资源
├── src/
│   ├── components/      # React组件
│   │   ├── WordList.jsx
│   │   ├── Flashcard.jsx
│   │   ├── Quiz.jsx
│   │   └── Progress.jsx
│   ├── utils/           # 工具函数
│   │   └── dictionary.js # 音标和发音相关
│   ├── App.jsx          # 主应用组件
│   ├── main.jsx         # 入口文件
│   └── index.css        # 全局样式
├── vocabulary.json      # 词汇数据
├── Dockerfile           # Docker配置
├── fly.toml            # Fly.io配置
├── nginx.conf          # Nginx配置
└── package.json        # 依赖配置
```

## 数据来源

词汇数据来自 `8000词.txt`，已解析为JSON格式存储在 `vocabulary.json` 中。

## 许可证

MIT
