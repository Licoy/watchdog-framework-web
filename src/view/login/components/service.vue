<template>
  <div class="login">
      
    <Row  class="login-model">
        <Col span="24">
            <Card>
              <div style="text-align:center;padding:10px">
                <h2>用户登录</h2>
                <br>
                <Form @submit.native.prevent="handleSubmit" ref="formItem" :model="formItem" :rules="FromRule" >
                    <FormItem prop="account">
                      <Input :disabled="isValidate" v-model.trim="formItem.account" type="text" placeholder="用户名">
                          <Icon type="md-person"  slot="prepend"/>
                      </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input :disabled="isValidate" v-model.trim="formItem.password" type="password" placeholder="密码">
                            <Icon type="ios-lock" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Checkbox :disabled="isValidate" v-model="formItem.agree">下次登录记住我的身份</Checkbox><br>
                        <Button :loading="isSubmit"  :disabled="isValidate" html-type="submit" type="primary">
                            {{isValidate ? '登录验证中':'立即登录'}}
                        </Button>
                    </FormItem>
                </Form>
              </div>
          </Card>
        </Col>
    </Row>
  </div>
</template>
<script>
  import md5 from 'js-md5';
  import { post } from '@/libs/axios-cfg'
  export default {
        data () {
            return {
                isSubmit:false,
                formItem: {
                    account:'',
                    password:'',
                    validateCode:'',
                    agree:true
                },
                isValidate:false,
                FromRule:{
                    account:[
                        { required: true, message: '账号不能为空' }
                    ],
                    password:[
                        {required: true, message: '请填写密码', },
                        { type: 'string',min:6, message: '密码长度不能小于6位',  }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                if(this.isValidate){
                    return false;
                }
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.login()
                    }
                });
            },
            async login(){
                this.isValidate = true;
                const loadings = this.$Message.loading({
                    content: '用户信息验证中...',
                    duration: 0
                });
                try {
                    let res = await post('/account/sign-in',{
                        username: this.formItem.account,
                        password: this.formItem.password
                    })
                    this.$Message.success("登录成功");
                    localStorage.setItem('csrf-token', res.data);
                    this.$store.commit('setToken', res.data);
                    this.$router.push({name: 'home'});
                } catch (error) {
                    this.$throw(error)
                }
                setTimeout(loadings, 0);
                this.isValidate = false;
            }
        }
    }
</script>
<style>
body{
    background-image: url("../../../assets/images/login-bg.jpg");
    height: 100%;
  }
.login-model{
    width: 340px;
    margin-top:10%;
    float:right;
    margin-right:200px;
}
</style>