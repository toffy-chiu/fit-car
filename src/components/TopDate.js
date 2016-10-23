var React=require('react');
var UI = require('amazeui-touch'),
    Icon=UI.Icon;

module.exports=React.createClass({
    getInitialState:function(){
        //默认日期
        var now=new Date();
        return {
            year:now.getFullYear(),
            month:now.getMonth()
        };
    },
    //触发更新
    triggerUpdate:function(){
        this.props.onDateChange(this.state.year+'-'+(this.state.month<9?'0':'')+(this.state.month+1));
    },
    componentDidMount:function(){
        this.triggerUpdate();
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
        this.triggerUpdate();
    },
    render: function() {
        return (
            <div className="topDate">
                <Icon name="left-nav" data-ctrl="prev" onClick={this.handleClick} onTouchStart={this.handleClick}/>
                <span> {this.state.year}年{(this.state.month<9?'0':'')+(this.state.month+1)}月 </span>
                <Icon name="right-nav" data-ctrl="next" onClick={this.handleClick} onTouchStart={this.handleClick}/>
            </div>
        )
    }
});