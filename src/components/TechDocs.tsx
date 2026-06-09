/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  FolderTree, 
  Terminal, 
  BookOpen, 
  ChevronRight, 
  ChevronDown, 
  Code,
  FileText,
  Settings,
  CloudLightning,
  ShieldAlert
} from 'lucide-react';
import { CLOUD_DB_SCHEMAS } from '../data/schemas';
import { PLATFORM_DIRECTORY_STRUCTURE, FileNode } from '../data/directoryStructure';
import { PLATFORM_CODE_BANK } from '../data/codeBank';

export default function TechDocs() {
  const [activeSubTab, setActiveSubTab] = useState<'db' | 'tree' | 'code' | 'deploy'>('db');
  const [selectedFileCode, setSelectedFileCode] = useState<string>('app_json');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'alumni-association-miniprogram': true,
    'miniprogram': true,
    'pages': true
  });

  const toggleNode = (nodeName: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeName]: !prev[nodeName]
    }));
  };

  const renderDirectoryTree = (nodes: FileNode[], path: string = '') => {
    return nodes.map(node => {
      const currentPath = `${path}/${node.name}`;
      const isFolder = node.type === 'folder';
      const isExpanded = expandedNodes[node.name];

      return (
        <div key={currentPath} className="ml-3 font-mono text-sm leading-relaxed">
          <div 
            className={`flex items-center gap-1.5 py-1 px-1 rounded-sm transition-colors hover:bg-slate-50 ${
              node.codeKey ? 'cursor-pointer text-rose-800 font-medium' : isFolder ? 'cursor-pointer' : 'text-slate-600'
            }`}
            onClick={() => {
              if (isFolder) {
                toggleNode(node.name);
              } else if (node.codeKey) {
                setSelectedFileCode(node.codeKey);
                setActiveSubTab('code');
              }
            }}
          >
            {isFolder ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={isFolder ? 'text-slate-800' : ''}>
              {node.name}
            </span>
            <span className="text-slate-400 text-xs ml-2 font-sans overflow-hidden text-ellipsis whitespace-nowrap">
              - {node.description}
            </span>
            {node.codeKey && (
              <span className="bg-rose-100 text-rose-700 text-[10px] px-1 rounded ml-1.5 font-sans">
                点击阅读源码
              </span>
            )}
          </div>
          {isFolder && isExpanded && node.children && (
            <div className="border-l border-slate-200 ml-2.5">
              {renderDirectoryTree(node.children, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div id="tech-docs-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 侧边导航 */}
      <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2 h-fit">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
          技术设计与工程文档
        </h3>
        <button
          onClick={() => setActiveSubTab('db')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeSubTab === 'db'
              ? 'bg-rose-50 text-rose-900 font-medium border-l-2 border-rose-800'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          数据库集合设计
        </button>
        <button
          onClick={() => setActiveSubTab('tree')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeSubTab === 'tree'
              ? 'bg-rose-50 text-rose-900 font-medium border-l-2 border-rose-800'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          完整项目目录结构
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeSubTab === 'code'
              ? 'bg-rose-50 text-rose-900 font-medium border-l-2 border-rose-800'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4" />
          核心代码范本
        </button>
        <button
          onClick={() => setActiveSubTab('deploy')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeSubTab === 'deploy'
              ? 'bg-rose-50 text-rose-900 font-medium border-l-2 border-rose-800'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          本地开发与部署指南
        </button>
      </div>

      {/* 右侧展示核心 */}
      <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[500px]">
        {/* SubTab 1: DB Schema Definition */}
        {activeSubTab === 'db' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-rose-800" />
                微信云数据库集合设计 (WeChat Cloud DB Schemas)
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                第一批设计包含 7 大核心业务集合。微信云开发不需要繁琐的建表语句及驱动维护，可动态通过 JSON 安全规则直接由云函数读取。以下为严整设计的实体清单与索引规划。
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {CLOUD_DB_SCHEMAS.map(schema => (
                <div key={schema.collectionName} className="border border-slate-100 rounded-lg overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-rose-900">
                        db.collection('{schema.collectionName}')
                      </span>
                      <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                        {schema.fields.length} 个字段
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      安全规则: {schema.permission}
                    </span>
                  </div>

                  <div className="p-4 bg-white">
                    <p className="text-sm text-slate-600 font-sans mb-3">
                      <strong>用途描述：</strong>{schema.description}
                    </p>

                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">
                        推荐索引配置：
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {schema.indexes.map(idx => (
                          <span key={idx} className="bg-slate-100 text-slate-700 font-mono text-xs px-2 py-0.5 rounded">
                            {idx}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase">
                            <th className="py-2 font-medium">字段键名 (Key)</th>
                            <th className="py-2 font-medium">数据类型</th>
                            <th className="py-2 font-medium text-center">空值校验</th>
                            <th className="py-2 font-medium">业务功能语义说明</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans text-sm">
                          {schema.fields.map(f => (
                            <tr key={f.name} className="hover:bg-slate-50/50">
                              <td className="py-2 font-mono text-rose-900 font-medium">{f.name}</td>
                              <td className="py-2 font-mono text-slate-600 text-xs">{f.type}</td>
                              <td className="py-2 text-center">
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                  f.required ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                  {f.required ? '必填 Required' : '选填 Opt'}
                                </span>
                              </td>
                              <td className="py-2 text-slate-600">{f.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubTab 2: Directory Tree */}
        {activeSubTab === 'tree' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-rose-800" />
                完整项目目录物理结构 (Full Catalog Mapping)
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                平台整合了微信原生 Mini-Program （使用 TypeScript） 与 Web 骨干管理端。您可以点击下方带有 <span className="text-rose-700 font-bold">高亮</span> 标志的文件，我们将为您自动呈递或切换到该部分的源码实现。
              </p>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-900/5 overflow-x-auto max-h-[600px]">
              {renderDirectoryTree(PLATFORM_DIRECTORY_STRUCTURE)}
            </div>
          </div>
        )}

        {/* SubTab 3: Source codes */}
        {activeSubTab === 'code' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Code className="w-5 h-5 text-rose-800" />
                  端云核心业务代码范本 (Secure Core Source Sandbox)
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  采用一站式无服务器设计的微信小程序和 Node.js 微信云开发鉴权范本。
                </p>
              </div>
              
              {/* 二级代码栏选择器 */}
              <div className="flex shrink-0">
                <select
                  value={selectedFileCode}
                  onChange={(e) => setSelectedFileCode(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-rose-800 focus:outline-none"
                >
                  <option value="app_json">app.json (小程序路由)</option>
                  <option value="app_ts">app.ts (小程序生命周期)</option>
                  <option value="register_ts">register.ts (认证客户端逻辑)</option>
                  <option value="register_wxml">register.wxml (认证收集表单)</option>
                  <option value="admin_ts">admin.ts (移动审批端逻辑)</option>
                  <option value="admin_wxml">admin.wxml (移动审批端面板)</option>
                  <option value="cf_user_manager">user_manager/index.ts (用户管理云函数)</option>
                  <option value="cf_admin_gateway">admin_gateway/index.ts (安全审核网关)</option>
                </select>
              </div>
            </div>

            {/* 代码详情展示 */}
            {PLATFORM_CODE_BANK[selectedFileCode] && (
              <div className="flex flex-col gap-3 font-sans">
                <div className="bg-rose-50 text-rose-900 border border-rose-100 p-4 rounded-lg flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <CloudLightning className="w-4 h-4 text-rose-800" />
                    目标文件: <span className="font-mono text-xs">{PLATFORM_CODE_BANK[selectedFileCode].filePath}</span>
                  </div>
                  <p className="text-xs text-rose-800/90 leading-normal">
                    <strong>设计理念：</strong>{PLATFORM_CODE_BANK[selectedFileCode].explanation}
                  </p>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <div className="bg-slate-800 text-slate-400 px-4 py-2 font-mono text-xs flex justify-between items-center">
                    <span>{PLATFORM_CODE_BANK[selectedFileCode].filePath}</span>
                    <span className="uppercase text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-white font-semibold">
                      {PLATFORM_CODE_BANK[selectedFileCode].language}
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed select-text">
                    <code>{PLATFORM_CODE_BANK[selectedFileCode].code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SubTab 4: How to Deploy */}
        {activeSubTab === 'deploy' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-800" />
                精简本地开发与云上部署说明 (CI/CD Runbook)
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                一步步教您如何在微信官方开发者工具中起步，并且一键部署上线，实现完整安全闭环。
              </p>
            </div>

            <div className="prose prose-sm font-sans text-slate-600 flex flex-col gap-5 max-w-none">
              
              {/* Box 1 */}
              <div className="border border-amber-100 bg-amber-50/50 p-4 rounded-lg flex gap-3 text-sm text-yellow-900">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-950 mb-1">【严控安全审计】小程序防刷设计 & 云函数鉴权优势</h4>
                  <p className="text-xs leading-normal">
                    由于微信小程序客户端具有被逆向调试或反编译的安全隐患，<strong>本技术方案坚决反对将写入、审批修改这等核心权力挂接于小程序客户端直接直连数据库！</strong>
                    <br/>
                    所有人脸核验和授权提权一律部署在微信主控服务器隔离安全域内的<strong>【云函数】</strong>中。云函数通过 <code>cloud.getWXContext().OPENID</code> 获取微信绝对可信的微信号身份，并由此进入 <code>users</code> 库关联验证管理角色 <code>role</code>，完全杜绝封锁了通过网络代理包篡改申请状态的物理越权链路。
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="bg-rose-100 text-rose-900 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">注册微信小程序及开通云开发模块</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 mt-1.5">
                    <li>访问微信公众平台（<a href="https://mp.weixin.qq.com" target="_blank" rel="noreferrer" className="text-rose-800 underline">mp.weixin.qq.com</a>），注册一个「小程序」账号（推荐先选择个人或组织主体均可）。</li>
                    <li>记录下您的 <strong>AppID(小程序ID)</strong>。</li>
                    <li>在基础设置中，由于需要获取用户手机号，建议小程序认证主体为非个人名称或者是校友会组织机构以备一键绑定解锁。</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="bg-rose-100 text-rose-900 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">安装微信开发者工具及本地导入</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 mt-1.5">
                    <li>下载并安装 <strong>微信开发者工具 Stable 稳定版</strong>。</li>
                    <li>启动后选择「导入项目」，目录指向生成的 <code>alumni-association-miniprogram</code> 的根路径。</li>
                    <li>填入您在第一步注册到的 <strong>AppID</strong> ，并在后端服务中点击勾选并切换为 <strong>「微信云开发」</strong> 架构。</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="bg-rose-100 text-rose-900 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">开通并初始化云数据库集合</h3>
                  <p className="text-sm">进入开发者工具顶部的「云开发」控制台，开通服务（享有免费额度）后进行以下设置：</p>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 mt-1.5">
                    <li>点击<strong>数据库</strong>页签，点击 「+」 号依次新建 7 大核心集合：
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">users</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">alumni_audits</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">events</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">event_registrations</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">enterprises</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">jobs</code>、
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-900 mx-1">donations</code>。
                    </li>
                    <li>设置集合<strong>权限</strong>：将 <code>users</code>、<code>alumni_audits</code> 等设置安全权限为「所有者可写，所有人可读」或者自定义为 <code>cloudbase_rules.json</code> 文件内声明的安全条件。</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="bg-rose-100 text-rose-900 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">编写及一键上传部署云函数</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 mt-1.5">
                    <li>在开发者工具左侧侧栏，定位到 <code>cloudfunctions</code> 下对应的函数文件夹（如 <code>user_manager</code>）。</li>
                    <li>右键该目录，选择 <strong>「在终端打开」</strong> 并执行命令 <code>npm install</code> 载入微信官方服务器 SDK。</li>
                    <li>然后右键函数文件夹，执行 <strong>「创建并部署：所有文件」</strong>。部署进度完成后即可安全在线上测试运行！</li>
                    <li>同样步骤一并上传部署 <code>login</code> 及 <code>admin_gateway</code> 两个云函数，完成前段绑定。</li>
                  </ul>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="bg-rose-100 text-rose-900 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Web 骨干后台对接微信云托管（可选）</h3>
                  <p className="text-sm leading-normal">
                    第一版中我们设计的 Web 管理后台可以直接集成<strong>微信云开发提供的 Web SDK</strong>。可在 Web 管理后台直接实例化微信云初始化服务，从而直接由 Web 浏览器读取并安全审批数据库，省去购买和单独配置域名、SSL证书以及传统自建 ECS 服务器的繁杂开销！
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
