import axios from 'axios';
import iView from 'iview'
import { ResError } from './error/ResError';
import sf from 'string-format';

const axiosInstance = axios.create({  
    baseURL: "http://localhost:1000",  
    timeout: 3000,
    withCredentials: true
});
axiosInstance.interceptors.response.use(res => {
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
    throw new ResError("请求服务器失败，请检查服务是否正常！")
    return error
})

export const get = (url,params,pathVariable=null) =>  axiosInstance.get(sf(url, pathVariable), params)

export const post = (url,params,pathVariable=null) => axiosInstance.post(sf(url, pathVariable), params)

//more request method ... put delete patch