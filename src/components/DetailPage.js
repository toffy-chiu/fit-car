var React=require('react');
var Link=require('react-router').Link;
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    Icon=UI.Icon,
    Group=UI.Group,
    Loader=UI.Loader,
    Container=UI.Container;

var db = require('../lib/IndexDB');
var ct=require('../constants/CostType');

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
            var navBarProps = {
                title: '消费明细',
                amStyle: 'primary',
                leftNav: [
                    {
                        icon: 'left-nav',
                        href: '#/index'
                    }
                ]
            };
            return (
                <Container>
                    <NavBar {...navBarProps} />
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
                                                        <Icon name={o.icon} style={{fontSize:'2em',color:o.color}}/>
                                                        <strong
                                                            style={{marginLeft:'5px',verticalAlign:'text-top',flexGrow:1}}>{o.name}</strong>
                                                        <div className="fr">
                                                            <span>￥{o.amount} </span>
                                                            <Icon name="right-nav"
                                                                  style={{fontSize:'1em',color:'#ccc'}}/>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        }.bind(this))
                                    }
                                </ul>
                            ) : (
                                <h3 className="text-center padding-v-lg"><Icon name="info"/>没有数据！</h3>
                            )
                        }
                    </Group>
                </Container>
            )
        }
    }
});