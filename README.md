# AI算运势 - 商业版

一个基于 AI 的运势预测平台，支持八字命理、星座运势、塔罗占卜等功能。

## 功能特点

- 🔮 **八字命理** - 输入生辰八字，AI深度解析命运
- ⭐ **星座运势** - 12星座每日/每周/每月运势
- 🃏 **塔罗占卜** - 神秘塔罗牌阵指引
- 💬 **AI问答** - 智能运势顾问
- 👑 **会员系统** - 免费+付费商业模式

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI框架**: Tailwind CSS + Framer Motion
- **状态管理**: Zustand
- **AI服务**: 硅基流动 API (SiliconFlow)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```env
# AI API 配置
SILICONFLOW_API_KEY=your-api-key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
AI_MODEL=Qwen/Qwen2.5-7B-Instruct

# JWT 密钥
JWT_SECRET=your-secret-key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
ai-fortune-commercial/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── bazi/              # 八字命理页面
│   │   ├── xingzuo/          # 星座运势页面
│   │   ├── taluo/            # 塔罗占卜页面
│   │   ├── chat/             # AI问答页面
│   │   ├── vip/              # 会员页面
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首页
│   │   └── globals.css       # 全局样式
│   ├── components/            # React 组件
│   ├── lib/                   # 工具库
│   │   ├── ai-service.ts     # AI 服务
│   │   ├── store.ts          # 状态管理
│   │   └── utils.ts          # 工具函数
│   └── types/                 # TypeScript 类型
├── public/                    # 静态资源
├── .env.example              # 环境变量示例
├── package.json
└── README.md
```

## 商业模式

### 免费功能
- 每日3次免费运势查询
- 基础八字分析
- 星座今日运势

### 付费服务
- 八字精批 ¥9.9
- 终身运势 ¥29.9
- 塔罗占卜 ¥9.9
- 月度会员 ¥29.9
- 年度会员 ¥299

## AI API 接入

本项目使用[硅基流动](https://siliconflow.cn) API，支持国内访问，价格便宜。

注册可获得免费额度。

## 部署

### Vercel 部署

```bash
npm i -g vercel
vercel
```

### 环境变量

在 Vercel 项目设置中添加：
- `SILICONFLOW_API_KEY`
- `JWT_SECRET`

## License

MIT
