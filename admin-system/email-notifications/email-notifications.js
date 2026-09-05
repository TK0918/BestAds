(function () {
  'use strict';

  const root = document.getElementById('page-root');
  const page = document.body.dataset.adminPage;
  if (!root) return;

  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const scenarios = [
    { key: 'account_runway', name: '续航不足', category: '续航不足', color: '#2f6bff' },
    { key: 'wallet_shortfall_event', name: '钱包不足·事件', category: '钱包不足·事件', color: '#16a34a' },
    { key: 'wallet_shortfall_predict', name: '钱包不足·预测', category: '钱包不足·预测', color: '#f59e0b' },
    { key: 'auto_recharge_fail', name: '自动充失败', category: '自动充失败', color: '#ef4444' },
    { key: 'account_recharge_fail', name: '账户充失败', category: '账户充失败', color: '#8b5cf6' },
    { key: 'wallet_credited', name: '钱包到账', category: '钱包到账', color: '#06b6d4' },
    { key: 'clear_reduce_success', name: '清零/减款成功', category: '清零/减款成功', color: '#14b8a6' }
  ];

  const previewLanguages = [
    { key: 'en', label: 'English' },
    { key: 'zh', label: '中文' }
  ];

  const templateDefaults = {
    account_runway: {
      name: 'Account runway reminder',
      subject: '{{customerName}}, some ad accounts may run out of balance soon',
      preheader: 'Based on recent 7-day spend and current balances, {{riskAccountCount}} ad accounts may require recharge soon.',
      title: 'Ad account balance may run out soon',
      intro: 'Hi {{customerName}}, based on the average spend over the last 7 days and the current ad account balances, the following ad accounts are expected to run out soon. To keep campaigns running without interruption, please recharge these ad accounts as soon as possible. If you have already completed the recharge, please ignore this reminder. Data may be delayed; log in to BestAds for the latest account balance.',
      metricOneLabel: 'Accounts at risk',
      metricOneValue: '{{riskAccountCount}}',
      metricTwoLabel: 'Nearest runway',
      metricTwoValue: '{{estimatedDaysLeft}} days',
      metricThreeLabel: 'Suggested top-up',
      metricThreeValue: '{{suggestedTopUpAmount}}',
      tableTitle: 'Ad accounts requiring recharge',
      ctaText: 'Go to Account Management',
      ctaUrl: '{{accountManagementUrl}}',
      footer: 'This reminder is calculated once per day from BestAds account data. Platform data may have latency.',
      zh: {
        subject: '{{customerName}}，部分广告账户余额预计即将耗尽',
        preheader: '根据近 7 天平均消耗和当前余额，{{riskAccountCount}} 个广告账户预计近期需要充值。',
        title: '广告账户余额预计即将耗尽',
        intro: '您好，{{customerName}}。根据您的广告账户最近 7 天平均消耗和当前余额，以下广告账户预计近期将消耗完毕。为保证广告账户连续投放，建议您尽快进行广告账户充值。如果您已经完成充值，请忽略本次提醒。数据可能存在延迟，请以 BestAds 平台展示的数据为准。',
        metricOneLabel: '风险账户数',
        metricOneValue: '{{riskAccountCount}}',
        metricTwoLabel: '最短预计可用天数',
        metricTwoValue: '{{estimatedDaysLeft}} 天',
        metricThreeLabel: '建议充值金额',
        metricThreeValue: '{{suggestedTopUpAmount}}',
        tableTitle: '建议充值的广告账户',
        ctaText: '前往账户管理',
        ctaUrl: '{{accountManagementUrl}}',
        footer: '本提醒由 BestAds 每日根据账户余额和消耗数据计算生成，平台数据可能存在延迟。'
      }
    },
    wallet_shortfall_event: {
      name: 'Wallet shortfall after recharge request',
      subject: 'Auto recharge paused: wallet balance is insufficient',
      preheader: '{{adAccountName}} requires {{rechargeAmount}}, but your wallet is short by {{walletShortfall}}.',
      title: 'Wallet balance is not enough for auto recharge',
      intro: 'Hi {{customerName}}, {{adAccountName}} triggered an auto recharge task, but the recharge cannot be completed because your wallet balance is insufficient. Please arrange a transfer or wallet top-up as soon as possible so auto recharge can continue to serve your ad accounts.',
      metricOneLabel: 'Wallet balance',
      metricOneValue: '{{walletBalance}}',
      metricTwoLabel: 'Required recharge',
      metricTwoValue: '{{rechargeAmount}}',
      metricThreeLabel: 'Shortfall',
      metricThreeValue: '{{walletShortfall}}',
      tableTitle: 'Recharge demand',
      ctaText: 'Go to Wallet Management',
      ctaUrl: '{{walletManagementUrl}}',
      footer: 'Auto recharge will resume only after your wallet has enough available balance.',
      zh: {
        subject: '自动充值暂停：钱包余额不足',
        preheader: '{{adAccountName}} 需要充值 {{rechargeAmount}}，当前钱包缺口为 {{walletShortfall}}。',
        title: '钱包余额不足，自动充值无法完成',
        intro: '您好，{{customerName}}。广告账户 {{adAccountName}} 已触发自动充值任务，但因钱包余额不足，无法正常充值。请尽快安排打款转账或补足钱包余额，否则自动充值功能无法继续为您的广告账户服务。',
        metricOneLabel: '钱包余额',
        metricOneValue: '{{walletBalance}}',
        metricTwoLabel: '本次需充值',
        metricTwoValue: '{{rechargeAmount}}',
        metricThreeLabel: '钱包缺口',
        metricThreeValue: '{{walletShortfall}}',
        tableTitle: '自动充值需求',
        ctaText: '前往钱包管理',
        ctaUrl: '{{walletManagementUrl}}',
        footer: '钱包可用余额充足后，自动充值才能继续执行。'
      }
    },
    wallet_shortfall_predict: {
      name: 'Wallet shortfall forecast',
      subject: 'Wallet balance may not cover the next 3 days of ad spend',
      preheader: 'Based on the last 7 days of spend, your wallet may be short for upcoming ad account recharge.',
      title: 'Wallet balance may be insufficient for upcoming recharge',
      intro: 'Hi {{customerName}}, based on your overall spend over the last 7 days and the current balances of your ad accounts, BestAds forecasts that your wallet balance may not cover the next 3 days of ad account consumption. Please arrange a transfer or wallet top-up in advance to avoid delayed ad account recharge.',
      metricOneLabel: 'Wallet balance',
      metricOneValue: '{{walletBalance}}',
      metricTwoLabel: 'Last 7 days spend',
      metricTwoValue: '{{last7DaysSpend}}',
      metricThreeLabel: '3-day forecast demand',
      metricThreeValue: '{{forecastDemand}}',
      tableTitle: 'Spend forecast and account balances',
      ctaText: 'Go to Wallet Management',
      ctaUrl: '{{walletManagementUrl}}',
      footer: 'This reminder is calculated once per day from recent spend, account balances and active recharge needs.',
      zh: {
        subject: '钱包余额可能不足以覆盖未来 3 天广告消耗',
        preheader: '根据近 7 天整体消耗，您的钱包余额可能不足以支持后续广告账户充值。',
        title: '钱包余额可能不足以支持后续充值',
        intro: '您好，{{customerName}}。基于您最近 7 天的整体消耗和广告账户余额情况，BestAds 预测当前钱包余额可能不足以支付广告账户未来 3 天的消耗。建议您尽快安排打款转账，保证钱包余额充足，避免广告账户充值不及时影响投放。',
        metricOneLabel: '钱包余额',
        metricOneValue: '{{walletBalance}}',
        metricTwoLabel: '近 7 天消耗',
        metricTwoValue: '{{last7DaysSpend}}',
        metricThreeLabel: '未来 3 天预测需求',
        metricThreeValue: '{{forecastDemand}}',
        tableTitle: '消耗预测与广告账户余额',
        ctaText: '前往钱包管理',
        ctaUrl: '{{walletManagementUrl}}',
        footer: '本提醒由 BestAds 每日根据近期消耗、账户余额和充值需求计算生成。'
      }
    },
    auto_recharge_fail: {
      name: 'Auto recharge failed',
      subject: 'Auto recharge failed for {{adAccountName}}',
      preheader: 'The auto recharge task failed. You can review the recharge record and auto recharge settings.',
      title: 'Auto recharge failed',
      intro: 'Hi {{customerName}}, {{adAccountName}} triggered an auto recharge task, but the task was not completed. Please review the failure detail and check whether the auto recharge settings still match your delivery plan.',
      metricOneLabel: 'Recharge amount',
      metricOneValue: '{{rechargeAmount}}',
      metricTwoLabel: 'Trigger time',
      metricTwoValue: '{{triggerTime}}',
      metricThreeLabel: 'Failure reason',
      metricThreeValue: '{{failureReason}}',
      tableTitle: 'Failure detail',
      ctaText: 'View Recharge Records',
      ctaUrl: '{{rechargeRecordsUrl}}',
      secondaryCtaText: 'Review Auto Recharge Settings',
      secondaryCtaUrl: '{{autoRechargeUrl}}',
      footer: 'BestAds will not make repeated deductions for the same failed recharge record.',
      zh: {
        subject: '{{adAccountName}} 自动充值失败',
        preheader: '自动充值任务未完成，您可以查看充值记录和自动充值设置。',
        title: '自动充值失败',
        intro: '您好，{{customerName}}。广告账户 {{adAccountName}} 已触发自动充值任务，但本次任务未能完成。您可以查看失败详情，并检查自动充值设置是否仍符合当前投放计划。',
        metricOneLabel: '充值金额',
        metricOneValue: '{{rechargeAmount}}',
        metricTwoLabel: '触发时间',
        metricTwoValue: '{{triggerTime}}',
        metricThreeLabel: '失败原因',
        metricThreeValue: '{{failureReason}}',
        tableTitle: '失败明细',
        ctaText: '查看充值记录',
        ctaUrl: '{{rechargeRecordsUrl}}',
        secondaryCtaText: '查看自动充值设置',
        secondaryCtaUrl: '{{autoRechargeUrl}}',
        footer: '同一失败充值记录不会重复扣款。'
      }
    },
    account_recharge_fail: {
      name: 'Manual account recharge failed',
      subject: 'Ad account recharge failed for {{adAccountName}}',
      preheader: 'The recharge request was not completed. Please review the failure reason.',
      title: 'Ad account recharge failed',
      intro: 'Hi {{customerName}}, the recharge request for {{adAccountName}} was not completed. Please review the failure reason in BestAds and decide whether to resubmit the recharge request.',
      metricOneLabel: 'Requested amount',
      metricOneValue: '{{rechargeAmount}}',
      metricTwoLabel: 'Account',
      metricTwoValue: '{{adAccountName}}',
      metricThreeLabel: 'Failure reason',
      metricThreeValue: '{{failureReason}}',
      tableTitle: 'Recharge record',
      ctaText: 'View Recharge Records',
      ctaUrl: '{{rechargeRecordsUrl}}',
      footer: 'Please contact your account manager if the issue persists.',
      zh: {
        subject: '{{adAccountName}} 广告账户充值失败',
        preheader: '本次广告账户充值未完成，请查看失败原因。',
        title: '广告账户充值失败',
        intro: '您好，{{customerName}}。广告账户 {{adAccountName}} 的充值请求未能完成。请在 BestAds 查看失败原因，并根据实际情况决定是否重新提交充值。',
        metricOneLabel: '申请充值金额',
        metricOneValue: '{{rechargeAmount}}',
        metricTwoLabel: '广告账户',
        metricTwoValue: '{{adAccountName}}',
        metricThreeLabel: '失败原因',
        metricThreeValue: '{{failureReason}}',
        tableTitle: '充值记录',
        ctaText: '查看充值记录',
        ctaUrl: '{{rechargeRecordsUrl}}',
        footer: '如果问题持续存在，请联系您的客户经理。'
      }
    },
    wallet_credited: {
      name: 'Wallet credited',
      subject: 'Funds have been added to your BestAds wallet',
      preheader: '{{creditedAmount}} has been added to your wallet.',
      title: 'Wallet top-up credited',
      intro: 'Hi {{customerName}}, your online top-up or offline transfer has been credited to your BestAds wallet. The funds are now available for ad account recharge.',
      metricOneLabel: 'Credited amount',
      metricOneValue: '{{creditedAmount}}',
      metricTwoLabel: 'Wallet balance',
      metricTwoValue: '{{walletBalance}}',
      metricThreeLabel: 'Payment method',
      metricThreeValue: '{{paymentMethod}}',
      tableTitle: 'Wallet transaction',
      ctaText: 'View Wallet',
      ctaUrl: '{{walletManagementUrl}}',
      footer: 'You can use the wallet balance for ad account recharge in BestAds.',
      zh: {
        subject: '您的 BestAds 钱包已到账',
        preheader: '{{creditedAmount}} 已增加到您的钱包余额。',
        title: '钱包充值已到账',
        intro: '您好，{{customerName}}。您的在线充值或线下转账已经到账，并已增加到 BestAds 钱包余额。该金额现在可以用于广告账户充值。',
        metricOneLabel: '到账金额',
        metricOneValue: '{{creditedAmount}}',
        metricTwoLabel: '钱包余额',
        metricTwoValue: '{{walletBalance}}',
        metricThreeLabel: '付款方式',
        metricThreeValue: '{{paymentMethod}}',
        tableTitle: '钱包到账记录',
        ctaText: '查看钱包',
        ctaUrl: '{{walletManagementUrl}}',
        footer: '您可以使用钱包余额进行广告账户充值。'
      }
    },
    clear_reduce_success: {
      name: 'Ad account clear / deduction completed',
      subject: '{{operationType}} completed for {{adAccountName}}',
      preheader: '{{refundedAmount}} has been returned to your BestAds wallet.',
      title: 'Ad account {{operationType}} completed',
      intro: 'Hi {{customerName}}, the {{operationType}} request for {{adAccountName}} has been completed. The corresponding amount has been returned to your BestAds wallet. You can review the record in BestAds.',
      metricOneLabel: 'Operation type',
      metricOneValue: '{{operationType}}',
      metricTwoLabel: 'Amount returned',
      metricTwoValue: '{{refundedAmount}}',
      metricThreeLabel: 'Wallet balance',
      metricThreeValue: '{{walletBalance}}',
      tableTitle: 'Operation record',
      ctaText: 'View Operation Records',
      ctaUrl: '{{operationRecordsUrl}}',
      footer: 'Funds returned to the wallet can be used for ad account recharge.',
      zh: {
        subject: '{{adAccountName}} 广告账户{{operationType}}成功',
        preheader: '{{refundedAmount}} 已退回您的 BestAds 钱包。',
        title: '广告账户{{operationType}}已完成',
        intro: '您好，{{customerName}}。广告账户 {{adAccountName}} 的{{operationType}}已完成，对应金额已退回 BestAds 钱包。您可以在 BestAds 查看操作记录。',
        metricOneLabel: '操作类型',
        metricOneValue: '{{operationType}}',
        metricTwoLabel: '退回钱包金额',
        metricTwoValue: '{{refundedAmount}}',
        metricThreeLabel: '钱包余额',
        metricThreeValue: '{{walletBalance}}',
        tableTitle: '操作记录',
        ctaText: '查看操作记录',
        ctaUrl: '{{operationRecordsUrl}}',
        footer: '退回钱包的金额可用于广告账户充值。'
      }
    }
  };

  const templates = [
    templateRow('TPL-ADS-001', 'account_runway', '启用', '是', '已发布', '欧伟权', '2026-08-13 10:12:08'),
    templateRow('TPL-ADS-002', 'wallet_shortfall_event', '启用', '是', '已发布', '汤秀梅', '2026-08-13 09:42:33'),
    templateRow('TPL-ADS-003', 'wallet_shortfall_predict', '启用', '是', '草稿', '李志伟', '2026-08-12 18:26:41'),
    templateRow('TPL-ADS-004', 'auto_recharge_fail', '启用', '是', '已发布', '欧伟权', '2026-08-12 15:08:49'),
    templateRow('TPL-ADS-005', 'account_recharge_fail', '启用', '是', '已发布', '王荣荣', '2026-08-12 14:53:20'),
    templateRow('TPL-ADS-006', 'wallet_credited', '启用', '是', '已发布', '程允良', '2026-08-13 11:18:32'),
    templateRow('TPL-ADS-007', 'clear_reduce_success', '启用', '是', '已发布', '欧伟权', '2026-08-31 10:20:16')
  ];

  const templateVariables = [
    { token: '{{customerName}}', label: '客户名称' },
    { token: '{{merchantId}}', label: '商户ID' },
    { token: '{{walletBalance}}', label: '钱包余额' },
    { token: '{{adAccountName}}', label: '广告账户' },
    { token: '{{adAccountBalance}}', label: '账户余额', scenes: ['account_runway'] },
    { token: '{{riskAccountCount}}', label: '风险账户数', scenes: ['account_runway'] },
    { token: '{{estimatedDaysLeft}}', label: '预计可用天数', scenes: ['account_runway'] },
    { token: '{{avgDailySpend}}', label: '近7天日均消耗', scenes: ['account_runway', 'wallet_shortfall_predict'] },
    { token: '{{last7DaysSpend}}', label: '近7天消耗', scenes: ['wallet_shortfall_predict'] },
    { token: '{{suggestedTopUpAmount}}', label: '建议打款金额' },
    { token: '{{rechargeAmount}}', label: '充值金额', scenes: ['wallet_shortfall_event', 'auto_recharge_fail', 'account_recharge_fail'] },
    { token: '{{walletShortfall}}', label: '钱包缺口', scenes: ['wallet_shortfall_event'] },
    { token: '{{forecastDemand}}', label: '预测需求', scenes: ['wallet_shortfall_predict'] },
    { token: '{{failureReason}}', label: '失败原因', scenes: ['auto_recharge_fail', 'account_recharge_fail'] },
    { token: '{{triggerTime}}', label: '触发时间', scenes: ['auto_recharge_fail'] },
    { token: '{{rechargeOrderNo}}', label: '充值单号', scenes: ['account_recharge_fail'] },
    { token: '{{creditedAmount}}', label: '到账金额', scenes: ['wallet_credited'] },
    { token: '{{paymentMethod}}', label: '付款方式', scenes: ['wallet_credited'] },
    { token: '{{creditedTime}}', label: '到账时间', scenes: ['wallet_credited'] },
    { token: '{{operationType}}', label: '操作类型', scenes: ['clear_reduce_success'] },
    { token: '{{operationAmount}}', label: '操作金额', scenes: ['clear_reduce_success'] },
    { token: '{{refundedAmount}}', label: '退回钱包金额', scenes: ['clear_reduce_success'] },
    { token: '{{operationOrderNo}}', label: '单据号', scenes: ['clear_reduce_success'] },
    { token: '{{completedTime}}', label: '完成时间', scenes: ['clear_reduce_success'] },
    { token: '{{accountManagementUrl}}', label: '账户管理链接', scenes: ['account_runway'] },
    { token: '{{walletManagementUrl}}', label: '钱包管理链接', scenes: ['wallet_shortfall_event', 'wallet_shortfall_predict', 'wallet_credited'] },
    { token: '{{rechargeRecordsUrl}}', label: '充值记录链接', scenes: ['auto_recharge_fail', 'account_recharge_fail'] },
    { token: '{{autoRechargeUrl}}', label: '自动充值链接', scenes: ['auto_recharge_fail'] },
    { token: '{{operationRecordsUrl}}', label: '操作记录链接', scenes: ['clear_reduce_success'] }
  ];

  const templateSampleValues = {
    customerName: 'Zephyr Commerce',
    merchantId: '14229',
    walletBalance: '$2,864.50',
    adAccountName: 'FB-8921 | Zephyr-US-Main',
    adAccountBalance: '$126.40',
    riskAccountCount: '2',
    estimatedDaysLeft: '2.7',
    avgDailySpend: '$46.80',
    last7DaysSpend: '$7,420.00',
    suggestedTopUpAmount: '$1,500.00',
    rechargeAmount: '$1,000.00',
    walletShortfall: '$713.88',
    forecastDemand: '$3,200.00',
    failureReason: 'Media rejected the recharge request',
    triggerTime: '2026-08-13 10:18:42',
    rechargeOrderNo: 'AO20260813042',
    creditedAmount: '$5,000.00',
    paymentMethod: 'Online top-up',
    creditedTime: '2026-08-13 11:22:08',
    operationType: 'Clear',
    operationAmount: '$126.40',
    refundedAmount: '$126.40',
    operationOrderNo: 'CL20260831018',
    completedTime: '2026-08-31 10:18:42',
    accountManagementUrl: '../../bestads-client-styled/account-management.html',
    walletManagementUrl: '../../bestads-client-styled/wallet.html',
    rechargeRecordsUrl: '../../bestads-client-styled/operation-records.html',
    autoRechargeUrl: '../../bestads-client-styled/auto-recharge-rules.html',
    operationRecordsUrl: '../../bestads-client-styled/operation-records.html'
  };

  const templateSampleValuesByScene = {
    account_runway: {
      riskAccountCount: '3',
      estimatedDaysLeft: '0.2',
      avgDailySpend: '$500.00',
      suggestedTopUpAmount: '$3,363.74'
    },
    wallet_shortfall_event: {
      walletBalance: '$286.12',
      rechargeAmount: '$1,000.00',
      walletShortfall: '$713.88'
    },
    wallet_shortfall_predict: {
      last7DaysSpend: '$10,500.00',
      forecastDemand: '$3,363.74'
    },
    auto_recharge_fail: {
      failureReason: 'Media rejected the recharge request'
    },
    account_recharge_fail: {
      rechargeAmount: '$800.00',
      failureReason: 'Media account recharge rejected'
    },
    wallet_credited: {
      walletBalance: '$7,864.50'
    },
    clear_reduce_success: {
      walletBalance: '$2,990.90'
    }
  };

  const templateSampleValuesBySceneZh = {
    auto_recharge_fail: {
      failureReason: '媒体侧拒绝本次充值'
    },
    account_recharge_fail: {
      failureReason: '媒体账户充值被拒绝'
    },
    wallet_credited: {
      paymentMethod: '在线充值'
    }
  };

  function parseUsd(text) {
    return Number(String(text || '').replace(/[^0-9.-]/g, '')) || 0;
  }

  function formatUsd(amount) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const walletPredictSampleRows = [
    { name: 'FB-8921 | Zephyr-US-Main', balance: '$126.40', spend7d: '$3,500.00', days: '0.3', topup: '$1,373.60' },
    { name: 'FB-9016 | Zephyr-CA-Scale', balance: '$84.12', spend7d: '$2,800.00', days: '0.2', topup: '$1,115.88' },
    { name: 'TT-3318 | Zephyr-SEA', balance: '$205.74', spend7d: '$2,520.00', days: '0.6', topup: '$874.26' }
  ];

  const accountRunwaySampleRows = walletPredictSampleRows.map(row => ({
    name: row.name,
    balance: row.balance,
    avg: formatUsd(parseUsd(row.spend7d) / 7),
    days: row.days,
    topup: row.topup
  }));

  function sampleValuesFor(sceneKey) {
    const values = { ...templateSampleValues, ...(templateSampleValuesByScene[sceneKey] || {}) };
    if (activePreviewLanguage === 'zh') {
      values.operationType = '清零';
      Object.assign(values, templateSampleValuesBySceneZh[sceneKey] || {});
    }
    return values;
  }

  let activePreviewLanguage = 'en';

  const templatePreviewTables = {
    account_runway: {
      headers: ['Ad account', 'Current balance', 'Estimated days left'],
      rows: accountRunwaySampleRows.map(row => [row.name, row.balance, `${row.days} days`])
    },
    wallet_shortfall_event: {
      headers: ['Recharge request', 'Required amount', 'Wallet balance', 'Shortfall'],
      rows: [['Auto recharge R20260813018', '$1,000.00', '$286.12', '$713.88']]
    },
    wallet_shortfall_predict: {
      headers: ['Forecast window', 'Forecast demand', 'Wallet balance', 'Suggested top-up'],
      rows: [['Next 3 days', '$3,363.74', '$2,864.50', '$499.24']]
    },
    auto_recharge_fail: {
      headers: ['Ad account', 'Recharge amount', 'Failure reason'],
      rows: [['FB-8921 | Zephyr-US-Main', '$1,000.00', 'Media rejected the recharge request']]
    },
    account_recharge_fail: {
      headers: ['Ad account', 'Requested amount', 'Failure reason'],
      rows: [['FB-8921 | Zephyr-US-Main', '$800.00', 'Media account recharge rejected']]
    },
    wallet_credited: {
      headers: ['Transaction', 'Credited amount', 'Wallet balance'],
      rows: [['Online top-up W20260813009', '$5,000.00', '$7,864.50']]
    },
    clear_reduce_success: {
      headers: ['Order', 'Ad account', 'Operation', 'Amount returned'],
      rows: [['CL20260831018', 'FB-8921 | Zephyr-US-Main', 'Clear', '$126.40']]
    }
  };

  let activeTemplateField = null;

  const logs = [
    { time: '2026-08-11 10:58:31', scene: '续航不足', merchant: '14229', customer: 'Zephyr Commerce', recipient: 'm***@zephyr.com', status: '受理成功', reason: '-', messageId: 'M01-20260811105831-882101', template: 'TPL-ADS-001', operator: 'system' },
    { time: '2026-08-11 10:47:09', scene: '钱包不足·事件', merchant: '13185', customer: 'Umair-Simos', recipient: 'f***@umair.co', status: '受理成功', reason: '-', messageId: 'M01-20260811104709-110912', template: 'TPL-ADS-002', operator: 'system' },
    { time: '2026-08-11 10:35:18', scene: '钱包到账', merchant: '1128', customer: 'adstest', recipient: 'a***@test.com', status: '受理失败', reason: 'Sender domain daily limit', messageId: '-', template: 'TPL-ADS-006', operator: 'system' },
    { time: '2026-08-11 09:21:46', scene: '账户充失败', merchant: '14606', customer: 'BestAds接口测试', recipient: 'b***@merchant.com', status: '已抑制', reason: '无可用通知邮箱', messageId: '-', template: 'TPL-ADS-005', operator: 'system' },
    { time: '2026-08-10 22:12:07', scene: '自动充失败', merchant: '13249', customer: '产品验收0112', recipient: 'p***@shop.com', status: '受理成功', reason: '-', messageId: 'M01-20260810221207-770923', template: 'TPL-ADS-004', operator: 'system' },
    { time: '2026-08-10 18:02:54', scene: '钱包不足·预测', merchant: '12816', customer: 'Tobias', recipient: 't***@brand.com', status: '已抑制', reason: '钱包不足·预测已关闭', messageId: '-', template: 'TPL-ADS-003', operator: 'system' },
    { time: '2026-08-31 10:18:42', scene: '清零/减款成功', merchant: '14229', customer: 'Zephyr Commerce', recipient: 'm***@zephyr.com', status: '受理成功', reason: '-', messageId: 'M01-20260831101842-441208', template: 'TPL-ADS-007', operator: 'system' }
  ];

  const merchants = [
    { merchant: '14229', customer: 'Zephyr Commerce', weight: 1.28 },
    { merchant: '13185', customer: 'Umair-Simos', weight: 0.92 },
    { merchant: '1128', customer: 'adstest', weight: 0.76 },
    { merchant: '14606', customer: 'BestAds接口测试', weight: 0.68 },
    { merchant: '13249', customer: '产品验收0112', weight: 0.54 },
    { merchant: '12816', customer: 'Tobias', weight: 0.48 },
    { merchant: '12013', customer: 'WFRS Brand', weight: 0.42 },
    { merchant: '16201', customer: 'MX-F Shop', weight: 0.36 }
  ];

  const usageDaily = buildUsageDaily();

  const usageState = {
    tab: 'overview',
    startDate: '2026-08-05',
    endDate: '2026-08-11',
    selectedScenes: new Set(scenarios.map(item => item.key)),
    merchantId: '',
    customerName: ''
  };

  function statusTag(value) {
    const cls = /启用|成功|已充值|已入账|已发布/.test(value) ? 'status-success'
      : /失败|停用|关闭/.test(value) ? 'status-danger'
        : /抑制|待|观察|草稿/.test(value) ? 'status-warning'
          : 'status-info';
    return `<span class="status-tag ${cls}">${esc(value)}</span>`;
  }

  function templateRow(id, sceneKey, status, current, publishStatus, updatedBy, updatedAt) {
    const scene = scenarios.find(item => item.key === sceneKey);
    const content = templateDefaults[sceneKey];
    return {
      id,
      sceneKey,
      scenario: scene?.name || sceneKey,
      category: scene?.category || '-',
      name: content.name,
      subject: content.subject,
      source: 'Ads 自定义 HTML',
      status,
      current,
      publishStatus,
      updatedBy,
      updatedAt,
      content
    };
  }

  function buildUsageDaily() {
    const days = [];
    const start = new Date('2026-07-20T00:00:00');
    const end = new Date('2026-08-11T00:00:00');
    const base = {
      account_runway: 6,
      wallet_shortfall_event: 3,
      wallet_shortfall_predict: 4,
      auto_recharge_fail: 2,
      account_recharge_fail: 1,
      wallet_credited: 6,
      clear_reduce_success: 2
    };
    for (let date = new Date(start), index = 0; date <= end; date.setDate(date.getDate() + 1), index += 1) {
      const iso = date.toISOString().slice(0, 10);
      merchants.forEach((merchant, merchantIndex) => {
        scenarios.forEach((scenario, scenarioIndex) => {
          const weekdayLift = date.getDay() === 1 || date.getDay() === 2 ? 2 : 0;
          const raw = (base[scenario.key] + Math.floor(index / 3) + weekdayLift + ((merchantIndex + scenarioIndex + index) % 3)) * merchant.weight;
          const requests = Math.max(0, Math.round(raw));
          if (!requests) return;
          const failed = Math.max(0, Math.floor(requests * (scenario.key === 'wallet_credited' ? 0.04 : 0.03)) + ((index + scenarioIndex) % 9 === 0 ? 1 : 0));
          const suppressed = Math.max(0, Math.floor(requests * (scenario.key.includes('shortfall') ? 0.16 : 0.09)));
          const accepted = Math.max(0, requests - failed);
          const recipients = Math.max(1, Math.round(accepted * (1.22 + merchantIndex * 0.03)));
          days.push({ date: iso, merchant: merchant.merchant, customer: merchant.customer, sceneKey: scenario.key, scene: scenario.name, requests, accepted, failed, suppressed, recipients });
        });
      });
    }
    return days;
  }

  function selectedScenarioKeys() {
    return scenarios.filter(item => usageState.selectedScenes.has(item.key)).map(item => item.key);
  }

  function filteredUsageRecords() {
    const keys = new Set(selectedScenarioKeys());
    return usageDaily.filter(item => item.date >= usageState.startDate
      && item.date <= usageState.endDate
      && keys.has(item.sceneKey)
      && (!usageState.merchantId || item.merchant.includes(usageState.merchantId))
      && (!usageState.customerName || item.customer.toLowerCase().includes(usageState.customerName.toLowerCase())));
  }

  function blankUsageRow(scenario) {
    return { key: scenario.key, scene: scenario.name, requests: 0, accepted: 0, failed: 0, suppressed: 0, recipients: 0 };
  }

  function addUsage(target, source) {
    target.requests += source.requests;
    target.accepted += source.accepted;
    target.failed += source.failed;
    target.suppressed += source.suppressed;
    target.recipients += source.recipients;
    return target;
  }

  function usageByScene(records) {
    const byKey = new Map(scenarios.map(item => [item.key, blankUsageRow(item)]));
    records.forEach(item => addUsage(byKey.get(item.sceneKey), item));
    return scenarios.filter(item => usageState.selectedScenes.has(item.key)).map(item => byKey.get(item.key)).filter(item => item.requests > 0);
  }

  function usageTotals(rows) {
    return rows.reduce((acc, item) => addUsage(acc, item), { requests: 0, accepted: 0, failed: 0, suppressed: 0, recipients: 0 });
  }

  function trendRows(records) {
    const byDate = new Map();
    records.forEach(item => {
      if (!byDate.has(item.date)) byDate.set(item.date, { date: item.date, total: 0 });
      const row = byDate.get(item.date);
      row.total += item.requests;
      row[item.sceneKey] = (row[item.sceneKey] || 0) + item.requests;
    });
    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  function merchantRows(records) {
    const byMerchant = new Map();
    records.forEach(item => {
      if (!byMerchant.has(item.merchant)) {
        byMerchant.set(item.merchant, { merchant: item.merchant, customer: item.customer, sceneTotals: {}, requests: 0, accepted: 0, failed: 0, suppressed: 0, recipients: 0 });
      }
      const row = byMerchant.get(item.merchant);
      addUsage(row, item);
      row.sceneTotals[item.scene] = (row.sceneTotals[item.scene] || 0) + item.requests;
    });
    return Array.from(byMerchant.values()).map(item => {
      const topScene = Object.entries(item.sceneTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
      return { ...item, topScene };
    }).sort((a, b) => b.requests - a.requests);
  }

  function formatDateLabel(value) {
    return value.slice(5);
  }

  function pageHeader(title, subtitle, actions = '') {
    void title;
    void subtitle;
    void actions;
    return '<section class="admin-page">';
  }

  function filters(fields, scope = '') {
    return `<div class="admin-card filter-card email-filter-card" data-filter-scope="${esc(scope)}"><div class="admin-card__body"><div class="filter-grid cols-5">${fields.map(field => `<div class="filter-field ${field.type === 'multi' ? 'filter-field--multi' : ''}"><label>${esc(field.label)}</label>${fieldControl(field)}</div>`).join('')}<div class="filter-actions"><button class="btn btn-primary" type="button" data-action="${scope ? `${scope}-search` : 'search'}"><i class="fas fa-search"></i>查询</button><button class="btn btn-default" type="button" data-action="${scope ? `${scope}-reset` : 'reset'}">重置</button></div></div></div></div>`;
  }

  function fieldControl(field) {
    if (field.type === 'select') {
      return `<select><option>全部</option>${(field.options || []).map(item => `<option>${esc(item)}</option>`).join('')}</select>`;
    }
    if (field.type === 'multi') {
      const selectedKeys = field.selectedKeys || scenarios.map(item => item.key);
      const selectedLabel = selectedKeys.length === scenarios.length ? '全部' : scenarios.filter(item => selectedKeys.includes(item.key)).map(item => item.name).join('、');
      return `<button class="multi-select-trigger" type="button" data-action="toggle-scene-menu"><span>${esc(selectedLabel || '未选择')}</span><i class="fas fa-chevron-down"></i></button><div class="multi-select-menu">${scenarios.map(item => `<label class="multi-select-option"><input type="checkbox" data-scene-filter="${esc(item.key)}"${selectedKeys.includes(item.key) ? ' checked' : ''}><span>${esc(item.name)}</span></label>`).join('')}</div>`;
    }
    if (field.type === 'daterange') {
      return `<div class="email-date-range"><input type="date" data-range-start="${esc(field.key || '')}" value="${esc(field.startValue || '')}" placeholder="${esc(field.start || '开始日期')}"><span>至</span><input type="date" data-range-end="${esc(field.key || '')}" value="${esc(field.endValue || '')}" placeholder="${esc(field.end || '结束日期')}"></div>`;
    }
    return `<input ${field.key ? `data-filter="${esc(field.key)}"` : ''} value="${esc(field.value || '')}" placeholder="${esc(field.placeholder || '')}">`;
  }

  function table(headers, rows, minWidth = 1200, extraClass = '', headerActions = '') {
    const header = headerActions ? `<div class="admin-card__header"><div class="command-bar command-bar--split"><div></div><div class="command-group command-group--secondary">${headerActions}</div></div></div>` : '';
    const rowCount = (rows.match(/<tr/g) || []).length;
    return `<div class="admin-card list-card ${extraClass}">${header}<div class="table-scroll"><table class="admin-table" style="min-width:${minWidth}px"><thead><tr>${headers.map(h => `<th class="${h.left ? 'left' : ''} ${h.num ? 'num' : ''}">${esc(h.label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="pagination"><span>共 ${rowCount} 条，20 条/页</span><div class="pagination__actions"><button class="page-number is-active">1</button><button class="page-number">2</button><button class="page-number"><i class="fas fa-chevron-right"></i></button></div></div></div>`;
  }

  function exportButton(action) {
    return `<button class="btn btn-primary" type="button" data-action="${esc(action)}"><i class="fas fa-download"></i>导出数据</button>`;
  }

  function renderTemplates() {
    const rows = templates.map(item => `<tr><td>${esc(item.id)}</td><td class="left">${esc(item.scenario)}</td><td class="left"><span class="template-list-title">${esc(item.name)}</span><span class="template-list-sub">${esc(renderSampleText(item.subject, item.sceneKey))}</span></td><td>${statusTag(item.publishStatus)}</td><td>${esc(item.updatedBy)}</td><td>${esc(item.updatedAt)}</td><td class="ops"><div class="command-group"><button class="btn btn-link" data-action="preview-template" data-id="${esc(item.id)}">预览</button><button class="btn btn-link" data-action="edit-template" data-id="${esc(item.id)}">编辑</button><button class="btn btn-link" data-action="test-template" data-id="${esc(item.id)}">测试发送</button></div></td></tr>`).join('');
    root.innerHTML = pageHeader('提醒邮件模板', '维护 Ads 自定义 HTML 事务邮件模板，业务通过结构化模块配置，发送时由 Ads 渲染 HTML 后调用 Bestreach。')
      + filters([{ label: '场景', type: 'select', options: scenarios.map(s => s.name) }, { label: '模板编码', placeholder: '输入模板编码' }, { label: '发布状态', type: 'select', options: ['草稿', '已发布'] }], 'template')
      + table([{ label: '模板编码' }, { label: '场景', left: true }, { label: '模板名称 / 主题', left: true }, { label: '发布状态' }, { label: '更新人' }, { label: '更新时间' }, { label: '操作', left: true }], rows, 1240, 'email-template-table')
      + '</section>' + modalHtml();
  }

  function findTemplate(id) {
    return templates.find(item => item.id === id) || templates[0];
  }

  function allowedVariables(sceneKey) {
    return templateVariables.filter(item => !item.scenes || item.scenes.includes(sceneKey));
  }

  function renderSampleText(text, sceneKey) {
    const values = sampleValuesFor(sceneKey);
    return String(text || '').replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => values[key] || `{{${key}}}`);
  }

  function previewLanguageButtons() {
    return previewLanguages.map(item => `<button class="${item.key === activePreviewLanguage ? 'is-active' : ''}" type="button" data-preview-language="${esc(item.key)}">${esc(item.label)}</button>`).join('');
  }

  function templatePreviewStandalone(template) {
    return `<div class="template-preview-standalone" data-template-preview-wrapper data-template-id="${esc(template.id)}">
      <div class="template-preview-toolbar template-preview-toolbar--standalone">
        <div class="template-preview-tabs">
          ${previewLanguageButtons()}
        </div>
      </div>
      <div class="template-preview-frame" data-preview-frame data-preview-mode="preview">
        ${renderEmailPreview(readTemplateDraftFromContent(template.sceneKey, template.content))}
      </div>
    </div>`;
  }

  function templateModalBody(template = templates[0], mode = 'edit') {
    const content = template.content;
    return `<div class="template-editor-shell" data-template-editor>
      <div class="template-editor-main">
        <section class="template-editor-section">
          <div class="template-editor-section__head"><h4>基础信息</h4><span>Ads 渲染 HTML</span></div>
          <div class="form-grid template-editor-grid">
            <div class="form-field">
              <label>通知场景</label>
              <input data-template-display="sceneName" value="${esc(template.scenario)}" disabled>
              <input type="hidden" data-template-input="sceneKey" value="${esc(template.sceneKey)}">
            </div>
            <div class="form-field">
              <label>模板来源</label>
              <input data-template-display="source" value="Ads 自定义 HTML" disabled>
            </div>
            <div class="form-field">
              <label>模板名称</label>
              <input data-template-input="name" value="${esc(content.name)}">
            </div>
            <div class="form-field">
              <label>发布状态</label>
              <input data-template-display="publishStatus" value="${esc(template.publishStatus)}" disabled>
            </div>
            <div class="form-field full">
              <label>邮件主题</label>
              <input data-template-input="subject" value="${esc(content.subject)}">
            </div>
            <div class="form-field full">
              <label>预览摘要</label>
              <input data-template-input="preheader" value="${esc(content.preheader)}">
            </div>
          </div>
        </section>
        <section class="template-editor-section template-variable-section">
          <div class="template-editor-section__head"><h4>可用变量</h4><span>点击变量插入到当前字段</span></div>
          <div class="template-variable-list" data-variable-list>${variableButtons(template.sceneKey)}</div>
        </section>
        <section class="template-editor-section">
          <div class="template-editor-section__head"><h4>内容模块</h4><span>固定骨架 + 可编辑文案</span></div>
          <div class="form-grid template-editor-grid">
            <div class="form-field full">
              <label>标题</label>
              <input data-template-input="title" value="${esc(content.title)}">
            </div>
            <div class="form-field full">
              <label>正文说明</label>
              <textarea data-template-input="intro" rows="4">${esc(content.intro)}</textarea>
            </div>
            <div class="form-field">
              <label>指标 1 名称</label>
              <input data-template-input="metricOneLabel" value="${esc(content.metricOneLabel)}">
            </div>
            <div class="form-field">
              <label>指标 1 内容</label>
              <input data-template-input="metricOneValue" value="${esc(content.metricOneValue)}">
            </div>
            <div class="form-field">
              <label>指标 2 名称</label>
              <input data-template-input="metricTwoLabel" value="${esc(content.metricTwoLabel)}">
            </div>
            <div class="form-field">
              <label>指标 2 内容</label>
              <input data-template-input="metricTwoValue" value="${esc(content.metricTwoValue)}">
            </div>
            <div class="form-field">
              <label>指标 3 名称</label>
              <input data-template-input="metricThreeLabel" value="${esc(content.metricThreeLabel)}">
            </div>
            <div class="form-field">
              <label>指标 3 内容</label>
              <input data-template-input="metricThreeValue" value="${esc(content.metricThreeValue)}">
            </div>
            <div class="form-field">
              <label>明细表格标题</label>
              <input data-template-input="tableTitle" value="${esc(content.tableTitle)}">
            </div>
            <div class="form-field">
              <label>按钮文案</label>
              <input data-template-input="ctaText" value="${esc(content.ctaText)}">
            </div>
            <div class="form-field full">
              <label>页脚说明</label>
              <textarea data-template-input="footer" rows="3">${esc(content.footer)}</textarea>
            </div>
          </div>
        </section>
      </div>
      <aside class="template-preview-pane">
        <div class="template-preview-toolbar">
          <div class="template-preview-toolbar-main">
            <div class="template-preview-tabs">
              <button class="is-active" type="button" data-preview-width="desktop">桌面</button>
              <button type="button" data-preview-width="mobile">移动</button>
            </div>
            <div class="template-preview-tabs">
              ${previewLanguageButtons()}
            </div>
          </div>
          <div class="template-preview-tools">
            <button class="btn btn-default" type="button" data-action="refresh-template-preview"><i class="fas fa-rotate"></i>刷新预览</button>
          </div>
        </div>
        <div class="template-preview-frame" data-preview-frame data-preview-mode="${esc(mode)}">
          ${renderEmailPreview(readTemplateDraftFromContent(template.sceneKey, content), mode)}
        </div>
      </aside>
    </div>`;
  }

  function variableButtons(sceneKey) {
    return allowedVariables(sceneKey).map(item => `<button type="button" data-template-variable="${esc(item.token)}"><span>${esc(item.label)}</span><code>${esc(item.token)}</code></button>`).join('');
  }

  function readTemplateDraftFromContent(sceneKey, content) {
    return { ...(templateDefaults[sceneKey] || {}), ...content, sceneKey };
  }

  function readTemplateDraft() {
    const editor = document.querySelector('[data-template-editor]');
    if (!editor) return readTemplateDraftFromContent(templates[0].sceneKey, templates[0].content);
    const draft = {};
    editor.querySelectorAll('[data-template-input]').forEach(input => {
      draft[input.dataset.templateInput] = input.value;
    });
    if (!draft.sceneKey) draft.sceneKey = templates[0].sceneKey;
    return { ...(templateDefaults[draft.sceneKey] || {}), ...draft };
  }

  function refreshVariableButtons() {
    const sceneKey = document.querySelector('[data-template-input="sceneKey"]')?.value || templates[0].sceneKey;
    const list = document.querySelector('[data-variable-list]');
    if (list) list.innerHTML = variableButtons(sceneKey);
  }

  function applySceneDefaults(sceneKey) {
    const content = templateDefaults[sceneKey];
    if (!content) return;
    Object.entries(content).forEach(([key, value]) => {
      const input = document.querySelector(`[data-template-input="${key}"]`);
      if (input) input.value = value;
    });
  }

  function refreshTemplatePreview() {
    const frame = document.querySelector('[data-preview-frame]');
    if (!frame) return;
    const editor = document.querySelector('[data-template-editor]');
    const wrapper = document.querySelector('[data-template-preview-wrapper]');
    const template = wrapper?.dataset.templateId ? findTemplate(wrapper.dataset.templateId) : null;
    const draft = editor ? readTemplateDraft() : readTemplateDraftFromContent(template?.sceneKey || templates[0].sceneKey, template?.content || templates[0].content);
    frame.innerHTML = renderEmailPreview(draft, frame.dataset.previewMode || (editor ? 'edit' : 'preview'));
  }

  function renderEmailPreview(draft, mode = 'preview') {
    const content = previewContent(draft);
    const tableData = previewTableFor(content.sceneKey, activePreviewLanguage);
    const tableHeaders = tableData.headers.map(item => `<th>${esc(item)}</th>`).join('');
    const tableRows = tableData.rows.map(row => `<tr>${row.map(item => `<td>${esc(item)}</td>`).join('')}</tr>`).join('');
    const actions = [
      { text: content.ctaText, url: content.ctaUrl },
      content.secondaryCtaText ? { text: content.secondaryCtaText, url: content.secondaryCtaUrl } : null
    ].filter(Boolean);
    return `<article class="email-rendered ${mode === 'edit' ? 'email-rendered--edit' : ''}">
      <div class="email-rendered__preheader">${esc(renderSampleText(content.preheader || '', content.sceneKey))}</div>
      <header class="email-rendered__brand">
        <div class="email-rendered__logo">B</div>
        <div><strong>BestAds</strong><span>${activePreviewLanguage === 'zh' ? '账户通知' : 'Account Notification'}</span></div>
      </header>
      <main class="email-rendered__body">
        <p class="email-rendered__subject">${esc(renderSampleText(content.subject || '', content.sceneKey))}</p>
        <h1>${esc(renderSampleText(content.title || '', content.sceneKey))}</h1>
        <p class="email-rendered__intro">${esc(renderSampleText(content.intro || '', content.sceneKey))}</p>
        <div class="email-rendered__metrics">
          ${emailMetric(content.metricOneLabel, content.metricOneValue, content.sceneKey)}
          ${emailMetric(content.metricTwoLabel, content.metricTwoValue, content.sceneKey)}
          ${emailMetric(content.metricThreeLabel, content.metricThreeValue, content.sceneKey)}
        </div>
        <section class="email-rendered__table">
          <h2>${esc(renderSampleText(content.tableTitle || (activePreviewLanguage === 'zh' ? '明细' : 'Detail'), content.sceneKey))}</h2>
          <table><thead><tr>${tableHeaders}</tr></thead><tbody>${tableRows}</tbody></table>
        </section>
        <div class="email-rendered__actions">
          ${actions.map((item, index) => `<a class="email-rendered__cta ${index > 0 ? 'email-rendered__cta--secondary' : ''}" href="${esc(renderSampleText(item.url || '#', content.sceneKey))}">${esc(renderSampleText(item.text || (activePreviewLanguage === 'zh' ? '打开 BestAds' : 'Open BestAds'), content.sceneKey))}</a>`).join('')}
        </div>
      </main>
      <footer class="email-rendered__footer">${esc(renderSampleText(content.footer || '', content.sceneKey))}</footer>
    </article>`;
  }

  function previewContent(draft) {
    const base = { ...(templateDefaults[draft.sceneKey] || {}), ...draft };
    if (activePreviewLanguage !== 'zh') return base;
    return { ...base, ...(templateDefaults[draft.sceneKey]?.zh || {}), sceneKey: draft.sceneKey };
  }

  function emailMetric(label, value, sceneKey) {
    return `<div><span>${esc(renderSampleText(label || '-', sceneKey))}</span><b>${esc(renderSampleText(value || '-', sceneKey))}</b></div>`;
  }

  function previewTableFor(sceneKey, language = 'en') {
    const values = sampleValuesFor(sceneKey);
    if (language === 'zh') {
      const zhDefaults = {
        account_runway: {
          headers: ['广告账户', '当前余额', '近7天日均消耗', '预计可用天数', '建议充值金额'],
          rows: accountRunwaySampleRows.map(row => [row.name, row.balance, row.avg, `${row.days} 天`, row.topup])
        },
        wallet_shortfall_event: {
          headers: ['自动充值任务', '广告账户', '需充值金额', '钱包余额', '钱包缺口', '触发时间'],
          rows: [['Auto recharge R20260813018', values.adAccountName, values.rechargeAmount, values.walletBalance, values.walletShortfall, values.triggerTime]]
        },
        wallet_shortfall_predict: {
          headers: ['广告账户', '当前余额', '近7天消耗', '预计可用天数', '未来3天建议充值'],
          rows: walletPredictSampleRows.map(row => [row.name, row.balance, row.spend7d, `${row.days} 天`, row.topup])
        },
        auto_recharge_fail: {
          headers: ['广告账户', '充值金额', '触发时间', '失败原因'],
          rows: [[values.adAccountName, values.rechargeAmount, values.triggerTime, values.failureReason]]
        },
        account_recharge_fail: {
          headers: ['充值单号', '广告账户', '申请充值金额', '失败原因'],
          rows: [[values.rechargeOrderNo, values.adAccountName, values.rechargeAmount, values.failureReason]]
        },
        wallet_credited: {
          headers: ['到账类型', '到账金额', '到账时间', '钱包余额'],
          rows: [[values.paymentMethod, values.creditedAmount, values.creditedTime, values.walletBalance]]
        },
        clear_reduce_success: {
          headers: ['单据号', '广告账户', '操作类型', '操作金额', '退回钱包金额', '完成时间'],
          rows: [[values.operationOrderNo, values.adAccountName, '清零', values.operationAmount, values.refundedAmount, values.completedTime]]
        }
      };
      return zhDefaults[sceneKey] || zhDefaults.account_runway;
    }
    const defaults = {
      account_runway: {
        headers: ['Ad account', 'Current balance', '7-day avg daily spend', 'Estimated days left', 'Suggested top-up'],
        rows: accountRunwaySampleRows.map(row => [row.name, row.balance, row.avg, `${row.days} days`, row.topup])
      },
      wallet_shortfall_event: {
        headers: ['Auto recharge task', 'Ad account', 'Required recharge', 'Wallet balance', 'Shortfall', 'Trigger time'],
        rows: [['Auto recharge R20260813018', values.adAccountName, values.rechargeAmount, values.walletBalance, values.walletShortfall, values.triggerTime]]
      },
      wallet_shortfall_predict: {
        headers: ['Ad account', 'Current balance', 'Last 7 days spend', 'Estimated days left', 'Suggested 3-day top-up'],
        rows: walletPredictSampleRows.map(row => [row.name, row.balance, row.spend7d, `${row.days} days`, row.topup])
      },
      auto_recharge_fail: {
        headers: ['Ad account', 'Recharge amount', 'Trigger time', 'Failure reason'],
        rows: [[values.adAccountName, values.rechargeAmount, values.triggerTime, values.failureReason]]
      },
      account_recharge_fail: {
        headers: ['Recharge order', 'Ad account', 'Requested amount', 'Failure reason'],
        rows: [[values.rechargeOrderNo, values.adAccountName, values.rechargeAmount, values.failureReason]]
      },
      wallet_credited: {
        headers: ['Payment method', 'Credited amount', 'Credited time', 'Wallet balance'],
        rows: [[values.paymentMethod, values.creditedAmount, values.creditedTime, values.walletBalance]]
      },
      clear_reduce_success: {
        headers: ['Order', 'Ad account', 'Operation type', 'Requested amount', 'Amount returned', 'Completed at'],
        rows: [[values.operationOrderNo, values.adAccountName, values.operationType, values.operationAmount, values.refundedAmount, values.completedTime]]
      }
    };
    return defaults[sceneKey] || templatePreviewTables[sceneKey] || defaults.account_runway;
  }

  function insertTemplateVariable(token) {
    const field = activeTemplateField || document.querySelector('[data-template-input="intro"]');
    if (!field) return;
    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? field.value.length;
    field.value = `${field.value.slice(0, start)}${token}${field.value.slice(end)}`;
    const cursor = start + token.length;
    field.focus();
    if (field.setSelectionRange) field.setSelectionRange(cursor, cursor);
    refreshTemplatePreview();
  }

  function testSendBody(template) {
    return `<div class="form-grid">
      <div class="form-field full"><label>测试收件邮箱</label><input value="product-review@bestfulfill.com"></div>
      <div class="form-field full"><label>测试模板</label><input value="${esc(template.id)} / ${esc(template.name)}" disabled></div>
      <div class="form-field full"><label>样例变量</label><textarea rows="8">${esc(JSON.stringify(sampleValuesFor(template.sceneKey), null, 2))}</textarea></div>
    </div>`;
  }


  function renderLogs() {
    const rows = logs.map(item => `<tr><td>${esc(item.time)}</td><td>${esc(item.scene)}</td><td>${esc(item.merchant)}</td><td class="left">${esc(item.customer)}</td><td>${esc(item.recipient)}</td><td>${statusTag(item.status)}</td><td class="left"><span class="wrap">${esc(item.reason)}</span></td><td>${esc(item.messageId)}</td><td>${esc(item.template)}</td><td>${esc(item.operator)}</td><td class="ops"><button class="btn btn-link" data-action="view-log">详情</button></td></tr>`).join('');
    root.innerHTML = pageHeader('邮件发送日志', '查询系统判定、抑制和 Bestreach 受理结果。')
      + filters([{ key: 'logDate', label: '发送时间', type: 'daterange', start: '开始日期', end: '结束日期' }, { label: '场景', type: 'multi', selectedKeys: scenarios.map(item => item.key) }, { label: '商户 ID', placeholder: '输入商户 ID' }, { label: '客户名称', placeholder: '输入客户名称' }, { label: '状态', type: 'select', options: ['受理成功', '受理失败', '已抑制'] }], 'log')
      + table([{ label: '时间' }, { label: '场景' }, { label: '商户ID' }, { label: '客户名称', left: true }, { label: '收件人' }, { label: '状态' }, { label: '原因', left: true }, { label: 'messageId' }, { label: '模板' }, { label: '触发方' }, { label: '操作', left: true }], rows, 1680, '', exportButton('export-log'))
      + '</section>' + modalHtml();
  }

  function metricCard(label, value, sub) {
    return `<div class="email-metric"><span>${esc(label)}</span><b>${esc(value)}</b><em>${esc(sub)}</em></div>`;
  }

  function renderUsage() {
    const records = filteredUsageRecords();
    const sceneRows = usageByScene(records);
    const total = usageTotals(sceneRows);
    const merchantData = merchantRows(records);
    const trendData = trendRows(records);
    const rows = sceneRows.map(item => usageRow(item)).join('');
    const merchantTableRows = merchantData.map(item => {
      const acceptRate = `${Math.round(item.accepted / item.requests * 100)}%`;
      return `<tr><td>${esc(item.merchant)}</td><td class="left">${esc(item.customer)}</td><td>${esc(item.topScene)}</td><td>${item.requests}</td><td>${item.accepted}</td><td>${item.failed}</td><td>${item.suppressed}</td><td>${item.recipients}</td><td>${acceptRate}</td></tr>`;
    }).join('');
    const tabHtml = `<div class="business-tabs email-usage-tabs" role="tablist"><button class="business-tab ${usageState.tab === 'overview' ? 'is-active' : ''}" type="button" data-usage-tab="overview">业务整体</button><button class="business-tab ${usageState.tab === 'merchant' ? 'is-active' : ''}" type="button" data-usage-tab="merchant">商户维度</button></div>`;
    const overviewHtml = `<div class="email-metric-grid">${metricCard('请求数', total.requests.toLocaleString(), '按发送任务计数')}${metricCard('受理成功', total.accepted.toLocaleString(), 'Bestreach MAIL_RECEIVED')}${metricCard('受理失败', total.failed.toLocaleString(), 'Bestreach 未受理')}${metricCard('抑制数', total.suppressed.toLocaleString(), '无邮箱或开关关闭')}</div>`
      + `<div class="email-chart-grid">${pieChart(sceneRows, total)}${trendChart(trendData)}</div>`
      + table([{ label: '场景', left: true }, { label: '请求数' }, { label: '受理成功' }, { label: '受理失败' }, { label: '抑制数' }, { label: '收件人数' }, { label: '受理率' }], rows, 1080, 'email-usage-table', exportButton('export-usage'));
    const merchantTotal = usageTotals(merchantData);
    const merchantHtml = `<div class="email-metric-grid">${metricCard('覆盖商户', merchantData.length, '当前筛选范围')}${metricCard('商户请求数', merchantTotal.requests.toLocaleString(), '按商户聚合')}${metricCard('收件人数', merchantTotal.recipients.toLocaleString(), '按邮箱计数')}${metricCard('抑制数', merchantTotal.suppressed.toLocaleString(), '无邮箱或开关关闭')}</div>`
      + `<div class="admin-card"><div class="admin-card__header"><h2 class="admin-card__title">商户用量 Top 8</h2></div><div class="admin-card__body"><div class="email-merchant-bars">${merchantData.map(item => `<div data-tooltip="${esc(`${item.customer}：${item.requests} 次请求，${item.recipients} 个收件人`)}"><span>${esc(item.customer)}</span><i><b style="width:${Math.max(8, item.requests / Math.max(1, merchantData[0]?.requests || 1) * 100)}%"></b></i><em>${item.requests}</em></div>`).join('')}</div></div></div>`
      + table([{ label: '商户ID' }, { label: '客户名称', left: true }, { label: '最高频场景' }, { label: '请求数' }, { label: '受理成功' }, { label: '受理失败' }, { label: '抑制数' }, { label: '收件人数' }, { label: '受理率' }], merchantTableRows, 1240, 'email-usage-table', exportButton('export-usage'));
    root.innerHTML = pageHeader('邮件发送用量统计', '一期只展示 BestAds 自有请求、受理、失败和抑制；送达率、打开率等待 EDM 回执。')
      + tabHtml
      + filters([{ key: 'usageDate', label: '统计日期', type: 'daterange', start: '开始日期', end: '结束日期', startValue: usageState.startDate, endValue: usageState.endDate }, { label: '场景', type: 'multi', selectedKeys: selectedScenarioKeys() }, ...(usageState.tab === 'merchant' ? [{ key: 'merchantId', label: '商户 ID', value: usageState.merchantId, placeholder: '输入商户 ID' }, { key: 'customerName', label: '客户名称', value: usageState.customerName, placeholder: '输入客户名称' }] : [])], 'usage')
      + (usageState.tab === 'overview' ? overviewHtml : merchantHtml)
      + '</section>';
  }

  function usageRow(item) {
    const acceptRate = `${Math.round(item.accepted / item.requests * 100)}%`;
    return `<tr><td class="left">${esc(item.scene)}</td><td>${item.requests}</td><td>${item.accepted}</td><td>${item.failed}</td><td>${item.suppressed}</td><td>${item.recipients}</td><td>${acceptRate}</td></tr>`;
  }

  function pieChart(rows, total) {
    const byKey = new Map(rows.map(item => [item.key, item]));
    let cursor = 0;
    const slices = rows.map(item => {
      const startAngle = cursor;
      const sweep = total.requests ? item.requests / total.requests * 360 : 0;
      cursor += sweep;
      return pieSlice(item, startAngle, cursor, total.requests);
    }).join('') || '<circle class="email-pie-empty" cx="100" cy="100" r="82"></circle>';
    const legend = scenarios.map(scenario => {
      const item = byKey.get(scenario.key) || blankUsageRow(scenario);
      const active = usageState.selectedScenes.has(scenario.key);
      return `<button class="email-pie-legend-item ${active ? 'is-active' : 'is-muted'}" type="button" data-scene-toggle="${esc(scenario.key)}" data-tooltip="${esc(`${scenario.name}：${item.requests} 次，占比 ${active ? formatShare(item.requests, total.requests) : '0%'}`)}"><i style="background:${scenarioColor(scenario.key)}"></i><span>${esc(scenario.name)}</span><em>${item.requests}</em></button>`;
    }).join('');
    return `<div class="admin-card email-chart-card"><div class="admin-card__header"><h2 class="admin-card__title">场景占比</h2></div><div class="admin-card__body email-pie-layout"><div class="email-pie-wrap"><svg class="email-pie" viewBox="0 0 200 200" role="img" aria-label="邮件发送场景占比">${slices}<circle class="email-pie-hole" cx="100" cy="100" r="38"></circle></svg><div class="email-pie-tooltip" data-pie-tooltip hidden><b></b><span></span></div></div><div class="email-pie-legend">${legend}</div></div></div>`;
  }

  function pieSlice(item, startAngle, endAngle, totalRequests) {
    const share = formatShare(item.requests, totalRequests);
    const midPoint = piePoint((startAngle + endAngle) / 2);
    const attrs = `class="email-pie-slice scene-${esc(item.key)}" data-pie-slice data-pie-label="${esc(item.scene)}" data-pie-value="${esc(`${item.requests.toLocaleString()} 次`)}" data-pie-percent="${esc(share)}" data-pie-x="${esc(formatCoord(midPoint.x * 0.9))}" data-pie-y="${esc(formatCoord(midPoint.y * 0.9))}" fill="${scenarioColor(item.key)}" tabindex="0" aria-label="${esc(`${item.scene} ${item.requests} 次，占比 ${share}`)}"`;
    if (endAngle - startAngle >= 359.9) return `<circle ${attrs} cx="100" cy="100" r="82"></circle>`;
    return `<path ${attrs} d="${pieSlicePath(startAngle, endAngle)}"></path>`;
  }

  function pieSlicePath(startAngle, endAngle) {
    const start = piePoint(endAngle);
    const end = piePoint(startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 100 100 L ${formatCoord(start.x)} ${formatCoord(start.y)} A 82 82 0 ${largeArc} 0 ${formatCoord(end.x)} ${formatCoord(end.y)} Z`;
  }

  function piePoint(angle) {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: 100 + 82 * Math.cos(radians), y: 100 + 82 * Math.sin(radians) };
  }

  function formatCoord(value) {
    return value.toFixed(3).replace(/\.?0+$/, '');
  }

  function formatShare(value, total) {
    if (!total || !value) return '0%';
    const percent = value / total * 100;
    return `${percent >= 10 ? Math.round(percent) : percent.toFixed(1)}%`;
  }

  function trendChart(rows) {
    const max = Math.max(1, ...rows.map(item => item.total));
    const axis = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
    const bars = rows.map(item => `<div class="email-trend__day"><div class="email-trend__value">${item.total}</div><div class="email-trend__bar" style="height:${Math.max(24, item.total / max * 180)}px" data-tooltip="${esc(`${item.date}：${item.total} 次请求`)}">${scenarios.filter(s => usageState.selectedScenes.has(s.key)).map(s => `<i class="scene-${esc(s.key)}" data-tooltip="${esc(`${formatDateLabel(item.date)} ${s.name}：${item[s.key] || 0} 次`)}" style="height:${item.total ? Math.max(4, (item[s.key] || 0) / item.total * 100) : 0}%"></i>`).join('')}</div><span>${esc(formatDateLabel(item.date))}</span></div>`).join('');
    return `<div class="admin-card email-chart-card"><div class="admin-card__header"><h2 class="admin-card__title">用量趋势</h2><span class="email-chart-note">纵轴：请求数，横轴：日期</span></div><div class="admin-card__body"><div class="email-trend-plot"><div class="email-trend-yaxis">${axis.map(item => `<span>${item}</span>`).join('')}</div><div class="email-trend-canvas"><div class="email-trend-grid">${axis.map(() => '<i></i>').join('')}</div><div class="email-trend">${bars}</div><div class="email-trend-xaxis">统计日期</div></div></div></div></div>`;
  }

  function scenarioColor(key) {
    return scenarios.find(item => item.key === key)?.color || '#2f6bff';
  }

  function modalHtml() {
    return `<div class="modal-backdrop" id="emailModal" hidden><div class="modal modal-md email-modal" id="emailModalDialog"><div class="modal__header"><h3 class="modal__title" id="emailModalTitle">模板预览</h3><button class="modal__close" type="button" data-action="close-modal"><i class="fas fa-times"></i></button></div><div class="modal__body" id="emailModalBody"></div><div class="modal__footer" id="emailModalFooter"><button class="btn btn-default" type="button" data-action="close-modal">关闭</button></div></div></div>`;
  }

  function showToast(message, type = 'info') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = message;
    stack.appendChild(node);
    window.setTimeout(() => node.remove(), 2400);
  }

  function openModal(title, body, options = {}) {
    const modal = document.getElementById('emailModal');
    if (!modal) return;
    const dialog = document.getElementById('emailModalDialog');
    const footer = document.getElementById('emailModalFooter');
    document.getElementById('emailModalTitle').textContent = title;
    document.getElementById('emailModalBody').innerHTML = body;
    if (dialog) dialog.className = `modal email-modal ${options.size || 'modal-md'}`;
    if (footer) footer.innerHTML = options.footer || '<button class="btn btn-default" type="button" data-action="close-modal">关闭</button>';
    modal.hidden = false;
    if (options.afterOpen) options.afterOpen();
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const usageTab = event.target.closest('[data-usage-tab]');
      if (usageTab) {
        usageState.tab = usageTab.dataset.usageTab;
        renderUsage();
        return;
      }
      const previewWidth = event.target.closest('[data-preview-width]');
      if (previewWidth) {
        const frame = document.querySelector('[data-preview-frame]');
        document.querySelectorAll('[data-preview-width]').forEach(item => item.classList.toggle('is-active', item === previewWidth));
        if (frame) frame.classList.toggle('is-mobile', previewWidth.dataset.previewWidth === 'mobile');
        return;
      }
      const previewLanguage = event.target.closest('[data-preview-language]');
      if (previewLanguage) {
        activePreviewLanguage = previewLanguage.dataset.previewLanguage || 'en';
        document.querySelectorAll('[data-preview-language]').forEach(item => item.classList.toggle('is-active', item === previewLanguage));
        refreshTemplatePreview();
        return;
      }
      const variableButton = event.target.closest('[data-template-variable]');
      if (variableButton) {
        insertTemplateVariable(variableButton.dataset.templateVariable);
        return;
      }
      const sceneToggle = event.target.closest('[data-scene-toggle]');
      if (sceneToggle) {
        toggleUsageScene(sceneToggle.dataset.sceneToggle);
        renderUsage();
        return;
      }
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'toggle-scene-menu') {
        const field = button.closest('.filter-field--multi');
        field?.classList.toggle('is-open');
        return;
      }
      if (action === 'usage-search') {
        readUsageFilters();
        renderUsage();
        return;
      }
      if (action === 'usage-reset') {
        usageState.startDate = '2026-08-05';
        usageState.endDate = '2026-08-11';
        usageState.selectedScenes = new Set(scenarios.map(item => item.key));
        usageState.merchantId = '';
        usageState.customerName = '';
        renderUsage();
        return;
      }
      if (action === 'export-log' || action === 'export-usage') {
        showToast('导出任务已创建，可在导出中心查看进度（原型）', 'success');
        return;
      }
      if (action === 'close-modal') {
        document.getElementById('emailModal').hidden = true;
        return;
      }
      if (action === 'edit-template') {
        const template = findTemplate(button.dataset.id);
        openModal('编辑邮件模板', templateModalBody(template, 'edit'), {
          size: 'modal-xl',
          footer: '<button class="btn btn-default" type="button" data-action="close-modal">取消</button><button class="btn btn-default" type="button" data-action="test-template-current">测试发送</button><button class="btn btn-primary" type="button" data-action="publish-template">发布启用</button>',
          afterOpen: () => {
            activeTemplateField = document.querySelector('[data-template-input="intro"]');
          }
        });
        return;
      }
      if (action === 'preview-template') {
        const template = findTemplate(button.dataset.id);
        openModal('邮件预览', templatePreviewStandalone(template), {
          size: 'modal-lg',
          footer: '<button class="btn btn-default" type="button" data-action="close-modal">关闭</button><button class="btn btn-primary" type="button" data-action="edit-template" data-id="' + esc(template.id) + '">编辑模板</button>'
        });
        return;
      }
      if (action === 'test-template' || action === 'test-template-current') {
        const template = action === 'test-template' ? findTemplate(button.dataset.id) : findTemplate('TPL-ADS-001');
        openModal('测试发送', testSendBody(template), {
          size: 'modal-md',
          footer: '<button class="btn btn-default" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="button" data-action="confirm-test-template">发送测试邮件</button>'
        });
        return;
      }
      if (action === 'publish-template') {
        showToast('模板已发布并设为当前启用稿（原型）', 'success');
        document.getElementById('emailModal').hidden = true;
        return;
      }
      if (action === 'confirm-test-template') {
        showToast('测试邮件已提交给 Bestreach（原型）', 'success');
        document.getElementById('emailModal').hidden = true;
        return;
      }
      if (action === 'refresh-template-preview') {
        refreshTemplatePreview();
        return;
      }
      if (action === 'view-log') openModal('发送日志详情', '<dl class="detail-grid"><div><dt>受理状态</dt><dd>MAIL_RECEIVED</dd></div><div><dt>收件人</dt><dd>m***@zephyr.com</dd></div><div><dt>抑制原因</dt><dd>-</dd></div><div><dt>模板</dt><dd>TPL-ADS-001</dd></div></dl>');
    });
    document.addEventListener('change', event => {
      if (event.target.matches('[data-scene-filter]')) {
        const checked = Array.from(document.querySelectorAll('[data-scene-filter]:checked')).map(item => item.dataset.sceneFilter);
        usageState.selectedScenes = new Set(checked.length ? checked : scenarios.map(item => item.key));
        renderUsage();
      }
      if (event.target.matches('[data-range-start], [data-range-end]')) {
        readUsageFilters();
        renderUsage();
      }
      if (event.target.matches('[data-template-input]')) {
        if (event.target.dataset.templateInput === 'sceneKey') {
          applySceneDefaults(event.target.value);
          refreshVariableButtons();
        }
        refreshTemplatePreview();
      }
    });
    document.addEventListener('input', event => {
      if (event.target.matches('[data-template-input]')) refreshTemplatePreview();
    });
    document.addEventListener('focusin', event => {
      if (event.target.matches('[data-template-input]')) activeTemplateField = event.target;
    });
    document.addEventListener('mouseover', event => {
      const slice = event.target.closest('[data-pie-slice]');
      if (slice) showPieTooltip(slice, event);
    });
    document.addEventListener('mousemove', event => {
      const slice = event.target.closest('[data-pie-slice]');
      if (slice) movePieTooltip(slice, event);
    });
    document.addEventListener('mouseout', event => {
      const slice = event.target.closest('[data-pie-slice]');
      if (slice) hidePieTooltip(slice.closest('.email-pie-wrap'));
    });
    document.addEventListener('focusin', event => {
      const slice = event.target.closest('[data-pie-slice]');
      if (slice) showPieTooltip(slice);
    });
    document.addEventListener('focusout', event => {
      const slice = event.target.closest('[data-pie-slice]');
      if (slice) hidePieTooltip(slice.closest('.email-pie-wrap'));
    });
  }

  function showPieTooltip(slice, event) {
    const wrap = slice.closest('.email-pie-wrap');
    if (!wrap) return;
    const tooltip = wrap.querySelector('[data-pie-tooltip]');
    if (!tooltip) return;
    const title = tooltip.querySelector('b');
    const value = tooltip.querySelector('span');
    if (title) title.textContent = slice.dataset.pieLabel || '';
    if (value) value.textContent = `${slice.dataset.pieValue || '0 次'} / ${slice.dataset.piePercent || '0%'}`;
    tooltip.hidden = false;
    movePieTooltip(slice, event);
  }

  function movePieTooltip(slice, event) {
    const wrap = slice.closest('.email-pie-wrap');
    if (!wrap) return;
    const tooltip = wrap.querySelector('[data-pie-tooltip]');
    if (!tooltip) return;
    const rect = wrap.getBoundingClientRect();
    const x = event ? event.clientX - rect.left : Number(slice.dataset.pieX || 90);
    const y = event ? event.clientY - rect.top : Number(slice.dataset.pieY || 90);
    const maxX = Math.max(12, rect.width - 12);
    const maxY = Math.max(12, rect.height - 12);
    tooltip.style.left = `${Math.min(Math.max(x, 12), maxX)}px`;
    tooltip.style.top = `${Math.min(Math.max(y, 12), maxY)}px`;
  }

  function hidePieTooltip(wrap) {
    const tooltip = wrap?.querySelector('[data-pie-tooltip]');
    if (tooltip) tooltip.hidden = true;
  }

  function readUsageFilters() {
    const start = document.querySelector('[data-range-start="usageDate"]')?.value;
    const end = document.querySelector('[data-range-end="usageDate"]')?.value;
    if (start) usageState.startDate = start;
    if (end) usageState.endDate = end;
    if (usageState.startDate > usageState.endDate) {
      const original = usageState.startDate;
      usageState.startDate = usageState.endDate;
      usageState.endDate = original;
    }
    usageState.merchantId = document.querySelector('[data-filter="merchantId"]')?.value.trim() || '';
    usageState.customerName = document.querySelector('[data-filter="customerName"]')?.value.trim() || '';
  }

  function toggleUsageScene(key) {
    if (usageState.selectedScenes.has(key) && usageState.selectedScenes.size > 1) usageState.selectedScenes.delete(key);
    else usageState.selectedScenes.add(key);
  }

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .email-filter-card{margin-bottom:16px}
      .email-date-range{display:grid;grid-template-columns:minmax(0,1fr)24px minmax(0,1fr);gap:8px;align-items:center}
      .email-date-range span{color:var(--admin-muted);text-align:center}
      .email-usage-tabs{margin:0 0 16px}
      .email-metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
      .email-metric{display:grid;gap:6px;padding:16px;border:1px solid var(--admin-border);border-radius:4px;background:var(--admin-surface)}
      .email-metric span{color:var(--admin-secondary);font-size:13px}.email-metric b{font-size:26px;line-height:34px}.email-metric em{font-style:normal;color:var(--admin-muted);font-size:12px}
      .email-chart-grid{display:grid;grid-template-columns:420px minmax(0,1fr);gap:16px;margin-bottom:16px}
      .email-chart-card{min-height:320px}.email-chart-card .admin-card__header{min-height:52px}
      .email-chart-note{color:var(--admin-muted);font-size:12px}
      .email-pie-layout{display:grid;grid-template-columns:180px minmax(0,1fr);gap:24px;align-items:center}
      .email-pie-wrap{position:relative;width:180px;height:180px}
      .email-pie{display:block;width:180px;height:180px;overflow:visible}
      .email-pie-slice{transform-box:view-box;transform-origin:100px 100px;transition:transform .16s ease,filter .16s ease;cursor:pointer}
      .email-pie-slice:hover,.email-pie-slice:focus{transform:scale(1.045);filter:drop-shadow(0 8px 10px rgba(31,41,55,.2));outline:none}
      .email-pie-hole{fill:var(--admin-surface);stroke:color-mix(in srgb,var(--admin-border) 72%,transparent);stroke-width:1;pointer-events:none}
      .email-pie-empty{fill:color-mix(in srgb,var(--admin-page-bg) 82%,var(--admin-surface))}
      .email-pie-tooltip{position:absolute;z-index:8;display:grid;gap:2px;min-width:112px;padding:7px 10px;border:1px solid rgba(17,24,39,.1);border-radius:4px;background:rgba(17,24,39,.94);color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.18);font-size:12px;line-height:18px;pointer-events:none;transform:translate(12px,-50%)}
      .email-pie-tooltip[hidden]{display:none}
      .email-pie-tooltip b{font-size:12px;font-weight:600;white-space:nowrap}
      .email-pie-tooltip span{font-variant-numeric:tabular-nums;white-space:nowrap;opacity:.88}
      .email-pie-legend{display:grid;gap:10px}
      .email-pie-legend-item{display:grid;grid-template-columns:10px minmax(0,1fr)56px;gap:8px;align-items:center;width:100%;min-height:28px;border:0;border-radius:4px;background:transparent;color:inherit;text-align:left;cursor:pointer}
      .email-pie-legend-item:hover{background:rgba(0,107,230,.06)}
      .email-pie-legend-item.is-muted{opacity:.42}
      .email-pie-legend-item.is-muted span{text-decoration:line-through}
      .email-pie-legend-item i{width:10px;height:10px;border-radius:2px}.email-pie-legend-item span{color:var(--admin-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.email-pie-legend-item em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums}
      .email-trend-plot{display:grid;grid-template-columns:42px minmax(0,1fr);gap:8px;min-height:260px}
      .email-trend-yaxis{height:218px;display:flex;flex-direction:column;justify-content:space-between;color:var(--admin-muted);font-size:12px;text-align:right;padding-top:4px}
      .email-trend-canvas{position:relative;min-width:0;padding:0 8px 20px}
      .email-trend-grid{position:absolute;left:8px;right:8px;top:4px;height:218px;display:flex;flex-direction:column;justify-content:space-between;pointer-events:none}
      .email-trend-grid i{display:block;border-top:1px dashed color-mix(in srgb,var(--admin-border) 78%,transparent)}
      .email-trend{position:relative;z-index:1;height:224px;display:flex;align-items:end;gap:14px;padding:8px 4px 0}
      .email-trend__day{flex:1;min-width:42px;display:grid;grid-template-rows:22px 1fr 20px;gap:6px;align-items:end;text-align:center}
      .email-trend__value{color:var(--admin-text);font-size:12px;font-variant-numeric:tabular-nums}
      .email-trend__bar{width:100%;max-width:42px;margin:0 auto;display:flex;flex-direction:column-reverse;overflow:hidden;border-radius:4px;background:color-mix(in srgb,var(--admin-page-bg) 82%,var(--admin-surface));transition:transform .16s ease,box-shadow .16s ease;cursor:default}
      .email-trend__bar:hover{transform:translateY(-3px);box-shadow:0 8px 18px rgba(31,41,55,.16)}
      .email-trend__bar i{display:block;width:100%;transition:filter .16s ease,opacity .16s ease}.email-trend__bar i:hover{filter:brightness(1.12)}.email-trend__day span{color:var(--admin-muted);font-size:12px}
      .email-trend-xaxis{position:absolute;right:8px;bottom:0;color:var(--admin-muted);font-size:12px}
      .scene-account_runway{background:#2f6bff}.scene-wallet_shortfall_event{background:#16a34a}.scene-wallet_shortfall_predict{background:#f59e0b}.scene-auto_recharge_fail{background:#ef4444}.scene-account_recharge_fail{background:#8b5cf6}.scene-wallet_credited{background:#06b6d4}.scene-clear_reduce_success{background:#14b8a6}
      .email-merchant-bars{display:grid;gap:12px}.email-merchant-bars div{display:grid;grid-template-columns:180px minmax(0,1fr)64px;gap:12px;align-items:center}.email-merchant-bars span{color:var(--admin-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.email-merchant-bars i{height:12px;border-radius:999px;background:color-mix(in srgb,var(--admin-page-bg) 82%,var(--admin-surface));overflow:hidden}.email-merchant-bars b{display:block;height:100%;border-radius:inherit;background:var(--admin-primary)}.email-merchant-bars em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums}
      [data-tooltip]{position:relative}
      [data-tooltip]:hover::after{content:attr(data-tooltip);position:absolute;z-index:50;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);max-width:260px;padding:7px 10px;border-radius:4px;background:rgba(17,24,39,.94);color:#fff;font-size:12px;line-height:18px;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.18)}
      .email-usage-table .admin-table th,.email-usage-table .admin-table td{text-align:center}
      .email-usage-table .admin-table th.left,.email-usage-table .admin-table td.left{text-align:left}
      .email-template-table .admin-table td{height:68px}
      .template-list-title,.template-list-sub{display:block;min-width:0}
      .template-list-title{font-weight:600;color:var(--admin-text);line-height:20px}
      .template-list-sub{margin-top:4px;color:var(--admin-muted);font-size:12px;line-height:18px;white-space:normal}
      .email-modal{display:flex;flex-direction:column;padding:18px 22px;overflow:hidden}
      .email-modal.modal-xl{width:min(1480px,calc(100vw - 48px));max-height:calc(100vh - 48px)}
      .email-modal .modal__header{min-height:36px;padding:0 8px 12px;border:0}
      .email-modal .modal__title{line-height:28px}
      .email-modal .modal__body{min-height:0;overflow:hidden;padding:0}
      .email-modal .modal__footer{min-height:42px;margin-top:14px;padding:8px 8px 0;background:transparent;border:0;box-shadow:none}
      #emailModalDialog.email-modal>.modal__header,#emailModalDialog.email-modal>.modal__footer{border-top:0!important;border-right:0!important;border-bottom:0!important;border-left:0!important;box-shadow:none!important;outline:0}
      #emailModalDialog.email-modal>.modal__footer{justify-content:flex-end;align-items:center}
      .email-modal .form-grid{padding:16px;border:1px solid var(--admin-border);border-radius:6px;background:color-mix(in srgb,var(--admin-page-bg) 58%,var(--admin-surface))}
      .email-modal .form-field select,.email-modal .form-field input,.email-modal .form-field textarea{width:100%}
      .email-modal .form-field input:disabled{background:color-mix(in srgb,var(--admin-page-bg) 78%,var(--admin-surface));color:var(--admin-secondary);cursor:not-allowed}
      .email-modal .form-field textarea[data-template-input="intro"]{min-height:88px}
      .email-modal .form-field textarea[data-template-input="footer"]{min-height:76px}
      .email-preview{display:grid;gap:12px;padding:18px;border:1px solid var(--admin-border);border-radius:6px;background:color-mix(in srgb,var(--admin-page-bg) 72%,var(--admin-surface))}
      .email-preview h3{margin:0;font-size:20px}.email-preview p{margin:0;color:var(--admin-secondary);line-height:22px}.email-preview small{color:var(--admin-muted)}
      .template-editor-shell{display:grid;grid-template-columns:minmax(620px,58fr)minmax(440px,42fr);gap:18px;height:min(720px,calc(100vh - 190px));min-height:560px}
      .template-editor-main{display:grid;align-content:start;gap:16px;min-width:0;overflow:auto;padding:0 4px 2px 0}
      .template-editor-section{border:1px solid var(--admin-border);border-radius:6px;background:var(--admin-surface)}
      .template-editor-section__head{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;padding:0 16px;border-bottom:1px solid var(--admin-border)}
      .template-editor-section__head h4{margin:0;font-size:14px;font-weight:600;color:var(--admin-text)}
      .template-editor-section__head span{color:var(--admin-muted);font-size:12px}
      .template-editor-grid{gap:16px 14px;border:0!important;border-radius:0!important;background:transparent!important}
      .template-variable-section{position:relative}
      .template-variable-list{display:flex;flex-wrap:wrap;gap:8px;padding:14px 16px}
      .template-variable-list button{display:grid;grid-template-columns:auto auto;align-items:center;gap:6px;min-height:30px;padding:0 10px;border:1px solid var(--admin-border);border-radius:4px;background:var(--admin-surface);color:var(--admin-secondary);cursor:pointer}
      .template-variable-list button:hover{border-color:var(--admin-primary);color:var(--admin-primary);background:rgba(0,107,230,.05)}
      .template-variable-list code{padding:1px 5px;border-radius:3px;background:color-mix(in srgb,var(--admin-page-bg) 78%,var(--admin-surface));color:var(--admin-text);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px}
      .template-preview-pane{align-self:start;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;min-width:0;height:100%;overflow:hidden}
      .template-preview-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .template-preview-toolbar-main{display:flex;align-items:center;gap:8px;min-width:0}
      .template-preview-toolbar--standalone{width:min(680px,100%);margin:0 auto 10px}
      .template-preview-tools{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}
      .template-preview-tools select{width:136px;height:32px;border:1px solid var(--admin-border);border-radius:4px;background:var(--admin-surface);color:var(--admin-text);font:inherit}
      .template-preview-tabs{display:inline-flex;align-items:center;padding:2px;border:1px solid var(--admin-border);border-radius:4px;background:var(--admin-surface)}
      .template-preview-tabs button{height:28px;padding:0 12px;border:0;border-radius:3px;background:transparent;color:var(--admin-secondary);cursor:pointer;font:inherit}
      .template-preview-tabs button.is-active{background:var(--admin-primary);color:#fff}
      .template-preview-frame{display:grid;justify-items:center;min-height:0;overflow:auto;padding:20px;border:1px solid var(--admin-border);border-radius:6px;background:#e9edf3}
      .template-preview-frame.is-mobile .email-rendered{width:360px}
      .template-preview-standalone{display:grid;justify-items:center;padding:18px;border-radius:6px;background:#e9edf3}
      .template-preview-standalone .template-preview-frame{width:100%;border:0;padding:0;background:transparent}
      .email-rendered{width:100%;max-width:680px;border:1px solid #d8dde8;border-radius:6px;background:#fff;color:#1f2937;font-family:Arial,Helvetica,sans-serif;box-shadow:0 10px 28px rgba(31,41,55,.12);overflow:hidden}
      .email-rendered__preheader{height:0;overflow:hidden;color:transparent;font-size:1px;line-height:1px}
      .email-rendered__brand{display:flex;align-items:center;gap:12px;padding:22px 28px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
      .email-rendered__brand strong,.email-rendered__brand span{display:block}
      .email-rendered__brand strong{font-size:18px;line-height:24px;color:#111827}
      .email-rendered__brand span{margin-top:2px;color:#6b7280;font-size:12px;line-height:18px}
      .email-rendered__logo{display:grid;place-items:center;width:36px;height:36px;border-radius:4px;background:#006be6;color:#fff;font-size:18px;font-weight:700}
      .email-rendered__body{padding:28px}
      .email-rendered__subject{margin:0 0 12px;color:#006be6;font-size:13px;line-height:20px;font-weight:600}
      .email-rendered h1{margin:0 0 14px;color:#111827;font-size:24px;line-height:32px;font-weight:700;letter-spacing:0}
      .email-rendered__intro{margin:0;color:#4b5563;font-size:14px;line-height:22px}
      .email-rendered__metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px 0}
      .email-rendered__metrics div{min-width:0;padding:14px;border:1px solid #e5e7eb;border-radius:4px;background:#f9fafb}
      .email-rendered__metrics span{display:block;color:#6b7280;font-size:12px;line-height:18px}
      .email-rendered__metrics b{display:block;margin-top:4px;color:#111827;font-size:17px;line-height:24px;word-break:break-word}
      .email-rendered__table{margin:0 0 22px;overflow:auto}
      .email-rendered__table h2{margin:0 0 10px;color:#111827;font-size:15px;line-height:22px}
      .email-rendered__table table{width:100%;min-width:540px;border-collapse:collapse;font-size:12px}
      .email-rendered__table th,.email-rendered__table td{padding:10px;border:1px solid #e5e7eb;text-align:left;line-height:18px}
      .email-rendered__table th{background:#f3f4f6;color:#4b5563;font-weight:600}
      .email-rendered__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
      .email-rendered__cta{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 18px;border-radius:4px;background:#006be6;color:#fff;text-decoration:none;font-weight:600}
      .email-rendered__cta--secondary{background:#fff;color:#006be6;border:1px solid #bfdbfe}
      .email-rendered__footer{padding:16px 28px;border-top:1px solid #e5e7eb;background:#f8fafc;color:#6b7280;font-size:12px;line-height:18px}
      @media (max-width:1160px){.email-chart-grid{grid-template-columns:1fr}.email-pie-layout{grid-template-columns:180px minmax(0,1fr)}}
      @media (max-width:960px){.email-metric-grid{grid-template-columns:1fr}.email-merchant-bars div{grid-template-columns:1fr}.email-merchant-bars em{text-align:left}.email-date-range{grid-template-columns:1fr}.email-date-range span{text-align:left}.email-pie-layout{grid-template-columns:1fr}.email-pie-wrap{margin:auto}.template-editor-shell{grid-template-columns:1fr;height:auto}.template-preview-pane{height:auto}.email-rendered__metrics{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  injectStyle();
  if (page === 'email-template') renderTemplates();
  if (page === 'email-send-logs') renderLogs();
  if (page === 'email-usage') renderUsage();
  bindEvents();
})();
