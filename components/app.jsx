var React=require('react');
var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    hashHistory=ReactRouter.hashHistory,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;

var IndexPage = require('./IndexPage');
var EditPage = require('./EditPage');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={IndexPage}/>
        <Route path="/index" component={IndexPage}/>
        <Route path="/edit" component={EditPage}/>
    </Router>
    ,
    document.getElementById('container')
);