import { NavLink, useLocation } from 'react-router-dom'

import { icons } from '@/assets/icons'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: icons.homeWhite },
  { to: '/work', label: 'Work', icon: icons.workWhite },
  { to: '/skills', label: 'Skills', icon: icons.skillsWhite },
]

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-4 z-30 flex justify-center sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:justify-start lg:left-8"
    >
      <ul className="flex flex-row items-start gap-3 sm:flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)

          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                aria-label={item.label}
                className="group relative flex h-11 w-fit items-center overflow-hidden rounded-full shadow-card transition-shadow duration-300 hover:shadow-float"
              >
                <span
                  className={cn(
                    'absolute inset-0',
                    isActive ? 'bg-accent' : 'bg-white/5 backdrop-blur-xl',
                  )}
                />
                <span className="border-ring pointer-events-none absolute inset-0 rounded-full" />
                <span className="relative flex size-11 shrink-0 items-center justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden
                    className="size-5 object-contain"
                  />
                </span>
                <span className="relative grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr]">
                  <span className="overflow-hidden">
                    <span className="block whitespace-nowrap pr-5 text-sm font-regular text-white">
                      {item.label}
                    </span>
                  </span>
                </span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
