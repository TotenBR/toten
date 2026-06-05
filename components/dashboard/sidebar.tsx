'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ImageIcon, VideoIcon, FileIcon, HomeIcon, LogOutIcon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: HomeIcon },
  { href: '/dashboard/fotos', label: 'Fotos', icon: ImageIcon },
  { href: '/dashboard/videos', label: 'Vídeos', icon: VideoIcon },
  { href: '/dashboard/arquivos', label: 'Arquivos', icon: FileIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">T</span>
        </div>
        <span className="font-bold text-lg tracking-tight">Toten</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <SignOutButton />
      </div>
    </aside>
  )
}

function SignOutButton() {
  const router = useRouter()
  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }
  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      <LogOutIcon className="h-4 w-4" />
      Sair
    </button>
  )
}

export function Header({ user }: { user: { name: string; email: string } }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">T</span>
        </div>
        <span className="font-bold">Toten</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
