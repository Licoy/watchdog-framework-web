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
                            <Button type="info" @click="addRoleModal=true"><Icon type="plus"></Icon>&nbsp;添加角色</Button>
                            <Button type="error" :disabled="selections.length==0"><Icon type="trash-a"></Icon>&nbsp;批量删除，已选 {{selections.length}} 项</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table @on-selection-change="selectChange" ref="table"  @on-select-all="selectChange" class="margin-bottom-10" :columns="columns" 
                        :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                     <Page :total="data.pages" class="tr" @on-change="pageChange" :current.sync="dataFilter.page" :page-size="dataFilter.pageSize"
                      @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        <AddRole v-if="addRoleModal" @cancel="onAddRoleModalCancel"/>
    </div>
</template>
<script>
    import AddRole from '@/components/system/role/AddRole'
    export default {
        data () {
            return {
                addRoleModal:false,
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
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {title: 'ID', key: 'id',sortable: true},
                    {title: '角色名', key: 'name',sortable: true},
                    {title: '权限集',key: 'permission',sortable: true, render:(h, params)=>{
                        let permissions = params.row.permissions;
                        if(permissions!=null && typeof(permissions)=="object" && permissions.length > 0){
                            let ps = [];
                            permissions.forEach(element => {
                                let r = h('Tag',{
                                    props:{
                                        color:'green',
                                        type:'dot'
                                    }
                                },element.name);
                                ps.push(r);
                            });
                            return h('div',ps)
                        }else{
                            return h('span','空')
                        }
                    }},
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'info',size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            //this.$router.push({path:'/product/setting',query:{info:params.row}})
                                        }
                                    }
                                }, '锁定'),
                                h('Button', {
                                    props: {type: 'primary',size: 'small'},
                                    style: {marginRight: '5px'}
                                }, '修改'),
                                h('Button', {
                                    props: {type: 'error',size: 'small'}
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
                removeObject:null
            }
        },
        components: {
            AddRole
        },
        created(){
            this.getData();
        },
        methods:{
            selectChange(selection){
                this.selections = selection;
            },
            pageChange(p){
                this.dataFilter.page = p;
                this.getData();
            },
            pageSizeChange(p){
                this.dataFilter.pageSize = p;
                this.getData();
            },
            getData(){
                this.setting.loading = true;
                this.$http.post("/role/list",{
                    page:this.dataFilter.page,
                    pageSize:this.dataFilter.pageSize
                }).then(res=>{
                    if(res.status == 1){
                        this.data = res.data;
                    }else{
                        this.$Message.error(res.msg);
                    }
                    this.setting.loading = false;
                }).catch(e=>{
                    this.$Message.error("服务器请求失败");
                    this.setting.loading = false;
                })
            },
            onAddRoleModalCancel(){
                this.addRoleModal = false;
            },
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '权限数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>