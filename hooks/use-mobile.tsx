import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      console.log('Mobile check:', {
        width: window.innerWidth,
        breakpoint: MOBILE_BREAKPOINT,
        isMobile: mobile
      })
      setIsMobile(mobile)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      checkMobile()
    }
    
    mql.addEventListener("change", onChange)
    checkMobile()
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return mounted ? !!isMobile : false
}
