var objectAssign=require('tf-utils/lib/objectAssign');
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
            objectAssign(row, data);
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