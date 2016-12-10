var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    hashHistory=ReactRouter.hashHistory,
    IndexRoute=ReactRouter.IndexRoute,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;
require('./lib/iconfont');
require('./css/amazeui.touch.min.css');
require('./css/app.css');

//首页
var Index=require('./pages/Index');
var Edit=require('./pages/Edit');
var Detail=require('./pages/Detail');
var Overview=require('./pages/Overview');
var Setting=require('./pages/Setting');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute component={Index}/>
            <Route path="/index" component={Index}/>
            <Route path="/edit(/:id)" component={Edit}/>
            <Route path="/detail/:date" component={Detail}/>
            <Route path="/overview" component={Overview}/>
            <Route path="/setting" component={Setting}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);