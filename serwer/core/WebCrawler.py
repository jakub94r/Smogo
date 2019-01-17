import json
import os
import threading

from core.ServerInfo import ServerInfo
from tools.Logger import Logger
from core.DataNormalizer import DataNormalizer

class WebCrawler:
    def __init__(self):
        self._servers = []
        self._initLogger()
        self.threadStop = threading.Event()
        self.crawlerThread = None # :type threading.Timer
        self.getServersData = threading.Lock()
        self._gatheredData = []
        self._aliveCounter = 0

    def _initLogger(self):
        self.logger = Logger()
        self.logger.setLoggingPath("logs/logs.log")

    def start(self):
        self._aliveCounter = 0
        self.threadStop.clear()
        self.logger.debug('Crawler Started.')
        self.crawlerThread = threading.Thread(target=self._listen)
        self.crawlerThread.start()

    def stop(self):
        self.threadStop.set()
        self.crawlerThread.join()
        self.logger.debug('Crawler Stopped.')

    def _listen(self):
        while not self.threadStop.is_set():
            try:
                self.getServersData.acquire()
                for serverInfo in self._servers:
                    self._queryServer(serverInfo)
                if self._servers:
                    self._aliveCounter += 1
            except Exception as e:
                self.logger.error(e)
            finally:
                self.getServersData.release()

    def _queryServer(self, serverInfo):
        parser = DataNormalizer().factory(serverInfo.parser)
        parser.setUrl(serverInfo.url)
        parser.setApiKey(serverInfo.apiKey)
        parser.sendRequest(crawler=self)

    def getNearestStationList(self, params, serverName):
        for serverInfo in self._servers:
            if serverInfo.name == serverName:
                parser = DataNormalizer.factory(serverInfo.parser)
                parser.setApiKey(serverInfo.apiKey)
                parser.setNearbyUrl(serverInfo.nearbyUrl)
                return parser.sendNearbyRequest(params)

        return None

    def saveRequestData(self, data):
        self._gatheredData.append(data)

    def loadConfigs(self, filepath):
        try:
            with open(filepath) as dataFile:
                serverList = json.load(dataFile)
        except:
            raise Exception("Couldn't load config from path: {}".format(filepath))
        try:
            self.getServersData.acquire()
            for server in serverList:
                info = ServerInfo()
                info.name = server["name"]
                info.url = server["url"]
                info.nearbyUrl = server["nearbyUrl"]
                info.apiKey = server["apiKey"]
                info.parser = server["parser"]
                self.logger.debug("Parsed: {}".format(str(info)))
                self._servers.append(info)
        except Exception as e:
            self.logger.error(e)
        finally:
            self.getServersData.release()


