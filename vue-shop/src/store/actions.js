import {USER_INFO} from './mutations-type';
import {getStore} from "@/config/global";
import {getUserInfo} from "@/service/api";

export default {

    //同步用户信息
    syncUserInfo({commit},userInfo){
        commit(USER_INFO,{userInfo});
    },

    //自动登录
    async reqUserInfo({commit}){
        //从本地获取用户数据
        //debugger
        let userInfo = JSON.parse(getStore('userInfo'));
        if(userInfo){
            commit(USER_INFO,{userInfo});
        }else {
            //通过服务器端
            let result = await getUserInfo();
            if(result.success_code === 200){
                commit(USER_INFO,{userInfo:result.data});
            }
        }
    },
}