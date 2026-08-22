const customerPageRoot = document.getElementById('page-root');
if (customerPageRoot) {
  customerPageRoot.classList.add('customer-management-root');
  customerPageRoot.innerHTML = String.raw`        <div class="customer-page-content">
          <section class="admin-filter-card" aria-label="客户查询条件">
            <div class="admin-filter-grid">
              <label class="admin-field"><span>商户ID内容</span><input id="filterMerchantIds" type="text" inputmode="numeric" placeholder="粘贴商户ID，一行一个，或使用空格/逗号分隔" /></label>
              <label class="admin-field"><span>客户名称</span><input id="filterCustomerName" type="text" placeholder="请输入客户名称" /></label>
              <label class="admin-field"><span>登录账号</span><input id="filterLoginAccount" type="text" placeholder="请输入登录账号" /></label>
              <label class="admin-field"><span>客户状态</span><select id="filterCustomerStatus"><option value="">全部</option><option value="enabled">启用</option><option value="disabled">停用</option></select></label>
              <label class="admin-field"><span>开户费状态</span><select id="filterOpeningFeeStatus"><option value="">全部</option><option value="未收取">未收取</option><option value="已收取">已收取</option><option value="不收取">不收取</option></select></label>
              <label class="admin-field"><span>客户级别</span><select id="filterCustomerLevel"><option value="">全部</option><option value="S">S</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></label>
              <label class="admin-field"><span>BD</span><input id="filterBd" type="text" placeholder="请选择BD" /></label>
              <label class="admin-field"><span>AM</span><input id="filterAm" type="text" placeholder="请选择AM" /></label>
            </div>
            <div class="admin-filter-actions">
              <button type="button" class="admin-button" onclick="resetCustomerFilters()">重置</button>
              <button type="button" class="admin-button admin-button--primary" onclick="searchCustomers()"><i class="fas fa-search mr-2"></i>查询</button>
            </div>
          </section>

          <section class="admin-grid-card" aria-label="客户列表">
            <div class="admin-command-bar">
              <div class="admin-command-group">
                <button type="button" class="admin-button admin-button--primary" onclick="openModal('add')"><i class="fas fa-plus mr-2"></i>添加客户</button>
                <button type="button" class="admin-button admin-button--primary admin-button--permission" onclick="openDefaultPermissionModal()"><i class="fas fa-shield-alt mr-2"></i>客户默认权限</button>
                <button id="batchEditButton" type="button" class="admin-button" onclick="openBatchEditModal()" disabled><i class="fas fa-pen mr-2"></i>批量修改</button>
                <button id="batchPermissionButton" type="button" class="admin-button" onclick="openBatchPermissionModal()" disabled><i class="fas fa-power-off mr-2"></i>批量功能开关</button>
              </div>
              <div class="admin-command-group">
                <button type="button" class="admin-button" onclick="openCustomizeFields()"><i class="fas fa-list mr-2"></i>自定义字段</button>
                <button type="button" class="admin-button admin-button--primary" onclick="showNotification('导出为原型演示，未执行真实导出', 'info')"><i class="fas fa-download mr-2"></i>导出数据</button>
              </div>
            </div>
            <div class="admin-grid-scroll">
              <table class="admin-grid-table" aria-describedby="customerTableSummary">
                <thead id="tableHead"></thead>
                <tbody id="tableBody"></tbody>
              </table>
            </div>
            <div class="admin-pagination" id="customerTableSummary">
              <select id="pageSize" aria-label="每页条数"><option value="20">20条/页</option><option value="50" selected>50条/页</option><option value="100">100条/页</option><option value="200">200条/页</option><option value="500">500条/页</option></select>
              <span>共 <strong class="admin-total-count">481</strong> 条</span>
              <span class="admin-page-range">1-50</span>
              <div class="admin-page-buttons" role="navigation" aria-label="分页">
                <button type="button" aria-label="上一页" disabled><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="is-active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">4</button>
                <button type="button">5</button>
                <button type="button" aria-label="下一页"><i class="fas fa-chevron-right"></i></button>
              </div>
            </div>
          </section>
        </div>
`;
  document.body.insertAdjacentHTML('beforeend', String.raw`  <!-- 添加客户模态框 -->
  <div id="addModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">添加客户</h3>
            <button onclick="closeModal('addModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="px-6 py-4" onsubmit="submitAddCustomer(event)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户名称 *</label>
              <input type="text" name="customerName" placeholder="请输入客户名称" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址 *</label>
              <input type="email" name="email" placeholder="请输入邮箱地址" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">登录密码 *</label>
              <input type="password" name="password" placeholder="请输入登录密码" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">沟通渠道 *</label>
              <select name="communicationChannel" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">请选择沟通渠道</option>
                <option value="email">邮箱</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="wechat">微信</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
              <input type="text" name="contactInfo" placeholder="请输入联系方式" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户来源 *</label>
              <select name="customerSource" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">请选择客户来源</option>
                <option value="organic">自然注册</option>
                <option value="referral">推荐注册</option>
                <option value="marketing">营销获客</option>
                <option value="partner">合作伙伴</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">介绍人</label>
              <input type="text" name="referrer" placeholder="请输入介绍人信息（选填）" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">本字段为自由文本备忘. 可结算的介绍人绑定与吐点请以 <a href="introducer-spitpoint.html#list" class="text-blue-600 hover:underline">介绍人列表</a>、<a href="introducer-spitpoint.html#relations" class="text-blue-600 hover:underline">介绍人关系</a> (「介绍人和吐点」页内 Tab) 的结构化数据为准.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户网站</label>
              <input type="url" name="website" placeholder="请输入客户网站（选填）" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">商业类型 *</label>
              <select name="businessType" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">请选择商业类型</option>
                <option value="ecommerce">电商</option>
                <option value="saas">SaaS软件</option>
                <option value="gaming">游戏</option>
                <option value="finance">金融</option>
                <option value="education">教育</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">合作状态 *</label>
              <select name="cooperationStatus" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">请选择合作状态</option>
                <option value="trial">试用期</option>
                <option value="active">活跃合作</option>
                <option value="inactive">暂停合作</option>
              </select>
            </div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg mt-4">
            <p class="text-sm text-blue-700">
              <i class="fas fa-info-circle mr-2"></i>
              系统将自动创建团队：<span class="font-medium">[客户名称]的团队</span>，团队状态默认为启用
            </p>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" onclick="closeModal('addModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              取消
            </button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200">
              添加客户
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 编辑客户模态框 -->
  <div id="editModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">编辑客户信息</h3>
            <button onclick="closeModal('editModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="px-6 py-4" onsubmit="submitEditCustomer(event)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户ID</label>
              <input type="text" name="customerId" readonly class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
              <input type="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户状态</label>
              <select name="customerStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="enabled">启用</option>
                <option value="disabled">停用</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">沟通渠道</label>
              <select name="communicationChannel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="email">邮箱</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="wechat">微信</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
              <input type="text" name="contactInfo" placeholder="请输入联系方式" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户来源</label>
              <select name="customerSource" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="organic">自然注册</option>
                <option value="referral">推荐注册</option>
                <option value="marketing">营销获客</option>
                <option value="partner">合作伙伴</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">介绍人</label>
              <input type="text" name="referrer" placeholder="请输入介绍人信息" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">本字段为自由文本备忘. 可结算的介绍人绑定与吐点请以 <a href="introducer-spitpoint.html#list" class="text-blue-600 hover:underline">介绍人列表</a>、<a href="introducer-spitpoint.html#relations" class="text-blue-600 hover:underline">介绍人关系</a> (「介绍人和吐点」页内 Tab) 的结构化数据为准.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户网站</label>
              <input type="url" name="website" placeholder="请输入客户网站" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">团队名称</label>
              <input type="text" name="teamName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">商业类型</label>
              <select name="businessType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="ecommerce">电商</option>
                <option value="saas">SaaS软件</option>
                <option value="gaming">游戏</option>
                <option value="finance">金融</option>
                <option value="education">教育</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">合作状态</label>
              <select name="cooperationStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="active">活跃合作</option>
                <option value="inactive">暂停合作</option>
                <option value="trial">试用期</option>
                <option value="terminated">终止合作</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">团队状态</label>
              <select name="teamStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="enabled">启用</option>
                <option value="disabled">停用</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" onclick="closeModal('editModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              取消
            </button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200">
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 调整额度模态框 -->
  <div id="quotaModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">调整额度</h3>
            <button onclick="closeModal('quotaModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="px-6 py-4" onsubmit="submitQuotaAdjustment(event)">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户ID</label>
              <input type="text" name="customerId" readonly class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">调整类型 *</label>
              <select name="adjustmentType" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">请选择调整类型</option>
                <option value="increase">增加</option>
                <option value="decrease">减少</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">调整额度 *</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input type="number" name="adjustmentAmount" step="0.01" min="0.01" placeholder="0.00" required class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">调整原因 *</label>
              <textarea name="adjustmentReason" required placeholder="请输入调整原因" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <p class="text-sm text-yellow-700">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                此操作将发起额度调整申请，需要上级审核
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" onclick="closeModal('quotaModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              取消
            </button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors duration-200">
              提交申请
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 字段自定义模态框 -->
  <div id="customizeFieldsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">自定义列表字段</h3>
            <button onclick="closeModal('customizeFieldsModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 可用字段 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">可用字段</h4>
              <div class="border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto">
                <ul id="availableFields" class="space-y-2">
                  <!-- 动态生成可用字段 -->
                </ul>
              </div>
            </div>
            
            <!-- 已选字段 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">已选字段（可拖拽排序）</h4>
              <div class="border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto">
                <ul id="selectedFields" class="space-y-2">
                  <!-- 动态生成已选字段 -->
                </ul>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-6">
            <div class="flex space-x-2">
              <button onclick="resetToDefault()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                重置为默认
              </button>
            </div>
            <div class="flex space-x-3">
              <button onclick="closeModal('customizeFieldsModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                取消
              </button>
              <button onclick="applyFieldSettings()" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200">
                应用设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 客户默认权限模态框 -->
  <div id="defaultPermissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full animate-fadeIn default-permission-dialog">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">客户默认权限</h3>
            <button type="button" onclick="closeModal('defaultPermissionModal')" class="text-gray-400 hover:text-gray-600" aria-label="关闭">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="default-permission-form" onsubmit="handleDefaultPermissionsSubmit(event)">
          <div class="default-permission-section-title">权限分配</div>
          <div id="defaultPermissionTreeContainer" class="default-permission-tree"></div>
          <div class="default-permission-footer">
            <button type="button" onclick="closeModal('defaultPermissionModal')" class="admin-button">取 消</button>
            <button type="submit" class="admin-button admin-button--primary">确 定</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 二次确认弹窗 -->
  <div id="confirmDefaultPermissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">确认设置</h3>
            <button onclick="closeModal('confirmDefaultPermissionModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              仅影响后续新建的客户
            </p>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            确定要保存这些默认权限设置吗？此设置将作为所有后续新增客户的默认权限。
          </p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onclick="closeModal('confirmDefaultPermissionModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
            取消
          </button>
          <button onclick="confirmDefaultPermissions()" class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors duration-200">
            确认保存
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 重置密码确认弹窗 -->
  <div id="resetPasswordModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl w-full animate-fadeIn reset-password-dialog">
        <div class="reset-password-content">
          <div class="reset-password-icon" aria-hidden="true"><i class="fas fa-exclamation"></i></div>
          <div class="reset-password-copy">
            <p id="resetPasswordMessage">确定要重置该客户的登录密码吗？</p>
            <p class="reset-password-result">重置后的密码为：<span>Ad8899Init</span></p>
          </div>
        </div>
        <div class="reset-password-actions">
          <button type="button" onclick="closeModal('resetPasswordModal')" class="admin-button">取 消</button>
          <button type="button" onclick="confirmResetPassword()" class="admin-button admin-button--primary">确 定</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 修改登录账号弹窗 -->
  <div id="updateEmailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">修改登录账号</h3>
            <button type="button" onclick="closeModal('updateEmailModal')" class="text-gray-400 hover:text-gray-600" aria-label="关闭"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <form class="px-6 py-5" onsubmit="submitUpdateEmail(event)">
          <label class="block text-sm font-medium text-gray-700 mb-2">客户ID</label>
          <input type="text" name="customerId" readonly class="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          <label class="block text-sm font-medium text-gray-700 mb-2">登录账号</label>
          <input type="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" onclick="closeModal('updateEmailModal')" class="admin-button">取 消</button>
            <button type="submit" class="admin-button admin-button--primary">确 定</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 批量客户功能开关模态框 -->
  <div id="batchPermissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl w-full animate-fadeIn batch-modal-dialog">
        <div class="batch-modal-header">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">批量功能开关（已选 <span id="batchPermissionSelectedCount">0</span> 个客户）</h3>
            <button type="button" onclick="closeModal('batchPermissionModal')" class="text-gray-400 hover:text-gray-600" aria-label="关闭">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="batch-modal-form" onsubmit="handleBatchPermissionsSubmit(event)">
          <div class="batch-permission-section">
            <label class="batch-modal-label"><span class="batch-modal-required">*</span>选择功能项</label>
            <div id="batchPermissionTreeContainer" class="batch-permission-tree"></div>
          </div>
          <div class="batch-permission-section">
            <div class="batch-modal-label"><span class="batch-modal-required">*</span>选择操作</div>
            <div class="batch-action-options">
              <label><input type="radio" name="batchAction" value="enable" required>开启功能</label>
              <label><input type="radio" name="batchAction" value="disable">关闭功能</label>
            </div>
          </div>
          <div class="batch-modal-footer">
            <button type="button" onclick="closeModal('batchPermissionModal')" class="admin-button">取 消</button>
            <button type="submit" class="admin-button admin-button--primary">确 定</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 客户权限管理模态框 -->
  <div id="permissionManagementModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">客户权限管理</h3>
            <button onclick="closeModal('permissionManagementModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="px-6 py-4" onsubmit="handleCustomerPermissionsSubmit(event)">
          <input type="hidden" id="permissionCustomerIdInput" name="customerId">
          
          <!-- 客户信息展示 -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 uppercase mb-3">客户信息</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">商户ID</p>
                  <p class="text-sm font-medium text-gray-900" id="customerMerchantId">-</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">商户名称</p>
                  <p class="text-sm font-medium text-gray-900" id="customerMerchantName">-</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">商户邮箱</p>
                  <p class="text-sm font-medium text-gray-900" id="customerMerchantEmail">-</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 权限树形结构 -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">权限配置</h4>
            <p class="text-sm text-gray-500 mb-3">权限枚举来源：<a href="../system-settings/client-menu.html" class="text-blue-600 hover:underline">系统设置 → 客户端菜单</a></p>
            <div class="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div class="space-y-2" id="permissionTreeContainer">
                <!-- 动态生成权限树 -->
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" onclick="closeModal('permissionManagementModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              取消
            </button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors duration-200">
              确认修改
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 客户权限二次确认弹窗 -->
  <div id="confirmCustomerPermissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">确认修改</h3>
            <button onclick="closeModal('confirmCustomerPermissionModal')" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              确定要修改该客户的权限配置吗？
            </p>
          </div>
          <div id="customerConfirmContent" class="text-sm text-gray-600 mb-4">
            <!-- 动态内容将通过JavaScript填充 -->
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onclick="closeModal('confirmCustomerPermissionModal')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
            取消
          </button>
          <button onclick="confirmCustomerPermissions()" class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors duration-200">
            确认保存
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 批量修改客户模态框 -->
  <div id="batchEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl w-full animate-fadeIn batch-modal-dialog">
        <div class="batch-modal-header">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">批量修改客户信息（已选 <span id="batchEditSelectedCount">0</span> 个商户）</h3>
            <button type="button" onclick="closeModal('batchEditModal')" class="text-gray-400 hover:text-gray-600" aria-label="关闭">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="batch-modal-form" onsubmit="submitBatchEdit(event)">
          <div class="batch-modal-label"><span class="batch-modal-required">*</span>批量修改字段</div>
          <select id="batchFieldSelect" required onchange="renderBatchValueInput()">
            <option value="">选择需要批量修改的字段</option>
          </select>
          <div id="batchValueInputContainer" class="mt-4"></div>
          <div class="batch-modal-footer">
            <button type="button" onclick="closeModal('batchEditModal')" class="admin-button">取 消</button>
            <button type="submit" class="admin-button admin-button--primary">确 定</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="openingFeeStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-backdrop hidden z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full animate-fadeIn">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">修改开户费状态</h3>
            <button type="button" onclick="closeModal('openingFeeStatusModal')" class="text-gray-400 hover:text-gray-600" aria-label="关闭">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <form class="px-6 py-4" onsubmit="submitOpeningFeeStatus(event)">
          <input type="hidden" id="openingFeeStatusCustomerId">
          <div class="grid grid-cols-1 gap-4">
            <p class="text-sm text-gray-500">按商户计，同一商户下所有客户共用一次开户费。回退其他扣费只退钱，不会改这个状态。</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">商户ID</label>
              <div id="openingFeeStatusMerchantId" class="text-sm text-gray-900">-</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">客户名称</label>
              <div id="openingFeeStatusCustomerName" class="text-sm text-gray-900">-</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">开户费状态</label>
              <select id="openingFeeStatusSelect" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="未收取">未收取</option>
                <option value="已收取">已收取</option>
                <option value="不收取">不收取</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" onclick="closeModal('openingFeeStatusModal')" class="admin-button">取 消</button>
            <button type="submit" class="admin-button admin-button--primary">确 定</button>
          </div>
        </form>
      </div>
    </div>
  </div>`);
}

    // 全局变量
    let allFields = [
      { key: 'customerId', label: '客户ID', width: '100px', sortable: true },
      { key: 'customerName', label: '客户名称', width: '150px' },
      { key: 'merchantId', label: '商户ID', width: '180px', sortable: true },
      { key: 'openingFeeStatus', label: '开户费状态', width: '120px' },
      { key: 'customerLevel', label: '客户级别', width: '100px' },
      { key: 'bd', label: 'BD', width: '220px' },
      { key: 'am', label: 'AM', width: '220px' },
      { key: 'customerStatus', label: '客户状态', width: '100px' },
      { key: 'defaultCurrency', label: '币种', width: '100px' },
      { key: 'currentBalance', label: '当前余额', width: '100px', align: 'right', sortable: true },
      { key: 'usedCredit', label: '已用额度', width: '100px', align: 'right', sortable: true },
      { key: 'creditLimit', label: '信用额度', width: '100px', align: 'right', sortable: true },
      { key: 'prepaidLimit', label: '预充金额上限', width: '120px', align: 'right', sortable: true },
      { key: 'remainingPrepaidAmount', label: '剩余预充金额', width: '120px', align: 'right', sortable: true },
      { key: 'availableBalance', label: '可用余额', width: '100px', align: 'right', sortable: true },
      { key: 'realAmount', label: '真实金额', width: '100px', align: 'right', sortable: true },
      { key: 'frozenAmount', label: '冻结金额', width: '100px', align: 'right', sortable: true },
      { key: 'registerTime', label: '注册时间', width: '150px' },
      { key: 'lastLoginTime', label: '最近登录', width: '150px' },
      { key: 'actions', label: '操作', width: '360px' }
    ];

    // 默认显示真实运营端客户列表的 19 个业务列，选择列由表格渲染器固定追加
    let defaultFields = allFields.map(field => field.key);
    
    // 当前显示的字段
    let currentFields = [...defaultFields];
    let filteredCustomerData = [];
    let hasAppliedFilter = false;
    let selectedCustomerIds = new Set();
    let sortState = { key: null, order: null };

    const batchEditableFields = {
      customerStatus: {
        label: '客户状态',
        type: 'enum',
        options: [
          { value: 'enabled', label: '启用' },
          { value: 'disabled', label: '停用' }
        ]
      },
      customerLevel: {
        label: '客户级别',
        type: 'enum',
        options: [
          { value: 'S', label: 'S' },
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' }
        ]
      },
      am: { label: 'AM', type: 'text' },
      bd: { label: 'BD', type: 'text' },
      customerSource: {
        label: '客户来源',
        type: 'enum',
        options: [
          { value: 'organic', label: '自然注册' },
          { value: 'referral', label: '推荐注册' },
          { value: 'marketing', label: '营销获客' },
          { value: 'partner', label: '合作伙伴' }
        ]
      },
      referrer: { label: '介绍人', type: 'text' },
      businessType: {
        label: '商业类型',
        type: 'enum',
        options: [
          { value: 'ecommerce', label: '电商' },
          { value: 'saas', label: 'SaaS软件' },
          { value: 'gaming', label: '游戏' },
          { value: 'finance', label: '金融' },
          { value: 'education', label: '教育' },
          { value: 'other', label: '其他' }
        ]
      },
      cooperationStatus: {
        label: '合作状态',
        type: 'enum',
        options: [
          { value: 'active', label: '活跃合作' },
          { value: 'inactive', label: '暂停合作' },
          { value: 'trial', label: '试用期' },
          { value: 'terminated', label: '终止合作' }
        ]
      },
      teamStatus: {
        label: '团队状态',
        type: 'enum',
        options: [
          { value: 'enabled', label: '启用' },
          { value: 'disabled', label: '停用' }
        ]
      }
    };

    // 模拟客户数据：按测试环境客户管理页的真实字段顺序、格式和样例数据对齐。
    const mockCustomerDefaults = {
      merchantName: '',
      merchantEmail: '',
      loginAccount: '',
      email: '',
      customerStatus: 'enabled',
      permissions: [],
      communicationChannel: 'email',
      contactInfo: '',
      customerSource: 'organic',
      referrer: '',
      website: '',
      teamId: '',
      teamName: '',
      businessType: 'ecommerce',
      cooperationStatus: 'active',
      teamStatus: 'enabled',
      remainingCredit: 0
    };

    function merchantOpeningFeeStatusOf(merchantId) {
      return window.BESTADS_OPENING_FEE_HELPERS ? window.BESTADS_OPENING_FEE_HELPERS.merchantStatus(merchantId) : '已收取';
    }

    function openOpeningFeeStatusModal(customerId) {
      const customer = customerData.find(item => item.customerId === customerId);
      if (!customer) return;
      document.getElementById('openingFeeStatusCustomerId').value = customerId;
      document.getElementById('openingFeeStatusMerchantId').textContent = customer.merchantId || '-';
      document.getElementById('openingFeeStatusCustomerName').textContent = customer.customerName || '-';
      document.getElementById('openingFeeStatusSelect').value = merchantOpeningFeeStatusOf(customer.merchantId);
      document.getElementById('openingFeeStatusModal').classList.remove('hidden');
    }

    function submitOpeningFeeStatus(event) {
      event.preventDefault();
      const customerId = document.getElementById('openingFeeStatusCustomerId').value;
      const customer = customerData.find(item => item.customerId === customerId);
      const status = document.getElementById('openingFeeStatusSelect').value;
      if (customer && window.BESTADS_OPENING_FEE_HELPERS) {
        window.BESTADS_OPENING_FEE_HELPERS.setMerchantStatus(customer.merchantId, status);
      }
      closeModal('openingFeeStatusModal');
      renderTable();
      showNotification('已更新商户开户费状态（原型）。退钱不会自动改这个状态。', 'success');
    }

    let customerData = [
      { ...mockCustomerDefaults, customerId: '4901', merchantId: '19901', customerName: '新客首次开户', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 800, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 800, realAmount: 800, frozenAmount: 0, registerTime: '2026-08-22 09:08:16', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '4801', merchantId: '18888', customerName: '内部免开户费', customerLevel: 'A', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 2600, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 2600, realAmount: 2600, frozenAmount: 0, registerTime: '2026-08-20 10:12:08', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '2688', merchantId: '11894', customerName: '测试用户_1777106273', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 3260, usedCredit: 820, creditLimit: 2000, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 2980, realAmount: 2800, frozenAmount: 0, registerTime: '2026-08-12 10:20:11', lastLoginTime: '2026-08-12 11:08:42' },
      { ...mockCustomerDefaults, customerId: '102', merchantId: '1128', customerName: 'adstest', customerLevel: 'A', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 860, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 640, realAmount: 640, frozenAmount: 0, registerTime: '2026-07-01 09:12:00', lastLoginTime: '2026-08-14 10:05:44' },
      { ...mockCustomerDefaults, customerId: '3472', merchantId: '14229', customerName: 'test金额变动', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 12480, usedCredit: 1320, creditLimit: 5000, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 11200, realAmount: 10800, frozenAmount: 0, registerTime: '2026-07-18 14:20:00', lastLoginTime: '2026-08-14 09:20:11' },
      { ...mockCustomerDefaults, customerId: '4770', merchantId: '17794', customerName: '开户取消样例', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 420, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 420, realAmount: 420, frozenAmount: 0, registerTime: '2026-08-01 11:16:20', lastLoginTime: '2026-08-10 16:08:02' },
      { ...mockCustomerDefaults, customerId: '3599', merchantId: '14656', customerName: '测试用户_1786008619', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-08-06 17:30:19', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3596', merchantId: '14651', customerName: '测试用户_1785922215', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-08-05 17:30:15', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3594', merchantId: '14633', customerName: '测试用户_1785749411', customerLevel: '', bd: '', am: '李志伟 (lizhiwei@bestfulfill.com)', defaultCurrency: 'USD', currentBalance: -1, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-08-03 17:30:11', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3593', merchantId: '13500', customerName: 'liyan', customerLevel: '', bd: '', am: '', defaultCurrency: 'GBP', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-08-03 17:10:54', lastLoginTime: '2026-08-03 17:11:49' },
      { ...mockCustomerDefaults, customerId: '3592', merchantId: '14619', customerName: '测试用户_1785663017', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 99, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 99, realAmount: 99, frozenAmount: 0, registerTime: '2026-08-02 17:30:17', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3590', merchantId: '14612', customerName: '测试用户_1785490214', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-07-31 17:30:15', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3589', merchantId: '14606', customerName: 'BestAds接口测试', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 99999919.99, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 99999919.99, realAmount: 99999919.99, frozenAmount: 0, registerTime: '2026-07-30 17:36:01', lastLoginTime: '2026-08-06 17:33:55' },
      { ...mockCustomerDefaults, customerId: '3588', merchantId: '14605', customerName: '测试用户_1785403815', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 99999888.99, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 99999888.99, realAmount: 99999888.99, frozenAmount: 0, registerTime: '2026-07-30 17:30:15', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3587', merchantId: '14603', customerName: 'test测试', customerLevel: '', bd: '吴文锐 (wuwenrui@bestfulfill.com)', am: '李志伟 (lizhiwei@bestfulfill.com)', defaultCurrency: 'USD', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-07-30 11:32:37', lastLoginTime: '2026-07-30 11:34:26' },
      { ...mockCustomerDefaults, customerId: '3584', merchantId: '14598', customerName: '测试用户_1785231015', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: -10, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-07-28 17:30:15', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3579', merchantId: '14581', customerName: '测试用户_1784971810', customerLevel: '', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 102.05, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 102.05, realAmount: 102.05, frozenAmount: 0, registerTime: '2026-07-25 17:30:10', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3577', merchantId: '14568', customerName: 'test测试用户10', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'USD', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-07-24 10:45:53', lastLoginTime: '2026-07-30 10:51:21' },
      { ...mockCustomerDefaults, customerId: '3576', merchantId: '14567', customerName: 'test测试币种EUR', customerLevel: 'B', bd: '', am: '', defaultCurrency: 'EUR', currentBalance: 0, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 0, realAmount: 0, frozenAmount: 0, registerTime: '2026-07-24 10:36:55', lastLoginTime: '-' },
      { ...mockCustomerDefaults, customerId: '3575', merchantId: '14566', customerName: 'test测试币种GBP', customerLevel: 'A', bd: '谭英就 (tanyingjiu@bestfulfill.com)', am: '邓港(denggang@bestfulfill.com)', defaultCurrency: 'GBP', currentBalance: 99857.4, usedCredit: 0, creditLimit: 0, prepaidLimit: 0, remainingPrepaidAmount: 0, availableBalance: 99857.4, realAmount: 99857.4, frozenAmount: 0, registerTime: '2026-07-24 10:35:14', lastLoginTime: '2026-07-24 14:50:08' }
    ];

    function applyTheme(theme) {
      const isDark = theme === 'dark';
      document.body.classList.toggle('theme-dark', isDark);
      const toggleButton = document.getElementById('themeToggleButton');
      if (toggleButton) {
        const icon = toggleButton.querySelector('i');
        if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        toggleButton.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
        toggleButton.setAttribute('title', isDark ? '切换浅色模式' : '切换深色模式');
      }
      try { localStorage.setItem('bestads-theme', isDark ? 'dark' : 'light'); } catch (error) { /* file:// 场景可能不可用 */ }
    }

    function initTheme() {
      let savedTheme = 'light';
      try { savedTheme = localStorage.getItem('bestads-theme') || 'light'; } catch (error) { /* 使用默认浅色 */ }
      applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
    }

    function toggleTheme() {
      applyTheme(document.body.classList.contains('theme-dark') ? 'light' : 'dark');
    }

    // 初始化页面
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      filteredCustomerData = [...customerData];
      initBatchFieldSelect();
      renderTable();
      updatePaginationSummary();
      syncBatchActionButtons();
    });

    // 渲染表格
    function renderTable() {
      renderTableHeader();
      renderTableBody();
    }

    // 渲染表头
    function renderTableHeader() {
      const tableHead = document.getElementById('tableHead');
      const headerRow = document.createElement('tr');
      const selectedRows = getDisplayedCustomers().filter(customer => selectedCustomerIds.has(customer.customerId));

      const checkboxTh = document.createElement('th');
      checkboxTh.className = 'admin-check-col';
      checkboxTh.innerHTML = `
        <input id="selectAllCustomers" type="checkbox" ${selectedRows.length > 0 && selectedRows.length === getDisplayedCustomers().length ? 'checked' : ''} onchange="toggleSelectAllCustomers(this.checked)" aria-label="全选客户" class="rounded border-gray-300 text-blue-600">
      `;
      headerRow.appendChild(checkboxTh);
      
      currentFields.forEach(fieldKey => {
        const field = allFields.find(f => f.key === fieldKey);
        if (field) {
          const th = document.createElement('th');
          th.style.width = field.width;
          th.style.minWidth = field.width;
          if (field.align === 'right') th.style.textAlign = 'right';
          if (fieldKey === 'actions') th.className = 'admin-operation-col';
          if (field.sortable) {
            const ascActive = sortState.key === fieldKey && sortState.order === 'asc' ? 'is-active' : '';
            const descActive = sortState.key === fieldKey && sortState.order === 'desc' ? 'is-active' : '';
            th.innerHTML = `
              <button type="button" class="admin-sort-header ${field.align === 'right' ? 'is-right' : ''}" onclick="toggleSort('${fieldKey}')" aria-label="按${field.label}排序">
                <span>${field.label}</span>
                <span class="admin-sort-icons" aria-hidden="true">
                  <i class="fas fa-caret-up ${ascActive}"></i>
                  <i class="fas fa-caret-down ${descActive}"></i>
                </span>
              </button>
            `;
          } else {
            th.textContent = field.label;
          }
          headerRow.appendChild(th);
        }
      });
      
      tableHead.innerHTML = '';
      tableHead.appendChild(headerRow);
    }

    // 渲染表格内容
    function renderTableBody() {
      const tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';

      getDisplayedCustomers().forEach(customer => {
        const row = document.createElement('tr');
        const checked = selectedCustomerIds.has(customer.customerId);

        const checkboxTd = document.createElement('td');
        checkboxTd.className = 'admin-check-col';
        checkboxTd.innerHTML = `
          <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleCustomerSelection('${customer.customerId}', this.checked)" aria-label="选择客户 ${customer.customerId}" class="rounded border-gray-300 text-blue-600">
        `;
        row.appendChild(checkboxTd);
        
        currentFields.forEach(fieldKey => {
          const td = document.createElement('td');
          if (fieldKey === 'actions') td.className = 'admin-operation-col';
          const field = allFields.find(f => f.key === fieldKey);
          if (field && field.align === 'right') td.style.textAlign = 'right';
          
          switch(fieldKey) {
            case 'customerId':
              td.innerHTML = `<span>${customer.customerId}</span>`;
              break;
            case 'customerName':
              td.innerHTML = `<span>${customer.customerName || customer.merchantName || '-'}</span>`;
              break;
            case 'merchantId':
              td.innerHTML = `<span>${customer.merchantId || '-'}</span>`;
              break;
            case 'openingFeeStatus':
              const openingFeeStatus = merchantOpeningFeeStatusOf(customer.merchantId);
              const openingFeeStatusClass = openingFeeStatus === '未收取' ? 'admin-tag--danger' : openingFeeStatus === '不收取' ? 'admin-tag--level' : 'admin-tag--success';
              td.innerHTML = `<span class="admin-tag ${openingFeeStatusClass}">${openingFeeStatus}</span>`;
              break;
            case 'customerLevel':
              const levelMap = { S: 'S', A: 'A', B: 'B', C: 'C', D: 'D', normal: '普通', vip: 'VIP', svip: 'SVIP' };
              td.innerHTML = `<span class="admin-tag admin-tag--level">${levelMap[customer.customerLevel] || customer.customerLevel || '-'}</span>`;
              break;
            case 'customerStatus':
              const statusText = customer.customerStatus === 'enabled' ? '启用' : '停用';
              td.innerHTML = `<span class="admin-tag ${customer.customerStatus === 'enabled' ? 'admin-tag--success' : 'admin-tag--danger'}">${statusText}</span>`;
              break;
            case 'am':
              td.innerHTML = `<span>${customer.am || '-'}</span>`;
              break;
            case 'bd':
              td.innerHTML = `<span>${customer.bd || '-'}</span>`;
              break;
            case 'defaultCurrency':
              td.innerHTML = `<span>${customer.defaultCurrency || '-'}</span>`;
              break;
            case 'currentBalance':
            case 'usedCredit':
            case 'creditLimit':
            case 'prepaidLimit':
            case 'remainingPrepaidAmount':
            case 'availableBalance':
            case 'realAmount':
            case 'frozenAmount':
              td.innerHTML = `<span class="${getAmountClass(customer[fieldKey])}">${formatAmount(customer[fieldKey])}</span>`;
              break;
            case 'registerTime':
            case 'lastLoginTime':
              td.innerHTML = `<span>${customer[fieldKey] || '-'}</span>`;
              break;
            case 'actions':
              td.innerHTML = `
                <div>
                  <button type="button" onclick="editCustomer('${customer.customerId}')">编辑</button>
                  <button type="button" onclick="openOpeningFeeStatusModal('${customer.customerId}')">修改开户费状态</button>
                  <button type="button" onclick="modifyCustomerAccount('${customer.customerId}')">修改账号</button>
                  <button type="button" onclick="managePermissions('${customer.customerId}')">权限管理</button>
                  <a href="customer-sub-account-management.html?merchantId=${customer.merchantId}">子账号管理</a>
                  <button type="button" onclick="resetPassword('${customer.customerId}')">重置密码</button>
                </div>
              `;
              break;
          }
          
          row.appendChild(td);
        });
        
        tableBody.appendChild(row);
      });
    }

    // 打开字段自定义
    function openCustomizeFields() {
      renderFieldCustomization();
      document.getElementById('customizeFieldsModal').classList.remove('hidden');
    }

    // 渲染字段自定义界面
    function renderFieldCustomization() {
      const availableFields = document.getElementById('availableFields');
      const selectedFields = document.getElementById('selectedFields');
      
      // 清空现有内容
      availableFields.innerHTML = '';
      selectedFields.innerHTML = '';
      
      // 渲染可用字段（未选中的）
      allFields.forEach(field => {
        if (!currentFields.includes(field.key)) {
          const li = createFieldItem(field, false);
          availableFields.appendChild(li);
        }
      });
      
      // 渲染已选字段（按当前顺序）
      currentFields.forEach(fieldKey => {
        const field = allFields.find(f => f.key === fieldKey);
        if (field) {
          const li = createFieldItem(field, true);
          selectedFields.appendChild(li);
        }
      });
      
      // 启用拖拽排序
      enableSortable();
    }

    // 创建字段项
    function createFieldItem(field, isSelected) {
      const li = document.createElement('li');
      li.className = `flex items-center justify-between p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 ${isSelected ? 'selected-field' : 'available-field'}`;
      li.dataset.fieldKey = field.key;
      
      li.innerHTML = `
        <div class="flex items-center">
          ${isSelected ? '<i class="fas fa-grip-vertical text-gray-400 mr-2"></i>' : ''}
          <span class="text-sm text-gray-900">${field.label}</span>
        </div>
        <button onclick="toggleField('${field.key}', ${isSelected})" class="text-sm ${isSelected ? 'text-red-600 hover:text-red-800' : 'text-blue-600 hover:text-blue-800'}">
          ${isSelected ? '移除' : '添加'}
        </button>
      `;
      
      return li;
    }

    // 切换字段选择状态
    function toggleField(fieldKey, isSelected) {
      if (isSelected) {
        // 移除字段
        currentFields = currentFields.filter(key => key !== fieldKey);
      } else {
        // 添加字段
        currentFields.push(fieldKey);
      }
      
      renderFieldCustomization();
    }

    // 启用拖拽排序
    function enableSortable() {
      const selectedFieldsList = document.getElementById('selectedFields');
      let draggedElement = null;
      
      selectedFieldsList.addEventListener('dragstart', function(e) {
        draggedElement = e.target.closest('li');
        e.target.style.opacity = '0.5';
      });
      
      selectedFieldsList.addEventListener('dragend', function(e) {
        e.target.style.opacity = '';
        draggedElement = null;
      });
      
      selectedFieldsList.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
      
      selectedFieldsList.addEventListener('drop', function(e) {
        e.preventDefault();
        const targetElement = e.target.closest('li');
        
        if (draggedElement && targetElement && draggedElement !== targetElement) {
          const draggedIndex = Array.from(selectedFieldsList.children).indexOf(draggedElement);
          const targetIndex = Array.from(selectedFieldsList.children).indexOf(targetElement);
          
          // 更新currentFields顺序
          const draggedFieldKey = currentFields[draggedIndex];
          currentFields.splice(draggedIndex, 1);
          currentFields.splice(targetIndex, 0, draggedFieldKey);
          
          // 重新渲染
          renderFieldCustomization();
        }
      });
      
      // 为每个字段项添加draggable属性
      selectedFieldsList.querySelectorAll('li').forEach(li => {
        li.draggable = true;
      });
    }

    // 重置为默认字段
    function resetToDefault() {
      currentFields = [...defaultFields];
      renderFieldCustomization();
    }

    // 应用字段设置
    function applyFieldSettings() {
      renderTable();
      closeModal('customizeFieldsModal');
      showNotification('字段设置已应用！', 'success');
    }

    function getDisplayedCustomers() {
      const source = hasAppliedFilter ? filteredCustomerData : customerData;
      if (!sortState.key || !sortState.order) return source;
      return [...source].sort((left, right) => {
        const leftNumber = getAmountNumber(left[sortState.key]);
        const rightNumber = getAmountNumber(right[sortState.key]);
        const leftValue = Number.isFinite(leftNumber) ? leftNumber : 0;
        const rightValue = Number.isFinite(rightNumber) ? rightNumber : 0;
        return (leftValue - rightValue) * (sortState.order === 'asc' ? 1 : -1);
      });
    }

    function toggleSort(fieldKey) {
      if (sortState.key !== fieldKey) {
        sortState = { key: fieldKey, order: 'asc' };
      } else if (sortState.order === 'asc') {
        sortState.order = 'desc';
      } else {
        sortState = { key: null, order: null };
      }
      renderTable();
    }

    function formatAmount(value) {
      if (value === null || value === undefined || value === '') return '-';
      const raw = String(value).replace(/[,$\s]/g, '');
      if (!raw || raw === '-' || raw === '—') return '-';
      const numeric = getAmountNumber(value);
      return Number.isFinite(numeric)
        ? numeric.toLocaleString('en-US', { maximumFractionDigits: 2, useGrouping: true })
        : String(value);
    }

    function getAmountNumber(value) {
      const raw = String(value ?? '').replace(/[,$\s]/g, '');
      if (!raw || raw === '-' || raw === '—') return 0;
      const numeric = Number(raw);
      return Number.isFinite(numeric) ? numeric : Number.NaN;
    }

    function getAmountClass(value) {
      if (value === null || value === undefined || value === '' || value === '-' || value === '—') return '';
      const numeric = getAmountNumber(value);
      if (!Number.isFinite(numeric)) return '';
      if (numeric < 0) return 'admin-amount--negative';
      if (numeric > 0) return 'admin-amount--positive';
      return '';
    }

    function updatePaginationSummary() {
      const total = hasAppliedFilter ? filteredCustomerData.length : 481;
      const totalEl = document.querySelector('.admin-total-count');
      const rangeEl = document.querySelector('.admin-page-range');
      if (totalEl) totalEl.textContent = total.toLocaleString('en-US');
      if (rangeEl) rangeEl.textContent = total === 0 ? '0-0' : `1-${Math.min(Number(document.getElementById('pageSize')?.value || 50), total)}`;
    }

    function resetCustomerFilters() {
      ['filterMerchantIds', 'filterCustomerName', 'filterLoginAccount', 'filterBd', 'filterAm'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
      });
      ['filterCustomerStatus', 'filterOpeningFeeStatus', 'filterCustomerLevel'].forEach(id => {
        const select = document.getElementById(id);
        if (select) select.value = '';
      });
      filteredCustomerData = [...customerData];
      hasAppliedFilter = false;
      sortState = { key: null, order: null };
      selectedCustomerIds.clear();
      renderTable();
      updatePaginationSummary();
      syncBatchActionButtons();
      showNotification('筛选条件已重置', 'info');
    }

    function searchCustomers() {
      const merchantIdRaw = document.getElementById('filterMerchantIds').value.trim();
      const merchantIds = merchantIdRaw
        ? merchantIdRaw.split(/[\s,，;；\n]+/).map(item => item.trim()).filter(item => /^\d{5}$/.test(item))
        : [];
      const customerName = document.getElementById('filterCustomerName').value.trim().toLowerCase();
      const loginAccount = document.getElementById('filterLoginAccount').value.trim().toLowerCase();
      const customerStatus = document.getElementById('filterCustomerStatus').value;
      const openingFeeStatus = document.getElementById('filterOpeningFeeStatus').value;
      const customerLevel = document.getElementById('filterCustomerLevel').value;
      const bd = document.getElementById('filterBd').value.trim().toLowerCase();
      const am = document.getElementById('filterAm').value.trim().toLowerCase();

      filteredCustomerData = customerData.filter(customer => {
        const merchantMatched = !merchantIdRaw || merchantIds.includes(String(customer.merchantId || ''));
        const customerNameMatched = !customerName || (customer.customerName || customer.merchantName || '').toLowerCase().includes(customerName);
        const loginAccountMatched = !loginAccount || (customer.loginAccount || customer.email || '').toLowerCase().includes(loginAccount);
        const customerStatusMatched = !customerStatus || customer.customerStatus === customerStatus;
        const openingFeeStatusMatched = !openingFeeStatus || merchantOpeningFeeStatusOf(customer.merchantId) === openingFeeStatus;
        const customerLevelMatched = !customerLevel || customer.customerLevel === customerLevel;
        const bdMatched = !bd || (customer.bd || '').toLowerCase().includes(bd);
        const amMatched = !am || (customer.am || '').toLowerCase().includes(am);
        return merchantMatched && customerNameMatched && loginAccountMatched && customerStatusMatched && openingFeeStatusMatched && customerLevelMatched && bdMatched && amMatched;
      });

      const displayedIds = new Set(filteredCustomerData.map(item => item.customerId));
      selectedCustomerIds.forEach(id => {
        if (!displayedIds.has(id)) {
          selectedCustomerIds.delete(id);
        }
      });

      hasAppliedFilter = true;
      renderTable();
      updatePaginationSummary();
      syncBatchActionButtons();
      showNotification(`查询完成, 共匹配 ${filteredCustomerData.length} 位客户`, 'success');
    }

    function toggleCustomerSelection(customerId, checked) {
      if (checked) {
        selectedCustomerIds.add(customerId);
      } else {
        selectedCustomerIds.delete(customerId);
      }
      renderTableHeader();
      syncBatchActionButtons();
    }

    function toggleSelectAllCustomers(checked) {
      getDisplayedCustomers().forEach(customer => {
        if (checked) {
          selectedCustomerIds.add(customer.customerId);
        } else {
          selectedCustomerIds.delete(customer.customerId);
        }
      });
      renderTable();
      syncBatchActionButtons();
    }

    function syncBatchActionButtons() {
      const hasSelection = selectedCustomerIds.size > 0;
      ['batchEditButton', 'batchPermissionButton'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = !hasSelection;
      });
    }

    function initBatchFieldSelect() {
      const select = document.getElementById('batchFieldSelect');
      if (!select) return;

      Object.entries(batchEditableFields).forEach(([key, config]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = config.label;
        select.appendChild(option);
      });
    }

    function openBatchEditModal() {
      if (selectedCustomerIds.size === 0) {
        showNotification('请先勾选要批量修改的客户', 'warning');
        return;
      }

      document.getElementById('batchEditSelectedCount').textContent = selectedCustomerIds.size;
      document.getElementById('batchFieldSelect').value = '';
      renderBatchValueInput();
      document.getElementById('batchEditModal').classList.remove('hidden');
    }

    function renderBatchValueInput() {
      const selectedField = document.getElementById('batchFieldSelect').value;
      const container = document.getElementById('batchValueInputContainer');

      if (!selectedField) {
        container.innerHTML = '';
        return;
      }

      const config = batchEditableFields[selectedField];
      if (config.type === 'enum') {
        container.innerHTML = `
          <label class="batch-modal-label">设置内容</label>
          <select id="batchFieldValue" required>
            <option value="">请选择</option>
            ${config.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
          </select>
        `;
      } else {
        container.innerHTML = `
          <label class="batch-modal-label">设置内容</label>
          <input id="batchFieldValue" type="text" required placeholder="请输入${config.label}">
        `;
      }
    }

    function submitBatchEdit(event) {
      event.preventDefault();

      const selectedField = document.getElementById('batchFieldSelect').value;
      const valueInput = document.getElementById('batchFieldValue');
      const nextValue = valueInput ? valueInput.value.trim() : '';

      if (!selectedField) {
        showNotification('请选择需要批量修改的字段', 'warning');
        return;
      }

      if (!nextValue) {
        showNotification('请填写批量修改内容', 'warning');
        return;
      }

      let updateCount = 0;
      customerData.forEach(customer => {
        if (selectedCustomerIds.has(customer.customerId)) {
          customer[selectedField] = nextValue;
          updateCount += 1;
        }
      });

      renderTable();
      closeModal('batchEditModal');
      showNotification(`批量修改成功, 已更新 ${updateCount} 位客户的${batchEditableFields[selectedField].label}`, 'success');
    }
    
    document.querySelectorAll('.admin-page-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.admin-page-tab').forEach(item => {
          item.classList.remove('is-active');
          item.setAttribute('aria-selected', 'false');
        });
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
      });
    });

    // 模态框操作
    function openModal(type) {
      if (type === 'add') {
        document.getElementById('addModal').classList.remove('hidden');
      }
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    // 点击模态框外部关闭
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal-backdrop')) {
        event.target.classList.add('hidden');
      }
    });

    // 编辑客户
    function editCustomer(customerId) {
      const customer = customerData.find(c => c.customerId === customerId);
      if (customer) {
        const form = document.querySelector('#editModal form');
        form.customerId.value = customer.customerId;
        form.email.value = customer.email;
        form.customerStatus.value = customer.customerStatus;
        form.communicationChannel.value = customer.communicationChannel;
        form.contactInfo.value = customer.contactInfo;
        form.customerSource.value = customer.customerSource;
        form.referrer.value = customer.referrer;
        form.website.value = customer.website;
        form.teamName.value = customer.teamName;
        form.businessType.value = customer.businessType;
        form.cooperationStatus.value = customer.cooperationStatus;
        form.teamStatus.value = customer.teamStatus;
        
        document.getElementById('editModal').classList.remove('hidden');
      }
    }

    function modifyCustomerAccount(customerId) {
      const customer = customerData.find(c => c.customerId === customerId);
      if (!customer) return;
      const form = document.querySelector('#updateEmailModal form');
      form.customerId.value = customer.customerId;
      form.email.value = customer.email || '';
      document.getElementById('updateEmailModal').classList.remove('hidden');
    }

    function submitUpdateEmail(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customer = customerData.find(c => c.customerId === formData.get('customerId'));
      if (customer) {
        customer.email = formData.get('email');
        showNotification(`客户 ${customer.customerId} 的登录账号已更新`, 'success');
      }
      closeModal('updateEmailModal');
    }

    // 重置密码：使用页面内确认弹窗，避免原生 confirm 与运营端视觉不一致
    let pendingResetCustomerId = null;

    function resetPassword(customerId) {
      pendingResetCustomerId = customerId;
      const message = document.getElementById('resetPasswordMessage');
      if (message) message.textContent = `确定要重置客户 ${customerId} 的登录密码吗？`;
      document.getElementById('resetPasswordModal').classList.remove('hidden');
    }

    function confirmResetPassword() {
      if (!pendingResetCustomerId) return;
      const customerId = pendingResetCustomerId;
      pendingResetCustomerId = null;
      closeModal('resetPasswordModal');
      showNotification(`客户 ${customerId} 的密码已重置为：Ad8899Init`, 'success');
    }

    // 调整额度
    function adjustQuota(customerId) {
      document.querySelector('#quotaModal form').customerId.value = customerId;
      document.getElementById('quotaModal').classList.remove('hidden');
    }

    // 提交添加客户
    function submitAddCustomer(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customerName = formData.get('customerName');
      
      // 生成客户ID和商户ID：商户ID沿用测试环境规则，为 1 开头的 5 位纯数字。
      const customerId = String(Math.max(...customerData.map(item => Number(item.customerId) || 0), 3599) + 1);
      const merchantId = String(Math.max(...customerData.map(item => Number(item.merchantId) || 10000), 14656) + 1);
      const teamId = 'T' + customerId;
      
      // 创建新客户数据
      const newCustomer = {
        customerId: customerId,
        merchantId: merchantId,
        customerName: customerName,
        email: formData.get('email'),
        loginAccount: formData.get('email'),
        customerLevel: 'B',
        customerStatus: 'enabled',
        am: '-',
        bd: '-',
        communicationChannel: formData.get('communicationChannel'),
        contactInfo: formData.get('contactInfo'),
        customerSource: formData.get('customerSource'),
        referrer: formData.get('referrer') || '',
        website: formData.get('website') || '',
        teamId: teamId,
        teamName: customerName + '的团队',
        businessType: formData.get('businessType'),
        cooperationStatus: formData.get('cooperationStatus'),
        teamStatus: 'enabled',
        defaultCurrency: 'USD',
        currentBalance: 0,
        availableBalance: 0,
        realAmount: 0,
        frozenAmount: 0,
        creditLimit: 0,
        usedCredit: 0,
        remainingCredit: 0,
        prepaidLimit: 0,
        remainingPrepaidAmount: 0,
        registerTime: new Date().toLocaleString('zh-CN'),
        lastLoginTime: '从未登录'
      };
      
      // 添加到数据中
      customerData.unshift(newCustomer);
      filteredCustomerData = [...customerData];
      hasAppliedFilter = false;
      
      // 重新渲染表格
      renderTable();
      
      showNotification(`客户添加成功！\n客户ID: ${customerId}\n团队名称: ${customerName}的团队`, 'success');
      closeModal('addModal');
      event.target.reset();
    }

    // 提交编辑客户
    function submitEditCustomer(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customerId = formData.get('customerId');
      
      // 更新客户数据
      const customerIndex = customerData.findIndex(c => c.customerId === customerId);
      if (customerIndex !== -1) {
        const customer = customerData[customerIndex];
        customer.email = formData.get('email');
        customer.customerStatus = formData.get('customerStatus');
        customer.communicationChannel = formData.get('communicationChannel');
        customer.contactInfo = formData.get('contactInfo');
        customer.customerSource = formData.get('customerSource');
        customer.referrer = formData.get('referrer');
        customer.website = formData.get('website');
        customer.teamName = formData.get('teamName');
        customer.businessType = formData.get('businessType');
        customer.cooperationStatus = formData.get('cooperationStatus');
        customer.teamStatus = formData.get('teamStatus');
        
        // 重新渲染表格
        renderTable();
      }
      filteredCustomerData = [...customerData];
      hasAppliedFilter = false;
      
      showNotification(`客户 ${customerId} 信息修改成功！`, 'success');
      closeModal('editModal');
    }

    // 提交额度调整
    function submitQuotaAdjustment(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customerId = formData.get('customerId');
      const adjustmentType = formData.get('adjustmentType');
      const adjustmentAmount = formData.get('adjustmentAmount');
      
      showNotification(`额度调整申请已提交！\n客户: ${customerId}\n类型: ${adjustmentType === 'increase' ? '增加' : '减少'}\n金额: $${adjustmentAmount}`, 'success');
      closeModal('quotaModal');
      event.target.reset();
    }

    // 每页显示数量变更
    document.getElementById('pageSize').addEventListener('change', function() {
      const pageSize = this.value;
      updatePaginationSummary();
      showNotification(`每页显示条数已调整为: ${pageSize}`, 'info');
    });
    
    // 通知函数
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `fixed top-20 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto transform transition-all duration-300 translate-x-full`;
      
      const typeColors = {
        'info': 'border-blue-400 text-blue-700',
        'success': 'border-green-400 text-green-700',
        'warning': 'border-yellow-400 text-yellow-700',
        'error': 'border-red-400 text-red-700'
      };
      
      const typeIcons = {
        'info': 'fas fa-info-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
      };
      
      notification.innerHTML = `
        <div class="rounded-lg shadow-lg border-l-4 ${typeColors[type]} p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="${typeIcons[type]}"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium whitespace-pre-line">${message}</p>
            </div>
            <div class="ml-auto pl-3">
              <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }

    // 打开客户默认权限设置模态框
    const DEFAULT_PERMISSION_GROUPS = [
      { key: 'page:asset-management', label: '资产管理', checked: false },
      { key: 'page:user-management', label: '用户管理', checked: false },
      { key: 'page:setting', label: '设置', checked: true },
      { key: 'page:ad-management', label: '广告投放', checked: true },
      { key: 'page:analyze', label: '数据分析', checked: true },
      { key: 'page:creative', label: '账号和创意', checked: true },
      { key: 'page:service', label: '服务工具', checked: true },
      { key: 'page:config', label: '管理配置', checked: true }
    ];

    function buildDefaultPermissionTreeHtml() {
      return DEFAULT_PERMISSION_GROUPS.map(group => `
        <div class="default-permission-row">
          <button type="button" class="default-permission-toggle" aria-label="展开${group.label}"><i class="fas fa-caret-right"></i></button>
          <label>
            <input type="checkbox" name="permissions" value="${group.key}" ${group.checked ? 'checked' : ''}>
            <span>${group.label}</span>
          </label>
        </div>
      `).join('');
    }

    function openDefaultPermissionModal() {
      document.getElementById('defaultPermissionTreeContainer').innerHTML = buildDefaultPermissionTreeHtml();
      document.getElementById('defaultPermissionModal').classList.remove('hidden');
    }

    // 管理客户权限
    function managePermissions(customerId) {
      const customer = customerData.find(c => c.customerId === customerId);
      if (!customer) return;
      
      // 设置客户ID
      document.getElementById('permissionCustomerIdInput').value = customerId;
      
      // 填充客户信息
      document.getElementById('customerMerchantId').textContent = customer.merchantId || customerId;
      document.getElementById('customerMerchantName').textContent = customer.merchantName || customer.customerName || '-';
      document.getElementById('customerMerchantEmail').textContent = customer.merchantEmail || customer.email || '-';
      
      // 生成权限树
      renderPermissionTree(customer.permissions || []);
      
      // 显示弹窗
      document.getElementById('permissionManagementModal').classList.remove('hidden');
    }

    // 渲染权限树
    function renderPermissionTree(currentPermissions) {
      const container = document.getElementById('permissionTreeContainer');
      container.innerHTML = buildPermissionTreeHtml(CLIENT_PERMISSION_TREE, 'permissions', currentPermissions || [], 'single');
    }

    // 全局变量：存储待确认的权限数据
    let pendingDefaultPermissions = null;

    // 处理客户默认权限提交
    function handleDefaultPermissionsSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const permissions = formData.getAll('permissions');
      if (permissions.length === 0) {
        showNotification('请至少选择一个权限项！', 'warning');
        return;
      }

      const selectedLabels = DEFAULT_PERMISSION_GROUPS
        .filter(group => permissions.includes(group.key))
        .map(group => group.label);
      showNotification(`客户默认权限设置已保存！\n选中的权限：${selectedLabels.join('、') || '无'}`, 'success');
      closeModal('defaultPermissionModal');
    }

    // 确认并保存客户默认权限
    function confirmDefaultPermissions() {
      if (pendingDefaultPermissions && pendingDefaultPermissions.length > 0) {
        // 分离页面权限和按钮权限
        const pagePermissions = pendingDefaultPermissions.filter(p => p.startsWith('page:'));
        const buttonPermissions = pendingDefaultPermissions.filter(p => p.startsWith('button:'));
        
        // 格式化显示
        const formattedPermissions = [
          ...pagePermissions.map(p => p.replace('page:', '')),
          ...buttonPermissions.map(p => p.replace('button:', '').replace(':', ' '))
        ];
        
        showNotification(`客户默认权限设置已保存！\n选中的权限：${formattedPermissions.join(', ') || '无'}`, 'success');
        closeModal('confirmDefaultPermissionModal');
        closeModal('defaultPermissionModal');
        pendingDefaultPermissions = null;
      } else {
        showNotification('请至少选择一个权限项！', 'warning');
      }
    }

    // 全局变量：存储待确认的客户权限数据
    let pendingCustomerPermissions = null;
    let pendingCustomerId = null;

    // 处理客户权限提交（显示二次确认）
    function handleCustomerPermissionsSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customerId = formData.get('customerId');
      const permissions = formData.getAll('permissions');
      
      // 保存待确认的数据
      pendingCustomerId = customerId;
      pendingCustomerPermissions = permissions;
      
      // 显示二次确认弹窗并填充内容
      displayCustomerConfirmContent(customerId, permissions);
      document.getElementById('confirmCustomerPermissionModal').classList.remove('hidden');
    }

    // 显示客户权限二次确认弹窗内容
    function displayCustomerConfirmContent(customerId, permissions) {
      const customer = customerData.find(c => c.customerId === customerId);
      if (!customer) return;
      
      // 分离页面权限和按钮权限
      const pagePermissions = permissions.filter(p => p.startsWith('page:'));
      const buttonPermissions = permissions.filter(p => p.startsWith('button:'));
      
      // 格式化权限名称
      const formattedPagePermissions = pagePermissions.map(p => p.replace('page:', ''));
      const formattedButtonPermissions = buttonPermissions.map(p => p.replace('button:', '').replace(':', ' '));
      
      const contentDiv = document.getElementById('customerConfirmContent');
      contentDiv.innerHTML = `
        <div class="space-y-2">
          <p><strong>客户名称：</strong>${customer.merchantName || customerId}</p>
          <p><strong>页面权限：</strong>${formattedPagePermissions.join('、') || '无'}</p>
          <p><strong>按钮权限：</strong>${formattedButtonPermissions.join('、') || '无'}</p>
        </div>
      `;
    }

    // 确认并保存客户权限
    function confirmCustomerPermissions() {
      if (pendingCustomerPermissions !== null && pendingCustomerId) {
        const customer = customerData.find(c => c.customerId === pendingCustomerId);
        
        if (customer) {
          // 更新客户权限
          customer.permissions = [...pendingCustomerPermissions];
          
          // 分离页面权限和按钮权限用于显示
          const pagePermissions = pendingCustomerPermissions.filter(p => p.startsWith('page:'));
          const buttonPermissions = pendingCustomerPermissions.filter(p => p.startsWith('button:'));
          
          const formattedPagePermissions = pagePermissions.map(p => p.replace('page:', ''));
          const formattedButtonPermissions = buttonPermissions.map(p => p.replace('button:', '').replace(':', ' '));
          
          showNotification(
            `客户 ${customer.merchantName || pendingCustomerId} 的权限已更新！\n页面权限：${formattedPagePermissions.join('、') || '无'}\n按钮权限：${formattedButtonPermissions.join('、') || '无'}`,
            'success'
          );
        }
        
        closeModal('confirmCustomerPermissionModal');
        closeModal('permissionManagementModal');
        pendingCustomerPermissions = null;
        pendingCustomerId = null;
      }
    }

    // 权限树定义（与客户端 Web 路由对齐）
    // 原型 Mock；上线后从「客户端菜单」接口获取树形权限主数据
    const CLIENT_PERMISSION_TREE = [
      { page: { key: 'page:adMange_meta', label: 'Meta 广告管理' }, buttons: [
        { key: 'button:adMange_meta:create', label: '创建广告' },
        { key: 'button:adMange_meta:edit', label: '编辑广告' },
        { key: 'button:adMange_meta:delete', label: '删除广告' }
      ]},
      { page: { key: 'page:adMange_meta_bulk-create-ad', label: '批量创建广告' }, buttons: [] },
      { page: { key: 'page:analyze_ad', label: '数据分析' }, buttons: [
        { key: 'button:analyze_ad:export', label: '导出报表' }
      ]},
      { page: { key: 'page:assets_account', label: '媒体账户' }, buttons: [
        { key: 'button:assets_account:auth', label: '授权账户' }
      ]},
      { page: { key: 'page:assets_creative', label: '素材库' }, buttons: [
        { key: 'button:assets_creative:upload', label: '上传素材' }
      ]},
      { page: { key: 'page:asset-management_account-management', label: '账户管理' }, buttons: [
        { key: 'button:asset-management_account-management:recharge', label: '充值' },
        { key: 'button:asset-management_account-management:deduct', label: '减款' },
        { key: 'button:asset-management_account-management:clear', label: '清零' }
      ]},
      { page: { key: 'page:asset-management_balance-management', label: '余额管理' }, buttons: [
        { key: 'button:asset-management_balance-management:online', label: '在线充值' },
        { key: 'button:asset-management_balance-management:offline', label: '线下转账' }
      ]},
      { page: { key: 'page:asset-management_operation-record', label: '操作记录' }, buttons: [] },
      { page: { key: 'page:setting_auto-recharge-setting', label: '自动充值设置' }, buttons: [
        { key: 'button:setting_auto-recharge-setting:edit', label: '编辑规则' }
      ]},
      { page: { key: 'page:user-management_sub-account-management', label: '子账号管理' }, buttons: [
        { key: 'button:user-management_sub-account-management:create', label: '创建子账号' }
      ]},
      { page: { key: 'page:user-management_role-management', label: '角色管理' }, buttons: [
        { key: 'button:user-management_role-management:create', label: '创建角色' }
      ]},
      { page: { key: 'page:service_task', label: '任务中心' }, buttons: [] },
      { page: { key: 'page:h5_account-management', label: 'H5-账户管理' }, buttons: [
        { key: 'button:h5_account-management:recharge', label: '批量充值' }
      ]},
      { page: { key: 'page:h5_balance-management', label: 'H5-钱包' }, buttons: [] },
      { page: { key: 'page:h5_operation-record', label: 'H5-操作记录' }, buttons: [] },
      { page: { key: 'page:h5_report-center', label: 'H5-报告中心' }, buttons: [] }
    ];

    function buildPermissionTreeHtml(tree, checkboxName, currentPermissions, prefix) {
      let html = '';
      tree.forEach(item => {
        const isPageChecked = currentPermissions && currentPermissions.includes(item.page.key);
        html += `<div class="permission-group mb-2">`;
        html += `<label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">`;
        html += `<input type="checkbox" name="${checkboxName}" value="${item.page.key}" ${isPageChecked ? 'checked' : ''} class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">`;
        html += `<span class="text-sm font-medium text-gray-900">${item.page.label}</span></label>`;
        if (item.buttons.length) {
          html += `<div class="ml-6 mt-1 space-y-1">`;
          item.buttons.forEach(btn => {
            const isBtnChecked = currentPermissions && currentPermissions.includes(btn.key);
            html += `<label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm">`;
            html += `<input type="checkbox" name="${checkboxName}" value="${btn.key}" ${isBtnChecked ? 'checked' : ''} class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">`;
            html += `<span class="text-gray-700">${btn.label}</span></label>`;
          });
          html += `</div>`;
        }
        html += `</div>`;
      });
      return html;
    }

    function buildBatchPermissionTreeHtml() {
      return DEFAULT_PERMISSION_GROUPS.map(group => `
        <div class="batch-permission-row">
          <button type="button" class="batch-permission-toggle" aria-label="展开${group.label}"><i class="fas fa-caret-right"></i></button>
          <label>
            <input type="checkbox" name="batchPermissions" value="${group.key}">
            <span>${group.label}</span>
          </label>
        </div>
      `).join('');
    }

    function openBatchPermissionModal() {
      if (selectedCustomerIds.size === 0) {
        showNotification('请先勾选要批量调整的客户', 'warning');
        return;
      }
      document.getElementById('batchPermissionSelectedCount').textContent = selectedCustomerIds.size;
      document.getElementById('batchPermissionTreeContainer').innerHTML = buildBatchPermissionTreeHtml();
      document.querySelectorAll('input[name="batchAction"]').forEach(input => { input.checked = false; });
      document.getElementById('batchPermissionModal').classList.remove('hidden');
    }

    function handleBatchPermissionsSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const action = formData.get('batchAction');
      const permissions = formData.getAll('batchPermissions');
      if (!action) {
        showNotification('请选择操作类型（开启或关闭）！', 'warning');
        return;
      }
      if (permissions.length === 0) {
        showNotification('请至少选择一个功能项！', 'warning');
        return;
      }
      const actionDesc = action === 'enable' ? '开启' : '关闭';
      showNotification(`批量功能${actionDesc}已应用！影响 ${selectedCustomerIds.size} 位客户`, 'success');
      closeModal('batchPermissionModal');
    }
