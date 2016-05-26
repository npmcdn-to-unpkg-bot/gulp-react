/**
 * 命令：gulp server 开启服务器
 * 命令：gulp dist   生成dist压缩版本
 */

//------gulp server---------


//请求代理
var url = require('url'),
	proxy = require('proxy-middleware'),
	proxyOptions = url.parse('http://localhost:8001/EDF/')

proxyOptions.route = '/EDF';

var option = {
	base: 'src'
};



//开发服务器
var gulp = require('gulp'), //gulp
	browserSync = require('browser-sync'), //实时刷新
	yargs = require('yargs').argv

// 执行server前,编译sass
gulp.task('server', ['sass'],function() {
	//server
	yargs.p = yargs.p || 9000;
	browserSync.init({
		server: {
			baseDir: "./src",
			middleware: [
				proxy(proxyOptions)
			]
		},
		ui: {
			port: yargs.p + 1,
			weinre: {
				port: yargs.p + 2
			}
		},
		port: yargs.p
	});


	//监听文件

		gulp.watch('src/**/*.scss', ['sass']);
		gulp.watch('src/*.html',function() {
			browserSync.reload();
		});
		gulp.watch('src/**/*.js', ['browserify',function() {
			browserSync.reload();
		}]);
		gulp.watch('src/images/*', function() {
			browserSync.reload();
		})
});



// 编译sass文件

var sass = require('gulp-ruby-sass'), //sass编译，注：需要安装ruby和sass
	autoprefix = require('gulp-autoprefixer')

gulp.task('sass', function() {
	gulp.src('src/sass/**/*.scss', function() {
		sass('src/sass/*.scss')
			.on('error', sass.logError)
			.pipe(autoprefix())
			.pipe(gulp.dest('src/styles/'))
			.pipe(browserSync.reload({stream: true}))
	})

});


//browserify

gulp.task('browserify',function(){



})








//--------gulp dist--------
var del 		   = require('del'),						//清空目录
	imagemin       = require("gulp-imagemin"),				//图片压缩
	jpegRecompress = require("imagemin-jpeg-recompress"),	//jpg压缩
	pngquant       = require("imagemin-pngquant"),			//png压缩
	minifyCss      = require('gulp-minify-css'),			//css压缩
	uglify         = require('gulp-uglify'),				//js压缩
	rev 		   = require('gulp-rev'),					//生成md5码和对应json
	revCollector   = require('gulp-rev-collector'),			//路径替换
	replace 	   = require('gulp-replace'),				//字符串替换
	gulpSequence   = require('gulp-sequence');				//gulp task任务排序执行


gulp.task('del-dist', function(){
	return del(['dist/**', 'rev/**'])
})

//min
gulp.task('min-jpg', function(){
	return gulp.src('src/images/**/*.jpg')
	.pipe(imagemin({use:[jpegRecompress({loops:6})]}))
	.pipe(rev())
	.pipe(gulp.dest('dist/images/'))
	.pipe(rev.manifest('jpg.json'))
	.pipe(gulp.dest('rev/'))
})

gulp.task('min-png', function(){
	return gulp.src('src/images/**/*.png')
	.pipe(imagemin({progressive:false,use:[pngquant()]}))
	.pipe(rev())
	.pipe(gulp.dest('dist/images/'))
	.pipe(rev.manifest('png.json'))
	.pipe(gulp.dest('rev/'))
})


//视频文件存放于images/
gulp.task('copy-media', function(){
	return gulp.src('src/images/**/*.+(gif|mp3|mp4)')
	.pipe(rev())
	.pipe(gulp.dest('dist/images/'))
	.pipe(rev.manifest('media.json'))
	.pipe(gulp.dest('rev/'))
})

gulp.task('min-css', function(){
	return gulp.src('src/styles/**/*.css')
	.pipe(minifyCss())
	.pipe(rev())
	.pipe(gulp.dest('dist/styles/'))
	.pipe(rev.manifest('styles.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('copy-js', function(){
	return gulp.src('src/scripts/*.js')
	.pipe(rev())
	.pipe(gulp.dest('dist/scripts/'))
	.pipe(rev.manifest('scripts.json'))
	.pipe(gulp.dest('rev/'))
})


gulp.task('copy-html', function(){
	return gulp.src('src/*.html')
	.pipe(gulp.dest('dist/'))
});

gulp.task('copy-lib', function(){
	return gulp.src('src/lib/**/*')
	.pipe(gulp.dest('dist/lib/'))
});





//revCollector
gulp.task('revCollector', function(){
	gulp.src(['rev/*.json', 'dist/**/*.+(html|js|css)'])
	.pipe(revCollector())
	.pipe(gulp.dest('dist/'))
})


gulp.task('dist', gulpSequence('del-dist', ['min-jpg', 'min-png', 'copy-media', 'min-css', 'copy-js', 'copy-html','copy-lib'], 'revCollector'));





gulp.task('default', function(){
	console.log('\n命令:gulp server  ---------  开启本地服务器 \n命令:gulp dist    ---------  压缩生成dist版本 \n命令:gulp upload  ---------  上传到服务器 \n\n')
})