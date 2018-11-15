from aiohttp import web

from core.DataGenerator import DataGenerator
from core.WebCrawler import WebCrawler
import logging

hostAddr = "127.0.0.1"
portNum = 8080

webCrawler = WebCrawler()
generator = DataGenerator()

async def handle(request):
    return web.json_response(text=generator.generateJson())

async def defaultHandle(request):
    return web.Response(text="404: Not Found")

async def on_shutdown(app):
    webCrawler.stop()

app = web.Application()
app.add_routes(
    [
        web.get('/', defaultHandle),
        web.get('/getData', handle)
    ]
)
app.on_shutdown.append(on_shutdown(app))

webCrawler.start()
web.run_app(app, host=hostAddr, port=portNum)
