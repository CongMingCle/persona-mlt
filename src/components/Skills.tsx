const skills = [
  { name: '产品测试', level: 95, description: '独立完成中大型项目全流程测试' },
  { name: '接口测试', level: 88, description: 'Whistle/故障注入/协议测试' },
  { name: '自动化测试', level: 85, description: 'Airtest UI自动化 + Pytest接口自动化' },
  { name: '白盒测试', level: 80, description: '代码变更分析，拓展测试覆盖' },
  { name: 'Python开发', level: 85, description: '测试脚本/工具/平台开发' },
  { name: '数据分析', level: 78, description: 'K-means聚类/LGB算法/数据建模' },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative section-container">
        {/* Section header */}
        <div className="animate-on-scroll mb-16">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
            Technical Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            专业技能
          </h2>
          <p className="text-muted-foreground max-w-xl">
            深耕质量保障领域，从功能测试到自动化测试，从白盒分析到数据驱动的测试优化。
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="animate-on-scroll group p-6 rounded-xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {skill.name}
                </h3>
                <span className="text-sm font-mono text-primary">{skill.level}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-primary animate-progress-fill"
                  style={{ '--progress-width': `${skill.level}%` } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
