webpackJsonp([3],{15:function(e,t,n){e.exports={dateFormat:function(e,t){function n(e){return e<10&&(e="0"+e),e}var a=e,o=a.getFullYear(),r=n(a.getMonth()+1),i=n(a.getDate()),s=n(a.getHours()),c=n(a.getMinutes()),l=n(a.getSeconds());return t.replace("yyyy",o).replace("MM",r).replace("dd",i).replace("HH",s).replace("mm",c).replace("ss",l)},objectAssign:function(e,t){for(var n in t)e[n]=t[n];return e}}},21:function(e,t,n){function a(){this.TABLE_CONSUMPTION="consumption"}var o=n(15),r=9,i="fit-car";a.prototype.index_date=["date"],a.prototype.keyRange={atMonth:function(e){return IDBKeyRange.bound([e[0]+"-01"],[e[0]+"-31"])}},a.prototype.open=function(e){var t=this,n=window.indexedDB.open(i,r);n.onerror=function(e){console.log(e.currentTarget.error.message)},n.onsuccess=function(t){var n=t.target.result;e(n)},n.onupgradeneeded=function(e){var n,a=e.target.result;if(a.objectStoreNames.contains(t.TABLE_CONSUMPTION)){var o=e.target.transaction;n=o.objectStore(t.TABLE_CONSUMPTION);for(var i=n.indexNames,s=0;s<i.length;s++)n.deleteIndex(i[s])}else n=a.createObjectStore(t.TABLE_CONSUMPTION,{autoIncrement:!0});n.createIndex("index_date",t.index_date,{unique:!1}),console.log("DB version changed to "+r)}},a.prototype.add=function(e,t){this.open(function(n){var a=n.transaction(e,"readwrite"),o=a.objectStore(e);"[object Array]"===Object.prototype.toString.apply(t)?t.forEach(function(e){o.add(e)}):o.add(t),n.close()})},a.prototype.save=function(e,t,n){this.open(function(a){var r=a.transaction(e,"readwrite"),i=r.objectStore(e),s=i.get(+t);s.onsuccess=function(e){var a=e.target.result;o.objectAssign(a,n),i.put(a,+t)}})},a.prototype.del=function(e,t){this.open(function(n){var a=n.transaction(e,"readwrite"),o=a.objectStore(e);t?o["delete"](+t):o.clear()})},a.prototype.get=function(e,t,n){this.open(function(a){var o=a.transaction(e,"readonly"),r=o.objectStore(e),i=r.get(+t);i.onsuccess=function(e){var t=e.target.result;n(t)}})},a.prototype.getList=function(e,t,n,a){this.open(function(o){var r,i=o.transaction(e,"readonly"),s=i.objectStore(e);if(n&&a){var c=s.index("index_"+n.join("_"));r=c.openCursor(a)}else r=s.openCursor();var l=[];r.onsuccess=function(e){var n=e.target.result;if(n){var a=n.value;a.id=n.primaryKey,l.push(a),n["continue"]()}else t(l),o.close()}})},e.exports=new a},28:function(e,t,n){e.exports={gas:{name:"加油",icon:"info",color:"#B0D865"},park:{name:"停车",icon:"info",color:"#4384EB"},wash:{name:"洗车",icon:"info",color:"#3DB9EF"},maintain:{name:"保养",icon:"info",color:"#4DC23D"},fix:{name:"维修",icon:"info",color:"#F7731B"},breach:{name:"违章",icon:"info",color:"#FF6565"},road:{name:"过路",icon:"info",color:"#22BB9F"},others:{name:"其他",icon:"info",color:"#868BE8"}}},177:function(e,t,n){var a=n(1),o=n(20),r=o.Field,i=o.Button,s=o.NavBar,c=o.Group,l=o.Modal,d=o.View,u=o.Loader,h=o.Container,m=n(15),p=n(179),f=n(21);e.exports=a.createClass({displayName:"module.exports",getInitialState:function(){return{loading:!0,isNew:!0,showConfirm:!1,id:0}},componentDidMount:function(){var e=this.props.params.id;e?(this.setState({isNew:!1}),f.get(f.TABLE_CONSUMPTION,e,function(t){t.loading=!1,t.id=e,this.setState(t)}.bind(this))):this.setState({loading:!1,type:"gas",date:m.dateFormat(new Date,"yyyy-MM-dd"),amount:""})},getData:function(){return{date:this.refs.date.getValue(),type:this.refs.itemRows.getValue(),amount:this.refs.amount.getValue()}},handleFieldChange:function(){this.setState(this.getData())},handleAddRecord:function(e){e.preventDefault();var t=this.getData();t.amount>0?(f.add(f.TABLE_CONSUMPTION,t),location.hash="/index"):alert("消费金额无效")},handleSaveRecord:function(e){e.preventDefault();var t=this.getData();t.amount>0?(f.save(f.TABLE_CONSUMPTION,this.state.id,t),location.hash="/detail/"+t.date.slice(0,7)):alert("消费金额无效")},handleDelRecord:function(){this.setState({showConfirm:!0})},handleAction:function(e){e&&(f.del(f.TABLE_CONSUMPTION,this.state.id),location.hash="/index"),this.setState({showConfirm:!1})},render:function(){if(this.state.loading)return a.createElement("div",{className:"loading"},a.createElement(u,{rounded:!0,amStyle:"primary"}));var e={title:"新增消费记录",amStyle:"primary",leftNav:[{icon:"left-nav",href:"javascript:history.back()"}]};return a.createElement(h,{fill:!0,direction:"column",transition:"sfl"},a.createElement(s,a.__spread({},e)),a.createElement("div",{className:"views"},a.createElement(d,null,a.createElement(h,{fill:!0,scrollable:!0},a.createElement(r,{ref:"date",type:"date",value:this.state.date,onChange:this.handleFieldChange,labelBefore:"消费时间："}),a.createElement(p,{ref:"itemRows",value:this.state.type,onChange:this.handleFieldChange}),a.createElement(r,{ref:"amount",type:"number",value:this.state.amount,onChange:this.handleFieldChange,labelBefore:"消费金额：",labelAfter:"元",min:"0",placeholder:"请输入消费金额"}),this.state.isNew?a.createElement(c,{className:"margin-0"},a.createElement(i,{type:"submit",onClick:this.handleAddRecord,amStyle:"primary",block:!0},"新增记录")):a.createElement(c,{className:"margin-0 text-center"},a.createElement(i,{onClick:this.handleDelRecord,amStyle:"alert"},"删除记录"),a.createElement(i,{onClick:this.handleSaveRecord,amStyle:"secondary"},"保存修改")),a.createElement(l,{title:"确定删除吗？",role:"confirm",isOpen:this.state.showConfirm,onAction:this.handleAction})))))}})},179:function(e,t,n){var a=n(1),o=n(20),r=o.Grid,i=o.Col,s=o.Badge,c=o.Icon,l=o.Group,d=n(28);e.exports=a.createClass({displayName:"module.exports",_value:null,propTypes:{value:a.PropTypes.oneOf(["gas","park","wash","maintain","fix","breach","road","others"])},handleClick:function(e){e.preventDefault(),this._value=e.currentTarget.getAttribute("data-key"),this.props.onChange(e)},getValue:function(){return this._value},getItemHTML:function(e){return a.createElement(i,null,a.createElement(s,{style:{width:"2.5rem",height:"2.5rem",lineHeight:3,backgroundColor:d[e].color,color:"white",opacity:this.props.value==e?1:.2},onTouchStart:this.handleClick,onClick:this.handleClick,"data-key":e,rounded:!0},a.createElement(c,{name:d[e].icon})),a.createElement("div",null,d[e].name))},render:function(){return this._value=this.props.value,a.createElement(l,{noPadded:!0,className:"margin-0 text-center"},a.createElement(r,{avg:4,className:"itemRows"},this.getItemHTML("gas"),this.getItemHTML("park"),this.getItemHTML("wash"),this.getItemHTML("maintain"),this.getItemHTML("fix"),this.getItemHTML("breach"),this.getItemHTML("road"),this.getItemHTML("others")))}})}});