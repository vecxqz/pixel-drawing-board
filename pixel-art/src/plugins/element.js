import { Button, Form, FormItem, Dialog } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.use(Button)
  app.use(Form)
  app.use(FormItem)
  app.use(Dialog)
}
