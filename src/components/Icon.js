var Icon=React.createClass({
    propTypes:{
        color:React.PropTypes.string,
        size:React.PropTypes.string,
        style:React.PropTypes.object,
        name:React.PropTypes.string.isRequired,
        onClick:React.PropTypes.func,
        onTouchStart:React.PropTypes.func
    },
    getDefaultProps:function(){
        return {
            size:'25'
        }
    },
    render: function() {
        return (
            <svg
                width={this.props.size}
                height={this.props.size}
                fill={this.props.color}
                style={this.props.style}
                onClick={this.props.onClick}
                onTouchStart={this.props.onTouchStart}
            >
                <use xlinkHref={'#icon-'+this.props.name}/>
            </svg>
        )
    }
});

module.exports=Icon;