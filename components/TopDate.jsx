var React=require('react');

module.exports=React.createClass({
    getInitialState:function(){
        var now=new Date();
        return {
            year:now.getFullYear(),
            month:now.getMonth()
        };
    },
    handleClick:function(e){
        var className=e.currentTarget.className;
        if(className=='prev'){
            if(this.state.month<1){
                this.state.year-=1;
                this.state.month=11;
            }else{
                this.state.month-=1;
            }
        }else if(className=='next'){
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
                <a href="javascript:;" className="prev" onClick={this.handleClick}><span className="icon icon-left-nav"></span></a>
                <strong> {this.state.year}年{(this.state.month<9?'0':'')+(this.state.month+1)}月 </strong>
                <a href="javascript:;" className="next" onClick={this.handleClick}><span className="icon icon-right-nav"></span></a>
            </div>
        )
    }
});