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
                            <Button type="error"><Icon type="trash-a"></Icon>&nbsp;批量删除，已选 {{selections.length}} 项</Button>
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
                        :loading="setting.loading"  :border="setting.showBorder" :data="data"></Table>
                    <Page :total="100" class="tr" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        
    </div>
</template>
<script>
    export default {
        data () {
            return {
                selections:[],
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
                    {title: '用户名', key: 'username',sortable: true},
                    {title: '年龄',key: 'age',sortable: true},
                    {title: '状态',key: 'status',sortable: true},
                    {title: '创建日期',key: 'create_date',sortable: true},
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
                data: []
            }
        },
        created(){
            this.getData();
        },
        methods:{
            selectChange(selection){
                this.selections = selection;
            },
            getData(){
                this.setting.loading = true;
                this.data = [
                    {
                        id:12,
                        username:'licoy',
                        age:20,
                        status:1,
                        create_date:'2018年4月18日09:29:54'
                    }
                ]
                this.setting.loading = false;
            },
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '产品数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>