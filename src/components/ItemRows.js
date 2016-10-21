var React=require('react');
var UI = require('amazeui-touch'),
    Grid=UI.Grid,
    Col=UI.Col,
    Badge=UI.Badge,
    Icon=UI.Icon,
    Group=UI.Group;

module.exports = React.createClass({
    _value:null,    //自定义属性
    propTypes:{
        value:React.PropTypes.oneOf(['gas', 'park', 'wash', 'maintain', 'fix', 'breach', 'road', 'others'])
    },
    handleClick:function(e){
        e.preventDefault();
        this._value=e.currentTarget.getAttribute('data-key');
        this.props.onChange(e);
    },
    getValue:function(){
        return this._value;
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
                <Badge style={{width:'2.5rem',height:'2.5rem',lineHeight:2.9}} onTouchStart={this.handleClick} onClick={this.handleClick} data-key={itemName} amStyle={this.props.value==itemName?'secondary':'default'} rounded>
                    <Icon name={itemObj[itemName].icon} />
                </Badge>
                <div>{itemObj[itemName].name}</div>
            </Col>
        )
    },
    render: function() {
        this._value=this.props.value;
        return (
            <Group noPadded className="margin-0 text-center">
                <Grid avg={4} className="itemRows">
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