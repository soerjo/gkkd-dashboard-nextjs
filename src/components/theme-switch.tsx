'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from './theme-provider'
import { Button } from './custom/button'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { toggleDark } from '@/store/slice/theme'

export default function ThemeSwitch() {
  const theme = useSelector((state: RootState) => state.theme)
  const dispatch = useDispatch()



  // /* Update theme-color meta tag
  //  * when theme is updated */
  // useEffect(() => {
  //   const themeColor = theme?.isDark !== 'dark' ? '#020817' : '#fff'
  //   const metaThemeColor = document.querySelector("meta[name='theme-color']")
  //   metaThemeColor && metaThemeColor.setAttribute('content', themeColor)
  // }, [theme])

  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => dispatch(toggleDark())}
    >
      {theme?.isDark === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </Button>
  )
}
