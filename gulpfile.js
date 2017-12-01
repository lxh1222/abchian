var gulp=require('gulp');
var webserver = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var concat = require('gulp-concat');
var minifyJs=require('gulp-uglify');
var minifyCss= require('gulp-minify-css');
var Mock = require('mockjs');
gulp.task('minifycss',function(){
 gulp.src('./css/style.scss')
 .pipe(concat('style.min.scss'))
 .pipe(minifyCss())
 .pipe(gulp.dest('./css'))
})
gulp.task('minifyjs',function(){
 gulp.src('./js/jquery.min.js')
 .pipe(concat('jquery.js'))
 .pipe(minifyJs())
 .pipe(gulp.dest('./js'))
})
gulp.task("webserver",function(){
    gulp.src("./")
    .pipe(webserver({
        host:"localhost",
        port:8080,
        open:true,
        fallback:"index.html",
        livereload:true
    }));
})
gulp.task("abchina",function(){
    gulp.src("./")
    .pipe(webserver({
        host:"localhost",
        port:9999,
        middleware:function(req,res,next){
            res.writeHead(200,{
                "content-type":"text/json;charset=utf-8",
                "Access-Control-Allow-Origin":"*"
            })
            if(req.url === "/indexHtml"){
                var filename = req.url.split("/")[1];
                // var dataFile = path.join(__dirname,"data",filename + ".json");
                fs.exists("./data/data.json",function(exist){
                    console.log(exist)
                    if(exist){
                        fs.readFile("./data/data.json",function(err,data){
                            console.log(err)
                            if(err){
                                throw err;
                            }else{
                                res.end(data);
                            }                           
                        })
                    }else{
                        var data = "can't found this file " + filename;
                        res.end(data) 
                    }
                })
            }
            next();
        }
    }));
})
gulp.task("default",function(){
    gulp.start("webserver")
})