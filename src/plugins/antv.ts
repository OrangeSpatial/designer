import { App, Component, Plugin } from 'vue'
import DIV from './DIV.vue'
import { Button, Input, Select, Radio, Checkbox, Card, Collapse } from 'ant-design-vue'

export const antvComponents: Record<string, Plugin | Component> = {
  Button,
  Input,
  Select,
  Radio,
  Checkbox,
  Card,
  Collapse,
  div: DIV
}

// export default (app: App) => {
//   Object.keys(antvComponents).map(key => {
//     app.use(antvComponents[key])
//   })
// }
