import { Briefcase, Clock } from 'lucide-react'

interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  highlights: string[]
  isCurrent?: boolean
  isPlaceholder?: boolean
}

const experiences: ExperienceItem[] = [
  {
    company: '文远知行 WeRide',
    role: '测试开发工程师',
    period: '2025年04月 - 至今',
    description: 'DeployTech团队，负责自动驾驶相关测试开发工作。',
    highlights: ['内容持续更新中...'],
    isCurrent: true,
    isPlaceholder: true,
  },
  {
    company: '网易 NetEase',
    role: '软件测试工程师',
    period: '2022年07月 - 2024年06月',
    description:
      '主要负责面向游戏产品的藏宝阁交易服务的质量保障。主导和参与专项测试优化项目，提升藏宝阁平台的整体测试质量和效率。',
    highlights: [
      '负责模块全流程测试，工作期间无事故级线上问题，月均线上问题数低于2个',
      '带领外包同学进行大型项目测试，优化测试流程，效率提升30%',
      '独立完成移动端兼容性测试优化，综合减少测试设备数量30%',
      '落地基于LGB算法的需求风险评估模型，识别高中低风险需求',
      '在QA平台开发线上账号管理模块',
    ],
    isCurrent: false,
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="section-container">
        {/* Section header */}
        <div className="animate-on-scroll mb-16">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
            Work Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            工作经历
          </h2>
          <p className="text-muted-foreground max-w-xl">
            从网易游戏质量保障到文远知行自动驾驶测试开发，持续深耕测试领域。
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.company}
                className="animate-on-scroll relative pl-16 md:pl-20"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-6 top-1">
                  {exp.isCurrent ? (
                    <div className="glow-dot" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-primary/50 bg-background" />
                  )}
                </div>

                {/* Card */}
                <div
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    exp.isPlaceholder
                      ? 'border-primary/30 bg-primary/5 border-dashed'
                      : 'border-border/50 bg-gradient-card hover:border-primary/20 hover:shadow-card-hover'
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Briefcase size={16} className="text-primary" />
                        {exp.company}
                        {exp.isCurrent && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            当前
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{exp.role}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Clock size={12} />
                      {exp.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>

                  {/* Highlights */}
                  {!exp.isPlaceholder && (
                    <ul className="space-y-2">
                      {exp.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.isPlaceholder && (
                    <p className="text-sm text-primary/60 italic">
                      此部分将持续更新工作内容与项目成果...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
