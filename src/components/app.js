var React=require('react');
var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    hashHistory=ReactRouter.hashHistory,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;

//首页
var IndexPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./IndexPage'));
    }, 'index');
};

//编辑页
var EditPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./EditPage'));
    }, 'edit');
};

//当月明细
var DetailPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./DetailPage'));
    }, 'detail');
};

//花销总览
var OverviewPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./OverviewPage'));
    }, 'overview');
};

//设置
var SettingPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./SettingPage'));
    }, 'setting');
};

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" getComponent={IndexPage}/>
        <Route path="/index" getComponent={IndexPage}/>
        <Route path="/edit(/:id)" getComponent={EditPage}/>
        <Route path="/detail/:date" getComponent={DetailPage}/>
        <Route path="/overview" getComponent={OverviewPage}/>
        <Route path="/setting" getComponent={SettingPage}/>
    </Router>
    ,
    document.getElementById('container')
);