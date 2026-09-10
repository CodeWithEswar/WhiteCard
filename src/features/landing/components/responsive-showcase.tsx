import {
  ComputerIcon,
  Tablet01Icon,
  SmartPhone01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export function ResponsiveShowcase() {
  const modes = [
    {
      icon: SmartPhone01Icon,
      title: 'Mobile Ergonomics',
      desc: 'Native-feeling floating bottom dock, sticky topbars, bottom sheets for filters, and 48px touch targets.',
    },
    {
      icon: Tablet01Icon,
      title: 'Tablet Rail',
      desc: 'Compact 76px icon rail providing rapid tooltips, quick upload action, and maximized viewport width.',
    },
    {
      icon: ComputerIcon,
      title: 'Desktop Sidebar',
      desc: 'Sophisticated 248px sidebar with layoutId active pills, keyboard shortcuts (⌘K), and multi-column grid.',
    },
  ]

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Adaptive Layouts
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Mobile-first by conviction
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We don't merely shrink desktop tables into unreadable cards. Every screen size receives a purposeful composition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {modes.map((m) => (
            <div
              key={m.title}
              className="p-6 rounded-3xl border border-border/80 bg-surface/80 flex flex-col justify-between text-left space-y-4"
            >
              <div className="size-10 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-foreground">
                <AppIcon icon={m.icon} size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
