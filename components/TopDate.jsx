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
            <div className="topDate">
                <Icon name="left-nav" data-ctrl="prev" onClick={this.handleClick} onTouchStart={this.handleClick}/>
                <strong> {this.state.year}年{(this.state.month<9?'0':'')+(this.state.month+1)}月 </strong>
                <Icon name="right-nav" data-ctrl="next" onClick={this.handleClick} onTouchStart={this.handleClick}/>
            </div>
        )
    }
});