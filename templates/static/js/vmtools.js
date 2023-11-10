const gateway = 'http://127.0.0.1:8698';
// 加载框
const netload = document.getElementById('netload');
// 消息框
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const alert = (message, type) => {
    const wrapper = document.createElement('div');
    // 使用内联框关闭消息本身必须引入报警插件或完整脚本
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
    // 自动关闭消息框
    setTimeout(() => {
        const closeButton = wrapper.querySelector('[aria-label="Close"]');
        closeButton.click();
    }, 5000);
}

// 封装一下错误消息
const eralert = (message) => {
    alert(message, 'danger');
}
// 成功消息
const sualert = (message) => {
    alert(message, 'success');
}

// 网络工具包
function http (type, url, data, header) {
    netload.style.display = 'block';
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url);
        if (header) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.onload = function () {
        if (xhr.status === 200) {
            netload.style.display = 'none';
            resolve(xhr.responseText); // 将响应文本作为参数传递给 resolve 方法
        } else {
            netload.style.display = 'none';
            reject(new Error(xhr.statusText)); // 创建并返回一个新的 Error 对象
        }
        };
        xhr.onerror = function() {
            netload.style.display = 'none';
            reject(new Error("Network Error")); // 创建并返回一个新的 Error 对象
        };
        if (!data) {
            xhr.send();
        } else {
            xhr.send(data);
        }
    });
}

// 列出所有虚拟网络
function getvmnet () {
    http('GET', gateway + '/api/vmnet')
        .then(function (data) {
        var data = JSON.parse(data);
        var data = JSON.parse(data);
        
        if (data.num == 0) {
            sualert('没有虚拟网络');
            return;
        }
        var allbody = document.getElementById('allbody');
        allbody.innerHTML = '<table class="table table-striped table-hover table-bordered align-middle">' +
                            '<thead id="tb-head">' +
                            '</thead>' +
                            '<tbody id="tb-body">' +
                            '</tbody>' +
                            '</table>';
        var tableBody = document.getElementById('tb-body');
        var tableHead = document.getElementById('tb-head');
        // 定义表头
        tableHead.innerHTML = '<tr>' +
                                '<th>网络名称</th>' +
                                '<th>网络类型</th>' +
                                '<th>启用dhcp</th>' +
                                '<th>子网</th>' +
                                '<th>掩码</th>' +
                                '</tr>';
        // 先清空表格
        tableBody.innerHTML = '';
        // 加载数据到表格
        for (var i = 0; i < data.vmnets.length; i++) {
            var vmnet = data.vmnets[i];
            
            var row = '<tr>' +
                        '<td>' + vmnet.name + '</td>' +
                        '<td>' + vmnet.type + '</td>' +
                        '<td>' + vmnet.dhcp + '</td>' +
                        '<td>' + vmnet.subnet + '</td>' +
                        '<td>' + vmnet.mask + '</td>' +
                    '</tr>';
                    
            tableBody.innerHTML += row;
        }
    })
    .catch(function(error) {
        eralert(error);
    })
}

// 显示查询MAC-IP绑定按钮
function showcmmacip () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
        '<input type="text" class="form-control" placeholder="要查询的网络名称" aria-label="vmnet8" aria-describedby="button-addon2" id="getcmmacipval">' +
        '<button class="btn btn-outline-secondary" type="button" id="getcmmacip" onclick="getcmmacip()">提交</button>' +
        '</div>';
}

// 列出所有MAC-IP绑定
function getcmmacip () {
    var value = document.getElementById('getcmmacipval').value;
    
    if (!value) {
        eralert('请输入要查询的网络名称');
    } else {
        http('GET',gateway + '/api/vmnet/' + value + '/mactoip')
        .then(function (data) {
            var data = JSON.parse(data);
            var data = JSON.parse(data);
            
            if (data.num == undefined) {
            eralert(data.Message);
            return;
            }
            if (data.num == 0) {
            sualert('该网络暂无MAC-IP绑定');
            return;
            }
            var allbody = document.getElementById('allbody');
            allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                '<thead id="tb-head">' +
                                '</thead>' +
                                '<tbody id="tb-body">' +
                                '</tbody>' +
                                '</table>';
            var tableBody = document.getElementById('tb-body');
            var tableHead = document.getElementById('tb-head');
            // 定义表头
            tableHead.innerHTML = '<tr>' +
                                    '<th>绑定地址</th>' +
                                    '<th>MAC</th>' +
                                    '<th>网络名称</th>' +
                                '</tr>';
            // 先清空表格
            tableBody.innerHTML = '';
            // 加载数据到表格
            for (var i = 0; i < data.mactoips.length; i++) {
            var vmnet = data.mactoips[i];
            
            var row = '<tr>' +
                        '<td>' + vmnet.ip + '</td>' +
                        '<td>' + vmnet.mac + '</td>' +
                        '<td>' + vmnet.vmnet + '</td>' +
                        '</tr>';
                        
            tableBody.innerHTML += row;
            }
        })
        .catch(function(error) {
        eralert(error);
        
        })
    }
}

// 显示查询所有端口转发按钮
function showportforward () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
        '<input type="text" class="form-control" placeholder="要查询的网络名称" aria-label="vmnet8" aria-describedby="button-addon2" id="getportforwardval">' +
        '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="getportforward()">提交</button>' +
        '</div>';
}

// 列出所有端口转发
function getportforward () {
var value = document.getElementById('getportforwardval').value;
if (!value) {
    eralert('请输入要查询的网络名称');
} else {
    http('GET',gateway + '/api/vmnet/' + value + '/portforward')
    .then(function (data) {
        var data = JSON.parse(data);
        var data = JSON.parse(data);
        
        if (data.num == undefined) {
        eralert(data.Message);
        return;
        }
        if (data.num == 0) {
        sualert('该网络暂无端口转发');
        return;
        }
        var allbody = document.getElementById('allbody');
        allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                            '<thead id="tb-head">' +
                            '</thead>' +
                            '<tbody id="tb-body">' +
                            '</tbody>' +
                            '</table>';
        var tableBody = document.getElementById('tb-body');
        var tableHead = document.getElementById('tb-head');
        // 定义表头
        tableHead.innerHTML = '<tr>' +
                                '<th>协议类型</th>' +
                                '<th>主机端口</th>' +
                                '<th>虚拟机IP</th>' +
                                '<th>虚拟机端口</th>' +
                                '<th>描述</th>' +
                            '</tr>';
        // 先清空表格
        tableBody.innerHTML = '';
        // 加载数据到表格
        for (var i = 0; i < data.port_forwardings.length; i++) {
        var vmnet = data.port_forwardings[i];
        
        var row = '<tr>' +
                    '<td>' + vmnet.protocol + '</td>' +
                    '<td>' + vmnet.port + '</td>' +
                    '<td>' + vmnet.guest.ip + '</td>' +
                    '<td>' + vmnet.guest.port + '</td>' +
                    '<td>' + vmnet.desc + '</td>' +
                    '</tr>';
        tableBody.innerHTML += row;
        }
    })
    .catch(function(error) {
    eralert(error);
    
    })
}
}

// 显示更改MAC-IP绑定表单
function showucmmacip () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">网络名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="vmnet网卡名称，如vmnet8" id="mactoipbv">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">MAC</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要绑定的MAC" id="mactoipm">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">IP</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="为MAC绑定的IP地址" id="mactoipi">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="updatemactoip()">提交</button>';
}

// 更改mac-ip绑定
function updatemactoip () {
    var vmnet = document.getElementById('mactoipbv').value;
    var mac = document.getElementById('mactoipm').value;
    var ip = document.getElementById('mactoipi').value;

    if (vmnet == '' || mac == '' || ip == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
        "IP": ip
        });
        
        http('PUT',gateway + '/api/vmnet/' + vmnet + '/mactoip/' + mac, jsond)
        .then(function (data) {
            var data = JSON.parse(data);
            var data = JSON.parse(data);
            
            if (data.Code == 0) {
            sualert(data.Message);
            return;
            } else {
            eralert('操作失败' + data.Message);
            return;
            }
        })
        .catch(function(error) {
            eralert(error);
            
        })
    }
}


// 显示更改端口转发表单
function showvpor () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">网络名称</span>' +
                    '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="vmnet网卡名称，如vmnet8" id="vmnetname">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">协议类型</span>' +
                    '<select class="form-select" aria-label="Default select example" id="protocol">' +
                        '<option value="tcp">TCP</option>' +
                        '<option value="udp">UDP</option>' +
                    '</select>' +
                '</div>' + 
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">主机端口</span>' +
                    '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要转发到主机上的哪个端口" id="hostport">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机IP</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要转发的虚拟机地址" id="vmip">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机端口</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要转发的虚拟机端口" id="vmport">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">描述</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="描述: 该条转发用于何目的" id="desc">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="updatevphp()">提交</button>';
    
}

// 更改端口转发
function updatevphp () {
    var vmnet = document.getElementById('vmnetname').value;
    var protocol = document.getElementById('protocol').value;
    var hostport = document.getElementById('hostport').value;
    var vmip = document.getElementById('vmip').value;
    var vmport = document.getElementById('vmport').value;
    var desc = document.getElementById('desc').value;
    
    if (vmnet == '' || protocol == '' || hostport == '' || vmip == '' || vmport == '' || desc == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
            "guestIp": vmip,
            "guestPort": parseInt(vmport),
            "desc": desc
          });
        
        http('PUT',gateway + '/api/vmnet/' + vmnet + '/portforward/' + protocol + '/' + hostport, jsond)
        .then(function (data) {
            var data = JSON.parse(data);
            var data = JSON.parse(data);
            if (data.Code == 0) {
                sualert(data.Message);
                return;
            } else {
                eralert(data.Message);
                return;
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}


// 显示创建虚拟网络表单
function showaddvmnet () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">网络名称</span>' +
                    '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="规则：vmnet + 数字" id="vmnetname">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">网络类型</span>' +
                    '<select class="form-select" aria-label="Default select example" id="vmtype">' +
                        '<option value="hostOnly">仅主机模式</option>' +
                        '<option value="bridged">桥接</option>' +
                        '<option value="nat">NAT</option>' +
                    '</select>' +
                '</div>' +
                '<label for="formGroupExampleInput" class="form-label">实测dhcp配置是无效的, 可以忽略以下选项</label>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">启用DHCP</span>' +
                    '<select class="form-select" aria-label="Default select example" id="dhcp">' +
                        '<option value="true">启用</option>' +
                        '<option value="false">关闭</option>' +
                    '</select>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<div class="input-group-text">' +
                        '<input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" id="csubnet">' +
                    '</div>' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">子网</span>' +
                    '<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="默认会自动分配" id="subnet">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">掩码</span>' +
                    '<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="默认会自动分配" id="netmask">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="addvmnet()">提交</button>';
}

// 创建虚拟网络
function addvmnet () {
    var vmnet = document.getElementById('vmnetname').value;
    var vmtype = document.getElementById('vmtype').value;
    var dhcp = document.getElementById('dhcp').value;
    var csubnet = document.getElementById('csubnet').checked;
    var subnet = document.getElementById('subnet').value;
    var netmask = document.getElementById('netmask').value;
    
    if (vmnet == '' || vmtype == '' || dhcp == '' || csubnet == '' || subnet == '' || netmask == '') {
        eralert('请检查输入参数');
    } else {
        if ( dhcp == false) {
            var jsond = JSON.stringify({
                "name": vmnet,
                "type": vmtype,
                "dhcp": dhcp
            });
        } else {
            if (csubnet == true) {
                var jsond = JSON.stringify({
                    "name": vmnet,
                    "type": vmtype,
                    "dhcp": dhcp,
                    "subnet": subnet,
                    "netmask": netmask
                });
            } else {
                var jsond = JSON.stringify({
                    "name": vmnet,
                    "type": vmtype,
                    "dhcp": dhcp
                });
            }
        }
        http('POST',gateway + '/api/vmnets', jsond)
        .then(function (data) {
            var data = JSON.parse(data);
            var data = JSON.parse(data);
            if ('Code' in data) {
                if (data.Code == 0) {
                    sualert(data.Message);
                    return;
                } else {
                    eralert(data.Message);
                    return;
                }
            } else {
                if ('num' in data) {
                    sualert('创建成功');
                    return;
                } else {
                    sualert(data);
                    return;
                }
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}


// 显示删除端口转发表单
function showdelvpor () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">网络名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="vmnet网卡名称，如vmnet8" id="vmnetname">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">主机端口</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="对应的主机端口" id="hostport">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">协议类型</span>' +
                    '<select class="form-select" aria-label="Default select example" id="protocol">' +
                        '<option value="tcp">TCP</option>' +
                        '<option value="udp">UDP</option>' +
                    '</select>' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="delportford()">提交</button>';
}

// 删除端口转发
function delportford () {
    var vmnet = document.getElementById('vmnetname').value;
    var hostport = document.getElementById('hostport').value;
    var protocol = document.getElementById('protocol').value;
    
    if (vmnet == '' || hostport == '' || protocol == '') {
        eralert('请检查输入参数');
    } else {
        http('DELETE',gateway + '/api/vmnet/' + vmnet + '/portforward/' + protocol + '/' + hostport)
        .then(function (data) {

            if (data.length === 2) {
                sualert("删除成功");
                return;
            } else {
                data = JSON.parse(data);
                data = JSON.parse(data);
                if ("Code" in data) {
                    eralert(data.Message);
                } else {
                    eralert(data);
                }
            }
        })
        .catch(function(error) {
            
            eralert(error)
        })
    }
}



// 列出所有虚拟机
function getvms () {
    http('GET', gateway + '/api/vms')
        .then(function (data) {
        var data = JSON.parse(data);
        var data = JSON.parse(data);
        console.log(data);
        if (data.num == 0) {
            sualert('当前VMware中没有虚拟机');
            return;
        }
        var allbody = document.getElementById('allbody');
        allbody.innerHTML = '<table class="table table-striped table-hover table-bordered align-middle">' +
                            '<thead id="tb-head">' +
                            '</thead>' +
                            '<tbody id="tb-body">' +
                            '</tbody>' +
                            '</table>';
        var tableBody = document.getElementById('tb-body');
        var tableHead = document.getElementById('tb-head');
        // 定义表头
        tableHead.innerHTML = '<tr>' +
                                '<th>ID</th>' +
                                '<th>路径</th>' +
                            '</tr>';
        // 先清空表格
        tableBody.innerHTML = '';
        // 加载数据到表格
        for (var i = 0; i < data.length; i++) {
            var vmnet = data[i];
            
            var row = '<tr>' +
                        '<td>' + vmnet.id + '</td>' +
                        '<td>' + vmnet.path + '</td>' +
                    '</tr>';
                    
            tableBody.innerHTML += row;
        }
    })
    .catch(function(error) {
        eralert(error);
    })
}


// 显示获取虚拟机设置信息表单
function showvmcm () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
    '<input type="text" class="form-control" placeholder="虚拟机ID" aria-describedby="button-addon2" id="vmid">' +
    '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="showvminfor()">提交</button>' +
    '</div>';
}


// 获取虚拟机基本设置
function showvminfor () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请输入vmid');
    } else {
        http('GET',gateway + '/api/vms/' + vmid)
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            var allbody = document.getElementById('allbody');
            allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                '<thead id="tb-head">' +
                                '</thead>' +
                                '<tbody id="tb-body">' +
                                '</tbody>' +
                                '</table>';
            var tableBody = document.getElementById('tb-body');
            var tableHead = document.getElementById('tb-head');
            // 定义表头
            tableHead.innerHTML = '<tr>' +
                                    '<th>ID</th>' +
                                    '<th>CPU</th>' +
                                    '<th>memory</th>' +
                                '</tr>';
            var row = '<tr>' +
                    '<td>' + data.id + '</td>' +
                    '<td>' + data.cpu.processors + '</td>' +
                    '<td>' + data.memory + '</td>' +
                    '</tr>';
            tableBody.innerHTML = row;
        })
        .catch(function(error) {
            
            eralert(error)
        })
    }
}


// 显示获取虚拟机配置参数表单
function showconfparam () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
    '<input type="text" class="form-control" placeholder="虚拟机ID" aria-describedby="button-addon2" id="vmid">' +
    '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="showvmparam()">提交</button>' +
    '</div>';
}


// 获取虚拟机配置参数
function showvmparam () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请输入vmid');
    } else {
        // 最后的参数是可选的，目前已知的参数只有displayName
        http('GET',gateway + '/api/vms/' + vmid + '/params/displayName')
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            var allbody = document.getElementById('allbody');
            allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                '<thead id="tb-head">' +
                                '</thead>' +
                                '<tbody id="tb-body">' +
                                '</tbody>' +
                                '</table>';
            var tableBody = document.getElementById('tb-body');
            var tableHead = document.getElementById('tb-head');
            // 定义表头
            tableHead.innerHTML = '<tr>' +
                                    '<th>参数名称</th>' +
                                    '<th>虚拟机名称</th>' +
                                '</tr>';
            var row = '<tr>' +
                    '<td>' + data.name + '</td>' +
                    '<td>' + data.value + '</td>' +
                    '</tr>';
            tableBody.innerHTML = row;
        })
        .catch(function(error) {
            
            eralert(error)
        })
    }
}


// 显示获取虚拟机限制信息表单
function showvmrestr () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
    '<input type="text" class="form-control" placeholder="虚拟机ID" aria-describedby="button-addon2" id="vmid">' +
    '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="showvmrestrictions()">提交</button>' +
    '</div>';
}


// 获取虚拟机限制信息
// 这里只列举部分获取到的参数
function showvmrestrictions () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请输入vmid');
    } else {
        // 最后的参数是可选的，目前已知的参数只有displayName
        http('GET',gateway + '/api/vms/' + vmid + '/restrictions')
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            var allbody = document.getElementById('allbody');
            allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                '<thead id="tb-head">' +
                                '</thead>' +
                                '<tbody id="tb-body">' +
                                '</tbody>' +
                                '</table>';
            var tableBody = document.getElementById('tb-body');
            var tableHead = document.getElementById('tb-head');
            // 定义表头
            tableHead.innerHTML = '<tr>' +
                                    '<th>参数名称</th>' +
                                    '<th>虚拟机名称</th>' +
                                '</tr>';
            var row = '<tr>' +
                    '<td>' + data.name + '</td>' +
                    '<td>' + data.value + '</td>' +
                    '</tr>';
            tableBody.innerHTML = row;
        })
        .catch(function(error) {
            
            eralert(error)
        })
    }
}




// 显示更新虚拟机设置信息表单
function showupvmset () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">CPU</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="分配几核CPU" id="vmcpus">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">memory</span>' +
                    '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="内存大小" id="vmmemory">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="updatevmset()">提交</button>';
}

// 更新虚拟机设置信息
// CPU和内存
function updatevmset () {
    var vmid = document.getElementById('vmid').value;
    var vmcpus = document.getElementById('vmcpus').value;
    var vmmemory = document.getElementById('vmmemory').value;
    
    if (vmid == '' || vmcpus == '' || vmmemory == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
            "processors": parseInt(vmcpus),
            "memory": parseInt(vmmemory)
          });
        http('PUT',gateway + '/api/vms/' + vmid,jsond)
        .then(function (data) {
            
            data = JSON.parse(data);
            data = JSON.parse(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if (data.id === vmid || data.cpu.processors === vmcpus || data.memory === vmmemory) {
                sualert("修改成功");
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}


// 更改虚拟机配置参数
function updatevmparams () {
    sualert("在当前版本中无法使用");
}


// 显示创建虚拟机副本表单
function showupvmset () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="从虚拟机创建副本" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">副本名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="为这个副本指定一个名称" id="copyname">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="creatcopyinvm()">提交</button>';
}

// 创建虚拟机副本
function creatcopyinvm () {
    var vmid = document.getElementById('vmid').value;
    var copyname = document.getElementById('copyname').value;

    if (vmid == '' || copyname == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
            "parentId": vmid,
            "name": copyname
          });
        console.log(jsond);
        http('POST',gateway + '/api/vms',jsond)
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if ("id" in data) {
                sualert("创建副本 [" + copyname + "] 成功<br>vmx文件已存在默认存放位置<br>需要手动注册vmx文件到VMware数据库中，否则虚拟机在VMware中不可见");
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示注册虚拟机到vm数据库表单
function showregistovmdb () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="为这个虚拟机指定名称" id="vmname">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机vmx路径</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="虚拟机文件路径（.vmx文件路径）" id="vmpath">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="registovmdb()">提交</button>';
}

// 注册虚拟机到vm数据库
function registovmdb () {
    var vmname = document.getElementById('vmname').value;
    var vmpath = document.getElementById('vmpath').value;

    if (vmname == '' || vmpath == '') {
        eralert('请检查输入参数');
    } else {
        // 需要注意一点，path中的/是必须要转义的
        var jsond = JSON.stringify({
            "path": vmpath,
            "name": vmname
          });
        console.log(jsond);
        http('POST',gateway + '/api/vms/registration',jsond)
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if ("id" in data) {
                sualert("注册虚拟机 [" + vmname + "] 到VMware数据库成功");
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}




// 显示删除虚拟机表单
function showdelvm () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要删除的虚拟机ID" id="vmid">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="delvm()">删除</button>';
}

// 删除端口转发
function delvm () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请检查输入参数');
    } else {
        http('DELETE',gateway + '/api/vms/' + vmid)
        .then(function (data) {
            if (data.length === 2) {
                sualert("删除成功");
                return;
            } else {
                data = JSON.parse(data);
                data = JSON.parse(data);
                if ("Code" in data) {
                    eralert(data.Message);
                } else {
                    eralert(data);
                }
            }
        })
        .catch(function(error) {
            eralert(error)
        })
    }
}


// 显示获取虚拟机IP表单
function showvmip () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
    '<input type="text" class="form-control" placeholder="虚拟机ID" aria-describedby="button-addon2" id="vmid">' +
    '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="getvmip()">提交</button>' +
    '</div>';
}


// 获取虚拟机IP
function getvmip () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请输入vmid');
    } else {
        // 最后的参数是可选的，目前已知的参数只有displayName
        http('GET',gateway + '/api/vms/' + vmid + '/ip')
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if ("ip" in data) {
                var allbody = document.getElementById('allbody');
                allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                    '<thead id="tb-head">' +
                                    '</thead>' +
                                    '<tbody id="tb-body">' +
                                    '</tbody>' +
                                    '</table>';
                var tableBody = document.getElementById('tb-body');
                var tableHead = document.getElementById('tb-head');
                // 定义表头
                tableHead.innerHTML = '<tr>' +
                                        '<th>虚拟机ID</th>' +
                                        '<th>IP</th>' +
                                    '</tr>';
                var row = '<tr>' +
                        '<td>' + vmid + '</td>' +
                        '<td>' + data.ip + '</td>' +
                        '</tr>';
                tableBody.innerHTML = row;
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示获取虚拟机所有网络适配器的表单
function show_get_vm_adapters () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group mb-3">' +
    '<input type="text" class="form-control" placeholder="虚拟机ID" aria-describedby="button-addon2" id="vmid">' +
    '<button class="btn btn-outline-secondary" type="button" id="getportforward" onclick="get_vm_adapters()">提交</button>' +
    '</div>';
}


// 获取虚拟机所有网络适配器
function get_vm_adapters () {
    var vmid = document.getElementById('vmid').value;
    
    if (vmid == '') {
        eralert('请输入vmid');
    } else {
        // 最后的参数是可选的，目前已知的参数只有displayName
        http('GET',gateway + '/api/vms/' + vmid + '/nic')
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);

            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            
            var allbody = document.getElementById('allbody');
            allbody.innerHTML += '<table class="table table-striped table-hover table-bordered align-middle">' +
                                '<thead id="tb-head">' +
                                '</thead>' +
                                '<tbody id="tb-body">' +
                                '</tbody>' +
                                '</table>';
            var tableBody = document.getElementById('tb-body');
            var tableHead = document.getElementById('tb-head');
            // 定义表头
            tableHead.innerHTML = '<tr>' +
                                    '<th>位置</th>' +
                                    '<th>类型</th>' +
                                    '<th>名称</th>' +
                                    '<th>MAC</th>' +
                                '</tr>';
            // 先清空表格
            tableBody.innerHTML = '';
            for (var i = 0; i < data.nics.length; i++) {
                var vmnet = data.nics[i];
                var row = '<tr>' +
                        '<td>' + vmnet.index + '</td>' +
                        '<td>' + vmnet.type + '</td>' +
                        '<td>' + vmnet.vmnet + '</td>' +
                        '<td>' + vmnet.macAddress + '</td>' +
                        '</tr>';
                tableBody.innerHTML += row;
            }
        
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示更新虚拟机网卡表单
function show_update_network_adapter () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要更新网卡的虚拟机ID" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">网卡位置</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="index  从1开始" id="vmindex">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">新网卡名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="vmnet1" id="vmname">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="update_network_adapter()">提交</button>';
}

// 更新虚拟机指定位置的网卡
function update_network_adapter () {
    var vmid = document.getElementById('vmid').value;
    var vmindex = document.getElementById('vmindex').value;
    var vmname = document.getElementById('vmname').value;
    if (vmid == '' || vmindex == '' || vmname == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
            "type": "custom",
            "vmnet": vmname
          });
        http('PUT',gateway + '/api/vms/' + vmid + '/nic/' + vmindex,jsond)
        .then(function (data) {
            console.log(data);
            data = JSON.parse(data);
            data = JSON.parse(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if ("index" in data) {
                sualert("更新网卡成功");
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示向虚拟机添加网卡表单
function show_create_network_adapter () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="虚拟机ID" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">新增网卡名称</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="vmnet1" id="vmname">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="create_network_adapter()">提交</button>';
}

// 更新虚拟机指定位置的网卡
function create_network_adapter () {
    var vmid = document.getElementById('vmid').value;
    var vmname = document.getElementById('vmname').value;
    if (vmid == '' || vmname == '') {
        eralert('请检查输入参数');
    } else {
        var jsond = JSON.stringify({
            "type": "custom",
            "vmnet": vmname
          });
        http('POST',gateway + '/api/vms/' + vmid + '/nic',jsond)
        .then(function (data) {
            console.log(data);
            data = JSON.parse(data);
            data = JSON.parse(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            }
            if ("index" in data) {
                sualert("新增网卡成功");
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示删除虚拟机网卡表单
function show_delete_network_adapter () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要更新网卡的虚拟机ID" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">网卡位置</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="index  从1开始" id="vmindex">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="delete_network_adapter()">提交</button>';
}

// 更新虚拟机指定位置的网卡
function delete_network_adapter () {
    var vmid = document.getElementById('vmid').value;
    var vmindex = document.getElementById('vmindex').value;
    if (vmid == '' || vmindex == '') {
        eralert('请检查输入参数');
    } else {
        http('DELETE',gateway + '/api/vms/' + vmid + '/nic/' + vmindex)
        .then(function (data) {
            if (data.length === 2) {
                sualert("删除成功");
                return;
            }
            data = JSON.parse(data);
            data = JSON.parse(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            } else {
                eralert(data);
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示获取虚拟机电源状态表单
function show_get_vm_power () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="要更新网卡的虚拟机ID" id="vmid">' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="get_vm_power()">获取电源状态</button>';
}

// 获取虚拟机电源状态
function get_vm_power () {
    var vmid = document.getElementById('vmid').value;
    if (vmid == '') {
        eralert('请检查输入参数');
    } else {
        http('GET',gateway + '/api/vms/' + vmid + '/power')
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            } 
            if ("power_state" in data) {
                if (data.power_state == "poweredOff") {
                    sualert('虚拟机电源未开启');
                } else if (data.power_state == "poweredOn") {
                    sualert('虚拟机电源开启');
                }
                
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}



// 显示更改虚拟机电源表单
function show_update_vm_power () {
    var allbody = document.getElementById('allbody');
    allbody.innerHTML = '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">虚拟机ID</span>' +
                    '<input type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" placeholder="" id="vmid">' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                    '<span class="input-group-text" id="inputGroup-sizing-sm">电源</span>' +
                    '<select class="form-select" aria-label="Default select example" id="vmpower">' +
                        '<option value="on">开启</option>' +
                        '<option value="off">关闭</option>' +
                    '</select>' +
                '</div>' +
                '<button type="button" class="btn btn-primary" onclick="update_vm_power()">提交</button>';
}

// 更改虚拟机电源
function update_vm_power () {
    var vmid = document.getElementById('vmid').value;
    var powerStatus = document.getElementById('vmpower').value;
    if (vmid == '' || powerStatus == '') {
        eralert('请检查输入参数');
    } else {
        http('PUT',gateway + '/api/vms/' + vmid + '/power',powerStatus)
        .then(function (data) {
            data = JSON.parse(data);
            data = JSON.parse(data);
            console.log(data);
            if ("Code" in data) {
                eralert(data.Message);
                return;
            } 
            if ("power_state" in data) {
                if (data.power_state == "poweredOff") {
                    sualert('虚拟机电源未开启');
                } else if (data.power_state == "poweredOn") {
                    sualert('虚拟机电源开启');
                }
            }
        })
        .catch(function(error) {
            eralert(error);
        })
    }
}