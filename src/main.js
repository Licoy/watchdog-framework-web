import Vue from 'vue';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import util from './libs/util';
import axios from 'axios';
import './libs/import-config'

const axiosInstance = axios.create({  
    baseURL: "http://localhost:1000",  
    timeout: 3000,
    withCredentials: true
});
axiosInstance.interceptors.response.use(res => {
    if(res.data.status == -6){
        store.commit('logout', this);
        store.commit('clearOpenedSubmenu');
        router.push({
            name: 'login'
        });
    }
    return res.data;
}, error => {
    console.log(error)
    return Promise.reject(error)
})

Vue.prototype.$http = axiosInstance

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
