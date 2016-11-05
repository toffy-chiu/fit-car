var UI = require('amazeui-touch'),
    NavBar=UI.NavBar,
    Container=UI.Container;

var DateInput = require('./DateInput');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            date:'2016-12-02',
            tableValue:{}
        };
    },
    componentDidMount:function(){
        setTimeout(function(){
            this.setState({date:'2016-05-06'});
        }.bind(this), 5000);
    },
    handleClick:function(){
        console.log(this.refs.name);
    },
    render:function(){
        var navBarProps = {
            title: '车消费记录',
            amStyle:'primary'
        };
        return (
            <Container fill direction="column">
                <div className="views">
                    <NavBar {...navBarProps} />
                    <DateInput value={this.state.date}/>
                    <input type="text" defaultValue="hello" ref="name"/>
                    <button type="button" onClick={this.handleClick}>test</button>
                </div>
            </Container>
        )
    }
});