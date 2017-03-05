/**
 * 线上发布配置
 */
require('./fis-conf-common');

// 七牛的空间域名，https 的域名以 // 开头，请不要带协议名
const domain = (process.env.QN_DOMAIN || '//dn-runedu-h5.qbox.me').trim();

// 指定项目源码
fis.set('project.files', [
    '/src/**'
]);

// 排除指定目录和文件
fis.set('project.ignore', [
    'node_modules/**',
    'build/**',
    'dist/**',
    '.gitignore',
    '.git/**'
]);

fis
    .match('*', {
        isMod: true,
        useSameNameRequire: true, // 开启同名依赖
        release: '/static/$&', // 所有默认资源都产出到static目录下
        domain
    })
    // html
    .match('/src/**.{html,tpl}', {
        optimizer: fis.plugin('rjy-html-minifier'),
        domain: '' // 页面不需要上cdn
    })
    .match('/src/pages/(**.html)', {
        release: '/$1' // pages目录下的页面，产出到根目录
    })
    .match(/^\/src\/pages\/(.*)([^/]+)\/\2\.html$/, {
        release: '/$1$2.html' // pages目录下与上级目录同名的页面，产出到上一级目录
    })
    // js
    .match('*.js', {
        useHash: true,
        optimizer: fis.plugin('uglify-js')
    })
    .match('/src/{directive,components,pages,utils}/**.js', {
        parser: fis.plugin('babel-5.x')
    })
    .match('/src/libs/**', {
        wrap: false // 不需要包装成amd
    })
    // css
    .match('*.{css,less}', {
        useHash: true,
        useSprite: true,
        optimizer: fis.plugin('clean-css')
    })
    // 字体
    .match('*.{eot,svg,ttf,woff}', {
        useHash: true
    })
    // 图片
    .match('*.{png,jpg,jpeg,gif,ico}', {
        useHash: true
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor', {
            type: 'pngquant' // pngcrush or pngquant default is pngcrush
        })
    });

// 打包
fis.match('::package', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        allInOne: true
    })
});
