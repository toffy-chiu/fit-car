var React=require('react');
var Link=require('react-router').Link;
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    Icon=UI.Icon,
    Group=UI.Group,
    Container=UI.Container;

var db = require('../lib/IndexDB');
var ct=require('../constants/CostType');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            list: []
        }
    },
    componentDidMount:function(){
        //读取数据库
        db.getList(db.TABLE_CONSUMPTION, db.index_date, db.keyRange.atMonth([this.props.params.date]), function(list){
            //倒序排序
            list.sort(function(a, b){
                return new Date(b.date).getTime()-new Date(a.date).getTime();
            });
            this.setState({list:list});
        }.bind(this));
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
            amount:item.amount
        };
    },
    render:function(){
        var navBarProps = {
            title: '消费明细',
            amStyle:'primary',
            leftNav:[
                {
                    icon:'left-nav',
                    href:'#/index'
                }
            ],
            rightNav:[
                {
                    icon:'bars'
                }
            ]
        };
        return (
            <Container>
                <NavBar {...navBarProps} />
                <div className="item item-header">{this.props.params.date}</div>
                <Group noPadded className="margin-0">
                    <ul className="list">
                        {
                            this.state.list.map(function(o){
                                o=this.getItem(o);
                                return (
                                    <li key={o.id} className="item item-linked">
                                        <Link to={'/edit/'+o.id} style={{display:'flex',alignItems:'center'}}>
                                            <div className="text-center" style={{lineHeight:1,borderRight:'1px solid #ccc',paddingRight:10,marginRight:10}}>
                                                <strong>{o.day}</strong>
                                                <br/>
                                                <small>{o.week}</small>
                                            </div>
                                            <Icon name="info" style={{fontSize:'2em'}} />
                                            <strong style={{marginLeft:'5px',verticalAlign:'text-top',flexGrow:1}}>{o.name}</strong>
                                            <div className="fr">
                                                <span>￥{o.amount} </span>
                                                <Icon name="right-nav" style={{fontSize:'1em',color:'#ccc'}} />
                                            </div>
                                        </Link>
                                    </li>
                                )
                            }.bind(this))
                        }
                    </ul>
                </Group>
            </Container>
        )
    }
});