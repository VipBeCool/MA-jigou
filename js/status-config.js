/**
 * 客户名单 - 状态枚举与配置
 * 双维度状态体系：营销阶段(reachStage) + 业务阶段(bizStage)
 */

// ==================== 营销阶段枚举 ====================
const REACH_STAGES = {
    PENDING:              { code: 'PENDING',              label: '待触达',           color: '#fa8c16', bg: '#fff7e6', border: '#ffd591', icon: '🔸' },
    REACHED_INTERESTED:   { code: 'REACHED_INTERESTED',   label: '已触达-有意向',    color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', icon: '✅' },
    REACHED_NO_INTEREST:  { code: 'REACHED_NO_INTEREST',  label: '已触达-无意向',    color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff', icon: '💬' },
    UNREACHED_EMPTY:      { code: 'UNREACHED_EMPTY',      label: '未触达-空号/停机', color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7', icon: '❌' },
    UNREACHED_REJECTED:   { code: 'UNREACHED_REJECTED',   label: '未触达-拒接',      color: '#faad14', bg: '#fffbe6', border: '#ffe58f', icon: '📵' },
    UNREACHED_WRONG:      { code: 'UNREACHED_WRONG',      label: '未触达-非目标企业',color: '#8c8c8c', bg: '#f5f5f5', border: '#d9d9d9', icon: '🚫' },
    UNREACHED_NO_ANSWER:  { code: 'UNREACHED_NO_ANSWER',  label: '未触达-无人接听',  color: '#faad14', bg: '#fffbe6', border: '#ffe58f', icon: '📞' },
    UNREACHED_OTHER:      { code: 'UNREACHED_OTHER',      label: '未触达-其他',      color: '#8c8c8c', bg: '#f5f5f5', border: '#d9d9d9', icon: '❓' },
};

// 营销阶段 - 各状态的附加信息字段定义
const REACH_STAGE_FIELDS = {
    REACHED_INTERESTED: [
        { key: 'interestProduct', label: '意向产品', type: 'select', options: ['科技贷','税e融','供应链金融','知识产权质押贷','其他'] },
        { key: 'interestAmount', label: '预估需求金额(万)', type: 'number', placeholder: '如 500' },
        { key: 'nextFollowDate', label: '下次跟进日期', type: 'date' },
    ],
    REACHED_NO_INTEREST: [
        { key: 'noInterestReason', label: '无意向原因', type: 'checkbox', options: ['暂无资金需求','已在他行申请','利率不满意','额度不满足','企业经营调整','其他'] },
        { key: 'noInterestDetail', label: '补充说明', type: 'text', placeholder: '如：已在建行获批300万…' },
    ],
    UNREACHED_EMPTY:     [{ key: 'altPhone', label: '备用联系方式', type: 'text', placeholder: '如有请填写' }],
    UNREACHED_REJECTED:  [{ key: 'retryPlan', label: '再次联系计划', type: 'date' }],
    UNREACHED_NO_ANSWER: [
        { key: 'attemptCount', label: '已尝试次数', type: 'select', options: ['1次','2次','3次','3次以上'] },
        { key: 'retryPlan', label: '下次联系日期', type: 'date' },
    ],
};

// ==================== 业务阶段枚举 ====================
const BIZ_STAGES = {
    NONE:      { code: 'NONE',      label: '--',     color: '#bfbfbf', bg: '#fafafa',  border: '#f0f0f0', icon: '○' },
    APPLIED:   { code: 'APPLIED',   label: '已申请', color: '#1890ff', bg: '#e6f7ff',  border: '#91d5ff', icon: '📝' },
    REVIEWING: { code: 'REVIEWING', label: '审批中', color: '#faad14', bg: '#fffbe6',  border: '#ffe58f', icon: '⏳' },
    APPROVED:  { code: 'APPROVED',  label: '已授信', color: '#52c41a', bg: '#f6ffed',  border: '#b7eb8f', icon: '🏦' },
    DISBURSED: { code: 'DISBURSED', label: '已放款', color: '#237804', bg: '#d9f7be',  border: '#95de64', icon: '💰' },
    SETTLED:   { code: 'SETTLED',   label: '已结清', color: '#8c8c8c', bg: '#f5f5f5',  border: '#d9d9d9', icon: '✔️' },
    REJECTED_BIZ: { code: 'REJECTED_BIZ', label: '已拒绝', color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7', icon: '✖️' },
};

// 业务阶段 - 各状态附加字段
const BIZ_STAGE_FIELDS = {
    APPLIED: [
        { key: 'applyDate', label: '申请日期', type: 'date' },
        { key: 'applyProduct', label: '申请产品', type: 'select', options: ['科技贷','税e融','供应链金融','知识产权质押贷','其他'] },
        { key: 'applyAmount', label: '申请金额(万)', type: 'number', placeholder: '如 500' },
    ],
    REVIEWING: [
        { key: 'reviewNode', label: '当前审批节点', type: 'select', options: ['支行初审','分行复审','总行终审'] },
    ],
    APPROVED: [
        { key: 'creditType', label: '额度类型', type: 'select', options: ['循环额度','非循环额度'] },
        { key: 'creditAmount', label: '授信金额(万)', type: 'number', placeholder: '如 500' },
        { key: 'creditExpiry', label: '额度到期日', type: 'date' },
        { key: 'approvedProduct', label: '授信产品', type: 'text', placeholder: '如 科技贷' },
    ],
    DISBURSED: [
        { key: 'creditType', label: '额度类型', type: 'select', options: ['循环额度','非循环额度'] },
        { key: 'creditAmount', label: '授信总额(万)', type: 'number' },
        { key: 'creditRemaining', label: '剩余可用额度(万)', type: 'number' },
        // 放款明细通过独立表格管理，见 disbursements 数组
    ],
    REJECTED_BIZ: [
        { key: 'rejectReason', label: '拒绝原因', type: 'select', options: ['信用评分不足','经营年限不足','行业限制','资料不全','其他'] },
        { key: 'rejectDetail', label: '详细说明', type: 'text', placeholder: '补充拒绝原因' },
    ],
};

// ==================== 工具函数 ====================
function getReachStageConfig(code) { return REACH_STAGES[code] || REACH_STAGES.PENDING; }
function getBizStageConfig(code) { return BIZ_STAGES[code] || BIZ_STAGES.NONE; }

// 渲染状态标签 HTML
function renderStageBadge(stageConfig) {
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500;background:${stageConfig.bg};color:${stageConfig.color};border:1px solid ${stageConfig.border};white-space:nowrap;">${stageConfig.icon} ${stageConfig.label}</span>`;
}

// 渲染附加信息表单字段
function renderStageFields(fields, existingData) {
    if (!fields || fields.length === 0) return '';
    const data = existingData || {};
    return fields.map(f => {
        let input = '';
        if (f.type === 'select') {
            input = `<select class="form-select" data-field="${f.key}" style="font-size:13px;">
                <option value="">请选择</option>
                ${f.options.map(o => `<option value="${o}" ${data[f.key]===o?'selected':''}>${o}</option>`).join('')}
            </select>`;
        } else if (f.type === 'checkbox') {
            input = `<div style="display:flex;flex-wrap:wrap;gap:8px;">${f.options.map(o => {
                const checked = (data[f.key] && Array.isArray(data[f.key]) && data[f.key].includes(o)) ? 'checked' : '';
                return `<label style="display:flex;align-items:center;gap:4px;font-size:13px;padding:4px 10px;border:1px solid #d9d9d9;border-radius:6px;cursor:pointer;transition:all .15s;${checked?'background:#e6f7ff;border-color:#91d5ff;':''}">
                    <input type="checkbox" value="${o}" data-field="${f.key}" ${checked} style="accent-color:#1890ff;"> ${o}
                </label>`;
            }).join('')}</div>`;
        } else if (f.type === 'date') {
            input = `<input type="date" class="form-input" data-field="${f.key}" value="${data[f.key]||''}" style="font-size:13px;max-width:200px;">`;
        } else if (f.type === 'number') {
            input = `<input type="number" class="form-input" data-field="${f.key}" value="${data[f.key]||''}" placeholder="${f.placeholder||''}" style="font-size:13px;max-width:200px;">`;
        } else {
            input = `<input type="text" class="form-input" data-field="${f.key}" value="${data[f.key]||''}" placeholder="${f.placeholder||''}" style="font-size:13px;">`;
        }
        return `<div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#8c8c8c;margin-bottom:4px;">${f.label}</label>
            ${input}
        </div>`;
    }).join('');
}
