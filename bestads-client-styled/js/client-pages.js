(function () {
  const zh = {
    common: {
      query: '查询',
      search: '搜索',
      export: '导出',
      create: '创建',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      edit: '编辑',
      resetPassword: '重置密码',
      enable: '启用',
      disable: '停用',
      empty: '暂无数据',
      total: '共 {count} 条',
      pageSize: '20 条/页',
      allStatus: '请选择状态',
      selectPlatform: '请选择平台',
      selectRole: '请选择角色',
      enabled: '启用',
      disabled: '停用',
      completed: '完成',
      failed: '失败',
      pending: '处理中',
      toastQuery: '查询条件已应用',
      toastExport: '导出任务已创建',
      toastSaved: '保存成功',
      toastResetPassword: '重置密码链接已生成',
      toastStatusChanged: '状态已更新',
      required: '必填'
    },
    pages: {
      'operation-records': {
        title: '操作记录',
        tabs: ['开户记录', '充值记录', '减款记录', '清零记录'],
        applyAccount: '申请开户',
        confirmPayment: '确认付款',
        viewDetail: '查看详情',
        cancelOpening: '取消开户',
        applyStatus: '请选择申请状态',
        startTime: '开始时间',
        endTime: '结束时间',
        accountId: '请输入广告账户ID',
        accountName: '请输入广告账户名称'
      },
      'location-fee': {
        title: '税费明细',
        tabs: ['税费明细', '预收池流水'],
        prepaidPool: '预收池余额',
        last7Days: '近 7 天估算税费',
        taxableConsume: '应税消耗合计',
        estimatedTax: '估算地区税费',
        referenceTotal: '参考合计',
        countryAccount: '涉及国家 / 账户',
        noticeTitle: '重要说明',
        noticeReserve: '系统会在充值时按比例预留地区税费，实际费用以 Meta 账单为准；预留不是服务费。',
        noticeOfficial: 'Meta 官方说明',
        notice1: '本页地区税费为估算金额，仅供参考；实际费用以 Meta 账单为准。',
        notice2: 'Meta 消耗存在延迟，系统会每日更新最近 9 天的消耗与税费估算，数据可能变化。',
        notice3: '金额按广告账户币种展示；税费不计入广告消耗，不等于扣款。',
        startDate: '开始日期',
        endDate: '结束日期',
        accountId: '请输入广告账户ID',
        accountName: '请输入广告账户名称',
        country: '请选择国家/地区',
        flowType: '请选择类型',
        flowAll: '全部类型',
        flowRecharge: '充值预留',
        flowDeduct: '税费扣减',
        flowTopup: '钱包补入',
        flowRelease: '退回钱包'
      },
      'introducer-daily-consume': {
        title: '推荐返佣',
        quarter: '2026Q3',
        customer: '请输入被介绍客户名称',
        media: '请选择媒体',
        accountId: '请输入广告账户ID',
        totalConsume: '总消耗 (USD)',
        customerCount: '客户数',
        commission: '佣金 (USD)',
        disclaimer: '免责声明：本页消耗与佣金数据仅供参考，可能受媒体报表延迟与追踪稳定性影响；实际消耗与佣金结算以财务部门提供的数据为准。'
      },
      'sub-account-management': {
        title: '子账号管理',
        accountName: '请输入账号名',
        create: '创建子账号',
        modalCreate: '创建子账号',
        modalEdit: '编辑子账号',
        loginName: '账号名',
        name: '姓名',
        role: '绑定角色',
        status: '状态',
        balanceAccounts: '管理余额账户',
        adAccounts: '管理广告账户',
        email: '登录邮箱',
        password: '初始密码'
      },
      'role-management': {
        title: '角色管理',
        roleName: '请输入角色名',
        create: '创建角色',
        modalCreate: '创建角色',
        modalEdit: '编辑角色',
        name: '角色名',
        status: '状态',
        description: '描述',
        permissions: '权限分配',
        permissionAssets: '资产管理',
        permissionUsers: '用户管理',
        permissionSettings: '设置',
        permissionReports: '报表查看'
      },
      'auto-recharge-rules': {
        title: '自动充值设置',
        ruleName: '请输入规则名称',
        create: '新增规则',
        modalCreate: '新增规则',
        modalEdit: '编辑规则',
        name: '规则名称',
        accounts: '关联账户',
        threshold: '触发余额',
        amount: '充值金额',
        activeTime: '生效时间',
        cooldown: '自动充值冷却期',
        dailyLimit: '单日充值次数上限',
        status: '状态'
      }
    }
  };

  const en = {
    common: {
      query: 'Query',
      search: 'Search',
      export: 'Export',
      create: 'Create',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      resetPassword: 'Reset Password',
      enable: 'Enable',
      disable: 'Disable',
      empty: 'No data',
      total: 'Total {count} items',
      pageSize: '20 / page',
      allStatus: 'Select Status',
      selectPlatform: 'Select Platform',
      selectRole: 'Select Role',
      enabled: 'Enabled',
      disabled: 'Disabled',
      completed: 'Completed',
      failed: 'Failed',
      pending: 'Processing',
      toastQuery: 'Filters applied',
      toastExport: 'Export task created',
      toastSaved: 'Saved',
      toastResetPassword: 'Password reset link generated',
      toastStatusChanged: 'Status updated',
      required: 'Required'
    },
    pages: {
      'operation-records': {
        title: 'Operation Records',
        tabs: ['Opening', 'Recharge', 'Deduction', 'Clear'],
        applyAccount: 'Apply Account',
        confirmPayment: 'Confirm Payment',
        viewDetail: 'Details',
        cancelOpening: 'Cancel',
        applyStatus: 'Select Application Status',
        startTime: 'Start Time',
        endTime: 'End Time',
        accountId: 'Enter Ad Account ID',
        accountName: 'Enter Ad Account Name'
      },
      'location-fee': {
        title: 'Tax Details',
        tabs: ['Tax Details', 'Prepaid Pool Ledger'],
        prepaidPool: 'Prepaid Pool',
        last7Days: 'Last 7 Days Estimated Tax',
        taxableConsume: 'Taxable Spend',
        estimatedTax: 'Estimated Location Tax',
        referenceTotal: 'Reference Total',
        countryAccount: 'Countries / Accounts',
        noticeTitle: 'Important',
        noticeReserve: 'Location fees are reserved from recharge at a set rate. Actual charges follow Meta billing. This reserve is not a service fee.',
        noticeOfficial: 'Meta official help',
        notice1: 'Location tax on this page is an estimate only. Actual fees are subject to Meta billing.',
        notice2: 'Meta spend may be delayed. The system updates the latest 9 days of spend and tax estimates daily, so data may change.',
        notice3: 'Amounts are shown in the ad account currency. Tax is not ad spend and is not equal to a deduction.',
        startDate: 'Start Date',
        endDate: 'End Date',
        accountId: 'Enter Ad Account ID',
        accountName: 'Enter Ad Account Name',
        country: 'Select Country/Region',
        flowType: 'Select type',
        flowAll: 'All types',
        flowRecharge: 'Recharge reserve',
        flowDeduct: 'Tax offset',
        flowTopup: 'Wallet top-up',
        flowRelease: 'Returned to wallet'
      },
      'introducer-daily-consume': {
        title: 'Referral',
        quarter: '2026Q3',
        customer: 'Introduced Customer',
        media: 'Select Media',
        accountId: 'Enter Ad Account ID',
        totalConsume: 'Spend (USD)',
        customerCount: 'Customers',
        commission: 'Commission (USD)',
        disclaimer: 'Disclaimer: Spend and commission data on this page is for reference only and may be affected by media reporting delay and tracking stability. Final spend and commission settlement are subject to finance data.'
      },
      'sub-account-management': {
        title: 'Sub-accounts',
        accountName: 'Enter Account Name',
        create: 'Create Sub-account',
        modalCreate: 'Create Sub-account',
        modalEdit: 'Edit Sub-account',
        loginName: 'Account',
        name: 'Name',
        role: 'Role',
        status: 'Status',
        balanceAccounts: 'Balance Accounts',
        adAccounts: 'Ad Accounts',
        email: 'Login Email',
        password: 'Initial Password'
      },
      'role-management': {
        title: 'Roles',
        roleName: 'Enter Role Name',
        create: 'Create Role',
        modalCreate: 'Create Role',
        modalEdit: 'Edit Role',
        name: 'Role Name',
        status: 'Status',
        description: 'Description',
        permissions: 'Permissions',
        permissionAssets: 'Assets',
        permissionUsers: 'Users',
        permissionSettings: 'Settings',
        permissionReports: 'Reports'
      },
      'auto-recharge-rules': {
        title: 'Auto Recharge',
        ruleName: 'Enter Rule Name',
        create: 'New Rule',
        modalCreate: 'New Rule',
        modalEdit: 'Edit Rule',
        name: 'Rule Name',
        accounts: 'Linked Accounts',
        threshold: 'Trigger Balance',
        amount: 'Recharge Amount',
        activeTime: 'Active Time',
        cooldown: 'Cooldown',
        dailyLimit: 'Daily Limit',
        status: 'Status'
      }
    }
  };

  const pageData = {
    'operation-records': {
      defaultTab: 'opening',
      tabs: [
        {
          id: 'opening',
          labelKey: 0,
          toolbar: [
            { type: 'range', start: '2026-08-06', end: '2026-08-12', startKey: 'startTime', endKey: 'endTime' },
            { type: 'select', key: 'applyStatus', options: ['', '处理中', '待确认', '完成', '失败'] }
          ],
          actions: [
            { kind: 'query' },
            { kind: 'export' },
            { kind: 'custom', labelKey: 'applyAccount', primary: true, action: 'apply-account' }
          ],
          columns: ['申请ID', '媒体', '投放信息', '账户数', '初始报价', '最终报价', '钱包扣款', '状态', '操作'],
          rows: [
            {
              applyId: 'AO20260813001',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901 / 898989765432101',
              url: 'https://www.luminara-home.com',
              country: '美国',
              timezone: 'America/Los_Angeles',
              dailyBudget: '300',
              accountCount: '2',
              category: '家居厨房与生活',
              currency: 'USD',
              initialQuote: '1,100.00 USD',
              openingFee: '0.00 USD',
              precharge: '1,100.00 USD',
              finalQuote: '待运营确认',
              walletCharge: '-',
              paymentStatus: '未扣款',
              paymentAuth: '已同意金额一致时自动扣款',
              submittedAt: '2026-08-13 10:26:18',
              openingStatus: '待运营审核',
              status: '处理中',
              result: '-',
              accountInfo: '-',
              openingFeeRecord: '确认费用后生成其他扣费单',
              rechargeRecord: '确认费用后生成占位充值单'
            },
            {
              applyId: 'AO20260812008',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901 / 898989765432101',
              url: 'https://www.breeze-pet.co',
              country: '美国',
              timezone: 'America/New_York',
              dailyBudget: '500',
              accountCount: '3',
              category: '宠物用品',
              currency: 'USD',
              initialQuote: '2,000.00 USD',
              openingFee: '30.00 USD',
              precharge: '2,000.00 USD',
              finalQuote: '2,030.00 USD',
              walletCharge: '-',
              paymentStatus: '待客户确认',
              paymentAuth: '未自动扣款，金额不一致',
              submittedAt: '2026-08-12 16:42:09',
              openingStatus: '待客户确认付款',
              status: '待确认',
              result: '-',
              accountInfo: '-',
              openingFeeRecord: '确认付款后生成其他扣费单',
              rechargeRecord: '确认付款后生成占位充值单'
            },
            {
              applyId: 'AO20260812002',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901 / 898989765432101',
              url: 'https://www.furora-style.com',
              country: '英国',
              timezone: 'Europe/London',
              dailyBudget: '200',
              accountCount: '2',
              category: '时尚与服装',
              currency: 'USD',
              initialQuote: '1,130.00 USD',
              openingFee: '30.00 USD',
              precharge: '1,100.00 USD',
              finalQuote: '1,130.00 USD',
              walletCharge: '1,130.00 USD',
              paymentStatus: '已扣款',
              paymentAuth: '金额一致，已按授权自动扣款',
              submittedAt: '2026-08-12 11:08:42',
              openingStatus: '已付款待开户',
              status: '处理中',
              result: '-',
              accountInfo: '-',
              openingFeeRecord: 'FEE-AO20260812002',
              rechargeRecord: 'AD-OPEN-AO20260812002-01 / 02 开户首充（待绑定账户）'
            },
            {
              applyId: 'AO20260811005',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901 / 898989765432101',
              url: 'https://www.oliva-amsterdam.nl',
              country: '荷兰',
              timezone: 'Europe/Amsterdam',
              dailyBudget: '150',
              accountCount: '1',
              category: '美妆与个护',
              currency: 'USD',
              initialQuote: '650.00 USD',
              openingFee: '0.00 USD',
              precharge: '650.00 USD',
              finalQuote: '650.00 USD',
              walletCharge: '650.00 USD',
              paymentStatus: '已扣款',
              paymentAuth: '金额一致，已按授权自动扣款',
              submittedAt: '2026-08-11 09:33:21',
              openingStatus: '开户成功',
              status: '完成',
              result: '成功',
              accountInfo: '1002116215352952 / Oliva-Amsterdam',
              openingFeeRecord: '无开户费',
              rechargeRecord: 'AD-OPEN-AO20260811005-01 已绑定 1002116215352952，系统已发起充值'
            },
            {
              applyId: 'AO20260813020',
              mediaChannel: 'AppLovin',
              url: 'https://www.luminara-home.com',
              country: '美国',
              timezone: 'America/Los_Angeles',
              dailyBudget: '400',
              accountCount: '2',
              category: '家居厨房与生活',
              currency: 'USD',
              initialQuote: '1,000.00 USD',
              openingFee: '0.00 USD',
              precharge: '1,000.00 USD',
              finalQuote: '1,000.00 USD',
              walletCharge: '1,000.00 USD',
              paymentStatus: '部分退款',
              paymentAuth: '金额一致，已按授权自动扣款',
              submittedAt: '2026-08-13 15:18:02',
              openingStatus: '部分成功',
              status: '完成',
              result: '2 个账户中 1 个成功 / 1 个已退款',
              accountInfo: '1983200478 / Lucas De Souza 1',
              openingFeeRecord: '无开户费',
              rechargeRecord: 'AD-OPEN-AO20260813020-01 已绑定并充值；02 已失败退款'
            },
            {
              applyId: 'AO20260814002',
              mediaChannel: 'Google',
              bmIds: '123-456-7890 / 987-654-3210',
              url: 'https://www.luminara-home.com',
              country: '英国',
              timezone: 'Europe/London',
              dailyBudget: '220',
              accountCount: '1',
              category: '家居厨房与生活',
              currency: 'USD',
              initialQuote: '500.00 USD',
              openingFee: '0.00 USD',
              precharge: '500.00 USD',
              finalQuote: '500.00 USD',
              walletCharge: '500.00 USD',
              paymentStatus: '已扣款',
              paymentAuth: '金额一致，已按授权自动扣款',
              submittedAt: '2026-08-14 10:05:44',
              openingStatus: '已付款待开户',
              status: '处理中',
              result: '待开户',
              accountInfo: '-',
              openingFeeRecord: '无开户费',
              rechargeRecord: 'AD-OPEN-AO20260814002-01 开户首充（待绑定账户）'
            },
            {
              applyId: 'AO20260814001',
              mediaChannel: 'TikTok',
              bmIds: '7012345678901234567',
              url: 'https://www.furora-style.com',
              country: '美国',
              timezone: 'America/Los_Angeles',
              dailyBudget: '180',
              accountCount: '1',
              category: '时尚与服装',
              currency: 'USD',
              initialQuote: '600.00 USD',
              openingFee: '0.00 USD',
              precharge: '600.00 USD',
              finalQuote: '待运营确认',
              walletCharge: '-',
              paymentStatus: '未扣款',
              paymentAuth: '已同意金额一致时自动扣款',
              submittedAt: '2026-08-14 09:20:11',
              openingStatus: '待运营审核',
              status: '处理中',
              result: '-',
              accountInfo: '-',
              openingFeeRecord: '确认费用后生成其他扣费单',
              rechargeRecord: '确认费用后生成占位充值单'
            },
            {
              applyId: 'AO20260822003',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901',
              url: 'https://www.first-open-home.com',
              country: '美国',
              timezone: 'America/Los_Angeles',
              dailyBudget: '300',
              accountCount: '1',
              category: '家居厨房与生活',
              currency: 'USD',
              initialQuote: '580.00 USD',
              openingFee: '30.00 USD',
              precharge: '550.00 USD',
              finalQuote: '580.00 USD',
              walletCharge: '30.00 USD',
              paymentStatus: '部分扣款失败',
              paymentAuth: '已同意金额一致时自动扣款',
              submittedAt: '2026-08-22 16:08:11',
              openingStatus: '扣款异常',
              status: '处理中',
              result: '-',
              accountInfo: '-',
              openingFeeRecord: 'FEE-AO20260822003',
              rechargeRecord: 'AD-OPEN-AO20260822003-01 扣款失败待重试'
            },
            {
              applyId: 'AO20260810003',
              mediaChannel: 'Facebook',
              bmIds: '121212345678901 / 898989765432101',
              url: 'https://www.example-health-supplement.com',
              country: '美国',
              timezone: 'America/Chicago',
              dailyBudget: '250',
              accountCount: '1',
              category: '口服健康保健与营养',
              currency: 'USD',
              initialQuote: '830.00 USD',
              openingFee: '30.00 USD',
              precharge: '800.00 USD',
              finalQuote: '830.00 USD',
              walletCharge: '830.00 USD',
              paymentStatus: '已退款',
              paymentAuth: '金额一致，已按授权自动扣款',
              submittedAt: '2026-08-10 14:12:37',
              openingStatus: '开户取消',
              status: '失败',
              result: '失败',
              accountInfo: '-',
              openingFeeRecord: 'FEE-AO20260810003 已回退 30.00 USD',
              rechargeRecord: 'AD-OPEN-AO20260810003-01 失败退款 800.00 USD'
            }
          ]
        },
        {
          id: 'recharge',
          labelKey: 1,
          toolbar: [
            { type: 'range', start: '2026-08-06', end: '2026-08-12', startKey: 'startTime', endKey: 'endTime' },
            { type: 'input', key: 'accountId' },
            { type: 'input', key: 'accountName' },
            { type: 'select', commonKey: 'selectPlatform', options: ['', 'Facebook', 'TikTok', 'Google', 'Outbrain'] }
          ],
          actions: [{ kind: 'query' }, { kind: 'export' }],
          columns: ['充值ID', '平台', '提交时间', '广告账户ID', '广告账户名称', '广告账户币种', '充值金额', '实际到账金额', '状态', '完成时间'],
          rows: [
            ['AD-OPEN-AO20260812002-01', 'Facebook', '2026-08-12 11:08:50', '开户首充（待绑定账户）', '-', 'USD', '550', '-', { status: '处理中' }, '-'],
            ['AD-OPEN-AO20260811005-01', 'Facebook', '2026-08-11 09:33:40', '1002116215352952', 'Oliva-Amsterdam', 'EUR', '650', '630.50', { status: '完成' }, '2026-08-11 10:02:18'],
            ['AD20260811144113308052052', '', '2026-08-11 14:41:13', '573938708665606', 'TL-B-07-1394', 'USD', '20', '18', { status: '完成' }, '2026-08-11 14:51:00'],
            ['AD20260811114229586059719', '', '2026-08-11 11:42:30', '573938708665606', 'TL-B-07-1394', 'USD', '20', '17', { status: '完成' }, '2026-08-11 11:51:00'],
            ['AD20260811113729171454376', '', '2026-08-11 11:37:29', '1292368695505904', 'MX-G-12-620', 'USD', '20', '19', { status: '失败' }, '-'],
            ['AD20260807142352218037259', '', '2026-08-07 14:23:52', '1292368695505904', 'MX-G-12-620', 'USD', '12', '12', { status: '完成' }, '2026-08-07 14:24:03'],
            ['AD20260806160908710028856', '', '2026-08-06 16:09:09', '1292368695505904', 'MX-G-12-620', 'USD', '11.11', '11.11', { status: '完成' }, '2026-08-06 16:10:03']
          ]
        },
        {
          id: 'deduct',
          labelKey: 2,
          toolbar: [
            { type: 'range', start: '2026-08-06', end: '2026-08-12', startKey: 'startTime', endKey: 'endTime' },
            { type: 'input', key: 'accountId' },
            { type: 'input', key: 'accountName' },
            { type: 'select', commonKey: 'selectPlatform', options: ['', 'Facebook', 'TikTok', 'Google', 'Outbrain'] }
          ],
          actions: [{ kind: 'query' }, { kind: 'export' }],
          columns: ['减款ID', '平台', '提交时间', '广告账户ID', '广告账户名称', '广告账户币种', '减款金额', '实际到账金额', '状态', '完成时间'],
          rows: [
            ['AD20260806161110744477616', '', '2026-08-06 16:11:11', '1292368695505904', 'MX-G-12-620', 'USD', '20', '20', { status: '完成' }, '2026-08-06 16:12:03']
          ]
        },
        {
          id: 'clear',
          labelKey: 3,
          toolbar: [
            { type: 'range', start: '2026-08-06', end: '2026-08-12', startKey: 'startTime', endKey: 'endTime' },
            { type: 'input', key: 'accountId' },
            { type: 'input', key: 'accountName' },
            { type: 'select', commonKey: 'selectPlatform', options: ['', 'Facebook', 'TikTok', 'Google', 'Outbrain'] }
          ],
          actions: [{ kind: 'query' }, { kind: 'export' }],
          columns: ['清零ID', '平台', '提交时间', '广告账户ID', '广告账户名称', '广告账户币种', '清零金额', '状态', '完成时间'],
          rows: [
            ['AD20260806162603374834874', '', '2026-08-06 16:26:03', '7325263652313890817', 'HHJC-TT-11-04', 'USD', '35.86', { status: '完成' }, '2026-08-06 16:31:00']
          ]
        }
      ]
    },
    'location-fee': {
      defaultTab: 'detail',
      summary: [
        ['prepaidPool', '500.00 USD'],
        ['last7Days', '84.00 USD'],
        ['taxableConsume', '18,650 USD'],
        ['estimatedTax', '624.50 USD']
      ],
      reference: [
        ['referenceTotal', '624.50 USD'],
        ['countryAccount', '4 / 2']
      ],
      tabs: [
        {
          id: 'detail',
          labelKey: 0,
          toolbar: [
            { type: 'range', start: '2026-07-01', end: '2026-07-14', startKey: 'startDate', endKey: 'endDate' },
            { type: 'input', key: 'accountId' },
            { type: 'input', key: 'accountName' },
            { type: 'select', key: 'country', options: ['', 'AT', 'FR', 'GB', 'TR'] }
          ],
          actions: [{ kind: 'query' }, { kind: 'export' }],
          columns: ['消耗日期', '广告账户ID', '广告账户名称', '国家/地区', '币种', '应税消耗', '税率', '估算税费'],
          rows: [
            ['2026-07-13', '238401982', 'AT-Prospecting', '奥地利', 'USD', '1,200.00', '5%', '60.00'],
            ['2026-07-13', '238401982', 'AT-Prospecting', '法国', 'USD', '800.00', '3%', '24.00'],
            ['2026-07-12', '555000111', 'EU-Brand', '英国', 'EUR', '2,450.00', '2%', '49.00'],
            ['2026-07-05', '555000111', 'EU-Brand', '土耳其', 'EUR', '1,000.00', '5%', '50.00']
          ]
        },
        {
          id: 'pool',
          labelKey: 1,
          toolbar: [
            { type: 'range', start: '2026-07-01', end: '2026-08-12', startKey: 'startDate', endKey: 'endDate' },
            { type: 'select', key: 'flowType', options: ['', '充值预留', '税费扣减', '钱包补入', '退回钱包'] }
          ],
          actions: [{ kind: 'query' }, { kind: 'export' }],
          columns: ['时间', '出/入账', '类型', '变动币种', '变动金额', '预收池币种', '预收池变动金额', '汇率', '关联账户'],
          rows: [
            ['2026-08-12 11:20:08', '入账', '充值预留', 'USD', '+50.00', 'USD', '+50.00', '1', '238401982'],
            ['2026-08-10 09:16:03', '出账', '税费扣减', 'USD', '-84.00', 'USD', '-84.00', '1', '238401982'],
            ['2026-08-07 14:20:00', '入账', '钱包补入', 'USD', '+30.00', 'USD', '+30.00', '1', '—'],
            ['2026-08-06 16:08:02', '出账', '退回钱包', 'USD', '-20.00', 'USD', '-20.00', '1', '—'],
            ['2026-08-05 11:02:18', '出账', '税费扣减', 'EUR', '-49.00', 'USD', '-53.26', '1.087', '555000111']
          ]
        }
      ]
    },
    'introducer-daily-consume': {
      toolbar: [
        { type: 'select', key: 'quarter', options: ['2026Q3', '2026Q2', '2026Q1'] },
        { type: 'input', key: 'customer' },
        { type: 'select', key: 'media', options: ['', 'Facebook', 'TikTok', 'Google', 'Outbrain'] },
        { type: 'input', key: 'accountId' }
      ],
      actions: [{ kind: 'query' }, { kind: 'export' }],
      summary: [
        ['totalConsume', '0'],
        ['customerCount', '0'],
        ['commission', '0']
      ],
      columns: ['计算季度', '客户名称', '媒体', '广告账户名称', '广告账户ID', '消耗范围', '消耗 (USD)', '吐点比例', '佣金 (USD)'],
      rows: []
    },
    'sub-account-management': {
      toolbar: [
        { type: 'input', key: 'accountName' },
        { type: 'select', commonKey: 'selectRole', options: ['', 'test123', 'test', 'Management'] },
        { type: 'select', commonKey: 'allStatus', options: ['', '启用', '停用'] }
      ],
      actions: [
        { kind: 'search' },
        { kind: 'custom', labelKey: 'create', primary: true, action: 'sub-create' }
      ],
      columns: ['账号名', '姓名', '绑定角色', '状态', '管理余额账户', '管理广告账户', '最近登录时间', '创建时间', '操作'],
      rows: [
        { login: 'adstest', name: 'tyj', role: 'test123', status: '启用', balance: '1', ads: '1', lastLogin: '2026-08-04 14:16:41', created: '2026-08-04 10:49:29' },
        { login: 'tyj@test.com', name: 'test', role: 'test', status: '启用', balance: '5', ads: '0', lastLogin: '2026-07-23 16:49:03', created: '2026-07-23 15:38:49' },
        { login: 'test111@test.com', name: 'AM', role: 'Management', status: '启用', balance: '2', ads: '0', lastLogin: '-', created: '2026-04-28 15:57:49' },
        { login: 'pmtest1202@test.com', name: 'PM test', role: 'Management', status: '停用', balance: '1', ads: '0', lastLogin: '2025-12-02 11:06:13', created: '2025-12-02 11:02:27' },
        { login: 'test@qq.com', name: 'testname', role: 'test', status: '启用', balance: '3', ads: '0', lastLogin: '2026-07-23 16:29:01', created: '2025-12-02 10:49:45' }
      ]
    },
    'role-management': {
      toolbar: [
        { type: 'input', key: 'roleName' },
        { type: 'select', commonKey: 'allStatus', options: ['', '启用', '停用'] }
      ],
      actions: [
        { kind: 'search' },
        { kind: 'custom', labelKey: 'create', primary: true, action: 'role-create' }
      ],
      columns: ['角色名', '绑定用户数', '状态', '更新时间', '操作'],
      rows: [
        { name: '回归角色', users: '0', status: '停用', updated: '2026-08-04 10:52:46' },
        { name: 'test123', users: '1', status: '启用', updated: '2026-07-23 17:28:27' },
        { name: '测试用角色', users: '0', status: '停用', updated: '2026-07-23 17:14:23' },
        { name: 'Management', users: '2', status: '启用', updated: '2025-12-02 11:07:08' },
        { name: 'test', users: '2', status: '启用', updated: '2026-07-23 19:05:22' },
        { name: 'etest', users: '0', status: '启用', updated: '2025-12-02 10:46:46' }
      ]
    },
    'auto-recharge-rules': {
      toolbar: [
        { type: 'input', key: 'ruleName' }
      ],
      actions: [
        { kind: 'query' },
        { kind: 'custom', labelKey: 'create', primary: true, action: 'auto-create' }
      ],
      columns: ['规则名称', '账户数', '状态', '生效时间', '自动充值冷却期', '单日充值次数上限', '更新时间', '操作'],
      rows: [
        { name: 'test-txm', accounts: '1', status: '启用', activeTime: '2026-07-28 00:00:00 - 2026-07-28 00:00:00', cooldown: '3 小时', dailyLimit: '3 次/日', updated: '2026-07-28 14:55:31' },
        { name: 'it-test', accounts: '1', status: '停用', activeTime: '2026-02-01 00:00:00 - 2026-06-30 11:39:33', cooldown: '1 小时', dailyLimit: '3 次/日', updated: '2026-07-01 10:05:39' },
        { name: 'test', accounts: '2', status: '停用', activeTime: '2026-04-28 00:00:00 - 2026-05-31 00:00:00', cooldown: '3 小时', dailyLimit: '3 次/日', updated: '2026-06-30 09:45:31' },
        { name: 'test', accounts: '2', status: '停用', activeTime: '2026-04-28 00:00:00 - 2026-05-31 00:00:00', cooldown: '3 小时', dailyLimit: '3 次/日', updated: '2026-06-30 09:45:31' },
        { name: 'test', accounts: '2', status: '停用', activeTime: '2026-04-28 00:00:00 - 2026-05-31 00:00:00', cooldown: '3 小时', dailyLimit: '3 次/日', updated: '2026-06-30 09:45:31' }
      ]
    }
  };

  window.BESTADS_CLIENT_PAGES = {
    i18n: {
      'zh-CN': zh,
      'en-US': en
    },
    data: pageData
  };
})();
