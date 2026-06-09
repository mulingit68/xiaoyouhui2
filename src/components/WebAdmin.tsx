/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  FileCheck2, 
  ShieldCheck, 
  Coins, 
  Calendar, 
  Briefcase, 
  Clock, 
  UserX,
  Search,
  Plus,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { UserInfo, AlumniAudit, AlumniEvent, EventRegistration, AlumniEnterprise, JobItem, DonationRecord, UserRole, AuditStatus } from '../types';

interface WebAdminProps {
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
  onCreateEvent: (event: AlumniEvent) => void;
}

export default function WebAdmin({
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
  onPromoteUser,
  onCreateEvent
}: WebAdminProps) {
  // 当前子版块: 'dashboard', 'audit', 'users', 'events', 'finance'
  const [subSection, setSubSection] = useState<'dashboard' | 'audit' | 'users' | 'events' | 'finance'>('dashboard');
  
  // 新活动表达
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtLocation, setNewEvtLocation] = useState('校友大厦 5F 创新孵化基地 - 线下多功能厅');
  const [newEvtDate, setNewEvtDate] = useState('2026-06-18 14:00 至 18:00');
  const [newEvtLimit, setNewEvtLimit] = useState('50');
  const [newEvtFee, setNewEvtFee] = useState('0');
  const [newEvtDesc, setNewEvtDesc] = useState('');
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  // 搜索关键字
  const [searchQuery, setSearchQuery] = useState('');

  // 处理活动发布
  const handlePublishEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvtTitle.trim()) {
      alert('请输入活动主题');
      return;
    }

    const newEventItem: AlumniEvent = {
      _id: 'evt_' + Date.now(),
      title: newEvtTitle,
      coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      description: newEvtDesc || '届时将有名誉理事发表主题演讲，诚邀各位具有相关行业背景的校友同袍们申请拨冗参会，开展跨界交流。',
      startTime: newEvtDate.split('至')[0]?.trim() || newEvtDate,
      endTime: newEvtDate.split('至')[1]?.trim() || '结束后回校',
      location: newEvtLocation,
      limitCount: Number(newEvtLimit) || 100,
      joinedCount: 0,
      needAudit: true, // 默认报名需要审核
      fee: Number(newEvtFee) || 0,
      status: 'PUBLISHED',
      publisher: currentUser.realName || '秘书处官方',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateEvent(newEventItem);
    setShowAddEventForm(false);
    setNewEvtTitle('');
    setNewEvtDesc('');
    alert('🎉 活动已成功发布并向小程序前端同步公映！');
  };

  // 统计数值
  const statsTotalUsers = usersList.length;
  const statsCertified = usersList.filter(u => u.isCertified).length;
  const statsPendingAudits = auditList.filter(a => a.status === AuditStatus.PENDING).length;
  const statsDonationsTotal = donationsList.reduce((acc, current) => acc + current.amount, 0);

  // 如果不具备管理权，阻挡并展示降权提示
  const hasAdminPermissions = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;

  if (!hasAdminPermissions) {
    return (
      <div id="no-admin-auth-panel" className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-sans">
          由于权限安全拦截 (Role Authorization Intercepted)
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          根据<b>管理员接口必须校验 role 的安全规范设计</b>，您当前绑定的临时游客微信账户无权查阅 Web 行政工作后台。
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg w-full text-xs text-slate-700 text-left">
          <strong>💡 如何解锁体验测试？</strong>
          <br/>
          请在上方顶部的<b>【快速角色/模式调试栏】</b>中，<strong>切换账户级别为「管理员 (ADMIN)」或「超级管理员 (SUPER_ADMIN)」</strong>，系统将瞬间放行并完成热重载。
        </div>
      </div>
    );
  }

  return (
    <div id="web-admin-parent" className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* 侧边大主板 */}
      <div className="xl:col-span-1 bg-slate-900 text-slate-300 p-4 rounded-xl flex flex-col gap-1 justify-between h-fit shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-4 px-2 pb-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
            <div>
              <div className="font-bold text-white text-xs text-bold tracking-wider font-sans leading-none">
                对公网关控制台
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                {currentUser.role === UserRole.SUPER_ADMIN ? '★ SUPER ADMIN MODE' : '☆ ADMINISTRATOR'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSubSection('dashboard')}
            className={`w-full text-left font-sans text-xs flex items-center gap-2 px-3 py-2.5 rounded-lg select-none transition-colors ${
              subSection === 'dashboard' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            数据概览与指标
          </button>

          <button
            onClick={() => setSubSection('audit')}
            className={`w-full text-left font-sans text-xs flex items-center gap-2 px-3 py-2.5 rounded-lg select-none transition-colors relative ${
              subSection === 'audit' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4 shrink-0" />
            实名入会审批
            {statsPendingAudits > 0 && (
              <span className="absolute right-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none animate-bounce">
                {statsPendingAudits}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubSection('users')}
            className={`w-full text-left font-sans text-xs flex items-center gap-2 px-3 py-2.5 rounded-lg select-none transition-colors ${
              subSection === 'users' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            会藉身份与授权管理
          </button>

          <button
            onClick={() => setSubSection('events')}
            className={`w-full text-left font-sans text-xs flex items-center gap-2 px-3 py-2.5 rounded-lg select-none transition-colors ${
              subSection === 'events' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            活动沙龙发布 center
          </button>

          <button
            onClick={() => setSubSection('finance')}
            className={`w-full text-left font-sans text-xs flex items-center gap-2 px-3 py-2.5 rounded-lg select-none transition-colors ${
              subSection === 'finance' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4 shrink-0" />
            财务审计及会费
          </button>
        </div>

        <div className="mt-8 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-sans leading-normal">
          <div>经办人: {currentUser.realName || currentUser.nickName}</div>
          <div className="mt-0.5 font-mono">NODE v20 • WECHAT SDK</div>
        </div>
      </div>

      {/* 右侧展示核心信息面板 */}
      <div className="xl:col-span-4 bg-white p-6 rounded-xl border border-slate-100 shadow-2xs flex flex-col gap-6">
        
        {/* TAB A: DASHBOARD STATUS */}
        {subSection === 'dashboard' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-sans flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                地方校友会建设指标中心 (Alumni Stats Engine)
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                统计数据实时取值于云开发的 7 大主物理集合。首期开发完成，系统运转稳定。
              </p>
            </div>

            {/* 数指矩阵 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col gap-1.5">
                <span className="text-slate-400 text-xs font-semibold">微信注册总账户</span>
                <div className="text-2xl font-bold font-mono text-slate-900">{statsTotalUsers} 人</div>
                <div className="text-[10px] text-slate-400">所有注册进站的微信账号</div>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col gap-1.5">
                <span className="text-slate-400 text-xs font-semibold">已核实实名会员</span>
                <div className="text-2xl font-bold font-mono text-emerald-600">{statsCertified} 人</div>
                <span className="text-[10px] text-emerald-600">提权为 ALUMNI_VERIFIED</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col gap-1.5">
                <span className="text-slate-400 text-xs font-semibold">待审核入册队列</span>
                <div className="text-2xl font-bold font-mono text-amber-500">{statsPendingAudits} 份</div>
                <div className="text-[10px] text-amber-500">亟需组委会理事审批签署</div>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col gap-1.5">
                <span className="text-slate-400 text-xs font-semibold">筹集会费/赞助总数</span>
                <div className="text-2xl font-bold font-mono text-blue-600">¥{statsDonationsTotal} 元</div>
                <div className="text-[10px] text-slate-400">已到账微信公账电子基金</div>
              </div>
            </div>

            {/* 统计图表结合 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center justify-between">
                  <span>🎓 本会校友就读专业分布看板</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">学籍统计</span>
                </h4>
                <div className="flex flex-col gap-2 font-sans text-xs text-slate-600">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span>计算机与人工智能学院 </span>
                    <strong className="text-slate-800 font-mono">
                      {usersList.filter(u => u.学院?.includes('计算机') || u.学院?.includes('智能')).length} 人
                    </strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span>机械与车辆控制学院 </span>
                    <strong className="text-slate-800 font-mono">
                      {usersList.filter(u => u.学院?.includes('机械') || u.学院?.includes('车辆')).length} 人
                    </strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span>经济管理及MBA商学院 </span>
                    <strong className="text-slate-800 font-mono">
                      {usersList.filter(u => u.学院?.includes('经') || u.学院?.includes('管') || u.学院?.includes('商')).length} 人
                    </strong>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center justify-between">
                  <span>💼 同城资源交互统计</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">商联统计</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">在招岗位</span>
                    <strong className="text-blue-600 text-lg font-mono font-bold mt-1 inline-block">
                      {jobsList.length} 席
                    </strong>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">线下沙龙</span>
                    <strong className="text-blue-600 text-lg font-mono font-bold mt-1 inline-block">
                      {eventsList.length} 场
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: AUDITING VERIFICATION */}
        {subSection === 'audit' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-sans flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                校友入册与实名身份审核 (Qualification Auditing Panel)
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                实时接收微信小程序端递报的实名申请。审核通过即更新 <code>role</code> 为已认证并授权其浏览全局涉密档案。
              </p>
            </div>

            {/* 审批列表 */}
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-3xs">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">待审批队列 ({auditList.filter(a => a.status === AuditStatus.PENDING).length} 笔)</span>
                <span className="text-[10px] text-slate-400">实时对齐云端 DB</span>
              </div>

              {auditList.filter(a => a.status === AuditStatus.PENDING).length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-sans text-sm">
                  ☕ 无待审单据，理事们辛苦了！
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {auditList.filter(a => a.status === AuditStatus.PENDING).map(pending => (
                    <div key={pending._id} className="p-4 bg-amber-50/10 hover:bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4 font-sans text-sm text-slate-600">
                      
                      {/* 单内账信息 */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-base">{pending.realName}</span>
                          <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            学籍年份: {pending.入学年份} 届 (攻读{pending.毕业年份 - pending.入学年份 === 4 ? '本科' : '硕博'})
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs mt-1">
                          <span><b>🎓 就读学院:</b> {pending.学院}</span>
                          <span><b>🔬 攻读专业:</b> {pending.专业}</span>
                          <span><b>📞 联络电话:</b> {pending.phoneNumber}</span>
                          <span><b>⏰ 递交日期:</b> {pending.createdAt.slice(0, 16)}</span>
                        </div>
                        {pending.extraInfo && (
                          <div className="bg-slate-50 text-slate-500 p-2 rounded text-xs mt-1 border border-slate-100">
                            <strong>留存辅导员/班级备注：</strong>"{pending.extraInfo}"
                          </div>
                        )}
                      </div>

                      {/* 求学凭据照片显示 */}
                      {pending.studentCardPicUrl && (
                        <div className="w-32 h-20 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                          <img className="w-full h-full object-cover" src={pending.studentCardPicUrl} alt="证明附件" />
                        </div>
                      )}

                      {/* 批准和拒绝动作组 */}
                      <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            const why = prompt('请给该校友批复拒绝理由:', '很抱歉，我们通过教务网络未对接上此入学年份该专业的数据。请再次仔细核实填写的姓名或重新提交有效的毕业证及学位证照片重新核查审核。');
                            if (why !== null) {
                              onUpdateAuditStatus(pending._id, AuditStatus.REJECTED, why);
                            }
                          }}
                          className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-800 font-medium cursor-pointer"
                        >
                          不予通过，发驳回微信
                        </button>
                        <button 
                          onClick={() => {
                            onUpdateAuditStatus(pending._id, AuditStatus.APPROVED);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-xs font-semibold cursor-pointer transition-colors"
                        >
                          比对无误，批准提权
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 已处理记录归档 */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
              <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                最新处理完毕档案 (审核流历史日志)
              </div>
              <div className="divide-y divide-slate-100/60 font-sans text-xs">
                {auditList.filter(a => a.status !== AuditStatus.PENDING).slice(0, 10).reverse().map(history => (
                  <div key={history._id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{history.realName}</span>
                      <span className="text-slate-400">({history.学院} - {history.专业})</span>
                      <span className={`px-1.5 py-0.2 rounded scale-90 ${
                        history.status === AuditStatus.APPROVED ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {history.status === AuditStatus.APPROVED ? '核准通过' : '已批复拒绝'}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">{history.updatedAt.slice(0, 16)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB C: USERS & PRIVILEGES */}
        {subSection === 'users' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-sans flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-800" />
                会籍成员与二级管理员授权 (Membership Configuration)
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                在这里列出全会注册人员资质。支持对已核实校友进行管理员/超级管理员授衔操作。
              </p>
            </div>

            {/* 搜寻与工具栏 */}
            <div className="flex gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 mt-1 ml-1" />
              <input 
                type="text" 
                placeholder="键入人员手机号或真实姓名快速搜索" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs font-sans placeholder-slate-400 text-slate-700 bg-transparent focus:outline-none border-none"
              />
            </div>

            {/* 会员矩阵列表 */}
            <div className="overflow-x-auto border border-slate-100 rounded-lg shadow-3xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase">
                  <tr>
                    <th className="p-3">档案姓名 / 微信卡号</th>
                    <th className="p-3">绑定电话</th>
                    <th className="p-3">所属界别及学院历</th>
                    <th className="p-3">当前社会职务</th>
                    <th className="p-3">会籍最高权限 (Role)</th>
                    <th className="p-3 text-right">管理层操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList
                    .filter(u => u.realName?.includes(searchQuery) || u.nickName.includes(searchQuery) || u.phoneNumber.includes(searchQuery))
                    .map(user => (
                      <tr key={user._id} className="hover:bg-slate-50/50">
                        <td className="p-3 flex items-center gap-2">
                          <img className="w-8 h-8 rounded-full border border-slate-100 object-cover" src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-bold text-slate-800">{user.realName || user.nickName}</div>
                            <span className="text-[9px] font-mono text-slate-400">OpenID: {user._id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{user.phoneNumber || '未绑定'}</td>
                        <td className="p-3 text-slate-600">
                          {user.isCertified ? `${user.入学年份}届 - ${user.学院}` : '游客-未登记'}
                        </td>
                        <td className="p-3 text-slate-500 font-sans">
                          {user.company ? `${user.company} | ${user.position}` : '-'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            user.role === UserRole.SUPER_ADMIN ? 'bg-rose-950 text-white' : (user.role === UserRole.ADMIN ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700')
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {user.role !== UserRole.SUPER_ADMIN ? (
                              <>
                                <button 
                                  onClick={() => onPromoteUser(user._id, UserRole.VISITOR)}
                                  className="bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-1 rounded text-[10px] hover:bg-slate-100 cursor-pointer"
                                  title="重置到游客"
                                >
                                  降级
                                </button>
                                <button 
                                  onClick={() => {
                                    if (currentUser.role !== UserRole.SUPER_ADMIN) {
                                      alert('⚠️ 权限不足：只有超级管理员（SUPER_ADMIN）身份才有权将普通校友提拔为后台系统管理员！');
                                      return;
                                    }
                                    onPromoteUser(user._id, UserRole.ADMIN);
                                  }}
                                  className="bg-blue-50 border border-blue-100 text-blue-600 font-medium px-1.5 py-1 rounded text-[10px] hover:bg-blue-100 cursor-pointer"
                                >
                                  任免理事(ADMIN)
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-400 text-[10px]">系统最高主号</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB D: EVENT CAMPAIGN PUBLISH */}
        {subSection === 'events' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-sans flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-800" />
                  活动沙龙与内推绿色招聘审核 (Content Campaign Center)
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  在线快速向小程序所有会友广播同城校友聚会及在招空缺。支持设置报名席位防溢机制。
                </p>
              </div>

              <button 
                onClick={() => setShowAddEventForm(!showAddEventForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs shrink-0 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showAddEventForm ? '收起发布单' : '发布线下联谊聚会'}
              </button>
            </div>

            {/* 新增活动表单窗 */}
            {showAddEventForm && (
              <form onSubmit={handlePublishEvent} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-4 text-xs text-slate-700 font-sans">
                <div className="font-bold text-sm text-rose-950">发布全新校友专项活动</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">活动标题主题 *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="例如: 2026年浙江同城青年校友露营与创新论坛沙龙" 
                      value={newEvtTitle} 
                      onChange={e => setNewEvtTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">开展活动具体时间段 *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="2026-06-25 14:00 至 2026-06-25 18:00" 
                      value={newEvtDate} 
                      onChange={e => setNewEvtDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block font-semibold mb-1">限定人数上限 *</label>
                    <input 
                      type="number" 
                      placeholder="0表示不设限" 
                      value={newEvtLimit} 
                      onChange={e => setNewEvtLimit(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block font-semibold mb-1">会友赞助缴费 (免费填 0)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={newEvtFee} 
                      onChange={e => setNewEvtFee(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none font-mono"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block font-semibold mb-1">活动详细驻地 *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="校友之家5楼多功能会议大厅" 
                      value={newEvtLocation} 
                      onChange={e => setNewEvtLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 font-sans">活动详细议程说明与报名要求</label>
                  <textarea 
                    placeholder="请输入活动主要内容，比如嘉宾阵容，车辆接送，是否需要实名校友方可参与等..." 
                    value={newEvtDesc} 
                    onChange={e => setNewEvtDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-sans focus:outline-none h-24"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddEventForm(false)}
                    className="bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg"
                  >
                    放弃取消
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
                  >
                    确认提报数据库并上线广播
                  </button>
                </div>
              </form>
            )}

            {/* 活动管理一览 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {eventsList.map(item => (
                <div key={item._id} className="border border-slate-100 rounded-xl p-4 flex flex-col gap-2 shadow-2xs">
                  <div className="flex justify-between items-center bg-slate-50/55 p-1 rounded font-mono text-[10px]">
                    <span>创建于: {item.createdAt.slice(0, 10)}</span>
                    <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-sans">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  
                  <div className="text-slate-500 text-xs flex flex-col gap-1 font-sans">
                    <span>🗓️ 历时: {item.startTime}</span>
                    <span>📍 选址: {item.location}</span>
                    <span>
                      👥 限制席位: {item.joinedCount} / {item.limitCount === 0 ? '不限量' : `${item.limitCount} 人`} (已报名占位)
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px] bg-slate-50 p-2 rounded leading-relaxed italic">
                    "{item.description}"
                  </p>
                </div>
              ))}
            </div>

            {/* 招聘岗位审核看板 */}
            <div className="border border-slate-100 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-slate-800 text-xs mb-3 flex justify-between items-center">
                <span>💼 校友企业内推岗位挂网在招清单 ({jobsList.length} 席)</span>
                <span className="text-[10px] text-slate-400">所有者拥有下架权</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-2.5">在招企业名称</th>
                      <th className="p-2.5">岗位方向</th>
                      <th className="p-2.5 font-bold">薪酬包挂网</th>
                      <th className="p-2.5">工作地</th>
                      <th className="p-2.5">求职投递简历邮箱</th>
                      <th className="p-2.5">在招状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobsList.map(job => (
                      <tr key={job._id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-bold font-bold text-slate-800">{job.enterpriseName}</td>
                        <td className="p-2.5 text-slate-600">{job.title}</td>
                        <td className="p-2.5 text-blue-600 font-bold font-mono">{job.salary}</td>
                        <td className="p-2.5 text-slate-500">{job.location}</td>
                        <td className="p-2.5 text-slate-600 font-mono">{job.contactEmail}</td>
                        <td className="p-2.5">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 rounded scale-90">
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB E: FINANCIAL AUDITING & DONATIONS */}
        {subSection === 'finance' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-sans flex items-center gap-2">
                  <Coins className="w-5 h-5 text-blue-600" />
                  地方校友财务会费及慈善专项捐助台账 (Auditing & Dues Ledger)
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  在这里列出通过微信支付系统秒到账的所有流水凭证。对账完成，支持一键导出财务Excel报告进行对公核验。
                </p>
              </div>

              <button 
                onClick={() => { alert('已模拟生成 Excel 财务数据汇总报表至后台缓存区，随时可下载！'); }}
                className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold font-sans flex items-center gap-1 hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                导出财务台账报表
              </button>
            </div>

            {/* 汇总资产仪表盘 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                <span className="text-slate-400 text-[10px] font-semibold block">会费对公总收入</span>
                <strong className="text-emerald-800 text-xl font-bold font-mono block mt-1">
                  ¥{donationsList.filter(d => d.type === 'MEMBERSHIP_FEE').reduce((acc, current) => acc + current.amount, 0)} 元
                </strong>
                <span className="text-[9px] text-slate-400 mt-1 block">用于日常行政开辟、网站房租等</span>
              </div>
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl">
                <span className="text-slate-400 text-[10px] font-semibold block">慈善与爱心赞助收入</span>
                <strong className="text-blue-800 text-xl font-bold font-mono block mt-1">
                  ¥{donationsList.filter(d => d.type === 'DONATION').reduce((acc, current) => acc + current.amount, 0)} 元
                </strong>
                <span className="text-[9px] text-slate-400 mt-1 block">专款专用于奖学金、帮扶困难学子</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] font-semibold block">微信代扣结算渠道汇率</span>
                <strong className="text-slate-800 text-xl font-bold font-mono block mt-1">
                  0.00 %
                </strong>
                <span className="text-[9px] text-slate-500 mt-1 block">微信官方专享绿色0费率通道</span>
              </div>
            </div>

            {/* 实名台账订单 */}
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="p-3 font-semibold">账期交易单号 (Order_ID)</th>
                    <th className="p-3 font-semibold">资助会友姓名</th>
                    <th className="p-3 font-semibold">就读求学届别</th>
                    <th className="p-3 font-semibold">捐赠类型</th>
                    <th className="p-3 font-semibold">爱心对公项目</th>
                    <th className="p-3 font-semibold">赞助金额 (RMB)</th>
                    <th className="p-3 font-semibold">结算时间</th>
                    <th className="p-3 font-semibold">电子感谢证明编号</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donationsList.map(record => (
                    <tr key={record._id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-400">{record._id}</td>
                      <td className="p-3 font-bold text-slate-850">{record.donorName}</td>
                      <td className="p-3 font-mono text-slate-500">{record.入学年份 || '未知'} 届</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.2 rounded font-sans text-[9px] font-bold ${
                          record.type === 'MEMBERSHIP_FEE' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                        }`}>
                          {record.type === 'MEMBERSHIP_FEE' ? '年度会费' : '慈善基金'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-sans">{record.projectTitle}</td>
                      <td className="p-3 text-slate-900 font-bold font-mono text-sm">
                        ¥{record.amount}.00
                      </td>
                      <td className="p-3 text-slate-600 font-sans">{record.payTime?.slice(0, 16).replace('T', ' ')}</td>
                      <td className="p-3 font-mono text-slate-400">{record.certificateNo || '未结算下发'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
