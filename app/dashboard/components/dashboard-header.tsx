import { KountrLogo } from "@/app/components/kountr-logo"
import { UserNav } from "./user-nav"
import { RefreshDataButton } from "./refresh-data-button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <KountrLogo size="xs" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <RefreshDataButton />
        <UserNav />
      </div>
    </header>
  )
}
