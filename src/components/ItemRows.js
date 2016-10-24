var UI = require('amazeui-touch'),
    Grid=UI.Grid,
    Col=UI.Col,
    Badge=UI.Badge,
    Icon=UI.Icon,
    Group=UI.Group;
var itemObj=require('../constants/CostType');

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
        return (
            <Col>
                <Badge style={{width:'2.5rem',height:'2.5rem',lineHeight:3,backgroundColor:itemObj[itemName].color,color:'white',opacity:this.props.value==itemName?1:0.2}} onTouchStart={this.handleClick} onClick={this.handleClick} data-key={itemName} rounded>
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