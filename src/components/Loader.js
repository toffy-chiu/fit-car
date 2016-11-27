var Loader=React.createClass({
    render: function() {
        return (
            <div className="loading">
                <div className="loader loader-primary loader-rounded">
                    <div className="loader-bounce1"></div>
                    <div className="loader-bounce2"></div>
                    <div className="loader-bounce3"></div>
                </div>
            </div>
        )
    }
});

module.exports=Loader;