var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    hashHistory=ReactRouter.hashHistory,
    IndexRedirect=ReactRouter.IndexRedirect,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;
require('./lib/iconfont');
require('./css/amazeui.touch.min.css');
require('./css/app.css');

var Master=require('./components/Master');
var Index=require('./pages/Index');
var Edit=require('./pages/Edit');
var Detail=require('./pages/Detail');
var Overview=require('./pages/Overview');
var Setting=require('./pages/Setting');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRedirect to="/index"/>
            <Route component={Master}>
                <Route path="index" component={Index}/>
                <Route path="detail" component={Detail}/>
                <Route path="overview" component={Overview}/>
                <Route path="setting" component={Setting}/>
            </Route>
            <Route path="edit(/:id)" component={Edit}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);