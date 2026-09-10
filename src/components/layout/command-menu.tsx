import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload01Icon,
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
  Settings02Icon,
  Sun01Icon,
  Moon02Icon,
} from '@hugeicons/core-free-icons'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../ui/command'
import { AppIcon } from '../icons/app-icon'
import { useTheme } from '../../providers/theme-provider'

interface CommandMenuProps {
  onOpenUpload?: () => void
}

export function CommandMenu({ onOpenUpload }: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { isDark, setAppearance } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="White Card Quick Commands"
      description="Quickly navigate vault and execute actions"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="py-2">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                if (onOpenUpload) onOpenUpload()
              })
            }
          >
            <AppIcon icon={Upload01Icon} size={15} />
            <span>Upload new document</span>
            <CommandShortcut>U</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Vault Spaces">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/government'))}
          >
            <AppIcon icon={Passport01Icon} size={15} />
            <span>Government Documents</span>
            <CommandShortcut>G</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/student'))}
          >
            <AppIcon icon={Certificate01Icon} size={15} />
            <span>Student Certificates</span>
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/search'))}
          >
            <AppIcon icon={Search01Icon} size={15} />
            <span>Search Vault</span>
            <CommandShortcut>/</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/app/settings'))}
          >
            <AppIcon icon={Settings02Icon} size={15} />
            <span>Settings & Themes</span>
            <CommandShortcut>,</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => setAppearance(isDark ? 'light' : 'dark'))
            }
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={15} />
            <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
