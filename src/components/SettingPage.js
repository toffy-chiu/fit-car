var React=require('react');
var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    Icon=UI.Icon,
    Group=UI.Group,
    List=UI.List,
    View=UI.View,
    Modal=UI.Modal,
    Field=UI.Field,
    Container=UI.Container;

var db = require('../lib/IndexDB');
var ct=require('../constants/CostType');

require('./css/SettingPage.css');

module.exports=React.createClass({
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
            <Container fill direction="column">
                <NavBar {...navBarProps} />
                <div className="views">
                    <View>
                        <Container fill scrollable>
                            <Group header="数据" noPadded className="margin-0">
                                <List>
                                    <List.Item media={<Icon name="download"/>} onClick={this.importData} title="导入" href="javascript:;"/>
                                    <List.Item media={<Icon name="share"/>} onClick={this.exportData} title="导出" href="javascript:;"/>
                                </List>
                                <Modal title="导入数据文件" role="confirm" onAction={this.handleAction} isOpen={this.state.showDialog}>
                                    <div className="btn btn-secondary btn-hollow margin-0 file-wrap text-truncate">
                                        {this.state.imports.file?this.state.imports.file.name:'请选择数据文件'}
                                        <Field type="file" className="file-field" onChange={this.handleImportFileChange}/>
                                    </div>
                                    <div className="importType">
                                        <label><input type="radio" name="type" value="1" checked={this.state.imports.type==1} onChange={this.handleImportTypeChange}/> 追加到原数据</label>
                                        <label><input type="radio" name="type" value="2" checked={this.state.imports.type==2} onChange={this.handleImportTypeChange}/> 覆盖原数据</label>
                                    </div>
                                </Modal>
                            </Group>
                        </Container>
                    </View>
                </div>
            </Container>
        )
    }
});