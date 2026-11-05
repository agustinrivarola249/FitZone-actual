import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { ActivitiesSection } from '@/components/landing/activities-section'
import { ScheduleSection } from '@/components/landing/schedule-section'
import { PlansSection } from '@/components/landing/plans-section'
import { SiteFooter } from '@/components/landing/site-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <ActivitiesSection />
        <ScheduleSection />
        <PlansSection />
      </main>
      <SiteFooter />
    </div>
  )
}
