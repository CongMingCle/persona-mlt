import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 马林滔. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="mailto:malintao0601@163.com"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Mail size={14} />
              malintao0601@163.com
            </a>
            <a
              href="tel:15623251961"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Phone size={14} />
              156-2325-1961
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
