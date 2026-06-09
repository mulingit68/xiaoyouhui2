/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodeSnippet {
  title: string;
  language: string;
  filePath: string;
  explanation: string;
  code: string;
}

export const PLATFORM_CODE_BANK: Record<string, CodeSnippet> = {
  app_json: {
    title: "小程序全局配置文件 (app.json)",
    language: "json",
    filePath: "miniprogram/app.json",
    explanation: "定义了整套小程序的第一层路由、底部 Tab 栏配置、以及窗口外观。第一版包含 5 个核心 Tab 频道及管理员独立子目录。",
    code: `{
  "pages": [
    "pages/index/index",
    "pages/alumni/alumni",
    "pages/event/event",
    "pages/enterprise/enterprise",
    "pages/profile/profile",
    "pages/alumni-detail/alumni-detail",
    "pages/register/register",
    "pages/donation/donation",
    "pages/admin/admin"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#0a2e5c",
    "navigationBarTitleText": "三水华侨中学校友会",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#f8f9fa"
  },
  "tabBar": {
    "color": "#6c757d",
    "selectedColor": "#0a2e5c",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "assets/icons/home.png",
        "selectedIconPath": "assets/icons/home_active.png"
      },
      {
        "pagePath": "pages/alumni/alumni",
        "text": "校友录",
        "iconPath": "assets/icons/directory.png",
        "selectedIconPath": "assets/icons/directory_active.png"
      },
      {
        "pagePath": "pages/event/event",
        "text": "活动",
        "iconPath": "assets/icons/event.png",
        "selectedIconPath": "assets/icons/event_active.png"
      },
      {
        "pagePath": "pages/enterprise/enterprise",
        "text": "企业内推",
        "iconPath": "assets/icons/work.png",
        "selectedIconPath": "assets/icons/work_active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "assets/icons/user.png",
        "selectedIconPath": "assets/icons/user_active.png"
      }
    ]
  },
  "sitemapLocation": "sitemap.json",
  "style": "v2",
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于推荐同城及附近区域开展的校友沙龙活动"
    }
  }
}`
  },

  app_ts: {
    title: "小程序运行环境初始化 (app.ts)",
    language: "typescript",
    filePath: "miniprogram/app.ts",
    explanation: "小程序加载时首个执行的逻辑。负责初始化微信云开发环境（通过 env 参数保障多套环境隔离），并在全局作用域挂载当前用户的 session 缓存。",
    code: `App<IAppOption>({
  globalData: {
    userInfo: null, // 全局用户状态
    userRole: 'VISITOR' // 默认访客
  },

  onLaunch() {
    // 1. 初始化微信云开发
    if (!wx.cloud) {
      console.error('请配合使用微信云开发 2.0.0 或以上版本');
    } else {
      wx.cloud.init({
        env: 'alumni-dist-prod-8gfy3c', // 对应云开发的物理环境ID
        traceUser: true // 开启用户流水分流，可以在控制台看见真实日活
      });
    }

    // 2. 调用微信登录云函数, 获取并维护用户登录态
    this.checkUserSession();
  },

  async checkUserSession() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {}
      });
      const result = res.result as any;
      if (result && result.openid) {
        console.log('微信自动鉴权成功, OpenID:', result.openid);
        
        // 查询数据库中该主键对应的档案
        const db = wx.cloud.database();
        const userQuery = await db.collection('users').doc(result.openid).get().catch(() => null);
        
        if (userQuery && userQuery.data) {
          const user = userQuery.data;
          this.globalData.userInfo = user;
          this.globalData.userRole = user.role;
          console.log('本地绑定账户身份成功:', user.role);
        } else {
          console.log('当前访问为新注册游客，尚未进行手机号绑定');
        }
      }
    } catch (err) {
      console.error('静默鉴权接口故障:', err);
    }
  }
});`
  },

  register_ts: {
    title: "校友入会/实名绑定客户端逻辑 (register.ts)",
    language: "typescript",
    filePath: "miniprogram/pages/register/register.ts",
    explanation: "实现绑定手机号、填写校友档案基础信息、以及上传证书附件。在云开发体系内，我们通过免写服务器直接将图片存入云存储服务，再将对应的 Cloud URI 提交给云数据库。",
    code: `const app = getApp();

Page({
  data: {
    step: 1, // 控制步骤条，1表示手机号绑定，2表示校友实名档案
    phoneNumber: '',
    realName: '',
    入学年份: 2012,
    学院: '',
    专业: '',
    extraInfo: '',
    studentCardPicUrl: '', // 毕业证书/学信网截图的 Cloud FileID
    years: [] as number[],
    isSubmitting: false
  },

  onLoad() {
    // 初始化年份选择器数据，如当年向前推 60 年
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 60; i--) {
      years.push(i);
    }
    this.setData({ years });
  },

  // 微信授权一键获取并绑定手机号
  async onGetPhoneNumber(e: any) {
    if (!e.detail.code) {
      wx.showToast({ title: '需要手机号授权以确认校友身份', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在获取手机号...' });
    try {
      // 调用云函数解密手机密码或回访微信服务器获取手机
      const res = await wx.cloud.callFunction({
        name: 'user_manager',
        data: {
          action: 'bindPhoneNumber',
          code: e.detail.code
        }
      });
      
      const result = res.result as any;
      if (result.success) {
        this.setData({
          phoneNumber: result.phoneNumber,
          step: 2 // 自动过渡到第二步：补充校友实名档案
        });
        wx.showToast({ title: '手机号验证成功', icon: 'success' });
      } else {
        wx.showModal({ title: '安全核查未通过', content: result.error || '获取失败，请重试', showCancel: false });
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '网络异常，请重试', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 单击上传证书截图说明
  uploadCertificate() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const filePath = res.tempFiles[0].tempFilePath;
        const cloudPath = \`certificates/\${Date.now()}-\${Math.random().toString(36).slice(-6)}.jpg\`;
        
        wx.showLoading({ title: '正上传凭证...' });
        // 免鉴权直传微信云存储
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: uploadRes => {
            this.setData({
              studentCardPicUrl: uploadRes.fileID // 保存云 FileID
            });
            wx.showToast({ title: '凭证上传成功', icon: 'success' });
          },
          fail: err => {
            console.error('上传图片失败:', err);
            wx.showToast({ title: '上传失败', icon: 'error' });
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      }
    });
  },

  // 输入框双向绑定模拟
  onInputName(e: any) { this.setData({ realName: e.detail.value }); },
  onInputCollege(e: any) { this.setData({ 学院: e.detail.value }); },
  onInputMajor(e: any) { this.setData({ 专业: e.detail.value }); },
  onInputExtra(e: any) { this.setData({ extraInfo: e.detail.value }); },
  onYearChange(e: any) {
    const idx = parseInt(e.detail.value);
    this.setData({ 入学年份: this.data.years[idx] });
  },

  // 提交校友实名档案与校友认证审核
  async onSubmitForm() {
    const { realName, phoneNumber, 入学年份, 学院, 专业, studentCardPicUrl, extraInfo } = this.data;
    
    if (!realName.trim() || !学院.trim() || !专业.trim()) {
      wx.showToast({ title: '带*项必须完整填写', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '正在提交中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'user_manager',
        data: {
          action: 'submitAlumniAudit',
          payload: {
            realName,
            phoneNumber,
            入学年份,
            学院,
            专业,
            studentCardPicUrl,
            extraInfo
          }
        }
      });

      const result = res.result as any;
      if (result.success) {
        wx.showModal({
          title: '申请提交成功',
          content: '您的校友实名资质正在审核中。本城市/地方校友组委会将在2个工作日内完成实名档案核验。',
          showCancel: false,
          success() {
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        });
      } else {
        wx.showModal({ title: '提交不成功', content: result.error || '因越权或数据格式错误导致保存失败', showCancel: false });
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '云数据链路发生未知偏差', icon: 'error' });
    } finally {
      this.setData({ isSubmitting: false });
      wx.hideLoading();
    }
  }
});`
  },

  register_wxml: {
    title: "校友入会/实名绑定视图层 (register.wxml)",
    language: "xml",
    filePath: "miniprogram/pages/register/register.wxml",
    explanation: "微信官方小程序原生标签视图代码。包含精美极简的流程步骤指示灯、一键绑定授权按钮、支持上传毕业凭证的安全提示框。",
    code: `<view class="container">
  <!-- 步骤展示 -->
  <view class="step-header">
    <view class="step-item {{step >= 1 ? 'active' : ''}}">
      <text class="step-number">1</text>
      <text class="step-text">手机号绑定</text>
    </view>
    <view class="step-line {{step >= 2 ? 'active-line' : ''}}"></view>
    <view class="step-item {{step >= 2 ? 'active' : ''}}">
      <text class="step-number">2</text>
      <text class="step-text">校友资质审核</text>
    </view>
  </view>

  <!-- 第一步：微信极速获取绑定手机号 -->
  <view wx:if="{{step === 1}}" class="step-content text-center">
    <image class="privacy-icon" src="/assets/icons/shield.png" />
    <view class="privacy-title">安全合规认证</view>
    <view class="privacy-desc">我们是经过学校官方登记认定的校友联谊会。为了维护校友圈安全，仅允许填写真实、有效的中国大陆实名手机号方能建立档案。</view>
    
    <button id="wechatPhoneBtn" class="btn btn-primary" open-type="getPhoneNumber" bindgetphonenumber="onGetPhoneNumber">
      一键安全绑定微信绑定手机号
    </button>
  </view>

  <!-- 第二步：校友实名档案表单 -->
  <view wx:if="{{step === 2}}" class="step-content">
    <view class="form-title">实名校友建档及入会资质提交</view>
    <view class="form-sub">* 必须填入您在母校的求学实情以便校方数据库对接系统直接秒核过审 *</view>

    <view class="form-item">
      <text class="form-label">真实姓名 *</text>
      <input class="input-element" placeholder="请填写您的身份证姓名" bindinput="onInputName" value="{{realName}}"/>
    </view>

    <view class="form-item">
      <text class="form-label">绑定的手机</text>
      <input class="input-element disabled" disabled value="{{phoneNumber}}"/>
    </view>

    <view class="form-item">
      <text class="form-label">入学年份 *</text>
      <picker mode="selector" range="{{years}}" bindchange="onYearChange">
        <view class="picker-value">{\{入学年份}\} 届 (单击可选择)</view>
      </picker>
    </view>

    <view class="form-item">
      <text class="form-label">毕业学院 *</text>
      <input class="input-element" placeholder="如 '计算机与人工智能学院'" bindinput="onInputCollege" value="{{学院}}"/>
    </view>

    <view class="form-item">
      <text class="form-label">攻读专业 *</text>
      <input class="input-element" placeholder="如 '网络工程'" bindinput="onInputMajor" value="{{专业}}"/>
    </view>

    <view class="form-item">
      <text class="form-label">证明材料（可选）</text>
      <view class="certificate-uploader" bindtap="uploadCertificate">
        <image wx:if="{{studentCardPicUrl}}" src="{{studentCardPicUrl}}" mode="aspectFit" class="cert-img" />
        <view wx:else class="uploader-placeholder">
          <text class="plus-icon">+</text>
          <text class="upload-tip">上传校园卡、毕业证书或学信网截图</text>
        </view>
      </view>
    </view>

    <view class="form-item">
      <text class="form-label">备注(选填)</text>
      <textarea class="textarea-element" placeholder="辅导员真实名字或班主任有助于加速审核" bindinput="onInputExtra" value="{{extraInfo}}"/>
    </view>

    <button id="submitAuditBtn" class="btn btn-primary" bindtap="onSubmitForm" disabled="{{isSubmitting}}">
      {\{isSubmitting ? '提交中...' : '核对并提交申请'\}\}
    </button>
  </view>
</view>`
  },

  admin_ts: {
    title: "小程序管理员审核业务代码 (admin.ts)",
    language: "typescript",
    filePath: "miniprogram/pages/admin/admin.ts",
    explanation: "微信小程序内理事、管理骨干的高效移动审批面板，可以加载待实名认证的校友明细，并进行快速的通过或拒绝操作。",
    code: `Page({
  data: {
    pendingAudits: [] as any[],
    activeTab: 'AUDITING', // AUDITING=待审批, PROCESSED=已处理
    auditReason: '', // 驳回理由文本
    showReasonDialog: false,
    selectedAuditId: ''
  },

  onShow() {
    this.checkAdminPrivileges();
  },

  // 进入自研安全网关，拦截越权行为
  async checkAdminPrivileges() {
    const app = getApp();
    // 基础的本地阻导，真正的严审部署在云开发函数中
    if (app.globalData.userRole !== 'ADMIN' && app.globalData.userRole !== 'SUPER_ADMIN') {
      wx.showModal({
        title: '鉴权失败',
        content: '该版块专属于校友会组委会理事或系统管理人员。',
        showCancel: false,
        success() {
          wx.navigateBack();
        }
      });
      return;
    }
    
    this.fetchPendingList();
  },

  // 获取云数据库待审列表
  async fetchPendingList() {
    wx.showLoading({ title: '加载注册队列...' });
    try {
      const res = await wx.cloud.callFunction({
        name: 'admin_gateway',
        data: {
          action: 'getPendingAlumniAudits',
          payload: {
            isActiveTab: this.data.activeTab
          }
        }
      });
      
      const result = res.result as any;
      if (result.success) {
        this.setData({
          pendingAudits: result.data || []
        });
      } else {
        wx.showToast({ title: result.error || '获取失败', icon: 'none' });
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '云基础底层超时', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 行使管理员特权审核过审
  async approveVerifyAlumni(e: any) {
    const auditId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '核验通过',
      content: '是否核准该申请真实性，并下发官方入会及实名认证校友级别？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '正在授权变动...' });
          try {
            const cloudRes = await wx.cloud.callFunction({
              name: 'admin_gateway',
              data: {
                action: 'processAlumniAudit',
                payload: {
                  auditId,
                  status: 'APPROVED',
                  reply: '经校方实名学籍认证数据比对无差异，准予入会并颁发校友勋章。'
                }
              }
            });

            const result = cloudRes.result as any;
            if (result.success) {
              wx.showToast({ title: '成功核验', icon: 'success' });
              this.fetchPendingList(); // 重新加载
            } else {
              wx.showModal({ title: '拒绝失败', content: result.error || '操作拒绝', showCancel: false });
            }
          } catch (err) {
            console.error(err);
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  // 行使驳回审批
  rejectVerifyAlumni(e: any) {
    const auditId = e.currentTarget.dataset.id;
    this.setData({
      showReasonDialog: true,
      selectedAuditId: auditId,
      auditReason: ''
    });
  },

  onInputReason(e: any) {
    this.setData({ auditReason: e.detail.value });
  },

  closeReasonDialog() {
    this.setData({ showReasonDialog: false });
  },

  // 发送驳回云指令
  async submitRejectAction() {
    const { selectedAuditId, auditReason } = this.data;
    if (!auditReason.trim()) {
      wx.showToast({ title: '请简述驳回核实疑点', icon: 'none' });
      return;
    }

    this.setData({ showReasonDialog: false });
    wx.showLoading({ title: '驳回批复中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'admin_gateway',
        data: {
          action: 'processAlumniAudit',
          payload: {
            auditId: selectedAuditId,
            status: 'REJECTED',
            reply: auditReason
          }
        }
      });

      const result = res.result as any;
      if (result.success) {
        wx.showToast({ title: '已成功驳回', icon: 'success' });
        this.fetchPendingList();
      } else {
        wx.showModal({ title: '驳回失败', content: result.error || '云端执行错误', showCancel: false });
      }
    } catch (err) {
      console.error(err);
    } finally {
      wx.hideLoading();
    }
  }
});`
  },

  admin_wxml: {
    title: "小程序管理员审核视图代码 (admin.wxml)",
    language: "xml",
    filePath: "miniprogram/pages/admin/admin.wxml",
    explanation: "校友会内部极速移动端审批中心页面代码。包含待审核列表的高保真表单，能放大査看学号、毕业证照片，提供通过及原因回复抽屉式框体。",
    code: `<view class="container">
  <view class="admin-title">校友理事实名审批台</view>

  <!-- 待审核列表卡片聚合 -->
  <view wx:if="{{pendingAudits.length === 0}}" class="empty-state">
    <image class="ok-icon" src="/assets/icons/success_badge.png" />
    <view class="empty-tip">报告理事，当前无排队待审核实名申请</view>
  </view>

  <scroll-view wx:else scroll-y class="audit-list">
    <view class="audit-card" wx:for="{{pendingAudits}}" wx:key="_id">
      <view class="card-line">
        <text class="label">申请姓名：</text>
        <text class="val highlight text-bold">{\{item.realName\}\}</text>
      </view>
      <view class="card-line">
        <text class="label">手机绑定：</text>
        <text class="val">{\{item.phoneNumber\}\}</text>
      </view>
      <view class="card-line">
        <text class="label">学籍经历：</text>
        <text class="val">{\{item.入学年份\}\}届 - {\{item.学院\}\} - {\{item.专业\}\}</text>
      </view>
      <view class="card-line" wx:if="{{item.extraInfo}}">
        <text class="label">补充线索：</text>
        <text class="val text-italic">"{\{item.extraInfo\}\}"</text>
      </view>

      <!-- 证明材料照片展示 -->
      <view class="card-pic-wrapper" wx:if="{{item.studentCardPicUrl}}">
        <text class="label-block">毕业/求学资质附件证明：</text>
        <image class="audit-pic" src="{{item.studentCardPicUrl}}" mode="aspectFill" bindtap="previewAttachment" data-src="{{item.studentCardPicUrl}}"/>
      </view>

      <!-- 操作动作栏 -->
      <view class="action-row">
        <button id="rejectBtn" class="btn-action btn-reject" bindtap="rejectVerifyAlumni" data-id="{{item._id}}">
          驳回申请
        </button>
        <button id="approveBtn" class="btn-action btn-approve" bindtap="approveVerifyAlumni" data-id="{{item._id}}">
          审核确认通过
        </button>
      </view>
    </view>
  </scroll-view>

  <!-- 驳回原因输入抽屉式覆盖框 -->
  <view class="dialog-mask" wx:if="{{showReasonDialog}}">
    <view class="dialog-box">
      <view class="dialog-title">拒绝该校友认证/实名会籍</view>
      <textarea class="dialog-input" placeholder="请详细阐述驳回校核疑点（例如：毕业年份与专业档案不吻合，请重填）" bindinput="onInputReason" value="{{auditReason}}" />
      <view class="dialog-actions">
        <button class="dialog-btn" bindtap="closeReasonDialog">放弃退出</button>
        <button class="dialog-btn confirm text-danger" bindtap="submitRejectAction">驳回并下发微信提醒</button>
      </view>
    </view>
  </view>
</view>`
  },

  cf_user_manager: {
    title: "校友资料与鉴权云函数 (user_manager/index.ts)",
    language: "typescript",
    filePath: "cloudfunctions/user_manager/index.ts",
    explanation: "微信云函数，运行于微信官方独占免流服务器内。具备免鉴权获取调用者 wxOpenID 的特性，在这里严密处理手机绑定、用户入册以及由于角色冲突引发的权限校验。",
    code: `import * as cloud from 'wx-server-sdk';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 绑定自动运行的上下文微信环境
});

const db = cloud.database();
const _ = db.command;

export async function main(event: any, context: any) {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID; // 自动免鉴权获取的客户端微信OpenID

  if (!openid) {
    return { success: false, error: '未能获取合法的微信操作上下文授权' };
  }

  const { action, payload } = event;

  try {
    switch (action) {
      // 1. 实现手机号极速解密与安全绑定
      case 'bindPhoneNumber': {
        const phoneCode = event.code;
        if (!phoneCode) return { success: false, error: '手机号换取票据code缺失' };

        // 调用微信开放接口解密手机号码
        const res = await cloud.openapi.phonenumber.getPhoneNumber({
          code: phoneCode,
        });

        if (res && res.phoneInfo && res.phoneInfo.phoneNumber) {
          const phoneNumber = res.phoneInfo.phoneNumber;

          // 开启事务或者安全创建/检索用户本尊
          const userDoc = await db.collection('users').doc(openid).get().catch(() => null);

          if (!userDoc) {
            // 是初次注册授权的游客用户
            await db.collection('users').add({
              data: {
                _id: openid,
                phoneNumber: phoneNumber,
                avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqgLwvuW4r6Dria5B1nS9icibG6icB6iaibiaibia/0', // 默认微信灰身头像
                nickName: '未实名校友',
                role: 'VISITOR', // 初次默认仅为游客
                isCertified: false,
                createdAt: db.serverDate(),
                updatedAt: db.serverDate()
              }
            });
          } else {
            // 已有记录，仅重置或覆盖手机
            await db.collection('users').doc(openid).update({
              data: {
                phoneNumber: phoneNumber,
                updatedAt: db.serverDate()
              }
            });
          }

          return { success: true, phoneNumber };
        } else {
          return { success: false, error: '解析微信加密手机包遭遇API故障' };
        }
      }

      // 2. 实名提交官方校友认证申请
      case 'submitAlumniAudit': {
        const { realName, phoneNumber, 入学年份, 学院, 专业, studentCardPicUrl, extraInfo } = payload;
        
        // 健壮校验证书或核心学籍必填
        if (!realName || !入学年份 || !学院 || !专业) {
          return { success: false, error: '拒绝保存，申报数据必填校核漏填' };
        }

        // 查询是否已经在排队待审批中以防轰炸
        const hasPending = await db.collection('alumni_audits').where({
          openid: openid,
          status: 'PENDING'
        }).count();

        if (hasPending.total > 0) {
          return { success: false, error: '您有一条入会实名在抱审队列，请勿重复刷单。' };
        }

        // 写入审核申请，设置默认状态为 PENDING (待审批)
        const auditId = \`audit_\${Date.now()}_\${Math.random().toString(36).substr(2, 6)}\`;
        await db.collection('alumni_audits').add({
          data: {
            _id: auditId,
            openid: openid,
            realName,
            phoneNumber,
            入学年份: Number(入学年份),
            毕业年份: Number(入学年份) + 4, // 模拟年份
            学院,
            专业,
            studentCardPicUrl: studentCardPicUrl || '',
            extraInfo: extraInfo || '',
            status: 'PENDING',
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        });

        return { success: true, auditId };
      }

      // 3. 用户自我编辑基本社会职务等辅助档案
      case 'updateSelfProfile': {
        const { nickName, avatarUrl, currentCity, company, position } = payload;

        // 特别安全防护：严禁用户通过编辑个人主页，伪造、越权篡改 role 或 isCertified 主字段
        await db.collection('users').doc(openid).update({
          data: {
            nickName: nickName,
            avatarUrl: avatarUrl,
            currentCity: currentCity || '',
            company: company || '',
            position: position || '',
            updatedAt: db.serverDate()
          }
        });

        return { success: true };
      }

      default:
        return { success: false, error: '未知云指令匹配' };
    }
  } catch (error: any) {
    console.error('云处理程序发生崩坏:', error);
    return { success: false, error: error.message || '微信微服务节点崩溃' };
  }
}`
  },

  cf_admin_gateway: {
    title: "管理后台强校验网关 (admin_gateway/index.ts)",
    language: "typescript",
    filePath: "cloudfunctions/admin_gateway/index.ts",
    explanation: "校友会核心服务端授权卫士。通过从 users 表中基于免伪造的 openid 实时拉取最新 role，严格审核身份。如果不是 ADMIN 或 SUPER_ADMIN 权限，直接拦截，彻底防护普通用户通过网络拦截修改请求内容伪造管理员操作数据库的行为。",
    code: `import * as cloud from 'wx-server-sdk';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

export async function main(event: any, context: any) {
  const wxContext = cloud.getWXContext();
  const operatorOpenid = wxContext.OPENID; // 管理操作者的真实 OpenID

  if (!operatorOpenid) {
    return { success: false, error: '拒绝：未捕捉到有效的微信管理端操作凭据' };
  }

  // ==== 🛡️ 严格安全级别拦截过滤：核查操作者的角色 ===
  const opUserQuery = await db.collection('users').doc(operatorOpenid).get().catch(() => null);
  if (!opUserQuery || !opUserQuery.data) {
    return { success: false, error: '越权警报：操作库不存在该微信号账户档案' };
  }

  const opRole = opUserQuery.data.role;
  if (opRole !== 'ADMIN' && opRole !== 'SUPER_ADMIN') {
    return { success: false, error: '越权警报：严禁普通身份校友行使管理员指令，该危险操作已记日志。' };
  }

  const { action, payload } = event;

  try {
    switch (action) {
      // 1. 获取待实名校友审核队列
      case 'getPendingAlumniAudits': {
        const { isActiveTab } = payload;
        const targetStatus = isActiveTab === 'AUDITING' ? 'PENDING' : _.neq('PENDING');

        const listQuery = await db.collection('alumni_audits')
          .where({
            status: targetStatus
          })
          .orderBy('createdAt', 'desc')
          .limit(100)
          .get();

        return { success: true, data: listQuery.data };
      }

      // 2. 审批操作处理核心逻辑
      case 'processAlumniAudit': {
        const { auditId, status, reply } = payload; // status只能是 APPROVED / REJECTED

        if (!['APPROVED', 'REJECTED'].includes(status)) {
          return { success: false, error: '指令集异常，拒绝解析不合法的审批结果' };
        }

        // a. 首先获取该笔申请单全文
        const auditDoc = await db.collection('alumni_audits').doc(auditId).get().catch(() => null);
        if (!auditDoc || !auditDoc.data) {
          return { success: false, error: '所对应审批的档案单据已被物理风控或丢失' };
        }

        const applicantOpenid = auditDoc.data.openid;

        // b. 使用微信云数据库事务或多步更新
        // 更新审计表
        await db.collection('alumni_audits').doc(auditId).update({
          data: {
            status: status,
            operatorOpenid: operatorOpenid,
            auditReply: reply || '',
            updatedAt: db.serverDate()
          }
        });

        // c. 如果通过，将对应用户的角色提权为认证校友并标定认证等级
        if (status === 'APPROVED') {
          await db.collection('users').doc(applicantOpenid).update({
            data: {
              role: 'ALUMNI_VERIFIED', // 升阶为已验证实名校友
              isCertified: true,
              realName: auditDoc.data.realName,
              入学年份: auditDoc.data.入学年份,
              学院: auditDoc.data.学院,
              专业: auditDoc.data.专业,
              updatedAt: db.serverDate()
            }
          });
        } else {
          // 如果是拒绝驳回，校友身份打回游客
          await db.collection('users').doc(applicantOpenid).update({
            data: {
              role: 'VISITOR', 
              isCertified: false,
              updatedAt: db.serverDate()
            }
          });
        }

        // d. 记录一份管理员的操作流水，做到留痕审计
        await db.collection('operation_logs').add({
          data: {
            operatorOpenid,
            operatorName: opUserQuery.data.realName || opUserQuery.data.nickName,
            role: opRole,
            action: \`审核校友 "\${auditDoc.data.realName}" 的实名入会认证申请，审批结果：\${status === 'APPROVED' ? '准予通过' : '不予通过，理由为：' + reply}\`,
            createdAt: db.serverDate()
          }
        });

        return { success: true };
      }

      // 3. 管理员授权及成员降权
      case 'updateUserAuth': {
        // 这一项属于 SUPER_ADMIN 超级管理员特权，普通二级 ADMIN 人员无权
        if (opRole !== 'SUPER_ADMIN') {
          return { success: false, error: '权限封锁：仅第一会长/系统超级管理员有权操作管理层委任。' };
        }

        const { targetUserOpenid, newRole } = payload;
        
        await db.collection('users').doc(targetUserOpenid).update({
          data: {
            role: newRole,
            updatedAt: db.serverDate()
          }
        });

        return { success: true };
      }

      default:
        return { success: false, error: '管理网关未定义该微操作指令' };
    }
  } catch (err: any) {
    console.error('管理云网关发生故障:', err);
    return { success: false, error: err.message || '微信数据库驱动失锁' };
  }
}`
  }
};
