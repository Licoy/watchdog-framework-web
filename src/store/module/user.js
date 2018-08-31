import { setToken, getToken } from '@/libs/util'
import { post } from '@/libs/axios-cfg'
import {errorHandler} from '@/libs/iview-cfg'
export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: ''
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
   actions: {
    // 退出登录
    handleLogOut ({ state, commit }) {
      commit('setToken', '')
      commit('setAccess', [])
      localStorage.clear()
    },
    // 获取用户相关信息
    async getUserInfo ({ state, commit }) {
      try {
          let res = await post('/account/all-permission-tag')
          commit('setAccess', res.data)
          return {access:res.data}
      } catch (error) {
        errorHandler(error)
      }
    }
  } 
}
