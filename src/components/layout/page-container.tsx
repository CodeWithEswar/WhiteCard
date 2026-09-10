import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: 'reading' | 'normal' | 'wide'
  className?: string
}

export function PageContainer({
  children,
  maxWidth = 'normal',
  className = '',
}: PageContainerProps) {
  const maxWidthClasses = {
    reading: 'max-w-[960px]',
    normal: 'max-w-[1280px]',
    wide: 'max-w-[1480px]',
  }

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 ${maxWidthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  )
}
