(() => {
  const root = document.documentElement;
  const surfaceSelect = document.querySelector('#surfaceSelect');
  const h5ThemeSelect = document.querySelector('#h5ThemeSelect');
  const stateSelect = document.querySelector('#stateSelect');
  const tableDemo = document.querySelector('.table-demo');
  const drawer = document.querySelector('#demoDrawer');
  const backdrop = document.querySelector('#drawerBackdrop');
  const toast = document.querySelector('#toast');
  let toastTimer;

  const setActive = (selector, attr, value) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.classList.toggle('is-active', button.dataset[attr] === value);
    });
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const updateTokens = () => {
    const computed = getComputedStyle(root);
    const values = {
      primaryToken: computed.getPropertyValue('--color-primary').trim(),
      successToken: computed.getPropertyValue('--color-success').trim(),
      warningToken: computed.getPropertyValue('--color-warning').trim(),
      dangerToken: computed.getPropertyValue('--color-danger').trim(),
      infoToken: computed.getPropertyValue('--color-info').trim(),
      baseFontToken: root.dataset.surface === 'h5' || root.dataset.surface === 'admin' ? '14px' : '12px',
      controlHeightToken: computed.getPropertyValue('--control-height').trim(),
      radiusToken: root.dataset.surface === 'h5' ? '10px' : root.dataset.surface === 'admin' ? '4px' : '8px',
    };
    Object.entries(values).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    });
    const baseFontLabel = document.querySelector('#baseFontLabel');
    if (baseFontLabel) {
      baseFontLabel.textContent = root.dataset.surface === 'admin' ? 'AntD 页面基础字号' : root.dataset.surface === 'h5' ? 'H5 基础字号' : 'Web 基础字号';
    }
  };

  const updateComponentProfiles = () => {
    const surface = root.dataset.surface;
    const profiles = {
      'client-web': {
        'brand-mark': 'B',
        'brand-name': 'BestAds',
        'brand-caption': 'Prototype Kit',
        'surface-note': '客户端 Web：Element Plus\nH5：Varlet + UnoCSS\n运营端：Vben + Ant Design Vue + VXE Grid',
        'intro-title': '先确认组件，再应用到业务页面',
        'intro-copy': '这里展示基于真实客户端 Web 与 H5 前端上下文整理的视觉 Token、组件状态和业务组件。所有示例都是可交互的，确认后再迁移到现有原型。',
        'primitives-badge': 'BestQueryForm · BestTable · BestStatus',
        'type-copy': '12px compact enterprise UI / 14px mobile list',
        'token-help': 'Web 以 4px 网格和 16px 页面间距为基线；H5 卡片圆角为 10px。',
        button: 'el-button / BestButton',
        form: 'BestQueryForm · BestFormItem',
        status: 'BestStatus · BestStatusDot',
        table: 'BestTable · default page size: 20',
        'button-caption': 'Web 控件高度 32px、基础圆角 8px；H5 使用 Varlet 的按钮圆角和主题色映射。',
        'status-caption': '客户端 Web 使用 `BestStatus` dot + text；H5 使用 `var-chip size="mini"`。',
        'business-copy': '先验证资金、账户和移动端核心组件，再迁移到业务页面。',
        'business-badge': 'Wallet · Recharge · PlatformBadge',
      },
      h5: {
        'brand-mark': 'B',
        'brand-name': 'BestAds',
        'brand-caption': 'Prototype Kit',
        'surface-note': '客户端 Web：Element Plus\nH5：Varlet + UnoCSS\n运营端：Vben + Ant Design Vue + VXE Grid',
        'intro-title': '先确认组件，再应用到业务页面',
        'intro-copy': '这里展示基于真实客户端 Web 与 H5 前端上下文整理的视觉 Token、组件状态和业务组件。所有示例都是可交互的，确认后再迁移到现有原型。',
        'primitives-badge': 'var-button · var-input · var-list · var-chip',
        'type-copy': '14px mobile list / 40px touch control / Varlet theme',
        'token-help': 'H5 以 4px 网格和 40px 触控高度为基线；卡片圆角和颜色跟随 Varlet 主题。',
        button: 'var-button',
        form: 'AppHeader · var-input · var-tabs',
        status: 'var-chip size="mini" · rechargeStatus',
        table: 'var-list · var-card · infinite scroll: 10',
        'button-caption': 'H5 使用 Varlet 的按钮、主题色和触控高度；弹层采用底部 `var-popup`。',
        'status-caption': 'H5 状态使用 `var-chip size="mini"`，颜色跟随 Varlet 主题。',
        'business-copy': '先验证 `var-card`、`var-list`、金额表单和底部 popup，再迁移到 H5 页面。',
        'business-badge': 'var-card · var-list · var-popup',
      },
      admin: {
        'brand-mark': 'A',
        'brand-name': 'Ads',
        'brand-caption': '运营管理系统',
        'surface-note': '客户端 Web：Element Plus\nH5：Varlet + UnoCSS\n运营端：Vben + Ant Design Vue + VXE Grid',
        'intro-title': '先确认运营端组件，再组合成业务页面',
        'intro-copy': '这里以运营端真实前端上下文为基线，预览 Vben Form、Ant Design Vue、VXE Grid 及已确认使用的业务组件。页面原型按这些组件组合，前端只需微调数据和接口。',
        'primitives-badge': 'AntD Button · Vben Form · AntD Tag · VXE Grid',
        'type-copy': '14px AntD base font / 32px control / compact mode optional',
        'token-help': '运营端优先消费 AntD/Vben 语义 token；页面卡片、控件和表格圆角 4px，查询区保持高密度。',
        button: 'AntD Button · @ant-design/icons-vue',
        form: 'Vben Form · useVxeGridOptions',
        status: 'AntD Tag · local dict color',
        table: 'VXE Grid · useVbenVxeGrid · page size: 50',
        'button-caption': '运营端主动作使用 AntD `Button type="primary"`，行内操作使用 `type="link" size="small"`，权限由 `v-access:code` 控制。',
        'status-caption': '运营端状态从本地/远程 dict 读取 label 与 color，再输出 AntD `Tag`。',
        'business-copy': '运营端已确认的业务组件包括 `SummaryCards`、`DetailCard`、`EditListFields` 和 `ExportTaskModal`。',
        'business-badge': 'SummaryCards · DetailCard · ExportTask · EditListFields',
      },
    };
    Object.entries(profiles[surface] || profiles['client-web']).forEach(([key, value]) => {
      const node = document.querySelector(`[data-profile="${key}"]`);
      if (node) {
        if (key === 'surface-note') node.innerHTML = value.replace(/\n/g, '<br />');
        else node.textContent = value;
      }
    });
  };

  const setSurface = (surface) => {
    root.dataset.surface = surface;
    surfaceSelect.value = surface;
    updateTokens();
    updateComponentProfiles();
    showToast(`已切换到${surface === 'h5' ? '客户端 H5' : surface === 'admin' ? '运营端 Admin' : '客户端 Web'}`);
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    setActive('[data-theme]', 'theme', theme);
    updateTokens();
  };

  const setView = (view) => {
    root.dataset.view = view;
    setActive('[data-view]', 'view', view);
    showToast(view === 'mobile' ? '已切换到 375px 移动视口' : '已切换到桌面视口');
  };

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    document.body.classList.add('drawer-active');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('drawer-active');
    const drawerState = document.querySelector('#drawerState');
    if (drawerState) drawerState.hidden = true;
    const submitButton = document.querySelector('#submitDrawer');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '确认充值';
    }
  };

  surfaceSelect.addEventListener('change', (event) => setSurface(event.target.value));
  h5ThemeSelect.addEventListener('change', (event) => {
    root.dataset.h5Theme = event.target.value;
    if (root.dataset.surface === 'h5') {
      root.dataset.theme = event.target.value.includes('dark') ? 'dark' : 'light';
      setActive('[data-theme]', 'theme', root.dataset.theme);
      updateTokens();
    }
    showToast(`H5 主题：${event.target.value}`);
  });

  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.addEventListener('click', () => setTheme(button.dataset.theme));
  });
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
  stateSelect.addEventListener('change', (event) => {
    tableDemo.dataset.demoState = event.target.value;
    showToast(`表格状态：${event.target.options[event.target.selectedIndex].text}`);
  });

  document.querySelectorAll('[data-open-drawer]').forEach((button) => button.addEventListener('click', openDrawer));
  document.querySelectorAll('[data-close-drawer]').forEach((button) => button.addEventListener('click', closeDrawer));
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  document.querySelectorAll('[data-retry]').forEach((button) => button.addEventListener('click', () => {
    stateSelect.value = 'loading';
    tableDemo.dataset.demoState = 'loading';
    window.setTimeout(() => {
      stateSelect.value = 'default';
      tableDemo.dataset.demoState = 'default';
      showToast('查询完成');
    }, 900);
  }));

  document.querySelectorAll('[data-amount]').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#amountInput').value = `${Number(button.dataset.amount).toFixed(2)}`;
    document.querySelectorAll('[data-amount]').forEach((item) => item.classList.toggle('is-active', item === button));
  }));
  document.querySelectorAll('[data-drawer-amount]').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#drawerAmount').value = `${Number(button.dataset.drawerAmount).toFixed(2)}`;
    document.querySelectorAll('[data-drawer-amount]').forEach((item) => item.classList.toggle('is-active', item === button));
  }));

  document.querySelector('#submitDrawer').addEventListener('click', () => {
    const button = document.querySelector('#submitDrawer');
    const drawerState = document.querySelector('#drawerState');
    button.disabled = true;
    button.innerHTML = '<i class="spinner"></i>提交中';
    window.setTimeout(() => {
      drawerState.hidden = false;
      button.innerHTML = '已提交';
      showToast('充值单已创建，状态为处理中');
    }, 650);
  });

  document.querySelector('#resetDemo').addEventListener('click', () => {
    setSurface('client-web');
    root.dataset.h5Theme = 'md2-light';
    h5ThemeSelect.value = 'md2-light';
    setTheme('light');
    setView('desktop');
    stateSelect.value = 'default';
    tableDemo.dataset.demoState = 'default';
    closeDrawer();
    showToast('已恢复默认预览状态');
  });

  document.querySelectorAll('.side-nav__item').forEach((item) => item.addEventListener('click', () => {
    document.querySelectorAll('.side-nav__item').forEach((navItem) => navItem.classList.remove('is-active'));
    item.classList.add('is-active');
  }));

  updateTokens();
  updateComponentProfiles();
})();
