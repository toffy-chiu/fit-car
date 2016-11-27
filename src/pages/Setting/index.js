var NavBar=require('../../components/NavBar');
var Icon=require('../../components/Icon');
var Modal=require('amazeui-touch/lib/Modal');
var Notification=require('amazeui-touch/lib/Notification');

var db = require('../../lib/IndexDB');

require('./index.css');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            showDialog:false,
            noticeVisible:false,
            imports:{
                file:null,
                type:1
            }
        }
    },
    /**
     * 导入数据文件
     */
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
    /**
     * 更新导入文件
     * @param e
     */
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
                    that.state.noticeVisible=true;
                    that.setState(that.state);
                };
                reader.readAsText(this.state.imports.file);
            }
        }else{
            this.setState({showDialog:false});
        }
    },
    closeNotification:function(){
        this.setState({noticeVisible:false});
    },
    render:function(){
        return (
            <div className="container container-fill container-column">
                <Notification amStyle="secondary" visible={this.state.noticeVisible} animated onDismiss={this.closeNotification}>导入完毕！</Notification>
                <NavBar title="设置" leftNav={{}} />
                <div className="views">
                    <div className="view">
                        <div className="container container-fill container-scrollable">
                            <div className="margin-0 group group-no-padded">
                                <header className="group-header">数据</header>
                                <div className="group-body">
                                    <ul className="list">
                                        <li className="item item-linked">
                                            <a href="javascript:;" onClick={this.importData}>
                                                <div className="item-media">
                                                    <Icon name="import" style={{marginBottom:-7}}/>
                                                </div>
                                                <div className="item-main">
                                                    <h3 className="item-title">导入</h3>
                                                    <Icon name="right" color="#ccc" size="16"/>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="item item-linked">
                                            <a href="javascript:;" onClick={this.exportData}>
                                                <div className="item-media">
                                                    <Icon name="export" style={{marginBottom:-7}}/>
                                                </div>
                                                <div className="item-main">
                                                    <h3 className="item-title">导出</h3>
                                                    <Icon name="right" color="#ccc" size="16"/>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                    <Modal title="导入数据文件" role="confirm" onAction={this.handleAction} isOpen={this.state.showDialog}>
                                        <div className="btn btn-secondary btn-hollow margin-0 file-wrap text-truncate">
                                            {this.state.imports.file?this.state.imports.file.name:'请选择数据文件'}
                                            <input type="file" className="file-field" onChange={this.handleImportFileChange}/>
                                        </div>
                                        <div className="importType">
                                            <label><input type="radio" name="type" value="1" checked={this.state.imports.type==1} onChange={this.handleImportTypeChange}/> 追加到原数据</label>
                                            <label><input type="radio" name="type" value="2" checked={this.state.imports.type==2} onChange={this.handleImportTypeChange}/> 覆盖原数据</label>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});