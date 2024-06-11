import { shallowRef } from 'vue'

import light from '../theme/light'
import night from '../theme/night'

const theme = shallowRef({})

export function useTheme() {
  const localTheme = localStorage.getItem('theme')
  theme.value = localTheme ? JSON.parse(localTheme) : light

  const setDayTheme = () => {
    theme.value = light
  }

  const setDarkTheme = () => {
    theme.value = night
  }

  return {
    theme,
    setDayTheme,
    setDarkTheme
  }
}
