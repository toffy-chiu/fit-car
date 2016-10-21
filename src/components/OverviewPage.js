var React=require('react');
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    Icon=UI.Icon,
    Group=UI.Group,
    List=UI.List,
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
        db.getList(db.TABLE_CONSUMPTION, function(list){
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
            title: '花销总览',
            amStyle:'primary',
            leftNav:[
                {
                    icon:'left-nav',
                    href:'#/index'
                }
            ]
        };
        //数据预处理，同月份的合并
        var list=[];
        if(this.state.list.length){
            var header='', month, types;
            this.state.list.forEach(function(o, i){
                //插入标题头
                month=o.date.slice(0, 7);
                if(header!=month){
                    header=month;

                    //插入第一个到倒数第二个月的项
                    for(var t in types){
                        types[t].amount+=' 元';
                        list.push(types[t]);
                    }

                    list.push({
                        title:header
                    });

                    //合并类型，初始化
                    types={};
                }

                if(!types[o.type]){
                    types[o.type]={
                        name:ct[o.type].name,
                        icon:ct[o.type].icon,
                        amount:0
                    }
                }
                types[o.type].amount+=+o.amount;

                //插入最后一项
                if(i==this.state.list.length-1){
                    for(var t in types){
                        types[t].amount+=' 元';
                        list.push(types[t]);
                    }
                }
            }.bind(this));
        }
        return (
            <Container>
                <NavBar {...navBarProps} />
                <div className="item item-header">{this.props.params.date}</div>
                <Group noPadded className="margin-0">
                    {
                        list.length?(
                            <List>
                                {
                                    list.map(function(o, i){
                                        return o.title
                                            ?<List.Item key={i} role="header">{o.title}</List.Item>
                                            :<List.Item key={i} title={<span><Icon name={o.icon}/> {o.name}</span>} after={o.amount}/>
                                    })
                                }
                            </List>
                        ):(
                            <h3 className="text-center padding-v-lg"><Icon name="info" />没有数据！</h3>
                        )
                    }
                </Group>
            </Container>
        )
    }
});