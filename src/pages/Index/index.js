var TopDate = require('../../components/TopDate');
var ItemTable = require('./ItemTable');
var Chart = require('./Chart');
var Loader=require('../../components/Loader');

var db = require('../../lib/IndexDB');

module.exports=React.createClass({
    getInitialState:function(){
        var now=new Date();
        return {
            loading:true,
            date:now.getFullYear()+'-'+TopDate.fixDecade(now.getMonth()+1),
            tableValue:{}
        };
    },
    componentDidMount:function(){
        this.loadData(this.state.date);
    },
    /**
     * 加载数据
     * @param date
     */
    loadData:function(date){
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
            this.setState({
                loading:false,
                date:date,
                tableValue:state
            });
        }.bind(this), db.index_date, db.keyRange.atMonth([date]));
    },
    /**
     * 改变日期
     * @param date
     */
    handleDateChange:function(date){
        this.loadData(date);
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            return (
                <div className="container">
                    <TopDate value={this.state.date} onChange={this.handleDateChange} />
                    <Chart data={this.state.tableValue}/>
                    <ItemTable value={this.state.tableValue} />
                </div>
            )
        }
    }
});