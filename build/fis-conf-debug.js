/**
 * 本地开发配置
 */
require('./fis-conf-common');

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
    .match('**', {
        isMod: true,
        useSameNameRequire: true, // 开启同名依赖
        release: '/static/$&' // 所有默认资源都产出到static目录下
    })
    // html
    .match('/src/pages/(**.html)', {
        release: '/$1' // pages目录下的页面，产出到根目录
    })
    .match(/^\/src\/pages\/(.*)([^/]+)\/\2\.html$/, {
        release: '/$1$2.html' // pages目录下与上级目录同名的页面，产出到上一级目录
    })
    // js
    .match('/src/**.js', {
        parser: fis.plugin('babel-5.x')
    })
    .match('/src/libs/**', {
        wrap: false // 不需要包装成amd
    });
