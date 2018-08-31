<template>
  <div>
      <!-- 更新角色  -->
        <Modal v-model="showModal" title="更新角色" :loading="loading" :mask-closable="false" :width="800" :closable="false">
            <Form ref="updateRole" :model="formItem" :label-width="90" :rules="ruleValidate">
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
        updateObject:{
            type:Object,
            default:null
        },
        allResource:{
            type:Array
        }
    },
    created(){
        if(this.updateObject!=null){
            this.formItem.name = this.updateObject.name;
        }
        this.getAllResource()
    },
    methods:{
      cancel(up=false){
          this.$emit('cancel',up);
      },
      ok(){
        let useList = this.$refs.tree.getCheckedNodes();
        this.$refs.updateRole.validate((valid) => {
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
                    this.update(postObj)
                }
            }
        })
      },
      async update(data){
        this.loading = true;
        try {
            let res = await post('/system/role/update/{id}',data,{
                id:this.updateObject.id
            })
            this.$Message.success("角色 "+data.name+" 更新成功");
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
      permissionSync(data,ro){
        if(data!=null && data.length>0){
            data.forEach(r => {
                if(r.id==ro.id){
                    ro.checked = true;
                }
                if(r.children!=null && r.children.length>0){
                    permissionSync(data,ro)
                }
            })
        }
      },
      dealPostData(data){
          data.forEach(element => {
              element.title = element.name;
              this.permissionSync(this.updateObject.resources,element)
              if(element.children!=null){
                  this.dealPostData(element.children)
              }
          });
      }
  }
}
</script>

