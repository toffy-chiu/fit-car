var NavBar=require('../../components/NavBar');
var List=require('amazeui-touch/lib/List');
var View=require('amazeui-touch/lib/View');
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
        }.bind(this));
    },
    render:function(){
        if(this.state.loading){
            return (
                <div className="loading">
                    <Loader rounded amStyle="primary"/>
                </div>
            )
        }else {
            //数据预处理，同月份的合并
            var list = [];
            var total = 0;
            if (this.state.list.length) {
                var header = '', month, types;
                this.state.list.forEach(function (o, i) {
                    //插入标题头
                    month = o.date.slice(0, 7);
                    if (header != month) {
                        header = month;

                        //插入第一个到倒数第二个月的项
                        for (var t in types) {
                            types[t].amount += ' 元';
                            list.push(types[t]);
                        }

                        list.push({
                            title: header
                        });

                        //合并类型，初始化
                        types = {};
                    }

                    if (!types[o.type]) {
                        types[o.type] = {
                            name: ct[o.type].name,
                            icon: ct[o.type].icon,
                            color: ct[o.type].color,
                            amount: 0
                        }
                    }
                    types[o.type].amount += +o.amount;
                    total += +o.amount;

                    //插入最后一项
                    if (i == this.state.list.length - 1) {
                        for (var t in types) {
                            types[t].amount += ' 元';
                            list.push(types[t]);
                        }
                    }
                }.bind(this));
            }
            return (
                <Container fill direction="column">
                    <NavBar title={`花销总览（共 ${total} 元）`} leftNav={{}} />
                    <div className="views">
                        <View>
                            <Container fill scrollable>
                                <Group noPadded className="margin-0">
                                    {
                                        list.length ? (
                                            <List>
                                                {
                                                    list.map(function (o, i) {
                                                        return o.title
                                                            ? <List.Item key={i} role="header">{o.title}</List.Item>
                                                            : <List.Item key={i}
                                                                         title={(
                                                                             <div style={{display:'flex',alignItems:'center'}}>
                                                                                <Icon name={o.icon} color={o.color} size="30"/>
                                                                                <span style={{marginLeft:5}}>{o.name}</span>
                                                                             </div>
                                                                         )}
                                                                         after={o.amount}/>
                                                    })
                                                }
                                            </List>
                                        ) : (
                                            <h3 className="text-center padding-v-lg">没有数据！</h3>
                                        )
                                    }
                                </Group>
                            </Container>
                        </View>
                    </div>
                </Container>
            )
        }
    }
});