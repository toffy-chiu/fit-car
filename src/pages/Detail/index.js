var Link=require('react-router').Link;
var NavBar=require('../../components/NavBar');
var Icon=require('../../components/Icon');
var Group=require('amazeui-touch/lib/Group');
var Loader=require('amazeui-touch/lib/Loader');
var Container=require('amazeui-touch/lib/Container');

var db = require('../../lib/IndexDB');
var ct=require('../../constants/CostType');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            list: []
        }
    },
    componentDidMount:function(){
        //读取数据库
        db.getList(db.TABLE_CONSUMPTION, function(list){
            //倒序排序
            list.sort(function(a, b){
                return new Date(b.date).getTime()-new Date(a.date).getTime();
            });
            this.setState({
                loading:false,
                list:list
            });
        }.bind(this), db.index_date, db.keyRange.atMonth([this.props.params.date]));
    },
    //条目数据预处理
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
            return (
                <div className="loading">
                    <Loader rounded amStyle="primary"/>
                </div>
            )
        }else {
            return (
                <Container>
                    <NavBar title="消费明细" leftNav={{}} />
                    <div className="item item-header">{this.props.params.date}</div>
                    <Group noPadded className="margin-0">
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
                    </Group>
                </Container>
            )
        }
    }
});