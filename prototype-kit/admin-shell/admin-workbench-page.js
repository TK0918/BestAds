const workbenchPageRoot = document.getElementById('page-root');
if (workbenchPageRoot) {
  workbenchPageRoot.classList.add('workbench-page-root');
  workbenchPageRoot.innerHTML = String.raw`        <div class="admin-page">
          <section class="workbench-grid" aria-label="运营概览">
            <article class="admin-card workbench-card">
              <div class="workbench-card__icon"><i class="fas fa-users" aria-hidden="true"></i></div>
              <div>
                <p class="workbench-card__label">客户数量</p>
                <p class="workbench-card__value">1,247</p>
                <div class="workbench-card__meta"><span class="status-tag status-success">+12% 本月</span></div>
              </div>
            </article>
            <article class="admin-card workbench-card">
              <div class="workbench-card__icon"><i class="fas fa-list" aria-hidden="true"></i></div>
              <div>
                <p class="workbench-card__label">管理账户</p>
                <p class="workbench-card__value">3,456</p>
                <div class="workbench-card__meta"><span class="status-tag status-success">+8% 本月</span></div>
              </div>
            </article>
            <article class="admin-card workbench-card">
              <div class="workbench-card__icon"><i class="fas fa-clock" aria-hidden="true"></i></div>
              <div>
                <p class="workbench-card__label">待处理事项</p>
                <p class="workbench-card__value">23</p>
                <div class="workbench-card__meta"><span class="status-tag status-warning">待跟进</span></div>
              </div>
            </article>
            <article class="admin-card workbench-card">
              <div class="workbench-card__icon"><i class="fas fa-dollar-sign" aria-hidden="true"></i></div>
              <div>
                <p class="workbench-card__label">月度营收</p>
                <p class="workbench-card__value">$45.2K</p>
                <div class="workbench-card__meta"><span class="status-tag status-success">+15% 本月</span></div>
              </div>
            </article>
          </section>

          <section class="admin-card workbench-section">
            <div class="admin-card__header">
              <h2 class="admin-card__title">常用操作</h2>
            </div>
            <div class="admin-card__body">
              <div class="workbench-actions">
                <a class="admin-card workbench-action" href="customer-management.html"><div><strong>客户管理</strong><span>查看客户资料、权限、余额和跟进信息</span></div><i class="fas fa-chevron-right" aria-hidden="true"></i></a>
                <a class="admin-card workbench-action" href="customer-sub-account-management.html"><div><strong>客户子账号管理</strong><span>维护客户角色、子账号和密码重置</span></div><i class="fas fa-chevron-right" aria-hidden="true"></i></a>
                <a class="admin-card workbench-action" href="deduction-details.html"><div><strong>其他扣费</strong><span>处理地区税费预收、释放和回退</span></div><i class="fas fa-chevron-right" aria-hidden="true"></i></a>
                <a class="admin-card workbench-action" href="export-center.html"><div><strong>导出中心</strong><span>查看导出任务状态并下载文件</span></div><i class="fas fa-chevron-right" aria-hidden="true"></i></a>
              </div>
            </div>
          </section>

          <section class="admin-card workbench-section">
            <div class="admin-card__header">
              <h2 class="admin-card__title">待处理事项</h2>
              <span class="muted">测试环境样例</span>
            </div>
            <ul class="workbench-list">
              <li><strong>处理开户申请</strong><span>3 条待审核</span></li>
              <li><strong>账户充值</strong><span>5 条待处理</span></li>
              <li><strong>绑卡户数据核对</strong><span>2 条异常待确认</span></li>
              <li><strong>在线支付白名单</strong><span>1 条配置待检查</span></li>
            </ul>
          </section>
        </div>
`;
}
