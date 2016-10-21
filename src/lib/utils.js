module.exports={
    /**
     * 日期格式化
     * @param date
     * @param pattern
     * @returns {*}
     */
    dateFormat:function(date, pattern){
        function fix(t) {
            if (t < 10)
                t = '0' + t;
            return t;
        }
        var x=date;
        var y = x.getFullYear(),
            M = fix(x.getMonth() + 1),
            d = fix(x.getDate()),
            H = fix(x.getHours()),
            m = fix(x.getMinutes()),
            s = fix(x.getSeconds());
        return pattern.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', H).replace('mm', m).replace('ss', s);
    },
    /**
     * 对象合并，这里只是简单地把对象2合并到对象1中去，并且只遍历一层
     * @param obj1
     * @param obj2
     * @returns {*}
     */
    objectAssign:function(obj1, obj2){
        for(var k in obj2){
            obj1[k]=obj2[k];
        }
        return obj1;
    }
};