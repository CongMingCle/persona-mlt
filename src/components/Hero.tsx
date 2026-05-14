import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse" />

      {/* Content */}
      <div className="relative z-10 section-container text-center pt-20">
        <div className="animate-fade-in">
          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-gradient">马林滔</span>
          </h1>

          {/* Title */}
          <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-2">
            测试开发工程师
          </p>
          <p className="text-base text-muted-foreground/70 mb-8">
            专注于质量保障、自动化测试与测试效能提升
          </p>

          {/* Contact info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-primary" />
              156-2325-1961
            </span>
            <span className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              malintao0601@163.com
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap size={14} className="text-primary" />
              武汉大学 · 985
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              信息管理与信息系统 · 本科
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-glow"
            >
              查看项目
            </a>
            <a
              href="#experience"
              className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              工作经历
            </a>
          </div>
        </div>

      </div>

      {/* Scroll indicator - positioned independently at very bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
        <span className="text-xs font-medium tracking-wide text-muted-foreground/80">
          向下滚动探索更多
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary animate-glow-pulse" />
        </div>
      </div>
    </section>
  )
}
