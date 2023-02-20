import Vue from 'vue'
import {
  Container,
  Header,
  Aside,
  Main,
  Button,
  Popover,
  Input,
  Loading,
  MessageBox,
  Message,
  Dialog,
  Slider,
  Tooltip,
  Drawer,
  Carousel,
  CarouselItem,
  Tag,
  Pagination,
  Select,
  Option,
  OptionGroup,
  Table,
  TableColumn,
  Form,
  FormItem,
  Notification,
  Radio,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Backtop,
  Menu,
  MenuItem,
  MenuItemGroup
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Slider)
Vue.use(Tooltip)
Vue.use(Drawer)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Backtop)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
