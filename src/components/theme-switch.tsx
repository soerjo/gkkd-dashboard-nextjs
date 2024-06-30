'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from './custom/button'
import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme()
  // const theme = useSelector((state: RootState) => state.theme)
  // const dispatch = useDispatch()



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
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </Button>
  )
}
