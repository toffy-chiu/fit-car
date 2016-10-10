webpackJsonp([2],{

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(78);
	var UI = __webpack_require__(312),
	    Icon=UI.Icon;

	module.exports=React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	        //默认日期
	        var now=new Date();
	        return {
	            year:now.getFullYear(),
	            month:now.getMonth()
	        };
	    },
	    componentDidMount:function(){
	        console.log('componentDidMount');
	        this.props.onDateChange(this.state.year+'-'+(this.state.month<9?'0':'')+(this.state.month+1));
	    },
	    componentDidUpdate:function(){
	        console.log('componentDidUpdate');
	        this.props.onDateChange(this.state.year+'-'+(this.state.month<9?'0':'')+(this.state.month+1));
	    },
	    handleClick:function(e){
	        e.preventDefault();
	        var ctrl=e.currentTarget.getAttribute('data-ctrl');
	        if(ctrl=='prev'){
	            if(this.state.month<1){
	                this.state.year-=1;
	                this.state.month=11;
	            }else{
	                this.state.month-=1;
	            }
	        }else if(ctrl=='next'){
	            if(this.state.month>10){
	                this.state.year+=1;
	                this.state.month=0;
	            }else{
	                this.state.month+=1;
	            }
	        }
	        this.setState(this.state);
	    },
	    render: function() {
	        return (
	            React.createElement("div", {className: "topDate"}, 
	                React.createElement(Icon, {name: "left-nav", "data-ctrl": "prev", onClick: this.handleClick, onTouchStart: this.handleClick}), 
	                React.createElement("strong", null, " ", this.state.year, "年", (this.state.month<9?'0':'')+(this.state.month+1), "月 "), 
	                React.createElement(Icon, {name: "right-nav", "data-ctrl": "next", onClick: this.handleClick, onTouchStart: this.handleClick})
	            )
	        )
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/local/sdb/workspace/workspace_js/fit-car/components/TopDate.jsx"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/local/sdb/workspace/workspace_js/fit-car/components/TopDate.jsx"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var VERSION = 9;
	var DB_NAME='fit-car';

	/**
	 * 构造函数
	 * @constructor
	 */
	function IndexDB(){
	    this.TABLE_CONSUMPTION='consumption';
	}

	IndexDB.prototype.index_date=['date'];
	IndexDB.prototype.keyRange={
	    startWith:function(value){
	        return IDBKeyRange.lowerBound(value);
	    }
	};

	/**
	 * 打开数据库
	 * @param callback
	 */
	IndexDB.prototype.open=function(callback){
	    var instance=this;
	    var request = window.indexedDB.open(DB_NAME, VERSION);
	    request.onerror = function (e) {
	        console.log(e.currentTarget.error.message);
	    };
	    request.onsuccess = function (e) {
	        var db = e.target.result;
	        callback(db);
	    };
	    request.onupgradeneeded = function (e) {
	        var db = e.target.result;
	        var store;
	        //创建表
	        //消费记录表
	        if (!db.objectStoreNames.contains(instance.TABLE_CONSUMPTION)) {
	            store = db.createObjectStore(instance.TABLE_CONSUMPTION, {autoIncrement: true});
	        }else{
	            var transaction=e.target.transaction;
	            store=transaction.objectStore(instance.TABLE_CONSUMPTION);
	            //删除所有索引
	            var names=store.indexNames;
	            for(var i=0;i<names.length;i++){
	                store.deleteIndex(names[i]);
	            }
	        }
	        store.createIndex('index_date', instance.index_date, {unique: false});

	        console.log('DB version changed to ' + VERSION);
	    };
	};

	/**
	 * 插入数据
	 * @param storeName
	 * @param data
	 */
	IndexDB.prototype.add=function(storeName, data){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readwrite');
	        var store=transaction.objectStore(storeName);
	        //如果插入数据为数组，则为批量插入，否则直接插入
	        if(Object.prototype.toString.apply(data) === '[object Array]'){
	            data.forEach(function(o){
	                store.add(o);
	            });
	        }else{
	            store.add(data);
	        }
	        db.close();
	    });
	};

	/**
	 * 获取指定条件的数据列表
	 * @param storeName
	 * @param indexArr array 条件字段名
	 * @param keyRange IDBKeyRange 条件对象
	 * @param callback
	 */
	IndexDB.prototype.get=function(storeName, indexArr, keyRange, callback){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readonly');
	        var store=transaction.objectStore(storeName);
	        //指定索引，条件查询
	        var index = store.index("index_"+indexArr.join('_'));
	        //打开游标，进行遍历
	        var request=index.openCursor(keyRange);
	        var list=[];
	        request.onsuccess=function(e){
	            var cursor=e.target.result;
	            if(cursor){
	                var row=cursor.value;
	                list.push(row);
	                cursor.continue();
	            }else {
	                callback(list);
	                db.close();
	            }
	        };
	    });
	};


	module.exports=new IndexDB();

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/local/sdb/workspace/workspace_js/fit-car/src/IndexDB.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/local/sdb/workspace/workspace_js/fit-car/src/IndexDB.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(78);
	var UI = __webpack_require__(312),
	    Field=UI.Field,
	    Button=UI.Button,
	    NavBar=UI.NavBar,
	    Group=UI.Group,
	    Container=UI.Container;

	var utils = __webpack_require__(370);
	var TopDate = __webpack_require__(366);
	var ItemRows = __webpack_require__(371);
	var db = __webpack_require__(368);
	module.exports=React.createClass({displayName: "module.exports",
	    handleAddRecord:function(e){
	        e.preventDefault();
	        var data={
	            date:this.refs.date.getValue(),
	            type:this.refs.itemRows.getType(),
	            amount:this.refs.amount.getValue()
	        };
	        db.add(db.TABLE_CONSUMPTION, data);
	        location.hash='/index';
	    },
	    render:function(){
	        var navBarProps = {
	            title: '新增消费记录',
	            amStyle:'primary',
	            leftNav:[
	                {
	                    icon:'left-nav',
	                    href:'#/index'
	                }
	            ]
	        };
	        return (
	            React.createElement(Container, {fill: true, direction: "column"}, 
	                React.createElement(NavBar, React.__spread({},  navBarProps)), 
	                React.createElement(Field, {ref: "date", type: "date", labelBefore: "消费时间：", defaultValue: utils.dateFormat(new Date(), 'yyyy-MM-dd')}), 
	                React.createElement(ItemRows, {ref: "itemRows"}), 
	                React.createElement(Field, {ref: "amount", type: "number", labelBefore: "消费金额：", labelAfter: "元", min: "0", placeholder: "请输入消费金额"}), 
	                React.createElement(Group, null, 
	                    React.createElement(Button, {onClick: this.handleAddRecord, onTouchStart: this.handleAddRecord, amStyle: "primary", block: true}, "新增记录")
	                )
	            )
	        )
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/local/sdb/workspace/workspace_js/fit-car/components/EditPage.jsx"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/local/sdb/workspace/workspace_js/fit-car/components/EditPage.jsx"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports={
	    dateFormat:function(date, pattern){
	        function fix(t) {
	            if (t < 10)
	                t = '0' + t;
	            return t;
	        }
	        var x=date;
	        var y = x.getFullYear(),
	            M = fix(x.getMonth() + 1),
	            d = fix(x.getDate()),
	            H = fix(x.getHours()),
	            m = fix(x.getMinutes()),
	            s = fix(x.getSeconds());
	        return pattern.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', H).replace('mm', m).replace('ss', s);
	    }
	};

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/local/sdb/workspace/workspace_js/fit-car/components/utils.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/local/sdb/workspace/workspace_js/fit-car/components/utils.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(78);
	var UI = __webpack_require__(312),
	    Grid=UI.Grid,
	    Col=UI.Col,
	    Badge=UI.Badge,
	    Icon=UI.Icon,
	    Group=UI.Group;

	module.exports = React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	        return {
	            selected:'gas'
	        };
	    },
	    componentDidMount:function(){
	    },
	    handleClick:function(e){
	        e.preventDefault();
	        this.setState({selected:e.currentTarget.getAttribute('data-key')});
	    },
	    getType:function(){
	        return this.state.selected;
	    },
	    /**
	     * 获取每一项的HTML
	     * @param itemName
	     */
	    getItemHTML:function(itemName){
	        //var itemObj={
	        //    gas:{name:'加油', icon:'am-icon-tint'},
	        //    park:{name:'停车', icon:'am-icon-product-hunt'},
	        //    wash:{name:'洗车', icon:'am-icon-flask'},
	        //    maintain:{name:'保养', icon:'am-icon-car'},
	        //    fix:{name:'维修', icon:'am-icon-wrench'},
	        //    breach:{name:'违章', icon:'am-icon-times'},
	        //    road:{name:'过路', icon:'am-icon-road'},
	        //    others:{name:'其他', icon:'am-icon-ellipsis-h'}
	        //};
	        var itemObj={
	            gas:{name:'加油', icon:'star'},
	            park:{name:'停车', icon:'star'},
	            wash:{name:'洗车', icon:'star'},
	            maintain:{name:'保养', icon:'star'},
	            fix:{name:'维修', icon:'star'},
	            breach:{name:'违章', icon:'star'},
	            road:{name:'过路', icon:'star'},
	            others:{name:'其他', icon:'star'}
	        };
	        return (
	            React.createElement(Col, null, 
	                React.createElement(Badge, {onTouchStart: this.handleClick, onClick: this.handleClick, "data-key": itemName, amStyle: this.state.selected==itemName?'secondary':'default', rounded: true}, 
	                    React.createElement(Icon, {name: itemObj[itemName].icon})
	                ), 
	                React.createElement("small", null, itemObj[itemName].name)
	            )
	        )
	    },
	    render: function() {
	        return (
	            React.createElement(Group, {noPadded: true}, 
	                React.createElement(Grid, {avg: 4, className: "itemRows"}, 
	                    this.getItemHTML('gas'), 
	                    this.getItemHTML('park'), 
	                    this.getItemHTML('wash'), 
	                    this.getItemHTML('maintain'), 
	                    this.getItemHTML('fix'), 
	                    this.getItemHTML('breach'), 
	                    this.getItemHTML('road'), 
	                    this.getItemHTML('others')
	                )
	            )
	        );
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/local/sdb/workspace/workspace_js/fit-car/components/ItemRows.jsx"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/local/sdb/workspace/workspace_js/fit-car/components/ItemRows.jsx"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }

});