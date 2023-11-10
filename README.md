# VMware 16 Pro 个人计算机虚拟化管理面板
1. 使用Bootstrap 5来构建前端，目前仅实现了基本的API对接（不会前端）
2. 使用Python库aiohttp.web实现对vmrest api的跨域代理，集成了登录和自动登录接口（完全可以在前端实现）
3. 基本对接了vmrest中可用的API

### 后续计划（待排期）
1. 完善面板，实现类似于云控制台、vCenter web的管理功能

### 运行该项目
1. 安装Python3以及aiohttp库
2. 配置vmrest，需要确保您的vmrest是可用的，本项目不会去自动打开vmrest [查看如何配置vmrest](https://docs.vmware.com/cn/VMware-Workstation-Pro/16.0/com.vmware.ws.using.doc/GUID-C3361DF5-A4C1-432E-850C-8F60D83E5E2B.html)
3. 以管理员方式运行vmrest（否则没有权限进行虚拟网卡操作）
4. 运行gateway.py脚本，该脚本用于转发前端的请求并校验登录
5. 直接在浏览器打开template/login.index页面（纯浏览器解析，原生实现）
6. 开始使用面板吧

<img src="https://github.com/HG-ha/VMware_panel/assets/60115106/3b3efebf-7a70-48a4-9306-4f9847050af7" title="login" alt="登录" width="60%" height="40%">
<img src="https://github.com/HG-ha/VMware_panel/assets/60115106/f8080aa0-f123-4133-80e5-c25f35204d28" title="demo" alt="样例" width="60%" height="40%">
<img src="https://github.com/HG-ha/VMware_panel/assets/60115106/972b5e1f-4564-43e7-9676-9750a0be9a6d" title="demo" alt="样例" width="60%" height="40%">


### 请喝茶吗

| 支付宝                                                                                     | 微信                                                                                    | 群                |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------- |
| <img src="https://github.com/HG-ha/qinglong/blob/main/zfb.jpg?raw=true" title="" alt="zfb" width="120px" height="120px"> | <img title="" src="https://github.com/HG-ha/qinglong/blob/main/wx.png?raw=true" alt="wx" width="120px" height="120px"> | 一铭API：1029212047 |
|                                                                                       |                                                                                       | 镜芯科技：376957298   |



### 其他项目

[一铭API](https://api.wer.plus)
