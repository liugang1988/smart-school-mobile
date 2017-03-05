# 前端代码使用说明

## 构建过程

* 第一步 从git中拉取最新源码

    注意：为了避免更新依赖包的时间过长，拉取源码后，不要覆盖本地源码目录内的node_modules目录

* 第二步 更新依赖包 + 编译文件

    在源码目录下运行以下命令，请区分运行环境

    ``` js
    // CMD 
    npm run init && set QN_DOMAIN=[请输入 QN_DOMAIN 的值] && npm run prod

    // shell 
    npm run init && QN_DOMAIN=[请输入 QN_DOMAIN 的值] npm run prod
    ```

* 第三步 查看编译结果

    编译后的代码将存放在源码同级目录，如下：

    ```
    -- 
    |-- src 源码
    |
    |-- dist 编译结果

    ```

* 第四步 验证编译结果

   例如，发布到正式环境后，在浏览器中输入网址：`[域名]/log.html` 

   页面中显示内容：`[域名]/log/prod_1474597812851abcdfe.js`

   可以这样解读：`[域名]/log/[QN_DOMAIN]_[编译日期（毫秒）]md5.js`

* 第五步 同步静态资源

    目前静态资源都存放在 `dist/static` 中。

    而正式环境的编译结果将指向七牛cdn，即：需将`dist/static` 中的资源同步到七牛cdn上。

    为了兼顾`http`和`https`,七牛cdn的域名必须兼容两者

