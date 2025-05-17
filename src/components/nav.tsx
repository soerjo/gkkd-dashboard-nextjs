'use client'

import { IconChevronDown } from '@tabler/icons-react'
import { buttonVariants } from './custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { cn } from '@/lib/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { SideLink } from '@/data/sidelinks'
import Link from 'next/link'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: SideLink[]
  closeNav: () => void
  setIsCollapsed: (prev:boolean) => void
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
  setIsCollapsed,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} setIsCollapsed={setIsCollapsed} />

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} setIsCollapsed={setIsCollapsed} />
      )

    return <NavLink {...rest} key={key} closeNav={closeNav} setIsCollapsed={setIsCollapsed} />
  }
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none ',
        className
      )}
    >
      <nav className='grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map(renderLink)}
      </nav>
    </div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav?: () => void
  setIsCollapsed?: (prev: boolean) => void
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: checkActiveNav(href) ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-14 justify-start text-wrap rounded-none px-6 border-l-3 border-default-400 hover:bg-default-200',
        subLink && 'h-10 w-full px-2'
      )}
      aria-current={checkActiveNav(href) ? 'page' : undefined}
    >
      <div className='mr-2'>{icon}</div>
      {title}
      {label && (
        <div className='ml-2 rounded-lg px-1 text-[0.625rem] text-primary-foreground'>
          {label}
        </div>
      )}
    </Link>
  )
}

export function NavLinkDropdown({ title, icon, label, sub, closeNav, setIsCollapsed }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-14 w-full justify-start rounded-none px-6 hover:bg-default-200',
        )}
      >
        <div className='mr-2'>{icon}</div>
        {title}
        {label && (
          <div className='ml-2 rounded-lg px-1 text-[0.625rem] text-primary-foreground'>
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <IconChevronDown stroke={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown' asChild>
        <ul>
          {sub!.map((sublink) => (
            <li key={sublink.title} className='ml-8'>
              <NavLink {...sublink} subLink closeNav={closeNav} setIsCollapsed={setIsCollapsed}/>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavLinkIcon({ title, icon, label, href, setIsCollapsed, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
        <div
          onClick={() => setIsCollapsed!(false)}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              // variant: 'secondary',
              size: 'icon',
              className: checkActiveNav(href) && 'bg-default-400 text-foreground-900',
            }),
            'h-14 w-14 cursor-pointer hover:bg-default-200 ' ,
          )}
        >
          {icon}
        </div>
  )
}

