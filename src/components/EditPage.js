var React=require('react');
var UI = require('amazeui-touch'),
    Field=UI.Field,
    Button=UI.Button,
    NavBar=UI.NavBar,
    Group=UI.Group,
    Modal=UI.Modal,
    View=UI.View,
    Loader=UI.Loader,
    Container=UI.Container;

var utils = require('../lib/utils');
var ItemRows = require('./ItemRows');
var db = require('../lib/IndexDB');
module.exports=React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            isNew:true, //当前页面是否新增状态
            showConfirm:false,
            id:0
        }
    },
    componentDidMount:function(){
        var id=this.props.params.id;
        //通过ID来判断是增加还是编辑
        if(id) {
            this.setState({isNew:false});
            //加载编辑信息
            db.get(db.TABLE_CONSUMPTION, id, function (info) {
                info.loading=false;
                info.id = id;
                this.setState(info);
            }.bind(this));
        }else{
            //设置默认值
            this.setState({
                loading:false,
                type:'gas',
                date:utils.dateFormat(new Date(), 'yyyy-MM-dd'),
                amount:''
            });
        }
    },
    getData:function(){
        return {
            date:this.refs.date.getValue(),
            type:this.refs.itemRows.getValue(),
            amount:this.refs.amount.getValue()
        };
    },
    /**
     * 输入组件值变化时
     */
    handleFieldChange:function(){
        //设置各组件的值
        this.setState(this.getData());
    },
    handleAddRecord:function(e){
        e.preventDefault();
        var data=this.getData();
        if(data.amount>0) {
            db.add(db.TABLE_CONSUMPTION, data);
            location.hash = '/index';
        }else{
            alert('消费金额无效');
        }
    },
    handleSaveRecord:function(e){
        e.preventDefault();
        var data=this.getData();
        if(data.amount>0) {
            db.save(db.TABLE_CONSUMPTION, this.state.id, data);
            location.hash = '/detail/'+data.date.slice(0, 7);
        }else{
            alert('消费金额无效');
        }
    },
    handleDelRecord:function(){
        this.setState({showConfirm:true});
    },
    /**
     * 删除确认
     * @param isOK
     */
    handleAction:function(isOK){
        if(isOK){
            //删除该记录
            db.del(db.TABLE_CONSUMPTION, this.state.id);
            location.hash = '/index';
        }
        this.setState({showConfirm:false});
    },
    render:function(){
        if(this.state.loading){
            return (
                <div className="loading">
                    <Loader rounded amStyle="primary"/>
                </div>
            )
        }else {
            var navBarProps = {
                title: '新增消费记录',
                amStyle: 'primary',
                leftNav: [
                    {
                        icon: 'left-nav',
                        href: 'javascript:history.back()'
                    }
                ]
            };
            return (
                <Container fill direction="column" transition="sfl">
                    <NavBar {...navBarProps} />
                    <div className="views">
                        <View>
                            <Container fill scrollable>
                                <Field ref="date" type="date" value={this.state.date} onChange={this.handleFieldChange}
                                       labelBefore="消费时间："/>
                                <ItemRows ref="itemRows" value={this.state.type} onChange={this.handleFieldChange}/>
                                <Field
                                    ref="amount"
                                    type="number"
                                    value={this.state.amount}
                                    onChange={this.handleFieldChange}
                                    labelBefore="消费金额："
                                    labelAfter="元"
                                    min="0"
                                    placeholder="请输入消费金额"/>
                                {
                                    this.state.isNew ? (
                                        <Group className="margin-0">
                                            <Button type="submit" onClick={this.handleAddRecord} amStyle="primary" block>新增记录</Button>
                                        </Group>
                                    ) : (
                                        <Group className="margin-0 text-center">
                                            <Button onClick={this.handleDelRecord} amStyle="alert">删除记录</Button>
                                            <Button onClick={this.handleSaveRecord} amStyle="secondary">保存修改</Button>
                                        </Group>
                                    )
                                }
                                <Modal title="确定删除吗？" role="confirm" isOpen={this.state.showConfirm} onAction={this.handleAction}/>
                            </Container>
                        </View>
                    </div>
                </Container>
            )
        }
    }
});