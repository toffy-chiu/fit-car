var Icon=require('./Icon');
var Link=require('react-router').Link;

var NavBar=React.createClass({
    propTypes:{
        title:React.PropTypes.string,
        leftNav:React.PropTypes.object,
        rightNav:React.PropTypes.object
    },
    render: function() {
        return (
            <header className="navbar navbar-primary">
                <h2 className="navbar-title navbar-center">{this.props.title}</h2>
                {
                    this.props.leftNav?(
                        <div className="navbar-nav navbar-left">
                            <Link to={this.props.leftNav.href||'/index'}>
                                <Icon name={this.props.leftNav.icon||'back'} color="white" style={{marginBottom:-6}}/>
                            </Link>
                        </div>
                    ):null
                }
                {
                    this.props.rightNav?(
                        <div className="navbar-nav navbar-right">
                            <Link to={this.props.rightNav.href}>
                                <Icon name={this.props.rightNav.icon} color="white" style={{marginBottom:-6}}/>
                            </Link>
                        </div>
                    ):null
                }
            </header>
        )
    }
});

module.exports = NavBar;