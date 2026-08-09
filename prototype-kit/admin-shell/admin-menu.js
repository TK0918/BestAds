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
      items: [
        page('meta-bm-config', 'BM 配置', 'meta-asset-management/bm-config.html', 'sliders-h'),
        page('meta-assets', '资产', 'meta-asset-management/assets.html', 'cubes'),
        page('meta-members', '成员', 'meta-asset-management/members.html', 'users'),
        page('meta-operation-log', '操作日志', 'meta-asset-management/operation-log.html', 'history')
      ]
    },
    {
      id: 'fb-business',
      label: 'FB业务管理',
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
      items: [
        page('tt-account-management', '账户管理', null, 'sync', { status: 'planned' }),
        page('tt-account-allocation', '账户分配', null, 'clipboard-list', { status: 'planned' }),
        page('tt-recharge-management', '账户充值', null, 'dollar-sign', { status: 'planned' }),
        page('tt-deduction-management', '账户减款', null, 'minus-circle', { status: 'planned' }),
        page('tt-clear-management', '账户清零', null, 'eraser', { status: 'planned' }),
        page('tt-service-fee-config', '服务费配置', null, 'receipt', { status: 'planned' })
      ]
    },
    {
      id: 'google-business',
      label: 'GG业务管理',
      items: [
        page('google-account-management', '账户管理', 'google-business/account-management.html', 'sync'),
        page('google-account-allocation', '账户分配', 'google-business/account-allocation.html', 'clipboard-list'),
        page('google-recharge-management', '账户充值', 'google-business/recharge-management.html', 'dollar-sign'),
        page('google-deduction-management', '账户减款', 'google-business/deduction-management.html', 'minus-circle'),
        page('google-clear-management', '账户清零', 'google-business/clear-management.html', 'eraser'),
        page('google-service-fee-config', '服务费配置', 'google-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'other-media-business',
      label: '其他媒体业务',
      items: [
        page('other-account-management', '账户管理', 'other-media-business/account-management.html', 'sync'),
        page('other-account-allocation', '账户分配', 'other-media-business/account-allocation.html', 'clipboard-list'),
        page('other-recharge-management', '账户充值', 'other-media-business/recharge-management.html', 'dollar-sign'),
        page('other-clear-management', '账户清零', 'other-media-business/clear-management.html', 'eraser'),
        page('other-service-fee-config', '服务费配置', 'other-media-business/service-fee-config.html', 'receipt')
      ]
    },
    {
      id: 'ad-governance',
      label: '广告管理',
      items: [
        page('ad-review', '广告审核', 'ad-governance/ad-review.html', 'shield-alt')
      ]
    },
    {
      id: 'customer-transactions',
      label: '客户流水',
      items: [
        page('transaction-detail', '交易明细', 'customer-transactions/transaction-detail.html', 'receipt'),
        page('online-recharge', '在线充值', 'customer-transactions/online-recharge.html', 'credit-card'),
        page('offline-transfer', '线下转账', 'customer-transactions/offline-transfer.html', 'university')
      ]
    },
    {
      id: 'material-analysis',
      label: '素材分析',
      items: [
        page('material-library', '素材库', null, 'images', { status: 'planned' })
      ]
    },
    {
      id: 'balance-monitor',
      label: '余额监控管理',
      items: [
        page('account-status-monitor', '账户状态监控', 'auto-recharge/account-status-monitor.html', 'bell'),
        page('balance-day-over-day-report', '余额日环比', 'auto-recharge/balance-day-over-day-report.html', 'chart-line'),
        page('client-rules', '客户端规则', 'auto-recharge/client-rules.html', 'sliders-h'),
        page('balance-notifications', '余额监控通知', 'auto-recharge/notifications.html', 'bell')
      ]
    },
    {
      id: 'reports',
      label: '报表',
      items: [
        page('customer-recharge-report', '客户打款情况', 'reports/customer-recharge-report.html', 'file-invoice-dollar'),
        page('account-recharge-report', '广告账户充值报表', 'reports/account-recharge-report.html', 'file-invoice-dollar'),
        page('account-consume-report', '广告消耗情况', 'reports/account-consume-report.html', 'chart-line'),
        page('negative-ad-report', '负向广告报表', 'reports/negative-ad-report.html', 'exclamation-triangle'),
        page('ad-daily-report', '广告日报', 'reports/ad-daily-report.html', 'calendar-day'),
        page('data-report', '数据报表', 'reports/data-report.html', 'table'),
        page('multi-tab-ad-data-report', '多 Tab 广告数据报表', 'reports/multi-tab-ad-data-report.html', 'table'),
        page('weekly-ad-data-report', '周度广告数据报表', 'reports/weekly-ad-data-report.html', 'chart-area'),
        page('consume-analysis-report', '消耗分析报表', 'reports/consume-analysis-report.html', 'chart-pie'),
        page('customer-fund-change-report', '客户资金变动报表', 'reports/customer-fund-change-report.html', 'wallet'),
        page('customer-reconciliation-daily-report', '客户对账日报', 'reports/customer-reconciliation-daily-report.html', 'clipboard-check'),
        page('customer-lifecycle-report', '客户生命周期报表', 'reports/customer-lifecycle-report.html', 'user-clock'),
        page('ad-customer-performance-report', '客户广告绩效报表', 'reports/ad-customer-performance-report.html', 'trophy'),
        page('recharge-distribution-report', '充值分布报表', 'reports/recharge-distribution-report.html', 'chart-pie'),
        page('profit-fluctuation-report', '利润波动报表', 'reports/profit-fluctuation-report.html', 'chart-line'),
        page('manual-consume-upload', '手工消耗上传', 'reports/manual-consume-upload.html', 'upload'),
        page('account-card-reconciliation-report', '绑卡户管理', 'reports/account-card-reconciliation-report.html', 'credit-card'),
        page('operation-daily-report', '运营日报', 'reports/report1.html', 'chart-line')
      ]
    },
    {
      id: 'system-settings',
      label: '系统配置',
      items: [
        page('precharge-config', '预充配置', 'system-configuration/precharge-config.html', 'sliders-h'),
        page('system-dict', '系统字典', 'main-functions/system-config.html', 'book'),
        page('permission-audit-log', '权限审计日志', 'Log/permission-audit-log.html', 'file-alt'),
        page('client-menu', '客户端菜单', 'system-settings/client-menu.html', 'sitemap'),
        page('notification-config', '通知配置', 'system-settings/notification-config.html', 'bell'),
        page('ad-consumption-decline-reminder', '消耗下降提醒配置', 'system-settings/ad-consumption-decline-reminder.html', 'exclamation-triangle')
      ]
    },
    
  ];

  window.BESTADS_ADMIN_MENU_VERSION = '2026-08-09.3';
})();
