/*
 * BestAds 运营端菜单唯一配置源。
 * path 使用仓库根目录相对路径，admin-shell.js 会自动解析为当前环境的 URL，
 * 因此同一份配置同时支持 file://、本地 HTTP 和 GitHub Pages。
 */
(function () {
  const root = 'admin-system/';
  const page = (id, label, file, icon, extra = {}) => ({
    id,
    label,
    path: file ? root + file : null,
    icon: icon || 'file',
    ...extra
  });

  window.BESTADS_ADMIN_MENU = [
    {
      id: 'main-functions',
      label: '主要功能',
      icon: 'users',
      items: [
        page('customer-list', '客户管理', 'main-functions/customer-management.html', 'users'),
        page('customer-sub-account', '客户子账号管理', 'main-functions/customer-sub-account-management.html', 'user-friends'),
        page('agent-management', '代理管理', 'main-functions/agent_management.html', 'user-shield'),
        page('introducer-spitpoint', '介绍人和吐点', 'main-functions/introducer-spitpoint.html', 'handshake'),
        page('rebate-config', '返点配置', 'main-functions/rebate-config.html', 'percent'),
        page('deduction-details', '其他扣费', 'main-functions/deduction-details.html', 'list-alt'),
        page('location-fee', '地区税费', 'main-functions/location-fee.html', 'globe'),
        page('export-center', '导出中心', 'main-functions/export-center.html', 'download')
      ]
    },
    {
      id: 'performance',
      label: '绩效',
      icon: 'chart-line',
      items: [
        page('performance-metric-description', '绩效指标说明', 'performance/metric-description.html', 'book'),
        page('performance-config', '绩效配置', 'performance/performance-config.html', 'sliders-h'),
        page('all-performance', '全员绩效查看', 'performance/all-performance.html', 'users-cog'),
        page('my-performance', '我的绩效', 'performance/my-performance.html', 'user-check'),
        page('performance-log', '绩效操作日志', 'performance/performance-log.html', 'history')
      ]
    },
    {
      id: 'meta-asset-management',
      label: 'Meta资产管理',
      icon: 'cubes',
      items: [
        page('meta-bm-config', 'BM 配置', 'meta-asset-management/bm-config.html', 'sliders-h'),
        page('meta-assets', '资产', 'meta-asset-management/assets.html', 'cubes'),
        page('meta-members', '成员', 'meta-asset-management/members.html', 'users'),
        page('meta-assignment-audit', '资产分配核对', 'meta-asset-management/assignment-audit.html', 'clipboard-check'),
        page('meta-operation-log', '操作日志', 'meta-asset-management/operation-log.html', 'history')
      ]
    },
    {
      id: 'fb-business',
      label: 'FB业务管理',
      icon: 'briefcase',
      items: [
        page('fb-account-management', '账户管理', 'fb-business/account-management.html', 'sync'),
        page('fb-account-opening', '开户管理', 'fb-business/account-opening.html', 'plus-circle'),
        page('fb-account-allocation', '账户分配', 'fb-business/account-allocation.html', 'clipboard-list'),
        page('fb-recharge-management', '账户充值', 'fb-business/recharge-management.html', 'dollar-sign'),
        page('fb-deduction-management', '账户减款', 'fb-business/deduction-management.html', 'minus-circle'),
        page('fb-clear-management', '账户清零', 'fb-business/clear-management.html', 'eraser'),
        page('fb-service-fee-config', '服务费配置', 'fb-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'tt-business',
      label: 'TT业务管理',
      icon: 'video',
      items: [
        page('tt-account-management', '账户管理', 'tt-business/account-management.html', 'sync'),
        page('tt-account-opening', '开户管理', 'tt-business/account-opening.html', 'plus-circle'),
        page('tt-account-allocation', '账户分配', 'tt-business/account-allocation.html', 'clipboard-list'),
        page('tt-recharge-management', '账户充值', 'tt-business/recharge-management.html', 'dollar-sign'),
        page('tt-deduction-management', '账户减款', 'tt-business/deduction-management.html', 'minus-circle'),
        page('tt-clear-management', '账户清零', 'tt-business/clear-management.html', 'eraser'),
        page('tt-service-fee-config', '服务费配置', 'tt-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'google-business',
      label: 'GG业务管理',
      icon: 'globe',
      items: [
        page('google-account-management', '账户管理', 'google-business/account-management.html', 'sync'),
        page('google-account-opening', '开户管理', 'google-business/account-opening.html', 'plus-circle'),
        page('google-account-allocation', '账户分配', 'google-business/account-allocation.html', 'clipboard-list'),
        page('google-recharge-management', '账户充值', 'google-business/recharge-management.html', 'dollar-sign'),
        page('google-deduction-management', '账户减款', 'google-business/deduction-management.html', 'minus-circle'),
        page('google-clear-management', '账户清零', 'google-business/clear-management.html', 'eraser'),
        page('google-service-fee-config', '账户服务费', 'google-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'other-media-business',
      label: '其他媒体业务',
      icon: 'layer-group',
      items: [
        page('other-account-management', '账户管理', 'other-media-business/account-management.html', 'sync'),
        page('other-account-opening', '开户管理', 'other-media-business/account-opening.html', 'plus-circle'),
        page('other-account-allocation', '账户分配', 'other-media-business/account-allocation.html', 'clipboard-list'),
        page('other-recharge-management', '账户充值', 'other-media-business/recharge-management.html', 'dollar-sign'),
        page('other-clear-management', '账户清零', 'other-media-business/clear-management.html', 'eraser'),
        page('other-service-fee-config', '账户服务费', 'other-media-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'ad-governance',
      label: '广告管理',
      icon: 'shield-alt',
      items: [
        page('ad-review', '广告审核', 'ad-governance/ad-review.html', 'shield-alt')
      ]
    },
    {
      id: 'customer-transactions',
      label: '客户流水',
      icon: 'receipt',
      items: [
        page('transaction-detail', '交易明细', 'customer-transactions/transaction-detail.html', 'receipt'),
        page('online-recharge', '在线充值', 'customer-transactions/online-recharge.html', 'credit-card'),
        page('offline-transfer', '线下转账', 'customer-transactions/offline-transfer.html', 'university')
      ]
    },
    {
      id: 'material-analysis',
      label: '素材分析',
      icon: 'images',
      items: [
        page('material-library', '素材库', null, 'images', { status: 'planned' })
      ]
    },
    {
      id: 'balance-monitor',
      label: '监控管理',
      icon: 'bell',
      items: [
        page('balance-monitor-auto-recharge', '余额监控&自动充值', 'auto-recharge/notifications.html', 'bell'),
        page('account-status-monitor', '账户封停监控', 'auto-recharge/account-status-monitor.html', 'bell'),
        page('balance-day-over-day-report', '账户余额日环比', 'auto-recharge/balance-day-over-day-report.html', 'chart-line')
      ]
    },
    {
      id: 'reports',
      label: '报表',
      icon: 'chart-pie',
      items: [
        page('industry-report', '行业报表', 'reports/industry-report.html', 'chart-pie'),
        page('customer-fund-change-report', '客户资金变动', 'reports/customer-fund-change-report.html', 'wallet'),
        page('overall-income-expense', '整体收支监控', 'reports/overall-income-expense.html', 'chart-line'),
        page('recharge-distribution-report', '充值分布', 'reports/recharge-distribution-report.html', 'chart-pie'),
        page('profit-distribution', '预计利润分布', 'reports/profit-fluctuation-report.html', 'chart-line'),
        page('consumption-distribution', '消耗分布', 'reports/consume-analysis-report.html', 'chart-area'),
        page('customer-reconciliation-daily-report', '客户对账日报', 'reports/customer-reconciliation-daily-report.html', 'clipboard-check'),
        page('weekly-ad-data-report', '广告周数据', 'reports/weekly-ad-data-report.html', 'calendar-week'),
        page('ad-customer-performance-report', '广告客户表现', 'reports/ad-customer-performance-report.html', 'trophy'),
        page('bind-card-account', '绑卡户管理', 'reports/account-card-reconciliation-report.html', 'credit-card'),
        page('acct-txn-summary', '综合充值清零减款', 'reports/acct-txn-summary.html', 'receipt'),
        page('customer-lifecycle-report', '客户生命周期', 'reports/customer-lifecycle-report.html', 'user-clock'),
        page('non-api-spend', '非接口方式获取消耗', 'reports/manual-consume-upload.html', 'upload'),
        page('ad-daily-report', '广告日报', 'reports/ad-daily-report.html', 'calendar-day'),
      ]
    },
    {
      id: 'system-settings',
      label: '系统配置',
      icon: 'cog',
      items: [
        page('precharge-config', '预充配置', 'system-configuration/precharge-config.html', 'sliders-h'),
        page('account-opening-rules', '账户规则配置', 'system-configuration/account-opening-rules.html', 'sliders-h'),
        page('system-dict', '系统字典', 'main-functions/system-config.html', 'book'),
        page('permission-audit-log', '权限审计日志', 'Log/permission-audit-log.html', 'file-alt'),
        page('client-menu', '客户端菜单', 'system-settings/client-menu.html', 'sitemap'),
        page('notification-config', '通知配置', 'system-settings/notification-config.html', 'bell'),
        page('ad-consumption-decline-reminder', '消耗下降提醒配置', 'system-settings/ad-consumption-decline-reminder.html', 'exclamation-triangle')
      ]
    },
    {
      id: 'email-notifications',
      label: '邮件通知',
      icon: 'envelope',
      items: [
        page('email-template', '提醒邮件模板', 'email-notifications/templates.html', 'envelope-open-text'),
        page('email-send-logs', '邮件发送日志', 'email-notifications/send-logs.html', 'list-alt'),
        page('email-usage', '邮件发送用量统计', 'email-notifications/usage.html', 'chart-bar')
      ]
    },
    
  ];

  window.BESTADS_ADMIN_MENU_VERSION = '2026-08-18.1';
})();
