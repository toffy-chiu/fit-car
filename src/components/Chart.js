// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/title');
var itemObj=require('../constants/CostType');

module.exports = React.createClass({
    propTypes:{
        data:React.PropTypes.object
    },
    componentWillReceiveProps:function(nextProps){
        if(nextProps.data!=this.props.data){
            //数据预处理
            var ds=[];
            var total=0;
            var data=nextProps.data;
            for(var type in data){
                if(data[type]){
                    total+=data[type];
                    ds.push({
                        name:itemObj[type].name,
                        value:data[type],
                        itemStyle:{
                            normal:{
                                color:itemObj[type].color
                            }
                        }
                    });
                }
            }

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(this.refs.main);
            // 绘制图表
            myChart.setOption({
                title:{
                    text:'本月共计消费',
                    textAlign:'center',
                    textStyle:{
                        fontSize:12
                    },
                    left:'48%',
                    top:'middle',
                    itemGap:5,
                    subtext:'￥'+total,
                    subtextStyle:{
                        color:'#111'
                    }
                },
                series: [
                    {
                        type:'pie',
                        radius: ['43%', '80%'],
                        avoidLabelOverlap: false,
                        label:{
                            normal:{
                                show:false
                            }
                        },
                        data:ds
                    }]
            });
        }
    },
    render: function() {
        return (
            <div ref="main" style={{width:320,height:180,margin:'0 auto'}}></div>
        );
    }
});