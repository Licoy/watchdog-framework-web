import axios from 'axios'
import iView from 'iview'
import { ResError } from './error/ResError'
import sf from 'string-format'
import store from '@/store'
import { router } from '@/router/index'
import config from '../config/index'

const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axiosInstance = axios.create({
  baseURL: baseRequestUrl,
  timeout: 3000
  // withCredentials: true
})
axiosInstance.interceptors.request.use(function (config) {
  iView.LoadingBar.start()
  if (localStorage.getItem('csrf-token')) {
    config.headers.Authorization = localStorage.getItem('csrf-token')
  }
  return config
}, function (error) {
  iView.LoadingBar.finish()
  return Promise.reject(error)
})
axiosInstance.interceptors.response.use(res => {
  iView.LoadingBar.finish()
  // -6表明身份异常或未登录
  if (res.data.code == -6) {
    store.commit('setToken', '')
    store.commit('setAccess', [])
    localStorage.clear()
    router.push({
      name: 'login'
    })
  }
  // 状态码小于0属于异常情况
  if (res.data.status < 0) {
    throw new ResError(res.data.msg)
  }
  return res.data
}, error => {
  iView.LoadingBar.finish()
  console.error(error)
  throw new ResError('请求服务器失败，请检查服务是否正常！')
  return error
})

export const baseUrl = baseRequestUrl

export const get = (url, params, pathVariable = null) => {
  if (params == null) {
    params = { axios_timestamp_current: new Date().getTime() }
  } else {
    params.axios_timestamp_current = new Date().getTime()
  }
  return axiosInstance.get(sf(url, pathVariable), { params: params })
}

export const post = (url, params, pathVariable = null) => axiosInstance.post(sf(url, pathVariable), params)

export const put = (url, params, pathVariable = null) => axiosInstance.put(sf(url, pathVariable), params)

export const patch = (url, params, pathVariable = null) => axiosInstance.patch(sf(url, pathVariable), params)

export const del = (url, params, pathVariable = null) => axiosInstance.delete(sf(url, pathVariable), { params: params })
