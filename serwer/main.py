from aiohttp import web

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(text=text)

async def helloWorld(app):
    print("Starting server, hello world :)")

app = web.Application()
app.on_startup.append(helloWorld)
app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

web.run_app(app)