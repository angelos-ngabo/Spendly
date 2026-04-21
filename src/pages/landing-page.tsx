import { Navigate, useNavigate } from 'react-router-dom'
import { APP_BASE } from '@/components/layout/nav'
import { MarketingCta } from '@/components/marketing/marketing-cta'
import { MarketingFeatures } from '@/components/marketing/marketing-features'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { MarketingHero } from '@/components/marketing/marketing-hero'
import { MarketingDeviceCompatibility } from '@/components/marketing/marketing-device-compatibility'
import { MarketingVisualDemo } from '@/components/marketing/marketing-visual-demo'
import { useAuth } from '@/context/auth-context'
import { userMayAccessWorkspace } from '@/lib/auth-access'
import { readGuestSessionFlag } from '@/lib/guest-storage'

export function LandingPage() {
  const { user, guestSession, authLoading, enterGuestSession, firebaseEnabled } = useAuth()
  const navigate = useNavigate()

  if (!authLoading && userMayAccessWorkspace(user, guestSession, readGuestSessionFlag())) {
    return <Navigate to={APP_BASE} replace />
  }

  const goToWorkspace = () => {
    enterGuestSession()
    navigate(APP_BASE)
  }

  return (
    <div className="min-h-svh bg-[#FAFAFA] text-[#252B42]">
      <MarketingHero firebaseEnabled={firebaseEnabled} onOpenApp={goToWorkspace} onGuestStart={goToWorkspace} />
      <MarketingFeatures />
      <MarketingDeviceCompatibility />
      <MarketingVisualDemo />
      <MarketingCta firebaseEnabled={firebaseEnabled} onOpenApp={goToWorkspace} />
      <MarketingFooter firebaseEnabled={firebaseEnabled} />
    </div>
  )
}
