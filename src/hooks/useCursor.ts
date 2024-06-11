import { onBeforeUnmount, onMounted, provide } from 'vue'
import { DTD_MOUSE } from '../constant'
import { Keyboard, Mouse } from '../model'

export function useCursor(keyboard?: Keyboard) {
  const mouse = new Mouse(keyboard)

  provide(DTD_MOUSE, mouse)

  onMounted(() => {
    window.addEventListener('mousedown', mouse.down)
    window.addEventListener('mousemove', mouse.move)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('mousedown', mouse.down)
    window.removeEventListener('mousemove', mouse.move)
  })

  return { mouse }
}
