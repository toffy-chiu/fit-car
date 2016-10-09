var React=require('react');
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    TabBar=UI.TabBar,
    Container=UI.Container;

var TopDate = require('./TopDate');
var ItemTable = require('./ItemTable');


module.exports=React.createClass({
    render:function(){
        var navBarProps = {
            title: '车消费记录',
            amStyle:'primary',
            rightNav:[
                {
                    icon:'refresh'
                }
            ]
        };
        return (
            <Container fill direction="column">
                <NavBar {...navBarProps} />
                <TopDate />
                <ItemTable />
                <TabBar amStyle="primary">
                    <TabBar.Item title="记一笔" icon="plus" href="#/edit" />
                    <TabBar.Item title="查看明细" icon="list" href="#/detail" />
                </TabBar>
            </Container>
        )
    }
});