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
                          <Icon type="person" slot="prepend"></Icon>
                      </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input :disabled="isValidate" v-model.trim="formItem.password" type="password" placeholder="密码">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    
                     <!--<FormItem>
                       <img src="../../assets/validate-code.png" alt="验证码" title="点击刷新验证码" style="cursor: pointer;float:left">
                     </FormItem>
                                            
                     <FormItem prop="validateCode">
                        <Input type="text" v-model="formItem.validateCode" placeholder="验证码">
                            <Icon type="ios-glasses" slot="prepend"></Icon>
                        </Input>
                    </FormItem> -->
                    <FormItem>
                        <Checkbox v-model="formItem.agree">下次登录记住我的身份</Checkbox><br>
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
  import Cookies from 'js-cookie';
  import md5 from 'js-md5';
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
            login(){
                this.isValidate = true;
                const loadings = this.$Message.loading({
                    content: '用户信息验证中...',
                    duration: 0
                });
                this.$http.post("/account/sign-in",{
                    username: this.formItem.account,
                    password: this.formItem.password
                }).then(res => {
                    if(res.status == 2){
                        this.$Message.success("登录成功");
                        Cookies.set('user', this.formItem.account);
                        Cookies.set('password', md5(md5(this.formItem.password)));
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        this.$router.push({
                            name: 'home_index'
                        });
                    }else{
                        this.$Message.error(res.msg);
                    }
                    setTimeout(loadings, 0);
                    this.isValidate = false;
                }).catch(e => {
                    this.$Message.error("请求服务器验证登录失败");
                    setTimeout(loadings, 0);
                    this.isValidate = false;
                })
            }
        }
    }
</script>
<style>
body{
    background-image: url("../../images/login-bg.jpg");
    height: 100%;
  }
.login-model{
    width: 340px;
    margin-top:10%;
    float:right;
    margin-right:200px;
}
</style>