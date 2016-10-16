var React=require('react');
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    TabBar=UI.TabBar,
    Container=UI.Container;

var TopDate = require('./TopDate');
var ItemTable = require('./ItemTable');

var db = require('../lib/IndexDB');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            date:'',
            tableValue:{}
        };
    },
    topDateChange:function(date){
        //设置当前月份
        this.setState({date:date});

        //读取数据库
        db.get(db.TABLE_CONSUMPTION, db.index_date, db.keyRange.atMonth([date]), function(list){
            //重量各项值
            var state={
                gas:0,
                park:0,
                wash:0,
                maintain:0,
                fix:0,
                breach:0,
                road:0,
                others:0
            };
            //计算各项总数
            list.forEach(function(o){
                state[o.type]+=+o.amount;
            });
            //设置当前状态（通过属性值更新子组件）
            this.setState({tableValue:state});
        }.bind(this));
    },
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
                <div className="views">
                    <NavBar {...navBarProps} />
                    <TopDate onDateChange={this.topDateChange} />
                    <ItemTable value={this.state.tableValue} />
                </div>
                <TabBar amStyle="primary">
                    <TabBar.Item title="记一笔" icon="plus" href="#/edit" />
                    <TabBar.Item title="查看明细" icon="list" href={'#/detail/'+this.state.date} />
                </TabBar>
            </Container>
        )
    }
});