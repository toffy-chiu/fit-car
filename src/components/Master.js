var TabBar=require('./TabBar');
var NavBar=require('./NavBar');

var Master = React.createClass({
    render:function(){
        return (
            <div>
                <NavBar title="汽车花销" rightNav={{href:'/edit',icon:'plus'}}/>
                {this.props.children}
                <TabBar/>
            </div>
        )
    }
});

module.exports = Master;