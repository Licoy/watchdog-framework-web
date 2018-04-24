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
                            <Button type="info" @click="openAddModal(null)"><Icon type="plus"></Icon>&nbsp;添加用户</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table @on-selection-change="selectChange" ref="table"  @on-select-all="selectChange" class="margin-bottom-10"
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                    <Page :total="data.pages" class="tr" @on-change="pageChange" :current.sync="dataFilter.page" :page-size="dataFilter.pageSize"
                      @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        <Modal v-model="modal.show" :title="modal.type==1 ? '添加用户':'编辑用户'"
             :mask-closable="false">
            <Form :model="modal.data" :label-width="80">
                <FormItem v-if="modal.type==2" label="ID">
                    <Input disabled :value="modal.data.id"></Input>
                </FormItem>
                <FormItem v-if="modal.type==1 && modal.data.parentName!=null" label="父级名称">
                    <Input disabled :value="modal.data.parentName"></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model.trim="modal.data.username"></Input>
                </FormItem>
                <FormItem label="年龄">
                    <InputNumber  :min="0" :step="1" v-model.trim="modal.data.age" style="width:100%"/>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model.trim="modal.data.status" style="width:100%">
                        <Option v-for="item in [{label:'正常',value:1},{label:'锁定',value:0}]"
                         :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
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
    </div>
</template>
<script>
    import miment from 'miment'
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
                selections:[],
                removeModal:false,
                modal:{
                    show:true,
                    type:1,
                    loading:true,
                    data:{
                        username:'',
                        age:0,
                        status:1
                    }
                },
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
                        title: '创建日期',
                        key: 'createDate',
                        render:(h,params)=>{
                            return h('span',miment(params.row.createDate).format('YYYY年MM月DD日 hh时mm分ss秒'))
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
                                    style: {marginRight: '5px'}
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