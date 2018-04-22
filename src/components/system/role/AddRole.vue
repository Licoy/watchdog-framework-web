<template>
  <div>
      <!-- 添加角色  -->
        <Modal v-model="showModal" title="角色添加" @on-cancel="cancel" @on-ok="ok">
            <Form  :label-width="80">
                <FormItem label="角色名称：">
                    <Input v-model="formItem.name" placeholder="角色名称"></Input>
                </FormItem>
            </Form>
            <Form  :label-width="70">
                <FormItem label="权限集：">
                    <Tree ref="tree" :data="formItem.permissions" show-checkbox></Tree>
                </FormItem>
            </Form>
        </Modal>
  </div>
</template>
<script>
export default {
  data(){
      return {
          formItem: {
                name:'',
                permissions: [
                    {
                        title: '全部权限',
                        expand: true,
                        children: [
                            {
                                title: '系统设置',
                                expand: true,
                                children: [
                                    {
                                        title: '用户管理',
                                        children:[
                                            {title:'用户添加'},
                                            {title:'用户锁定'},
                                            {title:'用户解锁'},
                                            {title:'用户删除'},
                                            {title:'用户编辑'}
                                        ]
                                    },
                                    {
                                        title: '角色管理',
                                        children:[
                                            {title:'角色添加'},
                                            {title:'角色锁定'},
                                            {title:'角色解锁'},
                                            {title:'角色删除'},
                                            {title:'角色编辑'}
                                        ]
                                    },
                                    {
                                        title: '权限管理',
                                        children:[
                                            {title:'权限添加'},
                                            {title:'权限锁定'},
                                            {title:'权限解锁'},
                                            {title:'权限删除'},
                                            {title:'权限编辑'}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
          },
          showModal:true
       }
  },
  methods:{
      cancel(){
          this.$emit('cancel');
      },
      ok(){
          console.log(this.$refs.tree.getCheckedNodes())
          this.cancel();
      }
  }
}
</script>

