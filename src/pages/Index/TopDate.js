var React=require('react');
var Icon=require('../../components/Icon');

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
    handleClick:function(n, e){
        e.preventDefault();
        var ctrl=e.currentTarget.getAttribute('data-ctrl');
        if(n==-1){
            if(this.state.month<1){
                this.state.year-=1;
                this.state.month=11;
            }else{
                this.state.month-=1;
            }
        }else if(n==1){
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
                <Icon name="left" size="16" style={{marginBottom:-3}}
                      onClick={this.handleClick.bind(this, -1)}
                      onTouchStart={this.handleClick.bind(this, -1)}/>
                <span> {this.state.year}年{(this.state.month<9?'0':'')+(this.state.month+1)}月 </span>
                <Icon name="right" size="16" style={{marginBottom:-3}}
                      onClick={this.handleClick.bind(this, 1)}
                      onTouchStart={this.handleClick.bind(this, 1)}/>
            </div>
        )
    }
});