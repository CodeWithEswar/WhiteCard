import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback } from 'react'

export function useSmartBack(defaultFallback = '/app') {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      navigate(-1)
    } else {
      const pathname = location.pathname
      if (pathname.startsWith('/app/document/') || pathname.startsWith('/app/documents/')) {
        navigate('/app')
      } else if (pathname.startsWith('/app/government')) {
        navigate('/app/government')
      } else if (pathname.startsWith('/app/student')) {
        navigate('/app/student')
      } else if (pathname.startsWith('/app/settings')) {
        navigate('/app')
      } else {
        navigate(defaultFallback)
      }
    }
  }, [navigate, location.pathname, defaultFallback])

  return handleBack
}
