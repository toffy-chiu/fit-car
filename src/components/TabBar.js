var Icon=require('./Icon');
var Link=require('react-router').Link;

var TabBar=React.createClass({
    propTypes:{
        date:React.PropTypes.string
    },
    render: function() {
        var navList=[
            {url:'/index', icon:'car', name:'首页'},
            {url:'/detail', icon:'list', name:'当月明细'},
            {url:'/overview', icon:'order', name:'花销总览'},
            {url:'/setting', icon:'setting', name:'设置'}
        ];
        return (
            <nav className="tabbar tabbar-primary padding-h-0">
                {
                    navList.map(function(o, i){
                        return (
                            <Link key={i} to={o.url} className="tabbar-item" activeClassName="active">
                                <Icon name={o.icon} color="white" style={{marginBottom:-3}}/>
                                <span className="tabbar-label">{o.name}</span>
                            </Link>
                        )
                    })
                }
            </nav>
        )
    }
});

module.exports = TabBar;