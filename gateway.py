import aiohttp
from functools import wraps
from aiohttp import web,ClientSession
import json
import base64
import os
import subprocess


corscode = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Server':'is my server',
            }

# 实例化路由
routes = web.RouteTableDef()

wj = lambda dt: web.json_response(dt)

# 处理OPTIONS和跨域的中间件
async def options_middleware(app, handler):
    async def middleware(request):
        # 处理 OPTIONS 请求，直接返回空数据和允许跨域的 header
        if request.method == 'OPTIONS':
            return web.Response(headers=corscode)
        # 继续处理其他请求
        response = await handler(request)
        # 为每次响应添加header
        try:
            response.headers.update(corscode)
        except Exception as e:
            return response
        return response
    return middleware

async def login(request):
    data = await request.json()
    password = data.get('password')
    username = data.get('username')
    if not all([password,username]):
        return wj({'code':400,'msg':'参数错误'})
    author = base64.b64encode(f'{username}:{password}'.encode('utf-8')).decode('utf-8')
    global headers
    headers = {'Content-Type': 'application/vnd.vmware.vmw.rest-v1+json','Accept': 'application/vnd.vmware.vmw.rest-v1+json','Authorization': f'Basic {author}'}
    async with aiohttp.ClientSession() as session:
        req = await session.get(f"{vmrest}/api/vmnet",headers=headers)
        data = await req.json()
        if data.get("Message","") == "Authentication failed":
            return wj({"code":201,"msg":"登录失败"})
        else:
            with open('headers.json','w') as f:
                f.write(json.dumps(headers,ensure_ascii=False))
            return wj({"code":200,"msg":"登录成功"})

async def alogin(request):
    if os.path.exists('headers.json'):
        # return wj({'code':201,'msg':'未查找到可用的headers配置，请手动登录'})
        with open('headers.json','r') as f:
            global headers
            headers = json.load(f)
    else:
        # 判断vmrest命令是否正确配置
        p = subprocess.Popen(f"where vmrest", stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        output, error = p.communicate()
        if not bool(output):
            return wj({"code":201,"msg":"未找到vmrest命令，请检查vmrest命令是否正确配置"})
        
        # 进行自动vmrest -C用户初始化
        vmrest_cfg = ["port=8697" ,
                    "username=admin" ,
                    "password=$2a$14$KwZcp/.PVvZlyrgR0Y9InelsHNmk9P.T3bb67oLgYNyuzH2N6XB3m" ,
                    "salt=YOnI~L{e=Yxo$Nj0"]
        
        if os.path.exists(f'{os.path.expanduser("~")}\\vmrest.cfg'):
            file = open(r"C:\Users\Lenovo\vmrest.cfg").read()
        else:
            # 都存在则表示vmrest.cfg已被初始化过
            if len([i for i in vmrest_cfg if i in file]) == 4:
                pass
            else:
                # 若初始用户不对则自动配置vmrest.cfg
                with open(f'{os.path.expanduser("~")}\\vmrest.cfg','w') as cfg:
                    cfg.write("\n".join(vmrest_cfg))
                    cfg.close()
        # 生成headers
        author = base64.b64encode('admin:@Admin1234'.encode('utf-8')).decode('utf-8')
        # global headers
        headers = {'Content-Type': 'application/vnd.vmware.vmw.rest-v1+json','Accept': 'application/vnd.vmware.vmw.rest-v1+json','Authorization': f'Basic {author}'}

    if not headers:
        return wj({"code":201,"msg":"未查找到可用的headers配置，自动初始化vmrest用户失败"})
    
    async with aiohttp.ClientSession() as session:
        req = await session.get(f"{vmrest}/api/vmnet",headers=headers)
        data = await req.json()
        print(data)
        if data.get("Message","") == "Authentication failed":
            return wj({"code":201,"msg":"用户验证失败"})
        else:
            return wj({"code":200,"msg":"登录成功"})


async def gateway(request):
    print(f'{vmrest}{request.rel_url}')
    data = await request.content.read()
    async with ClientSession() as session:
        # 发送请求并返回响应
        req = await session.request(request.method, f'{vmrest}{request.rel_url}', headers=headers, data=data)
        data = await req.text()
        try:
            return wj(data)
        except:
            return web.Response(text=await req.text(),status=req.status)
        


if __name__ == '__main__':
    vmrest = 'http://127.0.0.1:8697'
    app = web.Application()
    app.router.add_route('POST', '/login', login)
    app.router.add_route('POST', '/alogin', alogin)
    app.router.add_route('*', '/{tail:.*}', gateway)
    app.middlewares.append(options_middleware)
    web.run_app(app,port=8698,host='127.0.0.1')
