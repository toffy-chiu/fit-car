var Icon=require('./Icon');

var TopDate=React.createClass({
    propTypes:{
        value:React.PropTypes.string,
        onChange:React.PropTypes.func
    },
    statics:{
        /**
         * 处理小于10的补上0
         * @param num
         * @returns {*}
         */
        fixDecade:function(num){
            if(num<10){
                num='0'+num;
            }
            return num;
        }
    },
    /**
     * 前后点击选择
     * @param n
     * @param e
     */
    handleClick:function(n, e){
        e.preventDefault();
        var date=this.props.value.split('-');
        var year=+date[0];
        var month=+date[1]; //注意此month范围：1~12
        if(n==-1){
            if(month<=1){
                year-=1;
                month=12;
            }else{
                month-=1;
            }
        }else if(n==1){
            if(month>=12){
                year+=1;
                month=1;
            }else{
                month+=1;
            }
        }
        this.props.onChange(year+'-'+TopDate.fixDecade(month));
    },
    render: function() {
        return (
            <div className="topDate">
                <Icon name="left" size="16" style={{marginBottom:-3}}
                      onClick={this.handleClick.bind(this, -1)}
                      onTouchStart={this.handleClick.bind(this, -1)}/>
                <span> {this.props.value.replace('-', '年')}月 </span>
                <Icon name="right" size="16" style={{marginBottom:-3}}
                      onClick={this.handleClick.bind(this, 1)}
                      onTouchStart={this.handleClick.bind(this, 1)}/>
            </div>
        )
    }
});

module.exports = TopDate;