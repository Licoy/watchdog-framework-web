<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>资源管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15"  class="margin-bottom-10">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加资源</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Tooltip placement="top">
                                <i-switch size="large" v-model="props.isFold">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <div slot="content">
                                    <p>是否折叠所有的节点</p>
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                    <zk-table
                        ref="table"
                        sum-text="sum"
                        index-text="#"
                        :data="datas"
                        :columns="columns"
                        :stripe="props.stripe"
                        :border="props.border"
                        :show-header="props.showHeader"
                        :show-summary="props.showSummary"
                        :show-row-hover="props.showRowHover"
                        :show-index="props.showIndex"
                        :tree-type="props.treeType"
                        :is-fold="props.isFold"
                        :expand-type="props.expandType"
                        :selection-type="props.selectionType">
                        <template slot="type" slot-scope="scope">
                            <span v-if="scope.row.type==0"><Icon type="grid"></Icon>&nbsp;菜单</span>
                            <span v-else><Icon type="android-radio-button-on"></Icon>&nbsp;按钮</span>
                        </template>
                        <template slot="icon" slot-scope="scope">
                            <span v-if="scope.row.icon!=null && scope.row.icon!=''"><Icon :type="scope.row.icon"></Icon></span>
                            <span v-else>-</span>
                        </template>
                        <template slot="color" slot-scope="scope">
                            <span v-if="scope.row.color!=null && scope.row.color!=''">
                                <Icon type="paintbucket" :color="scope.row.color"></Icon>
                            </span>
                            <span v-else>-</span>
                        </template>
                        <template slot="verification" slot-scope="scope">
                            <span v-if="scope.row.verification==true">
                                是
                            </span>
                            <span v-else>否</span>
                        </template>
                        <template slot="action" slot-scope="scope">
                            <Button type="primary" @click="edit(scope.row)" size="small">编辑</Button>
                            <Button type="success" @click="openAddModal(scope.row)" size="small">添加下级</Button>
                            <Button type="error" @click="removeModalOpen(scope.row.id)" size="small">删除</Button>
                        </template>
                    </zk-table>
                </template>
            </div>
        </Card>
        <Modal v-model="modal.show" :title="modal.type==1 ? '添加资源':'更新资源'"
             @on-ok="modalOk"
             :mask-closable="false">
             <Alert show-icon>为方便操作，添加时[资源链接/权限标识]会自动继承父级的资源属性。</Alert>
            <Form :model="modal.data" :label-width="80">
                <FormItem v-if="modal.type==2" label="ID">
                    <Input disabled :value="modal.data.id"></Input>
                </FormItem>
                <FormItem v-if="modal.type==1 && modal.data.parentName!=null" label="父级名称">
                    <Input disabled :value="modal.data.parentName"></Input>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model.trim="modal.data.name"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select v-model.trim="modal.data.type" style="width:100%">
                        <Option v-for="item in [{label:'菜单',value:0},{label:'按钮',value:1}]"
                         :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="资源链接">
                    <Input v-model.trim="modal.data.url"></Input>
                </FormItem>
                <FormItem label="权限标识">
                    <Input v-model.trim="modal.data.permission"></Input>
                </FormItem>
                <FormItem label="验证与否">
                    <Select v-model="modal.data.verification" style="width:100%">
                        <Option v-for="verOption in [{label:'是',value:'true'},{label:'否',value:'false'}]"
                         :value="verOption.value" :key="verOption.value">{{ verOption.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="颜色标示">
                     <color-picker v-model="modal.data.color" recommend></color-picker>
                </FormItem>
                <FormItem label="图标">
                    <Input v-model.trim="modal.data.icon"></Input>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber  :min="0" :step="1" v-model.trim="modal.data.sort" style="width:100%"/>
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
                <Button type="error" size="large" long @click="remove">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                props: {
                    stripe: true,
                    border: true,
                    showHeader: true,
                    showSummary: false,
                    showRowHover: true,
                    showIndex: false,
                    treeType: true,
                    isFold: false,
                    expandType: false,
                    selectionType: false,
                },
                datas: [],
                columns: [
                    {
                        label: '资源名称',
                        prop: 'name',
                        width: '400px',
                    },
                    {
                        label: '类型',
                        prop: 'type',
                        type: 'template',
                        template: 'type',
                    },
                    {
                        label: '资源链接',
                        prop: 'url',
                    },
                    {
                        label: '权限标识',
                        prop: 'permission',
                    },
                    {
                        label: '验证与否',
                        prop: 'verification',
                        type: 'template',
                        template: 'verification',
                        width:'85px'
                    },
                    {
                        label: '颜色',
                        prop: 'color',
                        type: 'template',
                        template: 'color',
                        width:'60px'
                    },
                    {
                        label: '图标',
                        prop: 'icon',
                        type: 'template',
                        template: 'icon',
                        width:'80px'
                    },
                    {
                        label: '排序',
                        prop: 'sort',
                        width:'100px'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        prop: 'action',
                        template: 'action',
                    }
                ],
                modal:{
                    show:false,
                    type:1,
                    data:{
                        id:0,
                        name:'',
                        type:1, //0-菜单 1-按钮
                        url:'',
                        permission:'',
                        icon:'',
                        sort:0,
                        color:'#19BE6B',
                        verification:'true'
                    }
                },
                removeObject:null
            }
        },
        created(){
            this.getData();
        },
        methods:{
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/system/resource/list')
                    this.datas = res.data;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            async addOK(){
                this.$Message.loading({
                    content:"资源添加中...",
                    duration:0
                })
                try {
                    await post('/system/resource/add',this.modal.data)
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源添加成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            async editOk(){
                this.$Message.loading({
                    content:"资源更新中...",
                    duration:0
                })
                try {
                    await post('/system/resource/update/{id}',this.modal.data,{
                        id:this.modal.data.id
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源更新成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            removeModalOpen(id){
                this.removeModal = true;
                this.removeObject = id;
            },
            async remove(){
                this.setting.loading = true;
                this.$Message.loading({
                    content:"资源删除中...",
                    duration:0
                })
                try {
                    await post('/system/resource/remove/{id}',null,{
                        id:this.removeObject
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源删除成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
                this.removeModal = false;
            },
            modalOk(){
                if(this.modal.type==1){
                    this.addOK();
                }else{
                    this.editOk();
                }
            },
            edit(row){
                this.modal.type = 2;
                this.modal.data = {
                    id:row.id,
                    name:row.name,
                    type:row.type, //1-菜单 2-按钮
                    url:row.url,
                    permission:row.permission,
                    icon:row.icon,
                    sort:row.sort,
                    color:row.color=='' ? '#19BE6B' : row.color,
                    verification:row.verification==null ? 'true' : row.verification==true?'true':'false',
                }
                this.modal.show = true;
            },
            openAddModal(parent=null){
                this.modal.type = 1;
                this.modal.data = {
                    id:0,
                    parentId:parent==null ? null : parent.id,
                    name:'',
                    type:0, //1-菜单 2-按钮
                    url:parent==null ? null : parent.url,
                    permission:parent==null ? null : parent.permission,
                    icon:'',
                    sort:0,
                    parentName:parent==null ? null : parent.name,
                    verification:parent==null ? 'true' : parent.verification==true?'true':'false',
                    color:'#19BE6B'
                }
                console.log(this.modal.data)
                this.modal.show = true;
            }
        }
    }
</script>