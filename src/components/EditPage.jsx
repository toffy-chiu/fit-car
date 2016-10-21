var React=require('react');
var UI = require('amazeui-touch'),
    Field=UI.Field,
    Button=UI.Button,
    NavBar=UI.NavBar,
    Group=UI.Group,
    Modal=UI.Modal,
    Container=UI.Container;

var utils = require('../lib/utils');
var ItemRows = require('./ItemRows');
var db = require('../lib/IndexDB');
module.exports=React.createClass({
    getInitialState:function(){
        return {
            isNew:true, //当前页面是否新增状态
            showModal:false,
            id:0,
            date:utils.dateFormat(new Date(), 'yyyy-MM-dd'),
            type:null,
            amount:''
        }
    },
    componentDidMount:function(){
        var id=this.props.params.id;
        //如果是修改信息则赋值
        if(id) {
            this.setState({isNew:false});
            db.get(db.TABLE_CONSUMPTION, id, function (info) {
                info.id = id;
                this.refs.itemRows.setState({selected:info.type});
                this.setState(info);
            }.bind(this));
        }
    },
    handleAddRecord:function(e){
        e.preventDefault();
        var data={
            date:this.refs.date.getValue(),
            type:this.refs.itemRows.getType(),
            amount:this.refs.amount.getValue()
        };
        if(data.amount>0) {
            db.add(db.TABLE_CONSUMPTION, data);
            location.hash = '/index';
        }else{
            alert('消费金额无效');
        }
    },
    handleSaveRecord:function(e){
        e.preventDefault();
        var data={
            date:this.refs.date.getValue(),
            type:this.refs.itemRows.getType(),
            amount:this.refs.amount.getValue()
        };
        if(data.amount>0) {
            db.save(db.TABLE_CONSUMPTION, this.state.id, data);
            location.hash = '/index';
        }else{
            alert('消费金额无效');
        }
    },
    handleDelRecord:function(){
        this.setState({showModal:true});
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
        this.setState({showModal:false});
    },
    render:function(){
        var navBarProps = {
            title: '新增消费记录',
            amStyle:'primary',
            leftNav:[
                {
                    icon:'left-nav',
                    href:'#/index'
                }
            ]
        };
        return (
            <Container fill direction="column">
                <NavBar {...navBarProps} />
                <Field ref="date" type="date" value={this.state.date} labelBefore="消费时间：" />
                <ItemRows ref="itemRows" value={this.state.type} />
                <Field ref="amount" type="number" value={this.state.amount} labelBefore="消费金额：" labelAfter="元" min="0" placeholder="请输入消费金额" />
                {
                    this.state.isNew?(
                        <Group className="margin-0">
                            <Button onClick={this.handleAddRecord} amStyle="primary" block>新增记录</Button>
                        </Group>
                    ):(
                        <Group className="margin-0 text-center">
                            <Button onClick={this.handleDelRecord} amStyle="alert">删除记录</Button>
                            <Button onClick={this.handleSaveRecord} amStyle="secondary">保存修改</Button>
                        </Group>
                    )
                }
                <Modal title="确定删除吗？" role="confirm" isOpen={this.state.showModal} onAction={this.handleAction}></Modal>
            </Container>
        )
    }
});