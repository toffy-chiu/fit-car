var React=require('react');
var UI = require('amazeui-touch'),
    Field=UI.Field,
    Button=UI.Button,
    NavBar=UI.NavBar,
    Group=UI.Group,
    Container=UI.Container;

var utils = require('./utils');
var TopDate = require('./TopDate');
var ItemRows = require('./ItemRows');
module.exports=React.createClass({
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
                <Field type="date" labelBefore="消费时间：" defaultValue={utils.dateFormat(new Date(), 'yyyy-MM-dd')} />
                <ItemRows />
                <Field type="number" labelBefore="消费金额：" labelAfter="元" min="0" placeholder="请输入消费金额" />
                <Group>
                    <Button amStyle="primary" block>新增记录</Button>
                </Group>
            </Container>
        )
    }
});