from aiohttp import web

async def handle(request):
    return web.json_response(text="{}")

async def defaultHandle(request):
    return web.Response(text="404: Not Found")

app = web.Application()
app.add_routes([web.get('/', defaultHandle),
                web.get('/getData', handle)])

web.run_app(app, host="127.0.0.1", port=8080)
