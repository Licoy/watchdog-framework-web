<template>
  <div>
      <!-- 添加角色  -->
        <Modal v-model="showModal" title="角色添加" :loading="loading" :mask-closable="false" :width="800" :closable="false">
            <Form ref="addrole" :model="formItem" :label-width="90" :rules="ruleValidate">
                <FormItem label="角色名称：" prop="name">
                    <Input v-model="formItem.name" placeholder="角色名称"></Input>
                </FormItem>
            </Form>
            <Form  :label-width="70">
                <FormItem label="权限集：" prop="permissions">
                    <Tree ref="tree" :data="formItem.permissions" show-checkbox></Tree>
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
            formItem: {
                    name:'',
                    permissions: []
            },
            showModal:true,
            loading: false,
            ruleValidate:{
                name:[
                    { required: true, message: '角色名称不能为空'}
                ]
            }
        }
    },
    props:{
        allResource:{
            type:Array
        }
    },
    created(){
        this.getAllResource()
    },
    methods:{
      cancel(up=false){
          this.$emit('cancel',up);
      },
      ok(){
        let useList = this.$refs.tree.getCheckedNodes();
        this.$refs.addrole.validate((valid) => {
            if (valid) {
                if(useList.length<1){
                    this.$Notice.destroy();
                    this.$Notice.warning({
                        title: '请至少选择一个权限资源',
                        duration: 2
                    });
                }else{
                    let postObj = {
                        name:this.formItem.name,
                        resources:useList
                    }
                    this.add(postObj)
                }
            }
        })
      },
      async add(data){
        this.loading = true;
        try {
            let res = await post('/system/role/add',data)
            this.$Message.success("角色 "+data.name+" 添加成功");
            this.cancel(true);
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
      },
      async getAllResource(){
        let res = JSON.parse(JSON.stringify(this.allResource));
        this.dealPostData(res)
        this.formItem.permissions = res;
      },
      dealPostData(data){
          data.forEach(element => {
              element.title = element.name;
              if(element.children!=null){
                  this.dealPostData(element.children)
              }
          });
      }
  }
}
</script>

