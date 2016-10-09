var React=require('react');
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    TabBar=UI.TabBar,
    Container=UI.Container;

var TopDate = require('./TopDate');
var ItemTable = require('./ItemTable');

var db = require('../src/IndexDB');

module.exports=React.createClass({
    handleDetail:function(key, e){
        e.preventDefault();
    },
    topDateChange:function(date){console.log(this.refs);
        var itemTable=this.refs.itemTable;
        db.get(db.TABLE_CONSUMPTION, db.index_date, db.keyRange.startWith([date]), function(list){
            console.log(list);
            //set item table
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
            list.forEach(function(o){
                state[o.type]+=+o.amount;
            });
            itemTable.setState(state);
        });
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
                <NavBar {...navBarProps} />
                <TopDate onDateChange={this.topDateChange} />
                <ItemTable ref="itemTable" />
                <TabBar amStyle="primary">
                    <TabBar.Item title="记一笔" icon="plus" href="#/edit" />
                    <TabBar.Item title="查看明细" icon="list" onClick={this.handleDetail} onTouchStart={this.handleDetail} />
                </TabBar>
            </Container>
        )
    }
});