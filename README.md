# 介绍
`watchDog-framework-web`是[watchDog-framework](https://github.com/Licoy/watchDog-framework)的前端项目工程，本项目基于Vue + iView-Admin + Vue-Router + Vuex + Axios开发。

# 使用
> 使用前请先安装[NodeJs](https://nodejs.org/zh-cn/)(推荐使用8.x版本)，国内用户推荐使用[淘宝NPM镜像源](http://npm.taobao.org/)。
- 克隆到本地
```git
git clone git@github.com:watchdog-framework/watchdog-framework-web.git
```
- 安装依赖
```shell
npm install
```
- 运行
```shell
npm run dev
```
- 打包
```shell
npm run build
```

# 配置修改
- 请求地址

    将`libs\axios-cfg.js`中`baseURL: "http://localhost:1000", `改成自己的baseurl即可。
- 端口修改

    更改build目录下的`webpack.dev.config.js`中的`devServer`值为你所需要的端口即可。
# 讨论

 - QQ群：30261540 
 
    [点我快捷加入QQ群讨论](https://shang.qq.com/wpa/qunwpa?idkey=c3541f1d0dbe443456228e3aebf23f6795b614a94d5df6a32f0b2b1c759bb99b)
    

