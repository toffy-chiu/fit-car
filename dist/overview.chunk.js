webpackJsonp([4],{

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports={
	    gas:{name:'加油', icon:'info'},
	    park:{name:'停车', icon:'info'},
	    wash:{name:'洗车', icon:'info'},
	    maintain:{name:'保养', icon:'info'},
	    fix:{name:'维修', icon:'info'},
	    breach:{name:'违章', icon:'info'},
	    road:{name:'过路', icon:'info'},
	    others:{name:'其他', icon:'info'}
	};

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/constants/CostType.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/constants/CostType.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var utils=__webpack_require__(295);
	var VERSION = 9;
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
	    //特定某个月的
	    atMonth:function(value){
	        //按月份最大天数进行对比
	        return IDBKeyRange.bound([value[0]+'-01'], [value[0]+'-31']);
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
	 * 保存
	 * @param storeName
	 * @param id 主键字段
	 * @param data 保存的对象
	 */
	IndexDB.prototype.save=function(storeName, id, data){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readwrite');
	        var store=transaction.objectStore(storeName);
	        var request=store.get(+id);
	        request.onsuccess=function(e){
	            var row=e.target.result;
	            utils.objectAssign(row, data);
	            store.put(row, +id);
	        };
	    });
	};

	/**
	 * 保存
	 * @param storeName
	 * @param id 主键字段
	 */
	IndexDB.prototype.del=function(storeName, id){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readwrite');
	        var store=transaction.objectStore(storeName);
	        store.delete(+id);
	    });
	};

	/**
	 * 获取指定条件的数据列表
	 * @param storeName
	 * @param id 主键字段
	 * @param callback
	 */
	IndexDB.prototype.get=function(storeName, id, callback){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readonly');
	        var store=transaction.objectStore(storeName);
	        var request=store.get(+id);
	        request.onsuccess=function(e){
	            var row=e.target.result;
	            callback(row);
	        };
	    });
	};

	/**
	 * 获取指定条件的数据列表
	 * @param storeName
	 * @param indexArr array 条件字段名
	 * @param keyRange IDBKeyRange 条件对象
	 * @param callback
	 */
	IndexDB.prototype.getList=function(storeName, callback, indexArr, keyRange){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readonly');
	        var store=transaction.objectStore(storeName);
	        var request;
	        //不传条件则查询全部
	        if(indexArr&&keyRange) {
	            //指定索引，条件查询
	            var index = store.index("index_" + indexArr.join('_'));
	            //打开游标，进行遍历
	            request = index.openCursor(keyRange);
	        }else{
	            request=store.openCursor();
	        }
	        var list=[];
	        request.onsuccess=function(e){
	            var cursor=e.target.result;
	            if(cursor){
	                var row=cursor.value;
	                //set primary key
	                row.id=cursor.primaryKey;
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

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/lib/IndexDB.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/lib/IndexDB.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports={
	    /**
	     * 日期格式化
	     * @param date
	     * @param pattern
	     * @returns {*}
	     */
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
	    },
	    /**
	     * 对象合并，这里只是简单地把对象2合并到对象1中去，并且只遍历一层
	     * @param obj1
	     * @param obj2
	     * @returns {*}
	     */
	    objectAssign:function(obj1, obj2){
	        for(var k in obj2){
	            obj1[k]=obj2[k];
	        }
	        return obj1;
	    }
	};

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/lib/utils.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/lib/utils.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(3);
	var UI = __webpack_require__(237),
	    NavBar=UI.NavBar,
	    Icon=UI.Icon,
	    Group=UI.Group,
	    List=UI.List,
	    Container=UI.Container;

	var db = __webpack_require__(294);
	var ct=__webpack_require__(293);

	module.exports=React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	        return {
	            list: []
	        }
	    },
	    componentDidMount:function(){
	        //读取数据库
	        db.getList(db.TABLE_CONSUMPTION, function(list){
	            //倒序排序
	            list.sort(function(a, b){
	                return new Date(b.date).getTime()-new Date(a.date).getTime();
	            });
	            this.setState({list:list});
	        }.bind(this));
	    },
	    //条目数据预处理
	    getItem:function(item){
	        var date=new Date(item.date.replace(/-/g, '/'));
	        var weekNames=['日','一','二','三','四','五','六'];
	        return {
	            id:item.id,
	            day:date.getDate(),
	            week:'周'+weekNames[date.getDay()],
	            icon:ct[item.type].icon,
	            name:ct[item.type].name,
	            amount:item.amount
	        };
	    },
	    render:function(){
	        var navBarProps = {
	            title: '花销总览',
	            amStyle:'primary',
	            leftNav:[
	                {
	                    icon:'left-nav',
	                    href:'#/index'
	                }
	            ]
	        };
	        //数据预处理，同月份的合并
	        var list=[];
	        if(this.state.list.length){
	            var header='', month, types;
	            this.state.list.forEach(function(o, i){
	                //插入标题头
	                month=o.date.slice(0, 7);
	                if(header!=month){
	                    header=month;

	                    //插入第一个到倒数第二个月的项
	                    for(var t in types){
	                        types[t].amount+=' 元';
	                        list.push(types[t]);
	                    }

	                    list.push({
	                        title:header
	                    });

	                    //合并类型，初始化
	                    types={};
	                }

	                if(!types[o.type]){
	                    types[o.type]={
	                        name:ct[o.type].name,
	                        icon:ct[o.type].icon,
	                        amount:0
	                    }
	                }
	                types[o.type].amount+=+o.amount;

	                //插入最后一项
	                if(i==this.state.list.length-1){
	                    for(var t in types){
	                        types[t].amount+=' 元';
	                        list.push(types[t]);
	                    }
	                }
	            }.bind(this));
	        }
	        return (
	            React.createElement(Container, null, 
	                React.createElement(NavBar, React.__spread({},  navBarProps)), 
	                React.createElement("div", {className: "item item-header"}, this.props.params.date), 
	                React.createElement(Group, {noPadded: true, className: "margin-0"}, 
	                    
	                        list.length?(
	                            React.createElement(List, null, 
	                                
	                                    list.map(function(o, i){
	                                        return o.title
	                                            ?React.createElement(List.Item, {key: i, role: "header"}, o.title)
	                                            :React.createElement(List.Item, {key: i, title: React.createElement("span", null, React.createElement(Icon, {name: o.icon}), " ", o.name), after: o.amount})
	                                    })
	                                
	                            )
	                        ):(
	                            React.createElement("h3", {className: "text-center padding-v-lg"}, React.createElement(Icon, {name: "info"}), "没有数据！")
	                        )
	                    
	                )
	            )
	        )
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/components/OverviewPage.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/components/OverviewPage.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }

});