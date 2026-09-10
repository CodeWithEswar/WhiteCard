import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { BreadcrumbSegmentItem } from './breadcrumb-item'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  buildBreadcrumbs,
  type BreadcrumbSegment,
  type DocumentBreadcrumbMeta,
} from '@/lib/navigation/build-breadcrumbs'
import { cn } from 'cn'

interface PageBreadcrumbsProps {
  customSegments?: BreadcrumbSegment[]
  documentMeta?: DocumentBreadcrumbMeta
  className?: string
  maxVisible?: number
}

export function PageBreadcrumbs({
  customSegments,
  documentMeta,
  className,
  maxVisible = 3,
}: PageBreadcrumbsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const reduceMotion = useReducedMotion()

  const segments =
    customSegments || buildBreadcrumbs(location.pathname, searchParams, documentMeta)

  if (!segments || segments.length <= 1) {
    return null
  }

  const shouldCollapse = segments.length > maxVisible
  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]
  const middleSegments = shouldCollapse ? segments.slice(1, -1) : []

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('hidden md:flex items-center select-none', className)}
    >
      <motion.ol
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {shouldCollapse ? (
          <>
            {/* First Segment (e.g. Vault) */}
            <li className="inline-flex items-center">
              <BreadcrumbSegmentItem segment={firstSegment} />
            </li>

            {/* Separator */}
            <li role="presentation" aria-hidden="true" className="text-muted-foreground/60">
              <AppIcon icon={ArrowRight01Icon} size={11} />
            </li>

            {/* Collapsed Middle Dropdown */}
            <li className="inline-flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Show collapsed breadcrumb steps"
                      className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  }
                >
                  <AppIcon icon={MoreHorizontalCircle01Icon} size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40 p-1 select-none">
                  {middleSegments.map((segment) => (
                    <DropdownMenuItem
                      key={segment.id}
                      onClick={() => segment.href && navigate(segment.href)}
                      className="text-xs"
                    >
                      {segment.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* Separator */}
            <li role="presentation" aria-hidden="true" className="text-muted-foreground/60">
              <AppIcon icon={ArrowRight01Icon} size={11} />
            </li>

            {/* Current Last Segment */}
            <li className="inline-flex items-center">
              <BreadcrumbSegmentItem segment={lastSegment} />
            </li>
          </>
        ) : (
          segments.map((segment, index) => {
            const isLast = index === segments.length - 1
            return (
              <React.Fragment key={segment.id}>
                {index > 0 && (
                  <li role="presentation" aria-hidden="true" className="text-muted-foreground/60">
                    <AppIcon icon={ArrowRight01Icon} size={11} />
                  </li>
                )}
                <li className="inline-flex items-center">
                  <BreadcrumbSegmentItem segment={segment} />
                </li>
              </React.Fragment>
            )
          })
        )}
      </motion.ol>
    </nav>
  )
}
