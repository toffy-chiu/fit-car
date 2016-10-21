webpackJsonp([2],{

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

/***/ 296:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(3);
	var UI = __webpack_require__(237),
	    Field=UI.Field,
	    Button=UI.Button,
	    NavBar=UI.NavBar,
	    Group=UI.Group,
	    Modal=UI.Modal,
	    Container=UI.Container;

	var utils = __webpack_require__(295);
	var ItemRows = __webpack_require__(297);
	var db = __webpack_require__(294);
	module.exports=React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	        return {
	            isNew:true, //当前页面是否新增状态
	            showModal:false,
	            id:0,
	            type:null,
	            date:utils.dateFormat(new Date(), 'yyyy-MM-dd'),
	            amount:''
	        }
	    },
	    componentDidMount:function(){
	        var id=this.props.params.id;
	        //如果是修改信息则赋值
	        if(id) {
	            this.setState({isNew:false});
	            //加载编辑信息
	            db.get(db.TABLE_CONSUMPTION, id, function (info) {
	                info.id = id;
	                this.setState(info);
	            }.bind(this));
	        }
	    },
	    getData:function(){
	        return {
	            date:this.refs.date.getValue(),
	            type:this.refs.itemRows.getValue(),
	            amount:this.refs.amount.getValue()
	        };
	    },
	    /**
	     * 输入组件值变化时
	     */
	    handleFieldChange:function(){
	        //设置各组件的值
	        this.setState(this.getData());
	    },
	    handleAddRecord:function(e){
	        e.preventDefault();
	        var data=this.getData();
	        if(data.amount>0) {
	            db.add(db.TABLE_CONSUMPTION, data);
	            location.hash = '/index';
	        }else{
	            alert('消费金额无效');
	        }
	    },
	    handleSaveRecord:function(e){
	        e.preventDefault();
	        var data=this.getData();
	        if(data.amount>0) {
	            db.save(db.TABLE_CONSUMPTION, this.state.id, data);
	            location.hash = '/detail/'+data.date.slice(0, 7);
	        }else{
	            alert('消费金额无效');
	        }
	    },
	    handleDelRecord:function(){
	        this.setState({showModal:true});
	    },
	    /**
	     * 删除确认
	     * @param isOK
	     */
	    handleAction:function(isOK){
	        if(isOK){
	            //删除该记录
	            db.del(db.TABLE_CONSUMPTION, this.state.id);
	            location.hash = '/index';
	        }
	        this.setState({showModal:false});
	    },
	    render:function(){
	        var navBarProps = {
	            title: '新增消费记录',
	            amStyle:'primary',
	            leftNav:[
	                {
	                    icon:'left-nav',
	                    href:'javascript:history.back()'
	                }
	            ]
	        };
	        return (
	            React.createElement(Container, {fill: true, direction: "column"}, 
	                React.createElement(NavBar, React.__spread({},  navBarProps)), 
	                React.createElement(Field, {ref: "date", type: "date", value: this.state.date, onChange: this.handleFieldChange, labelBefore: "消费时间："}), 
	                React.createElement(ItemRows, {ref: "itemRows", value: this.state.type, onChange: this.handleFieldChange}), 
	                React.createElement(Field, {ref: "amount", type: "number", value: this.state.amount, onChange: this.handleFieldChange, labelBefore: "消费金额：", labelAfter: "元", min: "0", placeholder: "请输入消费金额"}), 
	                
	                    this.state.isNew?(
	                        React.createElement(Group, {className: "margin-0"}, 
	                            React.createElement(Button, {onClick: this.handleAddRecord, amStyle: "primary", block: true}, "新增记录")
	                        )
	                    ):(
	                        React.createElement(Group, {className: "margin-0 text-center"}, 
	                            React.createElement(Button, {onClick: this.handleDelRecord, amStyle: "alert"}, "删除记录"), 
	                            React.createElement(Button, {onClick: this.handleSaveRecord, amStyle: "secondary"}, "保存修改")
	                        )
	                    ), 
	                
	                React.createElement(Modal, {title: "确定删除吗？", role: "confirm", isOpen: this.state.showModal, onAction: this.handleAction})
	            )
	        )
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/components/EditPage.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/components/EditPage.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(3);
	var UI = __webpack_require__(237),
	    Grid=UI.Grid,
	    Col=UI.Col,
	    Badge=UI.Badge,
	    Icon=UI.Icon,
	    Group=UI.Group;

	module.exports = React.createClass({displayName: "module.exports",
	    _value:null,    //自定义属性
	    propTypes:{
	        value:React.PropTypes.oneOf(['gas', 'park', 'wash', 'maintain', 'fix', 'breach', 'road', 'others'])
	    },
	    handleClick:function(e){
	        e.preventDefault();
	        this._value=e.currentTarget.getAttribute('data-key');
	        this.props.onChange(e);
	    },
	    getValue:function(){
	        return this._value;
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
	                React.createElement(Badge, {style: {width:'2.5rem',height:'2.5rem',lineHeight:2.9}, onTouchStart: this.handleClick, onClick: this.handleClick, "data-key": itemName, amStyle: this.props.value==itemName?'secondary':'default', rounded: true}, 
	                    React.createElement(Icon, {name: itemObj[itemName].icon})
	                ), 
	                React.createElement("div", null, itemObj[itemName].name)
	            )
	        )
	    },
	    render: function() {
	        this._value=this.props.value;
	        return (
	            React.createElement(Group, {noPadded: true, className: "margin-0 text-center"}, 
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

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/components/ItemRows.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/components/ItemRows.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }

});