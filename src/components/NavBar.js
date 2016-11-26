var Icon=require('./Icon');

var NavBar=React.createClass({
    propTypes:{
        title:React.PropTypes.string,
        leftNav:React.PropTypes.object
    },
    render: function() {
        return (
            <header className="navbar navbar-primary">
                <h2 className="navbar-title navbar-center">{this.props.title}</h2>
                {
                    this.props.leftNav?(
                        <div className="navbar-nav navbar-left">
                            <a href={this.props.leftNav.href||'javascript:history.back()'}>
                                <Icon name={this.props.leftNav.icon||'back'} color="white" style={{marginBottom:-6}}/>
                            </a>
                        </div>
                    ):null
                }
            </header>
        )
    }
});

module.exports=NavBar;