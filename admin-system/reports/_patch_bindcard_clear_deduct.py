#!/usr/bin/env python3
"""Patch bind-card clear/deduct HTML prototypes."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FILTER_OLD = """                      <option value="待人工处理">待人工处理</option>
                      <option value="完成">完成</option>
                      <option value="失败">失败</option>"""

FILTER_NEW = """                      <option value="待人工处理">待人工处理</option>
                      <option value="待 Fund 降额">待 Fund 降额</option>
                      <option value="Fund 失败">Fund 失败</option>
                      <option value="完成">完成</option>
                      <option value="失败">失败</option>"""

ROW_ACTIONS_OLD = """      if (it.isBindCardAccount) {
        const initSt = INITIAL_BIND_STATUS;
        if (it.status === initSt) {
          btns = `<button onclick="openMediaCompleteModal('${it.id}')" class="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-1">媒体已完成</button>` +
                 `<button onclick="openMediaFailModal('${it.id}')" class="text-xs px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">标记媒体失败</button>`;
        } else if (it.status === 'Fund 失败') {
          btns = `<button onclick="onFundRetry('${it.id}')" class="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-1">重试</button>` +
                 `<button onclick="openIgnoreCompleteModal('${it.id}')" class="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700">忽略并完成</button>`;
        }
      }
      return detail + btns;"""

ROW_ACTIONS_CLEAR = """      if (it.isBindCardAccount) {
        const initSt = INITIAL_BIND_STATUS;
        if (it.status === initSt) {
          btns = `<button onclick="openMediaCompleteModal('${it.id}')" class="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-1">媒体已完成</button>` +
                 `<button onclick="openMediaFailModal('${it.id}')" class="text-xs px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">标记媒体失败</button>`;
        } else if (it.status === 'Fund 失败') {
          btns = `<button onclick="onFundRetry('${it.id}')" class="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-1">重试</button>` +
                 `<button onclick="openIgnoreCompleteModal('${it.id}')" class="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700">忽略并完成</button>`;
        }
      } else if (it.status === '待人工处理') {
        const applyAmt = it.customerApplyAmount != null ? it.customerApplyAmount : it.amount;
        btns = `<button onclick="openSuccessModal('${it.id}','${it.accountId}','${it.accountName}','USD','${formatAmount(applyAmt)}')" class="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"><i class="fas fa-check mr-1"></i>处理成功</button>`;
      }
      return detail + btns;"""

BIND_MANUAL_OLD = """    function bindManualProcessEnable() {
      const btn = document.getElementById('manualProcessBtn');
      if (!btn) return;
      const update = () => {
        const any = Array.from(document.querySelectorAll('#listTableBody .row-select')).some(cb => cb.checked && !cb.disabled);
        btn.classList.toggle('opacity-50', !any);
        btn.classList.toggle('cursor-not-allowed', !any);
        if (any) btn.removeAttribute('disabled'); else btn.setAttribute('disabled','true');
      };
      document.querySelectorAll('#listTableBody .row-select').forEach(cb => cb.addEventListener('change', update));
      update();
    }"""

BIND_MANUAL_DEDUCT = BIND_MANUAL_OLD  # unchanged

BIND_MANUAL_CLEAR = """    function bindManualProcessEnable() {
      const failBtn = document.getElementById('manualProcessFailBtn');
      const update = () => {
        const any = Array.from(document.querySelectorAll('#listTableBody .row-select')).some(cb => cb.checked && !cb.disabled);
        if (failBtn) {
          failBtn.classList.toggle('opacity-50', !any);
          failBtn.classList.toggle('cursor-not-allowed', !any);
          if (any) failBtn.removeAttribute('disabled'); else failBtn.setAttribute('disabled', 'true');
        }
      };
      document.querySelectorAll('#listTableBody .row-select').forEach(cb => cb.addEventListener('change', update));
      update();
    }"""

SETUP_MODALS_CLEAR_OLD = """      const mp = document.getElementById('manualProcessBtn');
      if (mp) {
        mp.addEventListener('click', () => { if (!mp.disabled) document.getElementById('manualProcessModal').classList.remove('hidden'); });
        document.getElementById('closeManualProcessModal').onclick = () => document.getElementById('manualProcessModal').classList.add('hidden');
        document.getElementById('cancelManualProcess').onclick = () => document.getElementById('manualProcessModal').classList.add('hidden');
        document.getElementById('manualProcessForm').addEventListener('submit', e => {
          e.preventDefault();
          document.getElementById('manualProcessModal').classList.add('hidden');
          showToast('人工处理已提交(原型)', 'success');
        });
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateSortIcons();
      renderTable();
      setupModals();
    });"""

SETUP_MODALS_CLEAR_NEW = """    }

    document.addEventListener('DOMContentLoaded', () => {
      updateSortIcons();
      renderTable();
      setupModals();
      setupSupplementUploadFlow();
      setupClearModal();
      setupManualProcessSuccessModal();
      setupManualProcessFailModal();
    });"""

TAIL_STUB_MARKER = """    // --- 保留补充清零数据原型(简化): 仍使用静态映射 ---"""

CLEAR_TAIL = r"""
    let supplementParsedRows = [];
    let supplementPreviewRows = [];
    const SUPPLEMENT_MEDIA = '__MEDIA__';

    function normalizeExcelRow(row) {
      const accountId = String(row['广告账户ID'] || row['广告账户Id'] || row['accountId'] || '').trim();
      const clearAmountRaw = row['清零金额'] ?? row['金额'] ?? row['clearAmount'] ?? '';
      return { accountId, clearAmountRaw };
    }

    function parseAmount(rawValue) {
      if (rawValue === null || rawValue === undefined) return { valid: false, value: 0 };
      const cleaned = String(rawValue).replace(/,/g, '').trim();
      if (!cleaned) return { valid: false, value: 0 };
      const amount = Number(cleaned);
      if (!Number.isFinite(amount) || amount <= 0) return { valid: false, value: 0 };
      return { valid: true, value: amount };
    }

    function getAccountReferenceMap() {
      const map = new Map();
      listData.forEach(it => {
        map.set(it.accountId, {
          customerId: it.customerId,
          customerName: it.customerName,
          merchantId: it.customerId ? `M${it.customerId.replace(/^C/i, '')}` : '-',
          accountName: it.accountName
        });
      });
      return map;
    }

    function buildSupplementPreviewRows(parsedRows) {
      const accountMap = getAccountReferenceMap();
      return parsedRows.map(item => {
        const matched = accountMap.get(item.accountId);
        const amountInfo = parseAmount(item.clearAmountRaw);
        let valid = true;
        let invalidReason = '';
        if (!item.accountId) { valid = false; invalidReason = '广告账户ID为空'; }
        else if (!matched) { valid = false; invalidReason = '无此账户'; }
        else if (!amountInfo.valid) { valid = false; invalidReason = '清零金额格式错误'; }
        return {
          merchantId: matched ? matched.merchantId : '-',
          customerId: matched ? matched.customerId : '-',
          customerName: matched ? matched.customerName : '-',
          media: SUPPLEMENT_MEDIA,
          accountId: item.accountId || '-',
          accountName: matched ? matched.accountName : '-',
          clearAmount: amountInfo.valid ? amountInfo.value.toFixed(2) : String(item.clearAmountRaw || '-'),
          valid,
          invalidReason
        };
      });
    }

    function renderSupplementPreviewRows(rows) {
      const tbody = document.getElementById('supplementPreviewBody');
      tbody.innerHTML = '';
      rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-4 py-3 whitespace-nowrap">${row.merchantId}</td>
          <td class="px-4 py-3 whitespace-nowrap">${row.customerName}</td>
          <td class="px-4 py-3 whitespace-nowrap">${row.media}</td>
          <td class="px-4 py-3 whitespace-nowrap">${row.accountId}</td>
          <td class="px-4 py-3 whitespace-nowrap">${row.accountName}</td>
          <td class="px-4 py-3 whitespace-nowrap">${row.clearAmount}</td>
          <td class="px-4 py-3 whitespace-nowrap ${row.valid ? 'text-green-600' : 'text-red-600'} font-medium">${row.valid ? '是' : '否'}</td>
          <td class="px-4 py-3 whitespace-nowrap text-red-600">${row.invalidReason || '-'}</td>`;
        tbody.appendChild(tr);
      });
    }

    function updateSupplementPreviewSummary(rows) {
      const total = rows.length;
      const validCount = rows.filter(row => row.valid).length;
      const invalidCount = total - validCount;
      document.getElementById('supplementTotalCount').textContent = String(total);
      document.getElementById('supplementValidCount').textContent = String(validCount);
      document.getElementById('supplementInvalidCount').textContent = String(invalidCount);
      const hint = document.getElementById('supplementPreviewHint');
      if (validCount === 0) hint.textContent = '当前没有可写入的有效数据, 请返回修改Excel后重新上传。';
      else if (invalidCount === 0) hint.textContent = `本次将写入${validCount}条有效数据。`;
      else hint.textContent = `本次将写入${validCount}条有效数据, ${invalidCount}条无效数据将被忽略。`;
      const confirmBtn = document.getElementById('confirmSupplementImport');
      confirmBtn.disabled = validCount === 0;
      confirmBtn.classList.toggle('opacity-50', validCount === 0);
      confirmBtn.classList.toggle('cursor-not-allowed', validCount === 0);
    }

    function formatDateTimeForTable(date) {
      const pad = n => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function appendSupplementRowsToMainTable(validRows) {
      const now = new Date();
      const dateTime = formatDateTimeForTable(now);
      const sourceRemark = '来源: 补充清零数据';
      const base = listData.length;
      validRows.forEach((row, index) => {
        const clearId = `CL${String(base + index + 1).padStart(3, '0')}`;
        listData.unshift({
          id: clearId,
          customerId: row.customerId,
          customerName: row.customerName,
          customerEmail: '-',
          submitTime: dateTime,
          accountId: row.accountId,
          accountName: row.accountName,
          agent: '管理员',
          amount: Number(row.clearAmount),
          customerApplyAmount: Number(row.clearAmount),
          status: '成功',
          completeTime: dateTime,
          remark: sourceRemark,
          isBindCardAccount: false,
          snapshotCardId: null,
          snapshotCardLast4: null,
          actualReduceAmount: null,
          fundOrderNo: null,
          statusTimeline: []
        });
      });
      renderTable();
    }

    function setupSupplementUploadFlow() {
      const uploadModal = document.getElementById('supplementUploadModal');
      const previewModal = document.getElementById('supplementPreviewModal');
      const openBtn = document.getElementById('openSupplementUploadModal');
      if (!openBtn) return;
      const closeUploadBtn = document.getElementById('closeSupplementUploadModal');
      const cancelUploadBtn = document.getElementById('cancelSupplementUpload');
      const backBtn = document.getElementById('backToSupplementUpload');
      const closePreviewBtn = document.getElementById('closeSupplementPreviewModal');
      const uploadBtn = document.getElementById('submitSupplementUpload');
      const confirmBtn = document.getElementById('confirmSupplementImport');
      const fileInput = document.getElementById('supplementFileInput');
      const fileInfo = document.getElementById('supplementUploadFileInfo');

      const resetUploadState = () => {
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        fileInfo.textContent = '';
        supplementParsedRows = [];
      };
      const closeUploadModal = () => { uploadModal.classList.add('hidden'); resetUploadState(); };
      const closePreviewModal = () => {
        previewModal.classList.add('hidden');
        document.getElementById('supplementPreviewBody').innerHTML = '';
        supplementPreviewRows = [];
      };

      openBtn.addEventListener('click', () => uploadModal.classList.remove('hidden'));
      closeUploadBtn.addEventListener('click', closeUploadModal);
      cancelUploadBtn.addEventListener('click', closeUploadModal);
      closePreviewBtn.addEventListener('click', closePreviewModal);
      backBtn.addEventListener('click', () => { previewModal.classList.add('hidden'); uploadModal.classList.remove('hidden'); });

      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) { fileInfo.classList.add('hidden'); fileInfo.textContent = ''; return; }
        fileInfo.classList.remove('hidden');
        fileInfo.textContent = `已选择文件: ${file.name} (${Math.ceil(file.size / 1024)} KB)`;
      });

      uploadBtn.addEventListener('click', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) { showToast('请先选择Excel文件', 'error'); return; }
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) { showToast('Excel中未找到可读取的工作表', 'error'); return; }
            const worksheet = workbook.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            if (!rawRows.length) { showToast('Excel内容为空', 'error'); return; }
            supplementParsedRows = rawRows.map(normalizeExcelRow);
            supplementPreviewRows = buildSupplementPreviewRows(supplementParsedRows);
            renderSupplementPreviewRows(supplementPreviewRows);
            updateSupplementPreviewSummary(supplementPreviewRows);
            uploadModal.classList.add('hidden');
            previewModal.classList.remove('hidden');
          } catch (err) {
            showToast('文件解析失败, 请确认Excel格式正确', 'error');
          }
        };
        reader.readAsArrayBuffer(file);
      });

      confirmBtn.addEventListener('click', () => {
        const validRows = supplementPreviewRows.filter(row => row.valid);
        if (!validRows.length) { showToast('没有可写入的有效数据', 'error'); return; }
        appendSupplementRowsToMainTable(validRows);
        closePreviewModal();
        closeUploadModal();
        showToast(`写入成功: ${validRows.length}条有效数据已入系统`, 'success');
      });
    }

    const clearCustomers = [
      { id: 'C1001', name: '张三', balance: 5000, accounts: [
        { id: 'FB001234567', name: '跨境电商账户01', balance: 200 },
        { id: 'FB001234569', name: '品牌推广账户03', balance: 150 }
      ]},
      { id: 'C1002', name: '李四', balance: 1200, accounts: [
        { id: 'FB001234568', name: '移动应用账户02', balance: 300 }
      ]}
    ];

    function setupClearModal() {
      const openBtn = document.getElementById('openClearModal');
      const modal = document.getElementById('clearModal');
      const closeBtn = document.getElementById('closeClearModal');
      if (!openBtn) return;
      openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

      const customerSelect = document.getElementById('customerSelect');
      const customerBalance = document.getElementById('customerBalance');
      const accountSearch = document.getElementById('accountSearch');
      const accountList = document.getElementById('accountList');
      let currentAccounts = [];

      clearCustomers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}（${c.id}）`;
        customerSelect.appendChild(opt);
      });

      function renderAccountList(accounts) {
        currentAccounts = accounts;
        accountList.innerHTML = '';
        accounts.forEach(acc => {
          const label = document.createElement('label');
          label.className = 'flex items-center mb-1 cursor-pointer';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = acc.id;
          checkbox.className = 'mr-2';
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(`${acc.name}（${acc.id}）- 当前余额：¥${acc.balance}`));
          accountList.appendChild(label);
        });
      }

      customerSelect.addEventListener('change', function() {
        const selected = clearCustomers.find(c => c.id === this.value);
        customerBalance.textContent = selected ? `可用余额：¥${selected.balance}` : '';
        renderAccountList(selected ? selected.accounts : []);
      });

      accountSearch.addEventListener('input', function() {
        const val = this.value.trim().toLowerCase();
        const selected = clearCustomers.find(c => c.id === customerSelect.value);
        if (!selected) return;
        renderAccountList(selected.accounts.filter(acc =>
          acc.name.toLowerCase().includes(val) || acc.id.toLowerCase().includes(val)
        ));
      });

      document.getElementById('submitClear').addEventListener('click', () => {
        const customer = clearCustomers.find(c => c.id === customerSelect.value);
        if (!customer) { showToast('请选择客户', 'error'); return; }
        const checked = Array.from(accountList.querySelectorAll('input[type=checkbox]:checked'));
        if (!checked.length) { showToast('请选择广告账户', 'error'); return; }
        showToast(`已为客户 ${customer.name} 的 ${checked.length} 个账户发起清零(原型)`, 'success');
        modal.classList.add('hidden');
        document.getElementById('clearForm').reset();
        customerBalance.textContent = '';
        accountList.innerHTML = '';
      });
    }

    function openSuccessModal(clearId, accountId, accountName, currency, originalBalance) {
      document.getElementById('successClearId').textContent = clearId;
      document.getElementById('successAccountId').textContent = accountId;
      document.getElementById('successAccountName').textContent = accountName;
      document.getElementById('successOriginalBalance').textContent = originalBalance;
      document.getElementById('successCurrency').textContent = currency;
      document.getElementById('manualProcessSuccessModal').classList.remove('hidden');
    }

    function setupManualProcessSuccessModal() {
      const modal = document.getElementById('manualProcessSuccessModal');
      const closeBtn = document.getElementById('closeManualProcessSuccessModal');
      const cancelBtn = document.getElementById('cancelManualProcessSuccess');
      const form = document.getElementById('manualProcessSuccessForm');
      const closeModal = () => { modal.classList.add('hidden'); form.reset(); };
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      form.addEventListener('submit', e => {
        e.preventDefault();
        const clearAmount = document.getElementById('successClearAmount').value;
        const clearId = document.getElementById('successClearId').textContent;
        if (!clearAmount || parseFloat(clearAmount) <= 0) { showToast('请输入有效的清零金额', 'error'); return; }
        const it = findItem(clearId);
        if (it) {
          it.status = '成功';
          it.completeTime = nowStr();
          it.amount = parseFloat(clearAmount);
          const remark = document.getElementById('successRemark').value.trim();
          if (remark) it.remark = remark;
          pushTimeline(it, '成功');
        }
        closeModal();
        renderTable();
        showToast('处理成功', 'success');
      });
    }

    function setupManualProcessFailModal() {
      const openBtn = document.getElementById('manualProcessFailBtn');
      const modal = document.getElementById('manualProcessFailModal');
      if (!openBtn) return;
      const closeBtn = document.getElementById('closeManualProcessFailModal');
      const cancelBtn = document.getElementById('cancelManualProcessFail');
      const form = document.getElementById('manualProcessFailForm');
      openBtn.addEventListener('click', () => { if (!openBtn.hasAttribute('disabled')) modal.classList.remove('hidden'); });
      const closeModal = () => { modal.classList.add('hidden'); form.reset(); };
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      form.addEventListener('submit', e => {
        e.preventDefault();
        const failRemark = document.getElementById('failRemark').value.trim();
        if (!failRemark) { showToast('请输入备注', 'error'); return; }
        Array.from(document.querySelectorAll('#listTableBody .row-select:checked')).forEach(cb => {
          const it = findItem(cb.dataset.id);
          if (it && !it.isBindCardAccount && it.status === '待人工处理') {
            it.status = '失败';
            it.remark = failRemark;
            it.completeTime = nowStr();
            pushTimeline(it, '失败');
          }
        });
        closeModal();
        renderTable();
        showToast('已标记处理失败', 'info');
      });
    }
"""

DEDUCT_TAIL = r"""
    const deductCustomers = [
      { id: 'C1001', name: '张三', balance: 5000, accounts: [
        { id: 'FB001234567', name: '跨境电商账户01', balance: 200 },
        { id: 'FB001234569', name: '品牌推广账户03', balance: 150 }
      ]},
      { id: 'C1002', name: '李四', balance: 1200, accounts: [
        { id: 'FB001234568', name: '移动应用账户02', balance: 300 }
      ]}
    ];

    function setupDeductionModal() {
      const openBtn = document.getElementById('openDeductionModal');
      const modal = document.getElementById('deductionModal');
      const closeBtn = document.getElementById('closeDeductionModal');
      if (!openBtn) return;
      openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

      const customerSelect = document.getElementById('customerSelect');
      const customerBalance = document.getElementById('customerBalance');
      const accountSearch = document.getElementById('accountSearch');
      const accountList = document.getElementById('accountList');
      const deductionAmounts = document.getElementById('deductionAmounts');
      const totalAmount = document.getElementById('totalAmount');
      let currentAccounts = [];
      let selectedCustomer = null;

      deductCustomers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}（${c.id}）`;
        customerSelect.appendChild(opt);
      });

      function renderAccountList(accounts) {
        currentAccounts = accounts;
        accountList.innerHTML = '';
        accounts.forEach(acc => {
          const label = document.createElement('label');
          label.className = 'flex items-center mb-1 cursor-pointer';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = acc.id;
          checkbox.className = 'mr-2';
          checkbox.addEventListener('change', updateDeductionAmounts);
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(`${acc.name}（${acc.id}）- 当前余额：¥${acc.balance}`));
          accountList.appendChild(label);
        });
      }

      function updateDeductionAmounts() {
        const checked = Array.from(accountList.querySelectorAll('input[type=checkbox]:checked'));
        deductionAmounts.innerHTML = '';
        checked.forEach(checkbox => {
          const account = currentAccounts.find(acc => acc.id === checkbox.value);
          if (!account) return;
          const div = document.createElement('div');
          div.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
          div.innerHTML = `
            <div class="flex-1 pr-2">
              <div class="text-sm font-medium">${account.name}</div>
              <div class="text-xs text-gray-500">当前余额：¥${account.balance}</div>
            </div>
            <input type="number" min="1" max="${account.balance}" placeholder="减款金额"
              class="w-28 px-2 py-1 text-sm border border-gray-300 rounded deduction-input text-right"
              data-account-id="${account.id}" data-max-balance="${account.balance}">`;
          deductionAmounts.appendChild(div);
        });
        updateTotalAmount();
      }

      function updateTotalAmount() {
        const inputs = deductionAmounts.querySelectorAll('.deduction-input');
        let total = 0;
        let hasError = false;
        inputs.forEach(input => {
          const amount = parseFloat(input.value) || 0;
          const maxBalance = parseFloat(input.dataset.maxBalance);
          total += amount;
          if (amount > maxBalance) { input.classList.add('border-red-500'); hasError = true; }
          else input.classList.remove('border-red-500');
        });
        if (selectedCustomer) {
          totalAmount.textContent = `总减款金额：¥${total} / 可用余额：¥${selectedCustomer.balance}`;
          totalAmount.className = total > selectedCustomer.balance || hasError ? 'mt-2 text-sm text-red-500' : 'mt-2 text-sm text-gray-500';
        }
      }

      deductionAmounts.addEventListener('input', e => {
        if (!e.target.classList.contains('deduction-input')) return;
        const maxBalance = parseFloat(e.target.dataset.maxBalance);
        const amount = parseFloat(e.target.value) || 0;
        if (amount > maxBalance) e.target.value = maxBalance;
        updateTotalAmount();
      });

      customerSelect.addEventListener('change', function() {
        selectedCustomer = deductCustomers.find(c => c.id === this.value);
        customerBalance.textContent = selectedCustomer ? `可用余额：¥${selectedCustomer.balance}` : '';
        renderAccountList(selectedCustomer ? selectedCustomer.accounts : []);
      });

      accountSearch.addEventListener('input', function() {
        const val = this.value.trim().toLowerCase();
        if (!selectedCustomer) return;
        renderAccountList(selectedCustomer.accounts.filter(acc =>
          acc.name.toLowerCase().includes(val) || acc.id.toLowerCase().includes(val)
        ));
      });

      document.getElementById('submitDeduction').addEventListener('click', () => {
        if (!selectedCustomer) { showToast('请选择客户', 'error'); return; }
        const inputs = deductionAmounts.querySelectorAll('.deduction-input');
        if (!inputs.length) { showToast('请选择账户并填写减款金额', 'error'); return; }
        showToast('减款申请已提交(原型)', 'success');
        modal.classList.add('hidden');
        document.getElementById('deductionForm').reset();
        deductionAmounts.innerHTML = '';
        totalAmount.textContent = '';
        customerBalance.textContent = '';
        accountList.innerHTML = '';
      });
    }
"""


def patch_clear(path: Path, media: str):
    text = path.read_text(encoding='utf-8')
    if FILTER_OLD not in text:
        print(f'  skip filter (already patched?): {path.name}')
    else:
        text = text.replace(FILTER_OLD, FILTER_NEW, 1)

    if ROW_ACTIONS_OLD in text:
        text = text.replace(ROW_ACTIONS_OLD, ROW_ACTIONS_CLEAR, 1)

    if BIND_MANUAL_OLD in text:
        text = text.replace(BIND_MANUAL_OLD, BIND_MANUAL_CLEAR, 1)

    if SETUP_MODALS_CLEAR_OLD in text:
        text = text.replace(SETUP_MODALS_CLEAR_OLD, SETUP_MODALS_CLEAR_NEW, 1)

    if TAIL_STUB_MARKER in text:
        idx = text.index(TAIL_STUB_MARKER)
        end = text.rindex('  </script>')
        tail = CLEAR_TAIL.replace('__MEDIA__', media)
        text = text[:idx] + tail + '\n\n' + text[end:]

    path.write_text(text, encoding='utf-8')
    print(f'patched clear: {path}')


def patch_deduct(path: Path):
    text = path.read_text(encoding='utf-8')
    dom_old = """    document.addEventListener('DOMContentLoaded', () => {
      updateSortIcons();
      renderTable();
      setupModals();
    });"""
    dom_new = """    document.addEventListener('DOMContentLoaded', () => {
      updateSortIcons();
      renderTable();
      setupModals();
      setupDeductionModal();
    });"""
    if dom_old in text and 'setupDeductionModal' not in text:
        text = text.replace(dom_old, dom_new, 1)

    if 'function setupDeductionModal' not in text:
        idx = text.rindex('  </script>')
        text = text[:idx] + DEDUCT_TAIL + '\n\n' + text[idx:]

    path.write_text(text, encoding='utf-8')
    print(f'patched deduct: {path}')


def main():
    patch_clear(ROOT / 'fb-business/clear-management.html', 'Facebook')
    patch_clear(ROOT / 'google-business/clear-management.html', 'Google')
    patch_clear(ROOT / 'other-media-business/clear-management.html', '其他媒体')
    patch_deduct(ROOT / 'fb-business/deduction-management.html')
    patch_deduct(ROOT / 'google-business/deduction-management.html')
    print('done')


if __name__ == '__main__':
    main()
