import Vue from 'vue'

//底部导航栏
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);

//加载图标
import { Loading } from 'vant';
Vue.use(Loading);

//图片懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload);

//提示组件
import {Toast} from 'vant'
Vue.use(Toast)

//弹出层
import { Dialog } from 'vant';
Vue.use(Dialog)

//导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);

//联系人
import { ContactCard, ContactList, ContactEdit } from 'vant';
Vue.use(ContactCard).use(ContactList).use(ContactEdit);

//地址列表
import { AddressList } from 'vant';
Vue.use(AddressList);

//编辑地址
import { AddressEdit } from 'vant';
Vue.use(AddressEdit);

//省市区选择
import { Area } from 'vant';
Vue.use(Area);

//单元格
import { Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup);

//提交订单
import { SubmitBar } from 'vant';
Vue.use(SubmitBar);

//宫格组件
import { Grid, GridItem } from 'vant';
Vue.use(Grid).use(GridItem);

//按钮
import { Button } from 'vant';
Vue.use(Button);

//滑动单元格
import { SwipeCell } from 'vant';
Vue.use(SwipeCell)

//商品卡片
import { Card } from 'vant';
Vue.use(Card);

//弹出层
import { Popup } from 'vant';
Vue.use(Popup);

//时间组件
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);

//标签页
import { Tab, Tabs } from 'vant';
Vue.use(Tab);
Vue.use(Tabs);