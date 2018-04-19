import Vue from 'vue';
import iView from 'iview';
import { ResError } from '@/libs//error/ResError';

iView.Message.config({
    duration: 4
});
//全局引入
Vue.use(iView)


const errorHandler = (error, vm)=>{
    if(!(error instanceof ResError)){
        iView.Message.error("系统出了点小差，请联系管理员修复一下~");
        console.error(error)
    }
}
  
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error)=> errorHandler(error,this);