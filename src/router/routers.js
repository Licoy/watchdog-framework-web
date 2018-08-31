import Main from '@/view/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/home/index')
      }
    ]
  },
  {
    path: '/system',
    name: 'doc',
    component: Main,
    meta: {
      title: '系统设置',
      icon:'ios-cog'
    },
    children:[
      { path: 'user',meta:{icon: 'md-people', title: '用户管理',access: ['system:user:list']}, name: 'system_user', component: () => import('@/view/system/user') },
      { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理',}, name: 'system_role', component: () => import('@/view/system/role') },
      { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理',access: ['system:resource:list']}, name: 'system_resource', component: () => import('@/view/system/resource') },
      { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志',access: ['system:log:list']}, name: 'system_log', component: () => import('@/view/system/log') },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
