webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(3);
	var ReactDOM=__webpack_require__(35);
	var ReactRouter=__webpack_require__(173),
	    hashHistory=ReactRouter.hashHistory,
	    Route=ReactRouter.Route,
	    Router=ReactRouter.Router;

	//首页
	var IndexPage=function(location, cb){
	    __webpack_require__.e/* nsure */(1, function(require){
	        //cb(error, value);
	        cb(null, __webpack_require__(236));
	    });
	};

	//编辑页
	var EditPage=function(location, cb){
	    __webpack_require__.e/* nsure */(2, function(require){
	        //cb(error, value);
	        cb(null, __webpack_require__(295));
	    });
	};

	//明细页
	var DetailPage=function(location, cb){
	    __webpack_require__.e/* nsure */(3, function(require){
	        //cb(error, value);
	        cb(null, __webpack_require__(298));
	    });
	};

	ReactDOM.render(
	    React.createElement(Router, {history: hashHistory}, 
	        React.createElement(Route, {path: "/", getComponent: IndexPage}), 
	        React.createElement(Route, {path: "/index", getComponent: IndexPage}), 
	        React.createElement(Route, {path: "/edit", getComponent: EditPage}), 
	        React.createElement(Route, {path: "/detail/:date", getComponent: DetailPage})
	    )
	    ,
	    document.getElementById('container')
	);

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/components/app.jsx"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/components/app.jsx"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }
]);