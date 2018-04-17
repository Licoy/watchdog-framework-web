import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('@/views/Login')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/components/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/components/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/components/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
         { path: 'account', title: '账户中心', name: 'account', component: () => import('@/views/account/account.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home',
        icon: 'home',
        name: 'home',
        title: '首页',
        component: Main,
        children: [
            { path: 'index', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') }
        ]
    },
    {
        path: '/system',
        icon: 'ios-gear',
        name: 'system',
        title: '系统设置',
        component: Main,
        children: [
            { path: 'user', icon: 'person', title: '用户管理', name: 'system_user', component: () => import('@/views/home/home.vue') },
            { path: 'person-stalker', icon: 'compose', title: '角色管理', name: 'system_role', component: () => import('@/views/home/home.vue') },
            { path: 'permisssion', icon: 'lock-combination', title: '权限管理', name: 'system_permisssion', component: () => import('@/views/home/home.vue') },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
