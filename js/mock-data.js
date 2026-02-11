/**
 * 智能营销平台 - 银行端工作台 Mock数据
 */

// 客户名单分组
const customerLists = [
    {
        id: 'all', name: '全部客户', icon: '👥', count: 18, source: '系统汇总',
        createdAt: '2025-01-15', assignStatus: '-', description: '所有客户合集'
    },
    {
        id: 'hightech', name: '高新科技名单', icon: '🏭', count: 8, source: 'AI智能圈选',
        createdAt: '2025-02-01', assignStatus: '已下发', description: '园区高新技术企业 + 苏信分≥750'
    },
    {
        id: 'newenergy', name: '新能源产业名单', icon: '⚡', count: 5, source: '产业链获客',
        createdAt: '2025-02-03', assignStatus: '已下发', description: '新能源产业链上游供应商'
    },
    {
        id: 'newbiz', name: '新成立企业名单', icon: '🆕', count: 3, source: '新企获客',
        createdAt: '2025-02-05', assignStatus: '待下发', description: '近3个月新注册科技型企业'
    },
    {
        id: 'trade', name: '进出口企业名单', icon: '🌏', count: 2, source: '进出口获客',
        createdAt: '2025-02-08', assignStatus: '待下发', description: '年出口额500万以上制造企业'
    },
    // ========== 产品推送名单（定制产品自动获客）==========
    {
        id: 'prod_keji', name: '科技贷推荐', icon: '📦', count: 5,
        source: '科技贷产品（自动推送）',
        createdAt: '2026-02-11', assignStatus: '已下发',
        description: '江苏银行科技贷定制获客产品，系统每日自动筛选推送',
        isProduct: true,
        product: {
            name: '科技贷',
            org: '江苏银行',
            type: '信用贷',
            freq: '每天',
            lastUpdate: '2026-02-11 06:00',
            nextUpdate: '2026-02-12 06:00',
            maxOutput: 500,
            sortBy: '苏信分由高到低',
            listProcess: '排除已触达客户',
            allowExport: true,
            visibleFields: ['企业名称', '统一社会信用代码', '联系方式', '苏信分', '行业分类'],
            score: '≥750', limit: '500万', rate: '4.5%-5.5%',
            rule: {
                name: '科技企业筛选规则',
                conditions: ['行业 = 制造业 / 科技服务', '苏信分 ≥ 750', '注册资金 ≥ 500万', '成立年限 ≥ 3年', '无司法风险']
            }
        }
    },
    {
        id: 'prod_shuie', name: '税e融推荐', icon: '📦', count: 4,
        source: '税e融产品（自动推送）',
        createdAt: '2026-02-10', assignStatus: '待下发',
        description: '江苏银行税e融定制获客产品，系统每周自动筛选推送',
        isProduct: true,
        product: {
            name: '税e融',
            org: '江苏银行',
            type: '信用贷',
            freq: '每周',
            lastUpdate: '2026-02-10 07:00',
            nextUpdate: '2026-02-17 07:00',
            maxOutput: 300,
            sortBy: '综合推荐度',
            listProcess: '排除已有名单客户',
            allowExport: false,
            visibleFields: ['企业名称', '统一社会信用代码', '联系方式'],
            score: '≥700', limit: '300万', rate: '5.0%-6.0%',
            rule: {
                name: '税务优质企业规则',
                conditions: ['纳税评级 = A / B', '苏信分 ≥ 700', '连续纳税 ≥ 2年', '无欠税记录']
            }
        }
    }
];

// 客户数据
const customers = [
    {
        id: 1, name: "苏州智云科技有限公司", region: "苏州工业园区", industry: "软件信息技术服务业",
        score: 798, revenue: 3500, tax: 280, patents: 12, employees: 85, status: "待触达",
        tags: ["高新技术企业", "专精特新"], listId: "hightech",
        recommendation: "高成长科技企业，近三年营收增长62%，拥有12项发明专利，信用优秀。",
        contact: { name: "张明", phone: "138****8888" },
        riskInfo: { defaultProb: 0.8, lawsuitCount: 0, debtRatio: 58 },
        suggestedAmount: "200-500万元"
    },
    {
        id: 2, name: "南京创新智造集团有限公司", region: "南京江宁区", industry: "通用设备制造业",
        score: 812, revenue: 8200, tax: 520, patents: 28, employees: 220, status: "待触达",
        tags: ["高新技术企业", "制造业单项冠军"], listId: "hightech",
        recommendation: "制造业龙头企业，年营收8200万元，拥有28项专利，苏信分812。",
        contact: { name: "李强", phone: "139****6666" },
        riskInfo: { defaultProb: 0.5, lawsuitCount: 0, debtRatio: 45 },
        suggestedAmount: "500-1000万元"
    },
    {
        id: 3, name: "无锡光电半导体有限公司", region: "无锡新吴区", industry: "电子器件制造",
        score: 785, revenue: 5600, tax: 380, patents: 35, employees: 150, status: "已意向",
        tags: ["高新技术企业", "科技型中小企业"], listId: "hightech",
        recommendation: "半导体行业新锐，营收快速增长48%，拥有35项专利。",
        contact: { name: "王芳", phone: "136****7777" },
        riskInfo: { defaultProb: 1.2, lawsuitCount: 0, debtRatio: 52 },
        suggestedAmount: "300-800万元"
    },
    {
        id: 4, name: "常州新能源科技股份有限公司", region: "常州武进区", industry: "电气机械及器材制造",
        score: 756, revenue: 12000, tax: 850, patents: 42, employees: 380, status: "已触达",
        tags: ["上市后备企业", "专精特新小巨人"], listId: "newenergy",
        recommendation: "新能源装备制造领军企业，年营收过亿，已进入上市辅导期。",
        contact: { name: "赵刚", phone: "135****5555" },
        riskInfo: { defaultProb: 0.6, lawsuitCount: 1, debtRatio: 48 },
        suggestedAmount: "800-1500万元"
    },
    {
        id: 5, name: "苏州生物医药研究院有限公司", region: "苏州工业园区", industry: "医药制造业",
        score: 768, revenue: 4200, tax: 320, patents: 18, employees: 95, status: "待触达",
        tags: ["高新技术企业", "生物医药"], listId: "hightech",
        recommendation: "创新药研发企业，多个管线处于临床阶段，研发团队实力雄厚。",
        contact: { name: "陈明华", phone: "137****4444" },
        riskInfo: { defaultProb: 2.1, lawsuitCount: 0, debtRatio: 35 },
        suggestedAmount: "300-600万元"
    },
    {
        id: 6, name: "南通精密机械制造有限公司", region: "南通崇川区", industry: "专用设备制造业",
        score: 742, revenue: 6800, tax: 480, patents: 15, employees: 210, status: "已放款",
        tags: ["高新技术企业"], listId: "newenergy",
        recommendation: "精密机械加工行业老牌企业，盈利能力稳定，此前合作良好。",
        contact: { name: "周伟", phone: "133****3333" },
        riskInfo: { defaultProb: 0.9, lawsuitCount: 0, debtRatio: 55 },
        suggestedAmount: "200-400万元"
    },
    // ========== 产品推送客户 ==========
    {
        id: 7, name: "苏州纳米智能装备有限公司", region: "苏州工业园区", industry: "通用设备制造业",
        score: 788, revenue: 4800, tax: 350, patents: 22, employees: 120, status: "待触达",
        tags: ["高新技术企业", "纳米技术"], listId: "prod_keji",
        recommendation: "纳米级精密装备制造商，多个产品打破进口垄断，苏信分788。",
        contact: { name: "孙磊", phone: "139****2222" },
        riskInfo: { defaultProb: 0.7, lawsuitCount: 0, debtRatio: 42 },
        suggestedAmount: "300-600万元"
    },
    {
        id: 8, name: "南京云端数据技术有限公司", region: "南京雨花台区", industry: "软件信息技术服务业",
        score: 772, revenue: 2800, tax: 210, patents: 8, employees: 65, status: "待触达",
        tags: ["高新技术企业", "大数据"], listId: "prod_keji",
        recommendation: "大数据分析平台服务商，连续3年盈利增长，技术团队50+人。",
        contact: { name: "林峰", phone: "136****1111" },
        riskInfo: { defaultProb: 1.0, lawsuitCount: 0, debtRatio: 38 },
        suggestedAmount: "200-400万元"
    },
    {
        id: 9, name: "无锡集成电路设计有限公司", region: "无锡新吴区", industry: "电子器件制造",
        score: 801, revenue: 6200, tax: 420, patents: 31, employees: 180, status: "待触达",
        tags: ["高新技术企业", "集成电路"], listId: "prod_keji",
        recommendation: "IC设计领域头部企业，国产替代受益明显，苏信分801。",
        contact: { name: "郑宇", phone: "138****9999" },
        riskInfo: { defaultProb: 0.4, lawsuitCount: 0, debtRatio: 35 },
        suggestedAmount: "500-1000万元"
    },
    {
        id: 10, name: "常州智能制造系统有限公司", region: "常州天宁区", industry: "通用设备制造业",
        score: 765, revenue: 7500, tax: 510, patents: 16, employees: 250, status: "已触达",
        tags: ["高新技术企业", "智能制造"], listId: "prod_keji",
        recommendation: "工业机器人集成方案商，合作客户遍布长三角，近年增长迅猛。",
        contact: { name: "吴强", phone: "135****0000" },
        riskInfo: { defaultProb: 0.8, lawsuitCount: 0, debtRatio: 50 },
        suggestedAmount: "400-800万元"
    },
    {
        id: 11, name: "苏州量子计算科技有限公司", region: "苏州高新区", industry: "软件信息技术服务业",
        score: 758, revenue: 1500, tax: 120, patents: 6, employees: 40, status: "待触达",
        tags: ["科技型中小企业", "量子计算"], listId: "prod_keji",
        recommendation: "前沿量子计算方向，已获B轮融资，团队来自中科大。",
        contact: { name: "何涛", phone: "137****3333" },
        riskInfo: { defaultProb: 1.5, lawsuitCount: 0, debtRatio: 28 },
        suggestedAmount: "100-300万元"
    },
    {
        id: 12, name: "南京顺达贸易有限公司", region: "南京栖霞区", industry: "批发和零售业",
        score: 735, revenue: 9500, tax: 680, patents: 0, employees: 45, status: "待触达",
        tags: ["纳税A级"], listId: "prod_shuie",
        recommendation: "纳税A级连续5年，年缴税680万，经营稳健，无司法记录。",
        contact: { name: "钱芳", phone: "138****5555" },
        riskInfo: { defaultProb: 0.6, lawsuitCount: 0, debtRatio: 40 },
        suggestedAmount: "200-300万元"
    },
    {
        id: 13, name: "苏州恒通建材有限公司", region: "苏州相城区", industry: "非金属矿物制品业",
        score: 721, revenue: 11000, tax: 750, patents: 3, employees: 180, status: "待触达",
        tags: ["纳税A级", "建材龙头"], listId: "prod_shuie",
        recommendation: "区域建材龙头，纳税记录优良，年缴税750万，资金需求旺。",
        contact: { name: "杨帆", phone: "139****7777" },
        riskInfo: { defaultProb: 0.9, lawsuitCount: 0, debtRatio: 52 },
        suggestedAmount: "300-500万元"
    },
    {
        id: 14, name: "无锡诺信科技发展有限公司", region: "无锡锡山区", industry: "软件信息技术服务业",
        score: 748, revenue: 3200, tax: 240, patents: 5, employees: 60, status: "待触达",
        tags: ["纳税B级", "科技型中小企业"], listId: "prod_shuie",
        recommendation: "纳税B级，连续纳税4年，软件行业增长较快，苏信分748。",
        contact: { name: "许峰", phone: "136****8888" },
        riskInfo: { defaultProb: 1.1, lawsuitCount: 0, debtRatio: 45 },
        suggestedAmount: "100-200万元"
    },
    {
        id: 15, name: "常州富达纺织有限公司", region: "常州武进区", industry: "纺织业",
        score: 712, revenue: 8600, tax: 580, patents: 2, employees: 320, status: "已触达",
        tags: ["纳税A级", "外贸企业"], listId: "prod_shuie",
        recommendation: "出口型纺织企业，纳税A级，年出口额约400万美元，经营稳定。",
        contact: { name: "冯军", phone: "135****6666" },
        riskInfo: { defaultProb: 0.7, lawsuitCount: 0, debtRatio: 48 },
        suggestedAmount: "200-400万元"
    }
];

// 统计数据
const statistics = {
    pendingCount: 156, pendingTrend: 12,
    contactedThisWeek: 45, contactedTrend: 8,
    interestedCount: 23, interestedTrend: 15,
    loanThisMonth: 1850, loanTrend: 22
};

// 漏斗数据
const funnelData = [
    { stage: "推送", count: 10000, rate: 100 },
    { stage: "触达", count: 6200, rate: 62 },
    { stage: "意向", count: 2100, rate: 21 },
    { stage: "申请", count: 850, rate: 8.5 },
    { stage: "授信", count: 520, rate: 5.2 },
    { stage: "放款", count: 380, rate: 3.8 }
];

// 客户经理排行
const managerRanking = [
    { rank: 1, name: "朱某人", loanAmount: 580, loanCount: 12 },
    { rank: 2, name: "王芳", loanAmount: 450, loanCount: 9 },
    { rank: 3, name: "张伟", loanAmount: 380, loanCount: 8 },
    { rank: 4, name: "陈静", loanAmount: 320, loanCount: 7 },
    { rank: 5, name: "刘洋", loanAmount: 280, loanCount: 6 }
];

// 待办任务
const todoTasks = [
    { id: 1, customerId: 1, customerName: "苏州智云科技有限公司", type: "首次触达", priority: "高", deadline: "今天" },
    { id: 2, customerId: 5, customerName: "苏州生物医药研究院有限公司", type: "首次触达", priority: "高", deadline: "今天" },
    { id: 3, customerId: 3, customerName: "无锡光电半导体有限公司", type: "跟进回访", priority: "中", deadline: "明天" }
];

// 获客任务（上级下发）
const acquisitionTasks = [
    {
        id: 'T001', name: '高新科技企业拓展', listId: 'hightech', listName: '高新科技名单',
        source: '苏州分行-科技支行', assignedBy: '李行长',
        totalCount: 8, completedCount: 3, deadline: '2025-03-01',
        status: '进行中', priority: '高', createdAt: '2025-02-01',
        description: '重点拓展园区内高新技术企业，聚焦科技贷和知识产权融资产品'
    },
    {
        id: 'T002', name: '新能源产业链开发', listId: 'newenergy', listName: '新能源产业名单',
        source: '苏州分行-科技支行', assignedBy: '李行长',
        totalCount: 5, completedCount: 1, deadline: '2025-03-15',
        status: '进行中', priority: '中', createdAt: '2025-02-03',
        description: '拓展新能源产业链上下游企业，推荐供应链金融方案'
    },
    {
        id: 'T003', name: '新成立企业首贷拓展', listId: 'newbiz', listName: '新成立企业名单',
        source: '总行营销中心', assignedBy: '张总',
        totalCount: 3, completedCount: 0, deadline: '2025-02-28',
        status: '待开始', priority: '高', createdAt: '2025-02-05',
        description: '对接新注册科技型企业，挖掘首贷户资源'
    },
    {
        id: 'T004', name: '外贸企业金融服务', listId: 'trade', listName: '进出口企业名单',
        source: '总行营销中心', assignedBy: '张总',
        totalCount: 2, completedCount: 0, deadline: '2025-03-10',
        status: '待开始', priority: '中', createdAt: '2025-02-08',
        description: '推荐跨境结算、出口信保融资等外贸金融产品'
    }
];

// 筛选选项
const statusOptions = [
    { value: "", label: "全部状态" },
    { value: "待触达", label: "待触达" },
    { value: "已触达", label: "已触达" },
    { value: "已意向", label: "已意向" },
    { value: "已放款", label: "已放款" }
];

const industryOptions = [
    { value: "", label: "全部行业" },
    { value: "软件信息技术服务业", label: "软件信息技术服务业" },
    { value: "通用设备制造业", label: "通用设备制造业" },
    { value: "电子器件制造", label: "电子器件制造" },
    { value: "医药制造业", label: "医药制造业" }
];

