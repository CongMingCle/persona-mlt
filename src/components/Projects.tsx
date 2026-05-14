import { useState } from 'react'
import { ChevronDown, ChevronUp, Award, Bug, Zap } from 'lucide-react'

interface Project {
  title: string
  subtitle: string
  description: string
  coreWork: string[]
  results: string[]
  tags: string[]
}

const projects: Project[] = [
  {
    title: '藏宝阁库存商品交易服务',
    subtitle: '蛋仔派对组件交易',
    description:
      '藏宝阁过往业务中所交易的都是孤品，库存商品交易能力的拓展对游戏侧API、商品系统和订单系统均有大幅改造，测试复杂度高。',
    coreWork: [
      '参与需求评审，对接开发技术方案，完成功能性用例设计和重点模块测试',
      '对藏宝阁和游戏侧之间的5个核心API进行协议测试，包括签名校验、接口幂等、参数篡改、并发调用及网络超时场景',
      '与游戏团队协作测试环境和边界管理，对外包同学进行测试分工和质量把关',
    ],
    results: [
      '测试阶段共发现61个Bug，其中5个P1以上级别Bug',
      '项目平稳上线，线上问题仅1个，影响小',
    ],
    tags: ['协议测试', 'API测试', '测试协作'],
  },
  {
    title: '移动端兼容性测试优化',
    subtitle: '两期数据驱动优化',
    description:
      '对兼容性测试设备列表进行两次优化，解决原来测试策略粗放和ROI偏低的问题。',
    coreWork: [
      '一期：通过App日志聚合计算用户设备分布，利用K-means聚类算法优化候选设备，最大化硬件参数覆盖度',
      '二期：构建【设备-Bug关联矩阵】量化设备间Bug重叠性，采用贪心算法初筛 + 阈值模型动态剔除冗余设备',
      '平衡测试成本与效果，形成(阈值, 设备集, Bug覆盖率)三元组供决策',
    ],
    results: [
      '用户覆盖度提升13%，硬件覆盖度平均提升20%',
      '兼容性测试成本总体下降30%，Android设备减少15%，iOS设备减少50%',
      '获得特别贡献奖，在二级部门内推广，网易大神和CC直播均接入',
    ],
    tags: ['数据建模', 'K-means', '贪心算法', '专项优化'],
  },
  {
    title: '基于LGB算法的需求风险评估模型',
    subtitle: '数据驱动的事前风险评估',
    description:
      '在事前的需求风险评估领域，传统方式是专家评估；本项目以数据为驱动，结合LGB机器学习算法，构建和应用需求风险评估模型。',
    coreWork: [
      '以需求单作为独立数据单元进行特征选择，包括人员特征、需求数据特征和代码特征',
      '洞察模型输出的0-Bug概率与实际Bug数呈显著负相关，将模型输出映射为风险等级',
      '制定落地策略：风险等级回写、更新策略、定时播报，以及针对低/高风险需求的差异化测试流程',
    ],
    results: [
      'QA在低风险需求的测试成本减少约10%',
      '识别到1个高风险程序优化单（开发标记为免测），实则有1个P1级Bug',
      '获得特别贡献奖，在一级部门内推广，帮助梦幻手游组迁移应用',
    ],
    tags: ['机器学习', 'LightGBM', '风险评估', '测试优化'],
  },
  {
    title: '线上账号共享平台',
    subtitle: 'QA平台功能模块',
    description:
      '藏宝阁接入了30+游戏产品，预发布环境或生产环境的验证对线上账号依赖大。开发线上账号共享功能，提升测试尾期效率。',
    coreWork: [
      '设计账号表和账号借用表的数据结构',
      '用Flask框架完成5个后端接口：添加/借用/归还/查询可借用/查询当前借用',
      '用Vue实现2个前端页面：可用账号查询页面和我的借用页面',
    ],
    results: [
      '解决线上账号管理混乱问题',
      '提升线上问题复现效率',
    ],
    tags: ['Flask', 'Vue', '全栈开发', '工具开发'],
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="animate-on-scroll group"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div
        className={`p-6 rounded-xl border border-border/50 bg-gradient-card transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover ${
          isExpanded ? 'border-primary/20' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-primary/70 mt-0.5">{project.subtitle}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expandable content */}
        {isExpanded && (
          <div className="pt-4 border-t border-border/50 space-y-4 animate-fade-in">
            {/* Core work */}
            <div>
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <Zap size={14} className="text-primary" />
                核心工作
              </h4>
              <ul className="space-y-2">
                {project.coreWork.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div>
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <Award size={14} className="text-accent" />
                项目成果
              </h4>
              <ul className="space-y-2">
                {project.results.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Bug size={12} className="mt-0.5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative section-container">
        {/* Section header */}
        <div className="animate-on-scroll mb-16">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
            Projects
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            项目经历
          </h2>
          <p className="text-muted-foreground max-w-xl">
            在网易期间主导和参与的核心项目，涵盖协议测试、数据驱动优化和工具开发。
          </p>
        </div>

        {/* Project cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Awards */}
        <div className="animate-on-scroll mt-16 p-6 rounded-xl border border-border/50 bg-gradient-card">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Award size={18} className="text-accent" />
            荣誉与其他
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
              获得3次质量先锋奖，2次特别贡献奖（二级部门奖项）
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
              线上专题分享1次
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
