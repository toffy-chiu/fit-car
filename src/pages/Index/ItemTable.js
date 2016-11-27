var itemObj=require('../../constants/CostType');
var Icon=require('../../components/Icon');

module.exports = React.createClass({
    /**
     * 获取每一项的HTML
     * @param itemName
     */
    getItemHTML:function(itemName){
        return (
            <div className="col">
                <Icon name={itemObj[itemName].icon} color={this.props.value[itemName]?itemObj[itemName].color:'#ccc'} style={{verticalAlign:'top'}}/>
                <span style={{marginLeft:'3px'}}>{itemObj[itemName].name}</span>
                {
                    this.props.value[itemName]
                    ?<span className="fr">￥{this.props.value[itemName]}</span>
                    :null
                }
            </div>
        )
    },
    render: function() {
        return (
            <div className="margin-0 group group-no-padded">
                <div className="group-body">
                    <div className="itemTable g g-bordered g-avg-2">
                        {this.getItemHTML('gas')}
                        {this.getItemHTML('park')}
                        {this.getItemHTML('wash')}
                        {this.getItemHTML('maintain')}
                        {this.getItemHTML('fix')}
                        {this.getItemHTML('breach')}
                        {this.getItemHTML('road')}
                        {this.getItemHTML('others')}
                    </div>
                </div>
            </div>
        );
    }
});