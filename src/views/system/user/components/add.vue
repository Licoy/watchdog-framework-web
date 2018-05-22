<template>
  <div>
    <Modal v-model="show" title="添加用户"
            :mask-closable="false" :closable="false">
        <Form ref="modalForm" :model="data" :rules="ruls"
                    :label-width="80">
            <FormItem label="用户名" prop="username">
                <Input v-model.trim="data.username"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model.trim="data.password"></Input>
            </FormItem>
            <FormItem label="重复密码" prop="rePassword">
                <Input type="password" v-model.trim="data.rePassword"></Input>
            </FormItem>
            <FormItem label="年龄" prop="age">
                <InputNumber :min="0" :step="1" v-model.trim="data.age" style="width:100%"/>
            </FormItem>
            <FormItem label="状态" prop="status">
                <Select v-model.trim="data.status" style="width:100%">
                    <Option v-for="item in [{label:'正常',value:1},{label:'锁定',value:0}]"
                        :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="角色组" prop="roles">
                <CheckboxGroup v-model="data.roles">
                    <Checkbox v-for="(item,index) in roles" :label="index" :key="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
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
  data() {
    const validateConfirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.data.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      show: true,
      loading: false,
      data: {
        username: "",
        age: 0,
        status: 1,
        password: "",
        rePassword: "",
        roles: []
      },
      ruls: {
        username: [
            { required: true, message: "用户名不能为空" },
            {pattern:/^(\w){4,16}$/,message:'用户名应为[A-Za-z0-9_]组成的4-16位字符'}
        ],
        password: [
          { required: true, message: "请填写密码"},
          {pattern:/^(\w){6,18}$/,message:'密码应为[A-Za-z0-9_]组成的6-18位字符'}
        ],
        rePassword: [{ validator: validateConfirmPwd }],
        age: [{ required: true, message: "年龄不能为空" }],
        status: [{ required: true, message: "用户状态不能为空" }],
        roles: [{ required: true, message: "请至少选择一个角色" }]
      }
    };
  },
  props: {
    roles: {
      type: Array,
      default: []
    }
  },
  methods: {
    /**
     * @description 关闭Modal
     * @param reload 是否重新加载数据
     */
    cancel(reload = false) {
      this.$emit("cancel", "add", reload);
    },
    /**
     * @description 确定按钮单击回调
     */
    ok() {
      this.$refs.modalForm.validate(valid => {
        if (valid) {
            let roles = []
            this.data.roles.forEach(el=>{
                roles.push(this.roles[el]);
            })
            let data = JSON.parse(JSON.stringify(this.data));
            data.roles = roles;
            this.add(data)
        }
      });
    },
    /**
     * @description 添加用户数据请求
     */
    async add(data){
        this.loading = true;
        try {
            let res = await post('/system/user/add',data)
            this.$Message.success("用户 "+data.username+" 添加成功");
            this.cancel(true)
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
    }
  }
};
</script>

