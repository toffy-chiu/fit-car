webpackJsonp([5],{

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
	 * @param id 主键字段,不传则为删除全部
	 */
	IndexDB.prototype.del=function(storeName, id){
	    this.open(function(db){
	        var transaction=db.transaction(storeName, 'readwrite');
	        var store=transaction.objectStore(storeName);
	        if(id) {
	            store.delete(+id);
	        }else{
	            store.clear();
	        }
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

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var React=__webpack_require__(3);
	var UI = __webpack_require__(237),
	    NavBar=UI.NavBar,
	    Icon=UI.Icon,
	    Group=UI.Group,
	    List=UI.List,
	    View=UI.View,
	    Modal=UI.Modal,
	    Field=UI.Field,
	    Container=UI.Container;

	var db = __webpack_require__(294);
	var ct=__webpack_require__(293);

	__webpack_require__(301);

	module.exports=React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	        return {
	            showDialog:false,
	            imports:{
	                file:null,
	                type:1
	            }
	        }
	    },
	    importData:function(){
	        this.setState({showDialog:true});
	    },
	    /**
	     * 导出数据文件
	     */
	    exportData:function(){
	        function downloadFile(fileName, content){
	            var aLink = document.createElement('a');
	            var blob = new Blob([content]);
	            var evt = document.createEvent("HTMLEvents");
	            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
	            aLink.download = fileName;
	            aLink.href = URL.createObjectURL(blob);
	            aLink.dispatchEvent(evt);
	        }
	        //读取数据库
	        db.getList(db.TABLE_CONSUMPTION, function(list){
	            downloadFile('fit.json', JSON.stringify(list));
	        });
	    },
	    handleImportFileChange:function(e){
	        this.state.imports.file=e.target.files[0];
	        this.setState({
	            imports:this.state.imports
	        });
	    },
	    /**
	     * 更新导入类型
	     * @param e
	     */
	    handleImportTypeChange:function(e){
	        this.state.imports.type=e.target.value;
	        this.setState({
	            imports:this.state.imports
	        });
	    },
	    /**
	     * 确认导入
	     * @param isOK
	     */
	    handleAction:function(isOK){
	        if(isOK){
	            if(this.state.imports.file) {
	                var that = this;
	                //导入
	                var reader = new FileReader();
	                reader.onload = function () {
	                    var dataList = JSON.parse(this.result);
	                    if (that.state.imports.type == 2) {
	                        db.del(db.TABLE_CONSUMPTION);
	                    }
	                    dataList.forEach(function (data) {
	                        delete data.id;
	                        db.add(db.TABLE_CONSUMPTION, data);
	                    });
	                    that.state.imports.file = null;
	                    that.state.showDialog = false;
	                    that.setState(that.state);
	                };
	                reader.readAsText(this.state.imports.file);
	            }
	        }else{
	            this.setState({showDialog:false});
	        }
	    },
	    render:function(){
	        var navBarProps = {
	            title: '设置',
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
	                React.createElement("div", {className: "views"}, 
	                    React.createElement(View, null, 
	                        React.createElement(Container, {fill: true, scrollable: true}, 
	                            React.createElement(Group, {header: "数据", noPadded: true, className: "margin-0"}, 
	                                React.createElement(List, null, 
	                                    React.createElement(List.Item, {media: React.createElement(Icon, {name: "download"}), onClick: this.importData, title: "导入", href: "javascript:;"}), 
	                                    React.createElement(List.Item, {media: React.createElement(Icon, {name: "share"}), onClick: this.exportData, title: "导出", href: "javascript:;"})
	                                ), 
	                                React.createElement(Modal, {title: "导入数据文件", role: "confirm", onAction: this.handleAction, isOpen: this.state.showDialog}, 
	                                    React.createElement("div", {className: "btn btn-secondary btn-hollow margin-0 file-wrap text-truncate"}, 
	                                        this.state.imports.file?this.state.imports.file.name:'请选择数据文件', 
	                                        React.createElement(Field, {type: "file", className: "file-field", onChange: this.handleImportFileChange})
	                                    ), 
	                                    React.createElement("div", {className: "importType"}, 
	                                        React.createElement("label", null, React.createElement("input", {type: "radio", name: "type", value: "1", checked: this.state.imports.type==1, onChange: this.handleImportTypeChange}), " 追加到原数据"), 
	                                        React.createElement("label", null, React.createElement("input", {type: "radio", name: "type", value: "2", checked: this.state.imports.type==2, onChange: this.handleImportTypeChange}), " 覆盖原数据")
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	            )
	        )
	    }
	});

	 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } if (typeof module.exports === 'function') { __REACT_HOT_LOADER__.register(module.exports, 'module.exports', "/home/toffy/web/fit-car/src/components/SettingPage.js"); return; } for (var key in module.exports) { if (!Object.prototype.hasOwnProperty.call(module.exports, key)) { continue; } var namedExport = void 0; try { namedExport = module.exports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/home/toffy/web/fit-car/src/components/SettingPage.js"); } } })();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 301:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(302);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(304)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(302, function() {
				var newContent = __webpack_require__(302);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(303)();
	// imports


	// module
	exports.push([module.id, ".file-wrap{\n    position: relative;\n    max-width:100%;\n    min-width: 150px;\n}\n.file-wrap:hover{\n    background-color: #fff;\n}\n.file-field{\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0;\n    top: 0;\n    opacity: 0;\n}\n.importType>label{\n    text-align: left;\n    margin: 10px 0 10px 50px;\n}", ""]);

	// exports


/***/ },

/***/ 303:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 304:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }

});