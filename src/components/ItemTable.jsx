var React=require('react');
var UI = require('amazeui-touch'),
    Grid=UI.Grid,
    Col=UI.Col,
    Icon=UI.Icon,
    Group=UI.Group;
var itemObj=require('../constants/CostType');

module.exports = React.createClass({
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
        return (
            <Col>
                <Icon name={itemObj[itemName].icon} />
                <small style={{marginLeft:'5px',verticalAlign:'text-top'}}>{itemObj[itemName].name}</small>
                {
                    this.props.value[itemName]
                    ?<span className="fr">￥{this.props.value[itemName]}</span>
                    :null
                }
            </Col>
        )
    },
    render: function() {
        return (
            <Group noPadded className="margin-0">
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