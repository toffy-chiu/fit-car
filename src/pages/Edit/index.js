var NavBar=require('../../components/NavBar');
var Modal=require('amazeui-touch/lib/Modal');
var Loader=require('../../components/Loader');

var ItemRows = require('./ItemRows');
var dateFormat = require('tf-utils/lib/dateFormat');
var db = require('../../lib/IndexDB');
module.exports=React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            isNew:true, //当前页面是否新增状态
            showConfirm:false,
            id:0
        }
    },
    componentDidMount:function(){
        var id=this.props.params.id;
        //通过ID来判断是增加还是编辑
        if(id) {
            this.setState({isNew:false});
            //加载编辑信息
            db.get(db.TABLE_CONSUMPTION, id, function (info) {
                info.loading=false;
                info.id = id;
                this.setState(info);
            }.bind(this));
        }else{
            //设置默认值
            this.setState({
                loading:false,
                type:'gas',
                date:dateFormat(new Date(), 'yyyy-MM-dd'),
                amount:''
            });
        }
    },
    getData:function(){
        return {
            date:this.refs.date.value,
            type:this.refs.itemRows.getValue(),
            amount:this.refs.amount.value
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
        this.setState({showConfirm:true});
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
        this.setState({showConfirm:false});
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            return (
                <div className="container container-fill container-column">
                    <NavBar title="新增消费记录" leftNav={{href:!this.state.isNew?'/detail/'+this.state.date.slice(0, 7):null}} />
                    <div className="views">
                        <div className="view">
                            <div className="container container-fill container-scrollable">
                                <div className="field-group">
                                    <span className="field-group-label">消费时间：</span>
                                    <input ref="date" type="date" value={this.state.date} onChange={this.handleFieldChange} className="field"/>
                                </div>
                                <ItemRows ref="itemRows" value={this.state.type} onChange={this.handleFieldChange}/>
                                <div className="field-group">
                                    <span className="field-group-label">消费金额：</span>
                                    <input ref="amount" type="number" min="0" value={this.state.amount} onChange={this.handleFieldChange} placeholder="请输入消费金额" className="field"/>
                                    <span className="field-group-label">元</span>
                                </div>
                                {
                                    this.state.isNew ? (
                                        <div className="margin-0 group">
                                            <div className="group-body">
                                                <button type="submit" onClick={this.handleAddRecord} className="btn btn-primary btn-block">新增记录</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="margin-0 text-center group">
                                            <div className="group-body">
                                                <button onClick={this.handleDelRecord} className="btn btn-alert">删除记录</button>
                                                <button onClick={this.handleSaveRecord} className="btn btn-secondary">保存修改</button>
                                            </div>
                                        </div>
                                    )
                                }
                                <Modal title="确定删除吗？" role="confirm" isOpen={this.state.showConfirm} onAction={this.handleAction}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
});