<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>日志管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15" class="margin-bottom-10">
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button :disabled="selections.length==0 || setting.loading" type="error" @click="removeList(false)"><Icon type="trash-a"></Icon>&nbsp;批量删除所选</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                    </Row>
                    <Table ref="table"  class="margin-bottom-10" @on-selection-change="selectionChange"
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
                <Button type="error" size="large" long :loading="setting.loading">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
                selections:[],
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {title: '用户ID', key: 'uid'},
                    {title: '用户名', key: 'username'},
                    {title: '动作名称', key: 'actionName'},
                    {title: 'IP', key: 'ip',render:(h,params)=>{
                        let ip = params.row.ip;
                        let ipSplit = ip.split(".")
                        if(ipSplit.length==4){
                            return h('span',ipSplit[0]+'.'+'***'+'.'+ipSplit[2]+'.'+ipSplit[3])
                        }
                        return h('span',ip)
                    }},
                    {title: '请求类型', key: 'ajax',render:(h,params)=>{
                        return h('span',params.row.ajax == 0 ? '普通请求' : 'AJAX请求')
                    }},
                    {title: '请求地址', key: 'uri'},
                    {title: '请求参数', key: 'params'},
                    {title: '请求方法', key: 'httpMethod'},
                    {title: '类.方法', key: 'classMethod'},
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
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'error' ,size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.removeList(params.row.id)
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
            /**
             * @description 批量选择回调
             */
            selectionChange(list){
                this.selections = list;
            },
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
             * @description 获取用户列表
             */
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/system/log/list',{
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
             * @description 批量删除
             */
            async removeList(single = false){
                this.setting.loading = true;
                this.$Message.loading({
                    content:"日志删除中...",
                    duration:0
                });
                let objs = []
                if(single){
                    objs.push(single)
                }else{
                    this.selections.forEach(el=>{
                        objs.push(el.id)
                    })
                }
                try {
                    let res = await post('/system/log/remove',objs);
                    this.getData();
                    this.selections = [];
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"日志删除成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 导出表格CSV
             */
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '日志数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 0 && index < this.columns.length-1),
                        data: this.data.records
                    });
                }
            }
        }
    }
</script>