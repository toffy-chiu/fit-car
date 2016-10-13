var React=require('react');
var UI = require('amazeui-touch'),
    Field=UI.Field,
    Button=UI.Button,
    NavBar=UI.NavBar,
    Group=UI.Group,
    Container=UI.Container;

var utils = require('../lib/utils');
var TopDate = require('./TopDate');
var ItemRows = require('./ItemRows');
var db = require('../lib/IndexDB');
module.exports=React.createClass({
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
                <Field ref="date" type="date" labelBefore="消费时间：" defaultValue={utils.dateFormat(new Date(), 'yyyy-MM-dd')} />
                <ItemRows ref="itemRows" />
                <Field ref="amount" type="number" labelBefore="消费金额：" labelAfter="元" min="0" placeholder="请输入消费金额" />
                <Group className="margin-0">
                    <Button onClick={this.handleAddRecord} onTouchStart={this.handleAddRecord} amStyle="primary" block>新增记录</Button>
                </Group>
            </Container>
        )
    }
});