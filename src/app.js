var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    withRouter=ReactRouter.withRouter,
    hashHistory=ReactRouter.hashHistory,
    //browserHistory=ReactRouter.browserHistory,
    IndexRoute=ReactRouter.IndexRoute,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;
require('./lib/iconfont');

//首页
var IndexPage=require('./pages/Index');
IndexPage=withRouter(IndexPage);

//编辑页
var EditPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Edit'));
    }, 'edit');
};

//当月明细
var DetailPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Detail'));
    }, 'detail');
};

//花销总览
var OverviewPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Overview'));
    }, 'overview');
};

//设置
var SettingPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Setting'));
    }, 'setting');
};

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute component={IndexPage}/>
            <Route path="/index" component={IndexPage}/>
            <Route path="/edit(/:id)" getComponent={EditPage}/>
            <Route path="/detail/:date" getComponent={DetailPage}/>
            <Route path="/overview" getComponent={OverviewPage}/>
            <Route path="/setting" getComponent={SettingPage}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);