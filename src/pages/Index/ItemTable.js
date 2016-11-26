var Grid=require('amazeui-touch/lib/Grid');
var Col=require('amazeui-touch/lib/Col');
var Group=require('amazeui-touch/lib/Group');
var itemObj=require('../../constants/CostType');
var Icon=require('../../components/Icon');

module.exports = React.createClass({
    /**
     * 获取每一项的HTML
     * @param itemName
     */
    getItemHTML:function(itemName){
        return (
            <Col>
                <Icon name={itemObj[itemName].icon} color={this.props.value[itemName]?itemObj[itemName].color:'#ccc'} style={{verticalAlign:'text-top'}}/>
                <span style={{marginLeft:'3px'}}>{itemObj[itemName].name}</span>
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