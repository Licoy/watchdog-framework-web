<template>
  <div>
    <Modal v-model="show" title="更新用户"
            :mask-closable="false" :closable="false">
        <Form ref="modalForm" :model="data" :rules="ruls"
                    :label-width="80">
            <FormItem label="ID">
                <Input disabled v-model.trim="data.id"></Input>
            </FormItem>
            <FormItem label="用户名" prop="username">
                <Input v-model.trim="data.username"></Input>
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
    return {
      show: true,
      loading: false,
      data: {
        id:0,
        username: "",
        age: 0,
        status: 1,
        roles: []
      },
      ruls: {
        username: [
            { required: true, message: "用户名不能为空" },
            {pattern:/^(\w){4,16}$/,message:'用户名应为[A-Za-z0-9_]组成的4-16位字符'}
        ],
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
    },
    uid:{
        type:String,
        default:{}
    }
  },
  created(){
      this.getUserInfo();
  },
  methods: {
    /**
     * @description 关闭Modal
     * @param reload 是否重新加载数据
     */
    cancel(reload = false) {
      this.$emit("cancel", "update", reload);
    },
    /**
     * @description 获取用户信息
     */
    async getUserInfo(){
        try {
            let res = await post('/system/user/get/id/{id}',null,{
                id:this.uid
            })
            this.data = res.data;
            //进行角色的匹配
            let roles = []
            if(this.data.roles!=null){
                this.data.roles.forEach(el=>{
                    this.roles.forEach((r,index)=>{
                        if(el.id == r.id){ //判断当前用户角色列表中的角色ID是否和全部角色列表中的对应
                            roles.push(index) //对应则加入当前角色的数组下标
                        }
                    })
                })
            }
            this.data.roles = roles;
        } catch (error) {
            this.$throw(error)
        }
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
            this.update(data)
        }
      });
    },
    /**
     * @description 更新用户数据请求
     */
    async update(data){
        this.loading = true;
        try {
            let res = await post('/system/user/update/{id}',data,{
                id:this.data.id
            })
            this.$Message.success("用户 "+data.username+" 更新成功");
            this.cancel(true)
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
    }
  }
};
</script>

