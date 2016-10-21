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

//明细页
var DetailPage=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./DetailPage'));
    }, 'detail');
};

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" getComponent={IndexPage}/>
        <Route path="/index" getComponent={IndexPage}/>
        <Route path="/edit(/:id)" getComponent={EditPage}/>
        <Route path="/detail/:date" getComponent={DetailPage}/>
    </Router>
    ,
    document.getElementById('container')
);