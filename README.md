# BestAds - 海外媒体平台广告投放系统

## 项目简介

BestAds是一个针对海外媒体平台（主要是Facebook）的广告投放管理系统，包含客户端系统和运营管理系统两部分。

## 系统架构

### 客户端系统 (BestAds)
- **账户管理**: FB广告账户管理、开户申请、充值申请
- **广告投放**: Facebook广告创建和管理
- **操作记录**: 所有操作的详细记录和审计

### 运营管理系统 (Admin System)
- **客户管理**: 客户信息管理和账户状态监控
- **FB业务管理**: Facebook Business账户同步和分配
- **开户管理**: 客户开户申请的审核和处理
- **账户分配**: FB广告账户的智能分配
- **充值管理**: 客户充值申请的处理和记录

## 项目结构

```
BestAds/
├── README.md                 # 项目说明文档
├── 需求文档.md              # 详细需求文档
├── log.md                   # 开发日志
├── bestads-client/          # 客户端系统页面
│   ├── index.html          # 客户端首页
│   ├── account-management.html    # 账户管理页面
│   └── operation-records.html     # 操作记录页面
├── admin-system/           # 运营管理系统页面
│   ├── index.html         # 管理后台首页
│   ├── customer-management.html  # 客户管理页面
│   ├── account-management.html   # 账户管理页面
│   ├── account-opening.html      # 开户管理页面
│   └── account-allocation.html   # 账户分配页面
├── bestads-client-styled/  # 客户端系统样式版本
└── others/                 # 其他相关页面
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **框架**: 响应式设计，扁平化设计风格
- **后端**: Node.js + Express.js (规划中)
- **数据库**: MySQL + Redis (规划中)
- **部署**: Docker + Nginx (规划中)

## 设计特点

- 🎨 扁平化设计风格
- 📱 完全响应式布局
- 🔵 统一的蓝色主题色彩
- 💡 Material Design设计原则
- 🚀 无外部依赖，完全自包含

## 开发进度

- [x] 需求文档编写
- [x] UI设计和页面原型
- [x] 客户端系统页面
- [x] 运营管理系统页面
- [ ] 后端API开发
- [ ] 数据库设计
- [ ] 系统集成测试
- [ ] 部署和上线

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/TK0918/BestAds.git
cd BestAds
```

2. 在浏览器中打开HTML文件即可预览

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 协议

MIT License 