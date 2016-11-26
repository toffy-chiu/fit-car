var NavBar=require('../../components/NavBar');
var Container=require('amazeui-touch/lib/Container');
var Link=require('react-router').Link;

var TopDate = require('./TopDate');
var ItemTable = require('./ItemTable');
var Chart = require('./Chart');
var Icon = require('../../components/Icon');

var db = require('../../lib/IndexDB');

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
        db.getList(db.TABLE_CONSUMPTION, function(list){
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
        }.bind(this), db.index_date, db.keyRange.atMonth([date]));
    },
    render:function(){
        var navList=[
            {url:'/edit', icon:'plus', name:'记一笔'},
            {url:'/detail/'+this.state.date, icon:'list', name:'当月明细'},
            {url:'/overview', icon:'order', name:'花销总览'},
            {url:'/setting', icon:'setting', name:'设置'}
        ];
        return (
            <Container fill direction="column">
                <div className="views">
                    <NavBar title="车消费记录" />
                    <TopDate onDateChange={this.topDateChange} />
                    <Chart data={this.state.tableValue}/>
                    <ItemTable value={this.state.tableValue} />
                </div>
                <nav className="tabbar tabbar-primary padding-h-0">
                    {
                        navList.map(function(o, i){
                            return (
                                <Link key={i} to={o.url} className="tabbar-item">
                                    <Icon name={o.icon} color="white" style={{marginBottom:-3}}/>
                                    <span className="tabbar-label">{o.name}</span>
                                </Link>
                            )
                        })
                    }
                </nav>
            </Container>
        )
    }
});