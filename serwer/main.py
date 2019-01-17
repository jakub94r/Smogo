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


async def handlePostData(request):
    data = [{"id": 204, "location": {"latitude": 50.062006, "longitude": 19.940984},
             "address": {"country": "Poland", "city": "Krak\u00f3w", "street": "Miko\u0142ajska", "number": "4B",
                         "displayAddress1": "Krak\u00f3w", "displayAddress2": "Miko\u0142ajska"}, "elevation": 220.38,
             "airly": True,
             "sponsor": {"id": 7, "name": "Krak\u00f3wOddycha", "description": "Airly Sensor is part of action",
                         "logo": "https://cdn.airly.eu/logo/KrakowOddycha.jpg", "link": None}},
            {"id": 58, "location": {"latitude": 50.057447, "longitude": 19.946008},
             "address": {"country": "Poland", "city": "Krak\u00f3w", "street": "Dietla", "number": "84",
                         "displayAddress1": "Krak\u00f3w", "displayAddress2": "Dietla"}, "elevation": 208.99,
             "airly": False, "sponsor": {"id": 11, "name": "State Environmental Monitoring Station", "description": "",
                                         "logo": "https://cdn.airly.eu/logo/GIOs.jpg", "link": None}},
            {"id": 1096, "location": {"latitude": 50.06448, "longitude": 19.931761},
             "address": {"country": "Poland", "city": "Krak\u00f3w", "street": "Karmelicka", "number": "16",
                         "displayAddress1": "Krak\u00f3w", "displayAddress2": "Karmelicka 14"}, "elevation": 212.22,
             "airly": True, "sponsor": {"id": 49, "name": "eurobank", "description": "Airly Sensor's sponsor",
                                        "logo": "https://cdn.airly.eu/logo/eurobank.jpg", "link": None}}]
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
