var Icon=require('../../components/Icon');
var itemObj=require('../../constants/CostType');

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
            <div className="col">
                <span className="badge badge-rounded" style={{width:'2.5rem',height:'2.5rem',lineHeight:3,backgroundColor:itemObj[itemName].color,opacity:this.props.value==itemName?1:0.2}} onTouchStart={this.handleClick} onClick={this.handleClick} data-key={itemName}>
                    <Icon name={itemObj[itemName].icon} color="white" style={{marginBottom:-4,marginLeft:-1}} />
                </span>
                <div>{itemObj[itemName].name}</div>
            </div>
        )
    },
    render: function() {
        this._value=this.props.value;
        return (
            <div className="margin-0 text-center group group-no-padded">
                <div className="group-body">
                    <div className="itemRows g g-avg-4">
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