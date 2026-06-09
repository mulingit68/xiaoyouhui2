/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  Home, 
  Users, 
  Calendar, 
  Briefcase, 
  User, 
  Lock, 
  CheckCircle, 
  ChevronRight, 
  Building2, 
  PlusCircle, 
  QrCode, 
  Coins, 
  HelpCircle,
  FileCheck2,
  Trash2,
  Bell
} from 'lucide-react';
import { UserInfo, AlumniAudit, AlumniEvent, EventRegistration, AlumniEnterprise, JobItem, DonationRecord, UserRole, AuditStatus } from '../types';

interface SimulatorProps {
  currentUser: UserInfo;
  usersList: UserInfo[];
  auditList: AlumniAudit[];
  eventsList: AlumniEvent[];
  eventRegistrations: EventRegistration[];
  enterprisesList: AlumniEnterprise[];
  jobsList: JobItem[];
  donationsList: DonationRecord[];
  
  onUpdateCurrentUser: (user: UserInfo) => void;
  onSubmitAudit: (newAudit: AlumniAudit) => void;
  onUpdateAuditStatus: (auditId: string, status: AuditStatus, reply?: string) => void;
  onJoinEvent: (reg: EventRegistration) => void;
  onUpdateRegistrationStatus: (regId: string, status: AuditStatus) => void;
  onCreateEnterprise: (enterprise: AlumniEnterprise) => void;
  onCreateJob: (job: JobItem) => void;
  onDonate: (donation: DonationRecord) => void;
  onPromoteUser: (openid: string, role: UserRole) => void;
}

export default function MiniProgramSimulator({
  currentUser,
  usersList,
  auditList,
  eventsList,
  eventRegistrations,
  enterprisesList,
  jobsList,
  donationsList,
  onUpdateCurrentUser,
  onSubmitAudit,
  onUpdateAuditStatus,
  onJoinEvent,
  onUpdateRegistrationStatus,
  onCreateEnterprise,
  onCreateJob,
  onDonate,
  onPromoteUser
}: SimulatorProps) {
  // 当前模拟器所在页面: 'home', 'alumni', 'event', 'enterprise', 'profile', 'register', 'donation', 'admin-verify'
  const [activeScreen, setActiveScreen] = useState<'home' | 'alumni' | 'event' | 'enterprise' | 'profile' | 'register' | 'donation' | 'admin-verify'>('home');
  
  // 临时表单状态
  const [phoneInput, setPhoneInput] = useState('138' + Math.floor(10000000 + Math.random() * 90000000));
  const [registerName, setRegisterName] = useState('');
  const [registerCollege, setRegisterCollege] = useState('计算机与人工智能学院');
  const [registerMajor, setRegisterMajor] = useState('软件工程');
  const [registerYear, setRegisterYear] = useState(2016);
  const [registerUpload, setRegisterUpload] = useState<string>('');
  const [registerExtra, setRegisterExtra] = useState('');

  // 会费及捐助临时表单
  const [donationAmount, setDonationAmount] = useState('200');
  const [donationProject, setDonationProject] = useState('MEMBERSHIP_FEE'); // MEMBERSHIP_FEE, SCHOLARSHIP, ALUMNI_HOUSE
  const [donorName, setDonorName] = useState(currentUser.realName || currentUser.nickName);
  const [donationBlessing, setDonationBlessing] = useState('祝母校欣欣向荣，桃李芬芳！');
  const [showPayModal, setShowPayModal] = useState(false);
  const [recentGeneratedCert, setRecentGeneratedCert] = useState<DonationRecord | null>(null);

  // 招聘发布临时表单
  const [jobTitle, setJobTitle] = useState('');
  const [jobSalary, setJobSalary] = useState('12k-18k');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('北京');
  const [jobDesc, setJobDesc] = useState('');
  const [jobEmail, setJobEmail] = useState('');
  const [showAddJob, setShowAddJob] = useState(false);

  // 滑动图片索引
  const bannerImages = [
    { title: "2026年首场线下校友创新论坛", desc: "聚浪成潮，共享行业前沿热点" },
    { title: "校友之家实体配套建设计划", desc: "为广大校友提供回归歇脚新阵地" },
    { title: "春季名企直聘绿色内推周", desc: "50+家校友企业高薪虚位以待" }
  ];
  const [currentBanner, setCurrentBanner] = useState(0);

  // 重置表单至默认
  const handleStartRegister = () => {
    setRegisterName(currentUser.realName || '');
    setRegisterUpload('');
    setActiveScreen('register');
  };

  // 快捷获取解密微信手机号
  const handleQuickBindPhone = () => {
    // 模拟微信授权回传
    const mockPhone = '1' + Math.floor(3000000000 + Math.random() * 700000000);
    const updatedUser: UserInfo = {
      ...currentUser,
      phoneNumber: mockPhone,
      updatedAt: new Date().toISOString()
    };
    onUpdateCurrentUser(updatedUser);
    wxShowToast('手机绑定成功！');
  };

  // 提交认证
  const handleAuditSubmit = () => {
    if (!registerName.trim()) {
      alert('请填写真实姓名以便教务处数据库比对');
      return;
    }
    const auditId = 'audit_' + Date.now();
    const newAudit: AlumniAudit = {
      _id: auditId,
      openid: currentUser._id,
      realName: registerName,
      phoneNumber: currentUser.phoneNumber || '13900001234',
      入学年份: Number(registerYear),
      毕业年份: Number(registerYear) + 4,
      学院: registerCollege,
      专业: registerMajor,
      studentCardPicUrl: registerUpload || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80',
      extraInfo: registerExtra,
      status: AuditStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmitAudit(newAudit);
    wxShowToast('申请资料已提交云服务器！');
    setActiveScreen('profile');
  };

  // 简易通知
  const wxShowToast = (text: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white rounded-lg px-4 py-2.5 text-xs z-50 animate-fade-in font-sans pointer-events-none text-center max-w-[200px]';
    toast.innerHTML = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2200);
  };

  // 活动报名
  const handleRegisterEvent = (eventItem: AlumniEvent) => {
    // 角色核验
    if (currentUser.role === UserRole.VISITOR) {
      wxShowToast('🔒 权限拦截：该活动仅对已认证校友公开，请先提交校友认证审核。');
      return;
    }

    // 查验是否重复报名
    const alreadyJoined = eventRegistrations.some(
      r => r.eventId === eventItem._id && r.openid === currentUser._id
    );

    if (alreadyJoined) {
      wxShowToast('您已提交过本场活动报名登记，无需重复操作。');
      return;
    }

    const regId = 'reg_' + Date.now();
    const newReg: EventRegistration = {
      _id: regId,
      eventId: eventItem._id,
      openid: currentUser._id,
      realName: currentUser.realName || currentUser.nickName,
      phoneNumber: currentUser.phoneNumber || '13800001111',
      company: currentUser.company || '未知就职企业',
      remark: '无',
      status: eventItem.needAudit ? AuditStatus.PENDING : AuditStatus.APPROVED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onJoinEvent(newReg);
    if (eventItem.needAudit) {
      wxShowToast('报名已递交！该活动需要管理员审核，请查收通知。');
    } else {
      wxShowToast('🎉 报名成功！名额已锁定。');
    }
  };

  // 触发微信支付弹窗
  const triggerDonationCheckout = () => {
    if (!currentUser.phoneNumber) {
      wxShowToast('请先在个人中心绑定手机号，方可完成会费交纳！');
      setActiveScreen('profile');
      return;
    }
    setShowPayModal(true);
  };

  // 确认模拟微信支付
  const executeMockPayment = () => {
    setShowPayModal(false);
    const orderId = 'DON_XY' + Date.now().toString().slice(-8);
    const record: DonationRecord = {
      _id: orderId,
      openid: currentUser._id,
      donorName: donorName || currentUser.nickName,
      入学年份: currentUser.入学年份 || 2012,
      type: donationProject as 'MEMBERSHIP_FEE' | 'DONATION',
      amount: Number(donationAmount) || 200,
      projectTitle: donationProject === 'MEMBERSHIP_FEE' ? '2026年年度会费' : (donationProject === 'SCHOLARSHIP' ? '励志助学金基金' : '校友之家筹建项目'),
      payStatus: 'SUCCESS',
      payTime: new Date().toISOString(),
      certificateNo: 'XYCERT2026' + Math.floor(100000 + Math.random() * 900000),
      blessingMessage: donationBlessing,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onDonate(record);
    setRecentGeneratedCert(record);
    wxShowToast('💳 微信支付 RMB ' + record.amount + ' 元成功！');
  };

  // 内推职位发布
  const handleAddNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobCompany.trim() || !jobEmail.trim()) {
      alert('请完整填写关键信息');
      return;
    }

    const newJob: JobItem = {
      _id: 'job_' + Date.now(),
      enterpriseName: jobCompany,
      title: jobTitle,
      salary: jobSalary,
      location: jobLocation,
      experience: '1-3年',
      education: '本科',
      description: jobDesc || '岗位职责详见邮件咨询，欢迎广大校友及师弟师妹们投递绿色内推通道！',
      contactEmail: jobEmail,
      publisherOpenid: currentUser._id,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateJob(newJob);
    setShowAddJob(false);
    setJobTitle('');
    setJobDesc('');
    wxShowToast('💼 绿能内推岗位发布成功，即时对全局公开！');
  };

  const userPendingAudit = auditList.find(a => a.openid === currentUser._id && a.status === AuditStatus.PENDING);
  const userRejectedAudit = auditList.find(a => a.openid === currentUser._id && a.status === AuditStatus.REJECTED);

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">
      {/* 手机容器外观 */}
      <div className="w-[370px] h-[780px] bg-slate-900 rounded-[40px] p-3 shadow-xl relative border-[4px] border-slate-800 shrink-0 mx-auto select-none">
        
        {/* 手机顶部刘海 & 扬声器 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-5 bg-slate-900 rounded-b-xl z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-1"></div>
        </div>

        {/* 模拟器内容区 */}
        <div className="w-full h-full bg-[#f6f8fb] rounded-[30px] overflow-hidden flex flex-col relative text-slate-800 font-sans">
          
          {/* 小程序头部状态栏 */}
          <div className="bg-qzhong-navy text-white pt-6 pb-3 px-4 relative z-20 shrink-0">
            <div className="flex justify-between items-center text-xs opacity-75 mb-3 px-1">
              <span>广东移动 5G</span>
              <span>15:40</span>
              <div className="flex items-center gap-1">
                <span>100%</span>
                <div className="w-5 h-2.5 bg-white rounded-xs relative">
                  <div className="absolute left-0 top-0 h-full bg-emerald-400 rounded-xs" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-white text-qzhong-navy rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm font-sans border border-qzhong-gold">
                  侨
                </div>
                <span className="font-bold text-[13px] font-sans tracking-wide">三水华侨中学校友会</span>
              </div>
              <div className="w-14 h-6 bg-black/20 rounded-full flex items-center justify-around px-1 text-[10px] border border-white/20 select-none cursor-pointer">
                <span className="w-2 h-2 bg-[#02cc60] rounded-full animate-ping"></span>
                <span>•••</span>
              </div>
            </div>
          </div>

          {/* 各模拟视图切换器 */}
          <div id="simulator-screen-scrollbox" className="flex-1 overflow-y-auto overflow-x-hidden relative text-xs">
            
            {/* SCREEN 1: HOME */}
            {activeScreen === 'home' && (
              <div className="flex flex-col gap-3.5 pb-6">
                
                {/* 佛山市三水区华侨中学 - 专属校徽视觉身份牌 */}
                <div className="mx-3 mt-3 bg-qzhong-navy text-white rounded-xl p-3.5 border border-qzhong-gold/30 shadow-md relative overflow-hidden shrink-0">
                  {/* 背景装饰光效与几何线条 */}
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none"></div>
                  <div className="absolute right-6 top-2 text-[60px] font-bold text-white/[0.04] select-none pointer-events-none font-serif">
                    1985
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* 矢量绘制精美学校徽章 (Concentric, Sailboat/Waves, Stars, Founded year) */}
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md border-2 border-qzhong-gold relative">
                      <svg viewBox="0 0 100 100" className="w-10 h-10 text-qzhong-navy">
                        {/* 外环 */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                        {/* 三条水波纹 (Sanshui - Three Rivers) */}
                        <path d="M 25 65 Q 37.5 60 50 65 T 75 65" fill="none" stroke="#6ca6cd" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 21 72 Q 35.5 68 50 72 T 79 72" fill="none" stroke="#6ca6cd" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                        {/* 象征海外华侨的风帆 (Overseas Sailboat) */}
                        <path d="M 50 18 L 50 60" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 50 20 Q 30 35 50 50 Z" fill="currentColor" opacity="0.9" />
                        <path d="M 52 23 Q 68 38 52 48 Z" fill="#d4af37" opacity="0.8" />
                        {/* 创立年份 */}
                        <text x="50" y="86" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">1985</text>
                      </svg>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-xs tracking-wide">佛山市三水区华侨中学</h3>
                        <span className="text-[7px] bg-qzhong-gold text-qzhong-navy px-1 py-0.2 rounded font-semibold font-serif font-sans leading-none">SINCE 1985</span>
                      </div>
                      <p className="text-[8.5px] opacity-75 uppercase tracking-wider font-mono">Sanshui Overseas Chinese High School</p>
                      <p className="text-[8px] text-qzhong-gold font-sans font-medium mt-0.5 mt-qzhong-gold">
                        “自强不息，忧国忧民，侨心两耀，同德同心”
                      </p>
                    </div>
                  </div>
                </div>

                {/* 轮播图幻灯片 (更名为大写并配高雅设计) */}
                <div className="relative w-full h-[155px] bg-slate-800 text-white overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-qzhong-navy/95 via-qzhong-navy/40 to-black/20 z-10 flex flex-col justify-end p-3">
                    <span className="text-[8px] text-qzhong-navy bg-qzhong-gold px-1.5 py-0.5 rounded-sm w-fit mb-1 font-semibold tracking-wider">侨中推介</span>
                    <h4 className="font-bold text-xs tracking-tight line-clamp-1">
                      {bannerImages[currentBanner]?.title || "佛山市三水华侨中学校友联谊会论坛"}
                    </h4>
                    <p className="text-[9px] opacity-80 mt-0.5 font-sans">
                      {bannerImages[currentBanner]?.desc || "聚沙成塔，心系母校建设"}
                    </p>
                  </div>
                  <div className="absolute right-3 bottom-3 z-10 flex gap-1">
                    {bannerImages.map((_, i) => (
                      <button 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-350 ${currentBanner === i ? 'bg-qzhong-gold w-3' : 'bg-white/40'}`}
                        onClick={() => setCurrentBanner(i)}
                      ></button>
                    ))}
                  </div>
                  {/* 美轮美奂的母校写意插图背景 */}
                  <div className="w-full h-full bg-gradient-to-br from-qzhong-navy to-slate-950 flex items-center justify-center font-display text-4xl font-extrabold opacity-30 select-none text-qzhong-gold/20 tracking-widest leading-none font-serif">
                    QIAO ZHONG
                  </div>
                </div>

                {/* 九宫格快速导航 */}
                <div className="bg-white mx-3 p-3 rounded-xl border border-slate-100 grid grid-cols-4 gap-y-3.5 text-center shrink-0">
                  <button onClick={() => setActiveScreen('alumni')} className="flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 bg-qzhong-ice text-qzhong-navy rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">校友名录</span>
                  </button>
                  <button onClick={() => {
                    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) {
                      setActiveScreen('admin-verify');
                    } else {
                      wxShowToast('理事实名审批专页仅对管理员账户公开。');
                    }
                  }} className="flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">理事审批</span>
                  </button>
                  <button onClick={() => { setActiveScreen('donation'); setDonationProject('MEMBERSHIP_FEE'); }} className="flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                      <Coins className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">会费交纳</span>
                  </button>
                  <button onClick={() => { setActiveScreen('donation'); setDonationProject('DONATION'); }} className="flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 bg-qzhong-ice text-qzhong-sky rounded-full flex items-center justify-center transition-transform group-hover:scale-105 border border-qzhong-sky/10">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">专项助学</span>
                  </button>
                </div>

                {/* 平台数据成就展示 (换装学校高档科技蓝金主调) */}
                <div className="bg-gradient-to-r from-qzhong-navy to-[#1a4478] text-white rounded-xl mx-3 p-3 flex flex-col gap-2 shadow-sm shrink-0 font-sans border-t border-qzhong-gold/10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[10px] tracking-wide text-qzhong-gold">三水华侨校友会 • 数据看板</span>
                    <span className="text-[8px] bg-qzhong-gold/20 text-qzhong-gold border border-qzhong-gold/30 px-1.5 py-0.2 rounded-sm font-mono uppercase">Sync</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center mt-1">
                    <div className="bg-white/5 p-1.5 rounded border border-white/5">
                      <div className="text-[9px] opacity-75">正式校友会籍</div>
                      <div className="text-xs font-bold font-mono text-qzhong-gold">{usersList.filter(u => u.isCertified).length} 人</div>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded border border-white/5">
                      <div className="text-[9px] opacity-75">校友入驻企业</div>
                      <div className="text-xs font-bold font-mono text-qzhong-gold">{enterprisesList.length} 家</div>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded border border-white/5">
                      <div className="text-[9px] opacity-75">专享内推岗位</div>
                      <div className="text-xs font-bold font-mono text-qzhong-gold">{jobsList.length} 席</div>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded border border-white/5">
                      <div className="text-[9px] opacity-75">累积助学基金</div>
                      <div className="text-xs font-bold font-mono text-qzhong-gold">
                        ¥{donationsList.reduce((acc, d) => acc + d.amount, 0)} 元
                      </div>
                    </div>
                  </div>
                </div>

                {/* 今日名校要闻资讯 */}
                <div className="bg-white mx-3 p-3.5 rounded-xl border border-slate-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-850 text-[11px] flex items-center gap-1">
                      <span className="w-1 h-3 bg-qzhong-navy rounded-full inline-block"></span>
                      侨中校音 • 新闻动态
                    </span>
                    <span className="text-[9px] text-slate-400">全部</span>
                  </div>

                  <div className="flex flex-col gap-3 font-sans">
                    <div className="flex gap-2.5 items-start">
                      <div className="w-14 h-14 bg-qzhong-ice rounded-lg shrink-0 flex flex-col items-center justify-center font-mono text-[10px] text-qzhong-navy font-extrabold select-none p-1 border border-qzhong-sky/10">
                        <span className="text-[8px] tracking-tighter opacity-70 uppercase font-sans">NEWS</span>
                        <span>06/09</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <h4 className="font-bold text-slate-800 leading-snug">侨中有你：三水华侨中学41周年(筹)学术活动</h4>
                        <p className="text-[9px] text-slate-400 leading-normal">海内外校友理事长、名誉会长及各界名流齐聚，共同研讨科技创新时代育人新模式。</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start border-t border-slate-50 pt-2.5">
                      <div className="w-14 h-14 bg-qzhong-ice rounded-lg shrink-0 flex flex-col items-center justify-center font-mono text-[10px] text-qzhong-navy font-extrabold select-none p-1 opacity-80 border border-qzhong-sky/10">
                        <span className="text-[8px] tracking-tighter opacity-70 uppercase font-sans">ALUM</span>
                        <span>06/01</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <h4 className="font-bold text-slate-800 leading-snug">汇聚佛山：青年侨中校友湾区圆桌茶话沙龙举办</h4>
                        <p className="text-[9px] text-slate-400 leading-normal">校友分会牵头，数十位资深校友分享制造业升级和智能化大潮中的就业与创业心得。</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 2: ALUMNI DIRECTORY */}
            {activeScreen === 'alumni' && (
              <div className="p-3 flex flex-col gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-1.5 shadow-2xs">
                  <span className="text-slate-400">🔎</span>
                  <input 
                    type="text" 
                    placeholder="输入姓名、行业或就读专业关键字" 
                    className="w-full text-xs font-medium text-slate-700 bg-transparent border-none placeholder-slate-400 focus:outline-none"
                    disabled
                  />
                </div>

                <div className="flex gap-2">
                  <span className="bg-qzhong-navy text-white px-2 py-0.5 rounded text-[9px] font-semibold">全部届别</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px]">高三 (3) 班</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px]">大湾区创业大咖</span>
                </div>

                {/* 权限拦截检验 */}
                {currentUser.role === UserRole.VISITOR ? (
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs text-center flex flex-col items-center gap-3 my-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-800">隐私保护与信息访问受限</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed px-2">
                      根据《华侨中校园内校友会网络信息安全保护要求》，<strong>校友名录、高中班级及联系通路检索仅限定对【已认证的实名校友】开放访问</strong>。普通访客和游客账户无权查阅任何人的私人学籍。
                    </p>
                    <button 
                      onClick={handleStartRegister} 
                      className="bg-qzhong-navy hover:bg-qzhong-navy/90 text-white text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      申请实名校友认证
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {usersList.filter(u => u.isCertified).map(alumni => (
                      <div key={alumni._id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-3xs flex gap-3">
                        <img 
                          className="w-10 h-10 rounded-full border border-slate-100 shrink-0 object-cover" 
                          src={alumni.avatarUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{alumni.realName}</span>
                            <span className="text-[8px] bg-qzhong-ice text-qzhong-navy border border-qzhong-sky/20 px-1 py-0.2 rounded font-sans scale-90 origin-left font-semibold">
                              {alumni.入学年份 || '25'}届高中
                            </span>
                            {alumni.role === UserRole.ADMIN && (
                              <span className="text-[8px] bg-amber-50 text-amber-850 border border-amber-250 px-1 py-0.2 rounded scale-90 font-medium">
                                理事
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {alumni.学院 && (alumni.学院.includes('高') || alumni.学院.includes('班')) ? `${alumni.学院} • 班主任: ${alumni.专业 || '已审核'}` : `${alumni.学院 || '人文社会科学部'} • ${alumni.专业 || '毕业大咖'}`}
                          </div>
                          <div className="text-[9px] text-slate-600 font-medium mt-1">
                            {alumni.company ? `${alumni.company} | ${alumni.position}` : '暂未公开就职方向'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 3: EVENTS */}
            {activeScreen === 'event' && (
              <div className="p-3 flex flex-col gap-3 pb-6">
                <div className="font-bold text-slate-800 text-[11px] mb-1">
                  校友圈线下联谊沙龙活动
                </div>

                <div className="flex flex-col gap-4">
                  {eventsList.map(eventItem => (
                    <div key={eventItem._id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                      {/* 活动主图 */}
                      <div className="h-28 bg-slate-800 shrink-0 relative">
                        <div className="absolute top-2 right-2 bg-black/60 text-white rounded px-2 py-0.5 text-[8px] font-sans">
                          {eventItem.status === 'PUBLISHED' ? '报名登记中' : '活动已结束'}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2.5">
                          <h4 className="font-bold text-white text-xs leading-snug">{eventItem.title}</h4>
                        </div>
                      </div>

                      <div className="p-3 flex flex-col gap-1.5 font-sans">
                        <div className="text-[10px] text-slate-500">
                          🗓️ 时间: {eventItem.startTime}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          📍 地点: {eventItem.location}
                        </div>
                        <div className="text-[10px] text-slate-500 flex justify-between items-center bg-slate-50 p-1.5 rounded">
                          <span>
                            名额: <strong className="text-qzhong-navy">{eventItem.joinedCount}</strong> / {eventItem.limitCount} {eventItem.needAudit ? '(人工审核制)' : ''}
                          </span>
                          <span className="font-semibold text-qzhong-navy">
                            费用: {eventItem.fee === 0 ? '免费' : `¥${eventItem.fee}元`}
                          </span>
                        </div>

                        {/* 报名交互 */}
                        <div className="mt-2 text-right">
                          {eventRegistrations.some(r => r.eventId === eventItem._id && r.openid === currentUser._id) ? (
                            <button 
                              disabled 
                              className="w-full bg-slate-100 text-slate-500 text-xs py-1.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              已申请报名登记
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRegisterEvent(eventItem)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg font-medium cursor-pointer transition-colors"
                            >
                              一键极速抢报
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 4: ENTERPRISE & JOBS */}
            {activeScreen === 'enterprise' && (
              <div className="p-3 flex flex-col gap-3 pb-8">
                
                {/* 选项卡头部 */}
                <div className="bg-white p-1 rounded-lg border border-slate-200 flex text-center">
                  <span className="flex-1 text-slate-800 py-1 font-bold border-r border-slate-100 bg-slate-50 rounded">
                    💼 在招职位内推
                  </span>
                </div>

                {/* 是否显示发布表单开关 */}
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">共有 {jobsList.length} 个在招优秀岗位</span>
                  {currentUser.role !== UserRole.VISITOR && (
                    <button 
                      onClick={() => setShowAddJob(!showAddJob)}
                      className="text-qzhong-navy font-bold flex items-center gap-0.5 pointer-events-auto cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      {showAddJob ? '收起表单' : '发布全新内推'}
                    </button>
                  )}
                </div>

                {/* 发布招聘弹出单 */}
                {showAddJob && (
                  <form onSubmit={handleAddNewJob} className="bg-white p-3 rounded-lg border-2 border-blue-100 flex flex-col gap-2 font-sans">
                    <div className="font-bold text-slate-800">发布校友内推岗位 (直连同门)</div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-0.5">内推岗位名称 *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="如: Java架构师 / 资深媒介" 
                        value={jobTitle} 
                        onChange={e => setJobTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-0.5">招聘企业官方名 *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="如: 北京XX科技有限公司" 
                        value={jobCompany} 
                        onChange={e => setJobCompany(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">薪资待遇</label>
                        <input 
                          type="text" 
                          placeholder="如: 15K-20K·15薪" 
                          value={jobSalary} 
                          onChange={e => setJobSalary(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">工作城市</label>
                        <input 
                          type="text" 
                          placeholder="如: 杭州/远程" 
                          value={jobLocation} 
                          onChange={e => setJobLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-0.5">简历接收邮箱 *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="hr_alumni@company.com" 
                        value={jobEmail} 
                        onChange={e => setJobEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-0.5">岗位职责要求简述</label>
                      <textarea 
                        placeholder="简单填写，吸引学弟学妹们主动勾兑内推..." 
                        value={jobDesc} 
                        onChange={e => setJobDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none h-12"
                      />
                    </div>
                    <button type="submit" className="bg-qzhong-navy hover:bg-qzhong-navy/90 text-white py-1 rounded text-xs font-medium cursor-pointer transition-colors">
                      确认发布线上内推
                    </button>
                  </form>
                )}

                {/* 招聘列表显示 */}
                <div className="flex flex-col gap-2.5">
                  {jobsList.map(job => (
                    <div key={job._id} className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-3xs flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">{job.title}</span>
                        <span className="text-qzhong-navy font-semibold font-mono">{job.salary}</span>
                      </div>
                      <div className="flex justify-between items-center font-sans text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 inline text-slate-400" />
                          {job.enterpriseName}
                        </span>
                        <span>{job.location}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 border-t border-slate-50 pt-1.5 leading-relaxed font-sans">
                        {job.description}
                      </p>
                      <div className="bg-slate-50 p-1.5 rounded flex justify-between items-center text-[9px] text-slate-500 font-sans mt-0.5">
                        <span>投递邮箱: <strong className="text-slate-700">{job.contactEmail}</strong></span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-sans uppercase">
                          同门专属内推
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SCREEN 5: DONATIONS */}
            {activeScreen === 'donation' && (
              <div className="p-3 flex flex-col gap-3.5 pb-8 font-sans">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-3.5 rounded-xl shadow-sm">
                  <h4 className="font-bold text-xs">大德捐助 • 爱洒校友会</h4>
                  <p className="text-[9px] opacity-85 mt-1 leading-normal">
                    会费、及项目捐赠一律进入校友会联谊会统一开立的公益基金合规对公账户。我们向所有捐款 of the alumni lifelong certificate.
                  </p>
                </div>

                {/* 表单填写区 */}
                <div className="bg-white p-3 border border-slate-100 rounded-lg flex flex-col gap-2.5">
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">捐赠项目类型</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => { setDonationProject('MEMBERSHIP_FEE'); setDonationAmount('200'); }}
                        className={`py-1.5 rounded text-xs border font-medium transition-colors ${
                          donationProject === 'MEMBERSHIP_FEE' ? 'border-qzhong-navy bg-qzhong-ice text-qzhong-navy font-semibold' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        交纳年度会费 (200元)
                      </button>
                      <button 
                        onClick={() => { setDonationProject('DONATION'); setDonationAmount('500'); }}
                        className={`py-1.5 rounded text-xs border font-medium transition-colors ${
                          donationProject === 'DONATION' ? 'border-qzhong-navy bg-qzhong-ice text-qzhong-navy font-semibold' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        任意项目爱心自由捐
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">捐款金额 (元) *</label>
                    <input 
                      type="number" 
                      value={donationAmount}
                      onChange={e => setDonationAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-900 font-semibold font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">爱心捐款姓名 (默认实名)</label>
                    <input 
                      type="text" 
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      placeholder="不填将默认使用微信昵称"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">给母校或师弟师妹们寄语</label>
                    <textarea 
                      value={donationBlessing}
                      onChange={e => setDonationBlessing(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none h-12"
                    />
                  </div>

                  <button 
                    onClick={triggerDonationCheckout}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-xs cursor-pointer transition-colors"
                  >
                    💳 唤起微信支付 ¥{donationAmount} 元
                  </button>
                </div>

                {/* 是否有刚刚生成的证书 */}
                {recentGeneratedCert && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-center flex flex-col items-center gap-2 animate-fade-in font-serif">
                    <span className="text-xl">🏆</span>
                    <div className="font-bold text-slate-800 font-serif text-[11px]">电子爱心通稿感谢信 & 捐赠证书</div>
                    <div className="text-[9px] text-slate-500 font-sans border-y border-amber-200/50 py-1 w-full flex justify-between">
                      <span>编号: {recentGeneratedCert.certificateNo}</span>
                      <span>金额: ¥{recentGeneratedCert.amount}元</span>
                    </div>
                    <p className="text-[9px] text-slate-600 text-italic leading-relaxed my-1">
                      "【{recentGeneratedCert.donorName}】校友（在校期间登记所属 {recentGeneratedCert.入学年份} 届），您于校友网络平台慷慨赞助的 {recentGeneratedCert.projectTitle} 款项已确认入库对公专属财政。感谢您的支持，母校特颁此证！"
                    </p>
                    <button 
                      onClick={() => setRecentGeneratedCert(null)}
                      className="text-[9px] text-blue-600 underline font-sans"
                    >
                      我已收回，点我关闭
                    </button>
                  </div>
                )}

                {/* 爱心英雄光荣榜 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[10px] flex items-center gap-1.5">
                    🏅 校友会爱心捐款风云榜 (实时名录)
                  </span>
                  <div className="flex flex-col divide-y divide-slate-100 text-[10px] text-slate-600">
                    {donationsList.slice(-4).reverse().map((d, i) => (
                      <div key={d._id} className="py-2.5 flex justify-between items-center">
                        <div className="flex flex-col gap-0.5">
                          <div>
                            <span className="font-bold text-slate-800">{d.donorName}</span>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded ml-1 scale-90 inline-block font-sans">
                              {d.入学年份}届
                            </span>
                          </div>
                          <span className="text-[8px] text-slate-400 font-serif">" {d.blessingMessage} "</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-700 shrink-0">
                          +¥{d.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 6: CORE PROFILE */}
            {activeScreen === 'profile' && (
              <div className="flex flex-col gap-3 pb-6 font-sans">
                
                {/* 个人主卡片 */}
                <div className="bg-slate-900 text-white p-4 pb-6 flex items-center gap-3 relative shrink-0">
                  <img 
                    className="w-12 h-12 rounded-full border border-white/20 object-cover" 
                    src={currentUser.avatarUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm tracking-tight">{currentUser.realName || currentUser.nickName}</span>
                      
                      {/* 身份特权徽章 */}
                      <span className={`text-[8px] px-1 rounded scale-90 ${
                        currentUser.role === UserRole.VISITOR ? 'bg-white/20 text-white' : 'bg-blue-600 text-white font-medium'
                      }`}>
                        {currentUser.role === UserRole.VISITOR ? '访客' : (currentUser.role === UserRole.ADMIN ? '理事' : '已核校友')}
                      </span>
                    </div>
                    <p className="text-[9px] opacity-75 mt-0.5">
                      同城代码: {currentUser._id.slice(-6).toUpperCase()} • {currentUser.phoneNumber || '未绑定手机号'}
                    </p>
                  </div>
                  
                  {/* 快捷切换角色，便于调试体验 */}
                  <div className="absolute right-4 bottom-4 text-[8px] bg-white text-blue-600 px-2 py-0.5 rounded-sm font-sans leading-none cursor-pointer shadow-xs font-semibold">
                    微信已绑定
                  </div>
                </div>

                {/* 微信快速手机绑定提示器 */}
                {!currentUser.phoneNumber && (
                  <div className="bg-amber-50 border border-amber-100 p-3.5 mx-3 rounded-lg flex justify-between items-center text-[10px] mt-1 shrink-0 animate-pulse">
                    <div className="flex flex-col gap-0.5 text-yellow-900 pr-1">
                      <span className="font-bold">🚨 微信极速手机账号绑定拦截</span>
                      <span>需要绑定手机号才可提交认证或缴纳会费。</span>
                    </div>
                    <button 
                      onClick={handleQuickBindPhone}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[9px] px-2 py-1 rounded shrink-0 transition-colors cursor-pointer"
                    >
                      一键快速绑定
                    </button>
                  </div>
                )}

                {/* 校友验证模块状态控制面板 */}
                <div className="bg-white p-3.5 mx-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-xs">
                  <span className="font-bold text-slate-800 text-[10px]">
                    🎓 地方校友身份认证档案
                  </span>

                  {currentUser.role === UserRole.VISITOR ? (
                    userPendingAudit ? (
                      <div className="bg-amber-50 border border-amber-100 text-amber-800 p-2.5 rounded text-[10px] leading-relaxed">
                        <div className="font-bold text-yellow-950 mb-0.5">⏳ 实名认证审核中</div>
                        您的资质正在排队（在Web后台中可以即时审批！）
                      </div>
                    ) : userRejectedAudit ? (
                      <div className="bg-red-50 border border-red-100 text-red-800 p-2.5 rounded text-[10px] leading-relaxed">
                        <div className="font-bold text-red-950 mb-0.5">❌ 审核被驳回拒绝</div>
                        理由: {userRejectedAudit.auditReply || '请联系本地校友办'}
                        <button 
                          onClick={handleStartRegister}
                          className="mt-2 block bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[9px] font-semibold transition-colors cursor-pointer"
                        >
                          重新填报新证明
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] text-slate-500 leading-normal">
                          入会认证后方可解锁校友通讯名录、招聘绿色内推、线下学术交流沙龙席位等核心板块。
                        </p>
                        <button 
                          onClick={handleStartRegister}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          开始提交实名证书认证申请
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded text-[10px] leading-relaxed">
                      <div className="font-bold text-emerald-950 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        恭喜，您已成功过审实名校友！
                      </div>
                      <div className="mt-1 flex flex-col gap-0.5 text-[9px]">
                        <span>• 分类: {currentUser.学院} - {currentUser.专业} (学历认可)</span>
                        <span>• 就读年份: {currentUser.入学年份} 届</span>
                        <span>• 专属等级: {currentUser.role === UserRole.ADMIN ? '二级副会长-理事' : '正式注册校友会友'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 菜单项 */}
                <div className="bg-white mx-3 rounded-xl border border-slate-100 overflow-hidden text-[11px] text-slate-700 font-sans shadow-3xs flex flex-col">
                  {/* 如果是管理员，渲染秘密管理通道 */}
                  {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                    <button 
                      onClick={() => setActiveScreen('admin-verify')}
                      className="flex justify-between items-center p-3 border-b border-blue-50 text-blue-700 font-semibold bg-blue-50/20 hover:bg-blue-50/30 text-left transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        理亊移动端快速审批抽屉
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button 
                    onClick={() => { setActiveScreen('event'); }}
                    className="flex justify-between items-center p-3 border-b border-slate-100 text-left hover:bg-slate-50"
                  >
                    <span>我报名的校友活动 ({eventRegistrations.filter(r => r.openid === currentUser._id).length})</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => { setActiveScreen('donation'); }}
                    className="flex justify-between items-center p-3 border-b border-slate-100 text-left hover:bg-slate-50"
                  >
                    <span>我的会费及捐助凭据 (¥{donationsList.filter(d => d.openid === currentUser._id).reduce((acc, current) => acc + current.amount, 0)})</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  
                  <button 
                    onClick={() => { alert('第一版暂不开放开票功能/积分卡。'); }}
                    className="flex justify-between items-center p-3 text-left hover:bg-slate-50"
                  >
                    <span>校友专属电子会卡 / 联谊积分</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-50" />
                  </button>
                </div>

              </div>
            )}

            {/* SCREEN 7: CLIENT MULTI-STEP REGISTER FORM */}
            {activeScreen === 'register' && (
              <div className="p-3.5 flex flex-col gap-3 pb-8">
                <div className="flex items-center gap-1 bg-white p-2 border border-slate-100 rounded-lg shrink-0">
                  <button onClick={() => setActiveScreen('profile')} className="text-blue-600 font-semibold cursor-pointer">← 返回</button>
                  <span className="font-bold text-slate-800 text-[10px] ml-1">实名入会及校友双核认证</span>
                </div>

                {/* 表单渲染 */}
                <div className="bg-white p-3.5 border border-slate-100 rounded-xl flex flex-col gap-3 font-sans text-slate-700">
                  
                  {/* Step 1: Bind Phone */}
                  {!currentUser.phoneNumber ? (
                    <div className="text-center py-4 flex flex-col items-center gap-3">
                      <Lock className="w-8 h-8 text-blue-600 bg-blue-50/50 p-1.5 rounded-full" />
                      <div className="font-bold text-slate-800">微信快捷解密绑定手机号</div>
                      <p className="text-[10px] text-slate-400 leading-normal px-2">
                        为了保障地方商会、学术研讨会信息的百分之百真实性，防范撞库，必须绑定中国大陆实名制手机。
                      </p>
                      <button 
                        onClick={handleQuickBindPhone}
                        className="bg-emerald-600 text-white py-1.5 px-4 rounded text-xs font-semibold"
                      >
                        一键绑定微信手机
                      </button>
                    </div>
                  ) : (
                    // Step 2: Input Details
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">真实姓名 *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="请输入学籍证明一致的本人姓名" 
                          value={registerName}
                          onChange={e => setRegisterName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">毕业年份 (高中届别) *</label>
                          <select 
                            value={registerYear}
                            onChange={e => setRegisterYear(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="2020">2020 届</option>
                            <option value="2016">2016 届</option>
                            <option value="2012">2012 届</option>
                            <option value="2008">2008 届</option>
                            <option value="2000">2000 届</option>
                            <option value="1995">1995 届</option>
                            <option value="1985">1985 届</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">当前工作区域</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none">
                            <option>广东省内 (大湾区)</option>
                            <option>海外/中国港澳台</option>
                            <option>省外其他城市</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">高中就读班级 *</label>
                        <input 
                          type="text" 
                          placeholder="例如：高三 (3) 班" 
                          value={registerCollege}
                          onChange={e => setRegisterCollege(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">高三班主任/科任证明老师 *</label>
                        <input 
                          type="text" 
                          placeholder="请输入高三班主任或有关见证人老师姓名" 
                          value={registerMajor}
                          onChange={e => setRegisterMajor(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-1">资质照片（毕业证、毕业照、纪念册或教师聘书等）</label>
                        {registerUpload ? (
                          <div className="relative border border-dashed border-slate-200 p-1 rounded">
                            <img className="h-20 w-full object-cover rounded" src={registerUpload} alt="" />
                            <button 
                              onClick={() => setRegisterUpload('')}
                              className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            <button 
                              onClick={() => setRegisterUpload('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80')}
                              className="bg-slate-50 border border-dashed border-slate-220 rounded p-2 text-[9px] text-slate-600 flex flex-col items-center justify-center text-center hover:bg-slate-100"
                            >
                              📁 模拟学信网
                            </button>
                            <button 
                              onClick={() => setRegisterUpload('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&q=80')}
                              className="bg-slate-50 border border-dashed border-slate-220 rounded p-2 text-[9px] text-slate-600 flex flex-col items-center justify-center text-center hover:bg-slate-100"
                            >
                              🎓 模拟毕业证
                            </button>
                            <button 
                              onClick={() => setRegisterUpload('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&q=80')}
                              className="bg-slate-50 border border-dashed border-slate-220 rounded p-2 text-[9px] text-slate-600 flex flex-col items-center justify-center text-center hover:bg-slate-100"
                            >
                              🤝 模拟毕业合影
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">加急核对批注线索 (选填)</label>
                        <textarea 
                          placeholder="可填辅导员姓名等，方便秘书处闪速过审" 
                          value={registerExtra}
                          onChange={e => setRegisterExtra(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none h-12"
                        />
                      </div>

                      <button 
                        onClick={handleAuditSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-xs mt-1 transition-colors cursor-pointer"
                      >
                        确认无误，提报微信云安全网关
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* SCREEN 8: MOBILE IN-APP AUDIT CONSOLE FOR DIRECTORS */}
            {activeScreen === 'admin-verify' && (
              <div className="p-3 flex flex-col gap-3 pb-8">
                <div className="flex items-center gap-1 bg-white p-2 border border-slate-100 rounded-lg shrink-0">
                  <button onClick={() => setActiveScreen('profile')} className="text-blue-600 font-semibold select-none cursor-pointer">← 我的</button>
                  <span className="font-bold text-slate-800 text-[10px] ml-1">理亊移动端秒级审批台</span>
                </div>

                <div className="bg-amber-50 text-amber-900 border border-amber-100 p-2.5 rounded-lg text-[9px] leading-relaxed font-sans">
                  <strong>ℹ️ 角色绑定：</strong>当前您正以“{currentUser.realName || currentUser.nickName}”的 <strong>【{currentUser.role === UserRole.SUPER_ADMIN ? '超级系统管理员' : '校友会二级理主管'}】</strong> 身份进行特权操作。
                </div>

                {/* 待审明细 */}
                <div className="flex flex-col gap-2.5">
                  <div className="font-bold text-slate-400 text-[9px] uppercase">
                    待决实名会员申请单 ({auditList.filter(a => a.status === AuditStatus.PENDING).length})
                  </div>

                  {auditList.filter(a => a.status === AuditStatus.PENDING).length === 0 ? (
                    <div className="bg-white p-6 border border-slate-100 text-center rounded-xl text-slate-400">
                      报告理事，目前没有积压待审的会友单
                    </div>
                  ) : (
                    auditList.filter(a => a.status === AuditStatus.PENDING).map(pending => (
                      <div key={pending._id} className="bg-white p-3 border-2 border-amber-200/50 rounded-xl flex flex-col gap-2 font-sans text-slate-700">
                        <div className="flex justify-between items-center bg-slate-50 p-1 text-[9px] font-mono">
                          <span>流水号: {pending._id}</span>
                          <span className="text-amber-800 bg-amber-50 px-1 py-0.2 rounded font-bold">待理</span>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-[10px]">
                          <div>• 申请人: <strong className="text-slate-900 text-xs">{pending.realName}</strong> </div>
                          <div>• 绑定电话: {pending.phoneNumber}</div>
                          <div>• 宣誓求学: {pending.入学年份}届 - {pending.学院} - {pending.专业}</div>
                          {pending.extraInfo && <div className="text-italic text-slate-500 bg-slate-50 p-1.5 rounded">" {pending.extraInfo} "</div>}
                          {pending.studentCardPicUrl && (
                            <div className="mt-1">
                              <span className="text-[8px] text-slate-400 block mb-0.5">求学凭据一览</span>
                              <img className="h-20 w-fit object-contain rounded" src={pending.studentCardPicUrl} alt="" />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                          <button 
                            onClick={() => {
                              const why = prompt('请输入驳回该校友申请的原因说明:', '您填报的学籍历史在教务处系统核实无此数据，请重新上传真实的学位证书照片。');
                              if (why !== null) {
                                onUpdateAuditStatus(pending._id, AuditStatus.REJECTED, why);
                                wxShowToast('驳回意见已下达');
                              }
                            }}
                            className="bg-slate-100 text-slate-600 font-bold py-1.5 rounded hover:bg-red-50 hover:text-red-800"
                          >
                            驳回拒绝
                          </button>
                          <button 
                            onClick={() => {
                              onUpdateAuditStatus(pending._id, AuditStatus.APPROVED);
                              wxShowToast('审核已通过！该校友已成功晋级。');
                            }}
                            className="bg-emerald-600 text-white font-bold py-1.5 rounded hover:bg-emerald-700"
                          >
                            确认过审通过
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

          {/* 小程序底部 TAB BAR */}
          <div className="h-14 bg-white border-t border-slate-200 shrink-0 flex items-center justify-around text-center select-none relative z-20">
            <button 
              onClick={() => setActiveScreen('home')} 
              className={`flex-1 flex flex-col items-center gap-0.5 transition-colors ${activeScreen === 'home' ? 'text-qzhong-navy font-semibold' : 'text-slate-500'}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">首页</span>
            </button>
            <button 
              onClick={() => setActiveScreen('alumni')} 
              className={`flex-1 flex flex-col items-center gap-0.5 transition-colors ${activeScreen === 'alumni' ? 'text-qzhong-navy font-semibold' : 'text-slate-500'}`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">校友录</span>
            </button>
            <button 
              onClick={() => setActiveScreen('event')} 
              className={`flex-1 flex flex-col items-center gap-0.5 relative transition-colors ${activeScreen === 'event' ? 'text-qzhong-navy font-semibold' : 'text-slate-500'}`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">活动</span>
            </button>
            <button 
              onClick={() => setActiveScreen('enterprise')} 
              className={`flex-1 flex flex-col items-center gap-0.5 transition-colors ${activeScreen === 'enterprise' ? 'text-qzhong-navy font-semibold' : 'text-slate-500'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">招聘内推</span>
            </button>
            <button 
              onClick={() => setActiveScreen('profile')} 
              className={`flex-1 flex flex-col items-center gap-0.5 relative transition-colors ${activeScreen === 'profile' ? 'text-qzhong-navy font-semibold' : 'text-slate-500'}`}
            >
              {auditList.some(a => a.status === AuditStatus.PENDING) && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                <span className="absolute top-1 right-5 w-2 h-2 bg-red-650 rounded-full animate-bounce"></span>
              )}
              <User className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">我的</span>
            </button>
          </div>

          {/* 模拟微信支付覆盖模态 */}
          {showPayModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none animate-fade-in font-sans">
              <div className="w-full bg-white rounded-t-2xl p-4 flex flex-col gap-3 font-sans max-h-[380px]">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800 text-xs">微信支付</span>
                  <button onClick={() => setShowPayModal(false)} className="text-slate-400 font-bold text-sm">×</button>
                </div>

                <div className="text-center py-2">
                  <div className="text-slate-400 text-[10px]">校友会收银台-项目支出</div>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">¥{donationAmount}.00</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    收款方：地方校友会联谊总公会专项金
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-[10px] text-slate-600 border-y border-slate-50 py-3 font-sans">
                  <div className="flex justify-between">
                    <span>支付项目</span>
                    <span className="text-slate-900 font-bold">
                      {donationProject === 'MEMBERSHIP_FEE' ? '【2026年年度会费缴纳】' : '【支持校友圈公益捐赠】'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>支付方式</span>
                    <span className="text-slate-900 font-medium">零钱通 (招商银行储蓄借记卡)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>捐赠登记人</span>
                    <span className="text-slate-900 font-medium">{donorName} ({currentUser.nickName || '绑定微信号'})</span>
                  </div>
                </div>

                <button 
                  onClick={executeMockPayment}
                  className="w-full bg-[#07c160] text-white py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide hover:bg-[#06ad56]"
                >
                  确认指纹/免密安全结算
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 说明书卡片 */}
      <div className="flex-1 bg-white border border-slate-100 shadow-sm p-5 rounded-xl flex flex-col gap-3 max-w-[400px] font-sans">
        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-50 pb-2">
          📱 微信小程序客户端模拟指南
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          此处模拟的是部署在校友手机里的微信客户端界面。您可以自由切换下方内置的<strong>测试账户角色级别</strong>，直接看到基于权限隔离的数据层变动。
        </p>
        
        {/* 指南步骤 */}
        <div className="flex flex-col gap-2.5 my-2">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1">
            <span className="font-semibold text-slate-850 text-[11px] flex items-center gap-1">
              🚀 交互联动大闭环测试说明：
            </span>
            <ol className="list-decimal pl-4 text-[10px] text-slate-600 space-y-1">
              <li>先将上方或下方的测试身份设定为<strong>「普通访客」</strong></li>
              <li>进入手机模拟器内的 <code>“我的”</code>，点击 <code>“开始实名校友认证”</code>，填写表单并点击提报。</li>
              <li>提报后，您会发现个人主页呈递为 <code>“⏳ 实名认证审核中”</code>。</li>
              <li>此时切换上面的 Tab 页到 <strong>「💻 WEB管理后台」</strong> （也可以在小程序里把角色切换为管理员，进入 <code>“理事移动端审批台”</code>），在该审核清单下立即会显示这一条申请文档！</li>
              <li>点击 <code>“审核通过”</code>。</li>
              <li>切回小程序，重新打开 <code>“我的”</code> 或 <code>“校友录”</code>，您会发现测试状态瞬间晋级为 <code>“已核实校友会正式会员”</code>，并且校友通讯录的名录完全向您大门敞开，解锁阅读特权！</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px] text-slate-400">
          <span>✔️ 支持微信一键手机号绑定解密逻辑模拟</span>
          <span>✔️ 支持交会费、微信支付流水台账双联生成证书</span>
          <span>✔️ 支持活动限额指标，防止多端突发性超报名上限</span>
        </div>
      </div>
    </div>
  );
}
