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

    将`config/index.js`中`baseUrl`属性中的`dev(开发时)`以及`pro(上线时)`改成自己的baseUrl即可。
- 端口修改

    更改根目录下的`package.json`文件中的`scripts.dev`的`--port`的值为你所需要的端口即可，例如使用2000端口即为：`"dev": "vue-cli-service serve --open --port=2000"`
# 讨论

 - QQ群：30261540 
 
    [点我快捷加入QQ群讨论](https://shang.qq.com/wpa/qunwpa?idkey=c3541f1d0dbe443456228e3aebf23f6795b614a94d5df6a32f0b2b1c759bb99b)
    
# 版本支持
  - 0.2.x
