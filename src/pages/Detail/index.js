var Link=require('react-router').Link;
var Icon=require('../../components/Icon');
var Loader=require('../../components/Loader');
var TopDate = require('../../components/TopDate');

var db = require('../../lib/IndexDB');
var ct=require('../../constants/CostType');

module.exports=React.createClass({
    getInitialState:function(){
        var now=new Date();
        return {
            loading:true,
            date:now.getFullYear()+'-'+TopDate.fixDecade(now.getMonth()+1),
            list: []
        }
    },
    componentDidMount:function(){
        this.loadData(this.state.date);
    },
    /**
     * 加载数据
     * @param date
     */
    loadData:function(date){
        db.getList(db.TABLE_CONSUMPTION, function(list){
            //倒序排序
            list.sort(function(a, b){
                return new Date(b.date).getTime()-new Date(a.date).getTime();
            });
            this.setState({
                loading:false,
                date:date,
                list:list
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
    /**
     * 条目数据预处理
     * @param item
     * @returns {{id: *, day: number, week: string, icon: *, name: *, color: *, amount: *}}
     */
    getItem:function(item){
        var date=new Date(item.date.replace(/-/g, '/'));
        var weekNames=['日','一','二','三','四','五','六'];
        return {
            id:item.id,
            day:date.getDate(),
            week:'周'+weekNames[date.getDay()],
            icon:ct[item.type].icon,
            name:ct[item.type].name,
            color:ct[item.type].color,
            amount:item.amount
        };
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            return (
                <div className="container">
                    <TopDate value={this.state.date} onChange={this.handleDateChange} />
                    <div className="margin-0 group group-no-padded">
                        <div className="group-body">
                            {
                                this.state.list.length ? (
                                    <ul className="list">
                                        {
                                            this.state.list.map(function (o) {
                                                o = this.getItem(o);
                                                return (
                                                    <li key={o.id} className="item item-linked">
                                                        <Link to={'/edit/'+o.id}
                                                              style={{display:'flex',alignItems:'center'}}>
                                                            <div className="text-center"
                                                                 style={{lineHeight:1,borderRight:'1px solid #ccc',paddingRight:10,marginRight:10}}>
                                                                <strong>{o.day}</strong>
                                                                <br/>
                                                                <small>{o.week}</small>
                                                            </div>
                                                            <Icon name={o.icon} color={o.color} size="30"/>
                                                            <strong
                                                                style={{marginLeft:'5px',verticalAlign:'text-top',flexGrow:1}}>{o.name}</strong>
                                                            <div>
                                                                <span>￥{o.amount} </span>
                                                                <Icon name="right" color="#ccc" size="16" style={{margin:'0 0 -2px 10px'}}/>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                            }.bind(this))
                                        }
                                    </ul>
                                ) : (
                                    <h3 className="text-center padding-v-lg">没有数据！</h3>
                                )
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
});