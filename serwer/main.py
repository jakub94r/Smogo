import json

import requests
from aiohttp import web
from aiohttp.web_response import Response

from core.DataGenerator import DataGenerator
from core.WebCrawler import WebCrawler
import logging

hostAddr = "127.0.0.1"
portNum = 8080

headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
}

webCrawler = WebCrawler()
webCrawler.loadConfigs("configs\servers.json")
webCrawler.loadAirlyInstallations("configs\AirlyInstallations.txt")
generator = DataGenerator()

def getStationListStringFromParams(data):
    params = data.split('&')
    lat = None
    lng = None
    maxDistanceKM = 5
    maxResults = -1


async def handle(request):
    return web.json_response(text=generator.generateJson())

async def defaultHandle(request):
    return web.Response(text="404: Not Found", headers=headers)


async def handshake(request):
    uuid = "3242fdko32fg23gf"
    data = {
        "uuid": uuid
    }
    jsonString = json.dumps(data)
    return web.json_response(text=jsonString, headers=headers)

async def getPostData(request):
    result = {}
    data = await request.text()
    data = data.split("&")
    for arg in data:
        attribute = arg.split("=")
        result[attribute[0]] = attribute[1]

    return result

async def handlePostData(request):
    if request.method == "OPTIONS":
        return web.json_response(text="[]", headers=headers)
    params = await request.text()
    data = webCrawler.getNearestStationList(params, "Airly")

    jsonString = json.dumps(data)

    response = web.json_response(text=jsonString, headers=headers)
    return response


async def handleGetStationList(request):
    data = request.match_info.get('data')
    if not data:
        return web.Response(text="ERROR: Invalid parameters.")

    serverName = None
    params = data.split('&')
    for param in params:
        if "server" in param:
            serverName = param.split('=')[1]

    if not serverName:
        serverName = "Airly"

    response = webCrawler.getNearestStationList(data, serverName)
    if not response:
        return web.Response(text="ERROR: Invalid parameters or server not found.")

    return web.json_response(response)

async def on_shutdown(app):
    webCrawler.stop()

app = web.Application()
app.add_routes(
    [

        web.route("*", '/postData', handlePostData),
        web.get('/', defaultHandle),
        web.get('/getStationList/{data}', handleGetStationList),
        web.get('/handshake', handshake),
        web.get('/getData', handle)

    ]
)
app.on_shutdown.append(on_shutdown(app))

webCrawler.start()
web.run_app(app, host=hostAddr, port=portNum)
