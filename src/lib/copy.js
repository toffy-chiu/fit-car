var fs=require('fs');
var path=require('path');
var q=require('q');
module.exports=function(src, dist){
    copyDir(path.resolve(src), path.resolve(dist));

    function exists(dir){
        var deferred=q.defer();
        fs.exists(dir, function(exists){
            deferred.resolve(exists);
        });
        return deferred.promise;
    }
    function mkdir(exists, dir){
        var deferred=q.defer();
        if(exists){
            deferred.resolve();
        }else {
            fs.mkdir(dir, function () {
                deferred.resolve();
            });
        }
        return deferred.promise;
    }
    function readdir(dir){
        var deferred=q.defer();
        fs.readdir(dir, function(err, files){
            if(err){
                deferred.reject(err);
            }else {
                deferred.resolve(files);
            }
        });
        return deferred.promise;
    }

    function copyDir(srcDir, distDir){
        var callee=arguments.callee;
        exists(distDir)
            .then(function(exists){
                return mkdir(exists, distDir);
            })
            .then(function(){
                return readdir(srcDir);
            })
            .then(function(files){
                files.forEach(function(file){
                    var srcPath=path.resolve(srcDir, file);
                    var distPath=path.resolve(distDir, file);
                    var readable,writable;
                    fs.stat(srcPath, function(err, stat){
                        if(err){
                            console.error(err);
                            return;
                        }
                        if(stat.isFile()){
                            readable=fs.createReadStream(srcPath);
                            writable=fs.createWriteStream(distPath);
                            readable.pipe(writable);
                        }else if(stat.isDirectory()){
                            callee(srcPath, distPath);
                        }
                    });
                });
            })
        ;
    }
};