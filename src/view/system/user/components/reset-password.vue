<template>
    <div>
        <Modal v-model="show" :title="'重置 '+user.username+' 的密码'"
            :mask-closable="false"  :closable="false">
             <Form ref="modalForm" :model="data" :rules="ruls"
                    :label-width="80">
                <FormItem label="新密码" prop="password">
                    <Input v-model.trim="data.password" type="password"></Input>
                </FormItem>
                <FormItem label="重复密码" prop="rePassword">
                    <Input v-model.trim="data.rePassword" type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" :disabled="loading" @click="cancel(false)">取消</Button>
                <Button type="primary" :loading="loading" @click="ok">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
export default {
    data(){
        return {
            show:true,
            loading:false,
            data:{
                password:'',
                rePassword:''
            },
            ruls:{
                password: [
                    { required: true, message: "请填写密码"},
                    {pattern:/^(\w){6,18}$/,message:'密码应为[A-Za-z0-9_]组成的6-18位字符'}
                ],
                rePassword:{
                    validator:(rule, value, callback, source, options) => {
                        if (value === "") {
                            callback(new Error("请再次输入密码"));
                        } else if (value !== this.data.password) {
                            callback(new Error("两次输入密码不一致!"));
                        } else {
                            callback();
                        }
                    }
                }
            }
        }
    },
    props:{
        user:{
            type:Object,
            default:{}
        }
    },
    methods:{
        /**
         * @description 关闭Modal
         * @param reload 是否重新加载数据
         */
        cancel(reload = false) {
            this.$emit("cancel", "resetPassword", reload);
        },
        ok(){
            this.$refs.modalForm.validate(valid => {
                if (valid) {
                    this.resetPost({
                        password:this.data.password,
                        uid:this.user.id
                    })
                }
            });
        },
        async resetPost(data){
            this.loading = true;
            try {
                let res = await post('/system/user/reset-password',data)
                this.$Message.success("用户 "+this.user.username+" 密码重置成功");
                this.cancel(true)
            } catch (error) {
                this.$throw(error)
            }
            this.loading = false;
        }
    }

};
</script>
