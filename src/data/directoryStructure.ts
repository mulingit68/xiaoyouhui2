/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description: string;
  children?: FileNode[];
  codeKey?: string; // Links to pre-defined key in our code bank for display
}

export const PLATFORM_DIRECTORY_STRUCTURE: FileNode[] = [
  {
    name: "alumni-association-miniprogram",
    type: "folder",
    description: "微信原生小程序客户端根目录",
    children: [
      {
        name: "miniprogram",
        type: "folder",
        description: "小程序核心代码包",
        children: [
          {
            name: "pages",
            type: "folder",
            description: "独立视图页面集合",
            children: [
              {
                name: "index",
                type: "folder",
                description: "首页：聚合资讯、快速导航、统计面板与轮播组件",
                children: [
                  { name: "index.ts", type: "file", description: "主逻辑，加载幻灯片与新闻资讯数据" },
                  { name: "index.wxml", type: "file", description: "九宫格导航与资讯流渲染" },
                  { name: "index.json", type: "file", description: "页面配置，注册全局自定义头" },
                  { name: "index.wxss", type: "file", description: "专有样式，流式卡片与圆角定义" }
                ]
              },
              {
                name: "alumni",
                type: "folder",
                description: "校友名录：条件搜索、极简年份/学院分类，隐私保护过滤",
                children: [
                  { name: "alumni.ts", type: "file", description: "拉取已认证校友列表，实现分页与关键字检索" },
                  { name: "alumni.wxml", type: "file", description: "搜索框，多维聚合分类标签及校友卡片列表" },
                  { name: "alumni.json", type: "file", description: "启用下拉刷新配置" },
                  { name: "alumni.wxss", type: "file", description: "紧凑网格与字母快速定位锚点样式" }
                ]
              },
              {
                name: "alumni-detail",
                type: "folder",
                description: "校友详情页：提供基本资料和工作名片显示，支持直接拨号",
                children: [
                  { name: "alumni-detail.ts", type: "file", description: "根据openid检索校友全套公开字段" },
                  { name: "alumni-detail.wxml", type: "file", description: "卡片结构：就读经历、在招职位与一键微信号复制" }
                ]
              },
              {
                name: "register",
                type: "folder",
                description: "校友入会认证及手机绑定申请模块",
                children: [
                  { name: "register.ts", type: "file", description: "实现微信手机号快捷获取解密，表单收集与证件上传", codeKey: "register_ts" },
                  { name: "register.wxml", type: "file", description: "多步骤表单，提示认证特权和实名资质收集", codeKey: "register_wxml" },
                  { name: "register.wxss", type: "file", description: "表单间距和步骤指示条的响应样式" }
                ]
              },
              {
                name: "event",
                type: "folder",
                description: "校友活动列表及报名审核详情页",
                children: [
                  { name: "event.ts", type: "file", description: "获取校友活动，提交报名记录，管理自己报名的活动" },
                  { name: "event.wxml", type: "file", description: "活动报名按钮，名额进度条，倒计时与状态渲染" }
                ]
              },
              {
                name: "enterprise",
                type: "folder",
                description: "校友企业展示模块及相关急招聘发布",
                children: [
                  { name: "enterprise.ts", type: "file", description: "展现校友名下商会、合伙或创办企业资质和基本介绍" },
                  { name: "enterprise.wxml", type: "file", description: "企业黄页：行业检索，企业主页及内推岗位展示区" }
                ]
              },
              {
                name: "donation",
                type: "folder",
                description: "会费缴纳和爱心赞助页",
                children: [
                  { name: "donation.ts", type: "file", description: "微信支付API唤起、生成数字款项证明，渲染历史记录" },
                  { name: "donation.wxml", type: "file", description: "支付表单、会费档位、光荣爱心榜、数字感谢证书展示" }
                ]
              },
              {
                name: "profile",
                type: "folder",
                description: "个人中心：展示我的报名、我的内推、卡券会费证明及二级管理员面板入口",
                children: [
                  { name: "profile.ts", type: "file", description: "个人成长经历归档，权限校验后渲染管理中心链接" },
                  { name: "profile.wxml", type: "file", description: "个人主页，我的徽章与认证身份标签显示" }
                ]
              },
              {
                name: "admin",
                type: "folder",
                description: "小程序轻量级移动审批端：方便骨干理事随时接收审核微信推送进行秒级审批",
                children: [
                  { name: "admin.ts", type: "file", description: "获取待审批的校友、活动等列表，提交通过或拒绝请求", codeKey: "admin_ts" },
                  { name: "admin.wxml", type: "file", description: "待审批队列滑动卡片，带拒绝理由弹窗的极速操作面板", codeKey: "admin_wxml" }
                ]
              }
            ]
          },
          {
            name: "app.ts",
            type: "file",
            description: "微信小程序入口代码，进行云开发初始化 wx.cloud.init 并在 onLaunch 获知用户角色",
            codeKey: "app_ts"
          },
          {
            name: "app.json",
            type: "file",
            description: "小程序配置清单：声明所有页面路由结构、主线配色与窗口表现",
            codeKey: "app_json"
          },
          {
            name: "app.wxss",
            type: "file",
            description: "全局根样式、经典校色（红白/蓝白）及通用表单间距设计"
          }
        ]
      },
      {
        name: "cloudfunctions",
        type: "folder",
        description: "微信云开发自带的 Node.js 弹性云函数，部署在微信内，免鉴权安全访问数据库",
        children: [
          {
            name: "login",
            type: "folder",
            description: "登录函数：获取微信OpenID并拦截新访客、自动下发状态",
            children: [
              { name: "index.js", type: "file", description: "入口，解析上下文中的 openid" },
              { name: "package.json", type: "file", description: "依赖包声明" }
            ]
          },
          {
            name: "user_manager",
            type: "folder",
            description: "用户账号与身份入会认证相关云函数组",
            children: [
              { name: "index.ts", type: "file", description: "一站式接收认证提交、编辑档案，提供防跨站防越权保护", codeKey: "cf_user_manager" },
              { name: "package.json", type: "file", description: "导入 wx-server-sdk 并在服务端执行强类型检查" }
            ]
          },
          {
            name: "admin_gateway",
            type: "folder",
            description: "校友会核心审核与授权云函数：严禁普通用户直接修改数据库，通过后端角色拦截安全提交",
            children: [
              { name: "index.ts", type: "file", description: "验证管理员 role 身份后批量或者逐笔进行审批、录入操作", codeKey: "cf_admin_gateway" },
              { name: "package.json", type: "file", description: "配置文件" }
            ]
          },
          {
            name: "events_manager",
            type: "folder",
            description: "活动发布、活动加入审核底层云函数"
          },
          {
            name: "enterprises_recruitment",
            type: "folder",
            description: "校友企业入驻核查、内推岗位发布与过滤"
          }
        ]
      },
      {
        name: "project.config.json",
        type: "file",
        description: "微信开发者工具核心工程规则配置，指向云开发文件夹"
      },
      {
        name: "cloudbase_rules.json",
        type: "file",
        description: "云数据库安全规则：默认仅允许云函数、管理员超级写入，防恶意撞库"
      }
    ]
  },
  {
    name: "alumni-web-dashboard",
    type: "folder",
    description: "高级 Web 骨干管理后台（基于 React 19 + Tailwind CSS + 数据图表）",
    children: [
      { name: "src/App.tsx", type: "file", description: "管理面板总界面骨架" },
      { name: "src/components/WebAdmin.tsx", type: "file", description: "仪表盘与各项增删改查高级功能交互页" },
      { name: "src/components/MiniProgramSimulator.tsx", type: "file", description: "微信端模拟体验区" },
      { name: "src/types.ts", type: "file", description: "前后端共享的强类型声明" }
    ]
  }
];
