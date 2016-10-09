var React=require('react');
var UI = require('amazeui-touch'),
    Grid=UI.Grid,
    Col=UI.Col,
    Icon=UI.Icon,
    Group=UI.Group;

module.exports = React.createClass({
    getInitialState:function(){
        return {
            gas:0,
            park:0,
            wash:0,
            maintain:0,
            fix:0,
            breach:0,
            road:0,
            others:0
        };
    },
    componentDidMount:function(){
        setTimeout(function(){
            this.setState({road:200});
        }.bind(this), 3000);
    },
    /**
     * 获取每一项的HTML
     * @param itemName
     */
    getItemHTML:function(itemName){
        //var itemObj={
        //    gas:{name:'加油', icon:'am-icon-tint'},
        //    park:{name:'停车', icon:'am-icon-product-hunt'},
        //    wash:{name:'洗车', icon:'am-icon-flask'},
        //    maintain:{name:'保养', icon:'am-icon-car'},
        //    fix:{name:'维修', icon:'am-icon-wrench'},
        //    breach:{name:'违章', icon:'am-icon-times'},
        //    road:{name:'过路', icon:'am-icon-road'},
        //    others:{name:'其他', icon:'am-icon-ellipsis-h'}
        //};
        var itemObj={
            gas:{name:'加油', icon:'star'},
            park:{name:'停车', icon:'star'},
            wash:{name:'洗车', icon:'star'},
            maintain:{name:'保养', icon:'star'},
            fix:{name:'维修', icon:'star'},
            breach:{name:'违章', icon:'star'},
            road:{name:'过路', icon:'star'},
            others:{name:'其他', icon:'star'}
        };
        return (
            <Col>
                <span className={'am-badge am-round'+(this.state[itemName]?' am-badge-primary':'')}><Icon name={itemObj[itemName].icon} /></span>
                <small style={{marginLeft:'5px'}}>{itemObj[itemName].name}</small>
                {
                    this.state[itemName]
                    ?<span className="am-fr">￥{this.state[itemName]}</span>
                    :null
                }
            </Col>
        )
    },
    render: function() {
        return (
            <Group noPadded>
                <Grid bordered avg={2} className="itemTable">
                    {this.getItemHTML('gas')}
                    {this.getItemHTML('park')}
                    {this.getItemHTML('wash')}
                    {this.getItemHTML('maintain')}
                    {this.getItemHTML('fix')}
                    {this.getItemHTML('breach')}
                    {this.getItemHTML('road')}
                    {this.getItemHTML('others')}
                </Grid>
            </Group>
        );
    }
});