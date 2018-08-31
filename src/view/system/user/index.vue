<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>用户管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加用户</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table ref="table"  class="margin-bottom-10"
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                    <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.current" :page-size="data.size"
                      @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="removeUser">确认删除</Button>
            </div>
        </Modal>
        <AddUser v-if="addUserModal" :roles="roles" @cancel="onModalCancel"/>
        <UpdateUser v-if="updateUserModal" :roles="roles" :uid="updateUserId" @cancel="onModalCancel"/>
        <ResetPassword v-if="resetPasswordModal" :user="resetPasswordUser" @cancel="onModalCancel"/>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddUser from './components/add.vue'
    import UpdateUser from './components/update.vue'
    import ResetPassword from './components/reset-password.vue'
    export default {
        data () {
            return {
                addUserModal:false,
                updateUserModal:false,
                resetPasswordModal:false,
                updateUserId:null,
                resetPasswordUser:null,
                selections:[],
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                search:{
                    type:'name',
                    value:''
                },
                columns: [
                    {title: 'ID', key: 'id',sortable: true},
                    {title: '用户名', key: 'username',sortable: true},
                    {title: '年龄',key: 'age',sortable: true},
                    {
                        title: '状态',
                        key: 'status', 
                        render:(h,params)=>{
                            return h('span',
                                {
                                    style: {color: params.row.status == 1 ? 'green' : 'red'
                                }
                            }, params.row.status == 1 ? '正常' : '锁定中')
                        },
                        sortable: true
                    },
                    {
                        title: '角色组',
                        key: 'roles', 
                        render:(h,params)=>{
                            let roles = []
                            if(params.row.roles!=null && params.row.roles.length>0){
                                params.row.roles.forEach(element => {
                                    let role = h('Tag',{
                                        props:{
                                            color:"blue"
                                        }
                                    },element.name)
                                    roles.push(role)
                                });
                                return h('div',roles)
                            }
                            return h('span','空')
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'createDate',
                        render:(h,params)=>{
                            return h('span',dayjs(params.row.createDate).format('YYYY年MM月DD日 HH:mm:ss'))
                        },
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: params.row.status == 1 ? 'success' : 'warning' ,size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.lockUser(params.row)
                                        }
                                    }
                                }, params.row.status == 1 ? '锁定' : '恢复'),
                                h('Button', {
                                    props: {type: 'primary',size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.openAddModal(params.row.id)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {type: 'info',size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.openAddModal(params.row,'resetPassword')
                                        }
                                    }
                                }, '重置密码'),
                                h('Button', {
                                    props: {type: 'error',size: 'small'},
                                    on:{
                                        click:()=>{
                                            this.removeObject = {
                                                obj:params.row,
                                                index:params.index
                                            }
                                            this.removeModal = true;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: {},
                dataFilter:{
                    page:1,
                    pageSize:10
                },
                removeObject:null,
                roles:null
            }
        },
        components:{
            AddUser,UpdateUser,ResetPassword
        },
        created(){
            this.getData();
        },
        methods:{
            /**
             * @description 分页更换事件回调
             */
            pageChange(p){
                this.dataFilter.page = p;
                this.getData();
            },
            /**
             * @description 分页每页显示数量改变事件回调
             */
            pageSizeChange(p){
                this.dataFilter.pageSize = p;
                this.getData();
            },
            /**
             * @description 删除用户
             */
            async removeUser(){
                this.removeModal = false;
                if(this.removeObject==null){
                    this.$Message.warning("删除对象为空，无法继续执行！");
                    return false;
                }
                this.setting.loading = true;
                try {
                    let res = await post('/system/user/remove/{uid}',null,{
                        uid: this.removeObject.obj.id
                    })
                    this.$Message.success("删除成功");
                    this.data.records.splice(this.removeObject.index,1);
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 锁定/解锁用户
             */
            async lockUser(obj){
                this.setting.loading = true;
                let status = obj.status;
                let req_url = status==1 ? 'lock' : 'unlock';
                let req_rep = status==1 ? 0 : 1;
                let req_msg = status==1 ? '已锁定' : '已解锁';
                try {
                    let res = await post('/system/user/{method}/{uid}',null,{
                        uid: obj.id,
                        method: req_url
                    })
                    this.$Message.destroy();
                    this.$Message.success(req_msg);
                    obj.status = req_rep;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 获取用户列表
             */
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/system/user/list',{
                        page:this.dataFilter.page,
                        pageSize:this.dataFilter.pageSize
                    })
                    this.data = res.data;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 获取角色列表
             */
            async getRoleList(){
                try {
                    let res = await post('/system/role/list',{
                        page:1,
                        pageSize:1000
                    })
                    this.roles = res.data.records;
                } catch (error) {
                    this.$throw(error)
                }
            },
             /**
             * @description 打开模态窗口
             * @param uid 用户ID
             * @param type 打开类型
             */
            openAddModal(uid,type = 'update'){
                if(uid==null || type==='update'){
                    if(this.roles==null){
                        this.getRoleList();
                    }
                }
                if(uid==null){
                    this.addUserModal = true;
                }else if(type==='update'){
                    this.updateUserId = uid;
                    this.updateUserModal = true;
                }else{
                    this.resetPasswordUser = uid;
                    this.resetPasswordModal = true;
                }
            },
            /**
             * @description 关闭模态窗口
             * @param type 窗口类型
             * @param reload 是否重新加载数据
             */
            onModalCancel(type,reload = false){
                switch(type){
                    case 'add':{
                        this.addUserModal = false;
                    };break;
                    case 'update':{
                        this.updateUserModal = false;
                    };break;
                    case 'resetPassword':{
                        this.resetPasswordModal = false;
                    };break;
                }
                if(reload) this.getData();
            },
            /**
             * @description 导出表格CSV
             */
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '用户数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>