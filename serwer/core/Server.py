import threading

import os
from aiohttp import web
import asyncio

from core.StationManager import StationManager


class Server(object):
    def __init__(self, hostAddr, port, logger):
        self._headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }

        self.hostAddr = hostAddr
        self.port = int(port)
        self.app = web.Application()
        self._thread = None
        self._logger = logger
        self._server = None
        self.loop = asyncio.get_event_loop()
        self._started = False
        self._stationManager = StationManager(logger)
        self.app.add_routes(
            [
                web.route("*", '/register/{uuid}', self.registerHandler),
                web.route("*", '/getLocationAirInfo/{lat}/{long}', self.getLocationAirInfoHandler),
                web.route("*", '/getNearStations/{lat}/{long}/{radius}/{limit}', self.getNearStationsHandler),
                web.route("*", '/getStationRanking/{order}/{limit}/{notEmpty}', self.getStationRankingHandler),
            ]
        )
        # self.app.on_shutdown.append(on_shutdown(app))

    def _generateJson(self, data):
        return web.json_response(data, headers=self._headers)

    def registerHandler(self, request):
        try:
            uuidFromUrl = request.match_info.get('uuid')
            uuid = self._generateUuid(uuidFromUrl)
        except:
            uuid = -1

        data = {
            "uuid": uuid
        }

        if uuid == -1:
            data["error"] = "Missing parameter id!"

        return self._generateJson(data)

    def getLocationAirInfoHandler(self, request):
        data = {}
        try:
            latitude = float(request.match_info.get('lat'))
            longitude = float(request.match_info.get('long'))
        except:
            data["error"] = "Missing parameters!"
            return self._generateJson(data)

        measure = self._stationManager.getMeasureForLocation(latitude, longitude)

        return self._generateJson(measure)

    def getNearStationsHandler(self, request):
        data = {}
        try:
            latitude = float(request.match_info.get('lat'))
            longitude = float(request.match_info.get('long'))
            limit = int(request.match_info.get('limit'))
            radius = float(request.match_info.get('radius'))
        except:
            data["error"] = "Missing parameters!"
            return self._generateJson(data)

        stations = self._stationManager.getNearStations(latitude, longitude, radius, limit)

        return self._generateJson(stations)

    def getStationRankingHandler(self, request):
        data = {}
        try:
            order = request.match_info.get('order').lower()
            limit = int(request.match_info.get('limit'))
        except:
            data["error"] = "Missing parameters!"
            return self._generateJson(data)

        try:
            notEmpty = int(request.match_info.get('notEmpty')) == 1
        except:
            notEmpty = False

        ranking = self._stationManager.getCurrentMeasurement()

        if order == "desc":
            ranking = ranking[::-1]

        if notEmpty:
            ranking = list(filter(lambda x: x["measurement"], ranking))

        if limit != -1:
            ranking = ranking[:limit]

        return self._generateJson(ranking)

    def start(self):
        self._logger.debug("Start received, trying to startup server on {0}:{1}".format(self.hostAddr, self.port))
        try:
            handler = self.app.make_handler()
            self._server = self.loop.create_server(handler, host=self.hostAddr, port=self.port)
            self._thread = threading.Thread(target=self._listener)
            self._thread.start()
        except Exception as e:
            self._logger.error("Error occured during starting server with message: \"{0}\"".format(e))
            return False

        return True

    def _listener(self):
        self._logger.debug("Started server on {0}:{1}".format(self.hostAddr, self.port))
        if not self._started:
            self._started = True
            self.loop.run_until_complete(self._server)
            self.loop.run_forever()

    def isRunning(self):
        return self._started

    def stop(self):
        self._logger.debug("Stop received, trying to shutdown server")
        self.loop.stop()
        self._server.close()
        if self._started:
            self._started = False

    def _generateUuid(self, uuidFromUrl):
        return uuidFromUrl

