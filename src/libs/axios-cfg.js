import axios from 'axios';
import iView from 'iview'
import { ResError } from './error/ResError';
import sf from 'string-format';
import store from '@/store';
import {router} from '@/router/index';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({  
    baseURL: "http://localhost:1000",  
    timeout: 3000,
    // withCredentials: true
});
axiosInstance.interceptors.request.use(function (config) {
    iView.LoadingBar.start();
    if(Cookies.get("csrf-token")){
        config.headers.Authorization = Cookies.get("csrf-token");
    }
    return config;
  }, function (error) {
    iView.LoadingBar.finish();
    return Promise.reject(error);
  })
axiosInstance.interceptors.response.use(res => {
    iView.LoadingBar.finish();
    //-6表明身份异常或未登录
    if(res.data.status == -6){
        store.commit('logout', this);
        store.commit('clearOpenedSubmenu');
        router.push({
            name: 'login'
        });
    }
    //状态码小于0属于异常情况
    if(res.data.status < 0){
        throw new ResError(res.data.msg)
    }
    return res.data;
}, error => {
    iView.LoadingBar.finish();
    throw new ResError("请求服务器失败，请检查服务是否正常！")
    return error
})

export const get = (url,params,pathVariable=null) =>  axiosInstance.get(sf(url, pathVariable), params)

export const post = (url,params,pathVariable=null) => axiosInstance.post(sf(url, pathVariable), params)

//more request method ... put delete patch