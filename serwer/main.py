from aiohttp import web
from serwer.WebCrawler import WebCrawler

webCrawler = WebCrawler()

async def handle(request):
    return web.json_response(text="{}")

async def defaultHandle(request):
    return web.Response(text="404: Not Found")

async def on_shutdown(app):
    webCrawler.stop()

app = web.Application()
app.add_routes([web.get('/', defaultHandle), web.get('/getData', handle)])
app.on_shutdown.append(on_shutdown(app))

web.run_app(app, host="127.0.0.1", port=8080)
