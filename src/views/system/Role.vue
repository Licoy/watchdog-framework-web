<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>角色管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <Button type="info" @click="addRoleModal=true"><Icon type="plus"></Icon>&nbsp;添加角色</Button>
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
        <UpdateRole v-if="updateRoleModal" :update-object="updateObject" @cancel="onUpdateRoleModalCancel"/>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="remove">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import AddRole from '@/components/system/role/AddRole'
    import UpdateRole from '@/components/system/role/UpdateRole'
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
                addRoleModal:false,
                updateRoleModal:false,
                updateObject:null,
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
                    {title: '角色名', key: 'name',sortable: true},
                    {title: '权限集',key: 'resources',sortable: true, render:(h, params)=>{
                        let resources = params.row.resources;
                        if(resources!=null && typeof(resources)=="object" && resources.length > 0){
                            let ps = [];
                            resources.forEach(element => {
                                let r = h('Tag',{
                                    props:{
                                        color:'green',
                                        type:'dot'
                                    }
                                },element.name);
                                ps.push(r);
                                this.dealPostData(element.children,ps, h)
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
                                    props: {type: 'primary',size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.updateObject = params.row;
                                            this.updateRoleModal = true;
                                        }
                                    }
                                }, '修改'),
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
                removeObject:null
            }
        },
        components: {
            AddRole,UpdateRole
        },
        created(){
            this.getData();
        },
        methods:{
            pageChange(p){
                this.dataFilter.page = p;
                this.getData();
            },
            pageSizeChange(p){
                this.dataFilter.pageSize = p;
                this.getData();
            },
            async remove(){
                this.removeModal = false;
                if(this.removeObject==null){
                    this.$Message.warning("删除对象为空，无法继续执行！");
                    return false;
                }
                this.setting.loading = true;
                try {
                    let res = await post('/system/role/remove/{rid}',null,{
                        rid: this.removeObject.obj.id
                    })
                   this.$Message.success("删除成功");
                    this.data.records.splice(this.removeObject.index,1);
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/system/role/list',{
                        page:this.dataFilter.page,
                        pageSize:this.dataFilter.pageSize
                    })
                    this.data = res.data;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            onAddRoleModalCancel(up=false){
                this.addRoleModal = false;
                if(up) this.getData()
            },
            onUpdateRoleModalCancel(up=false){
                this.updateRoleModal = false;
                if(up) this.getData()
            },
            dealPostData(data, ps, h){
                if(data!=null){
                    data.forEach(element => {
                        let r = h('Tag',{
                            props:{
                                color:'green',
                                type:'dot'
                            }
                        },element.name);
                        ps.push(r);
                        if(element.children!=null){
                            this.dealPostData(element.children, ps, h)
                        }
                    });
                }
                
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