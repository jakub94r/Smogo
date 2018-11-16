import json
import os

from core.DataNormalizer import DataNormalizer
from serwer.core.ServerInfo import ServerInfo

class WebCrawler:
    def __init__(self):
        self.__servers = []
        self.loadConfigs()
        self.crawlerThread = None

    def start(self):
        print('Crawler Started.')
        for serverInfo in self.__servers:
            self._queryServer(serverInfo)

    def stop(self):
        print('Crawler Stopped.')

    def _listen(self):
        pass

    def _queryServer(self, serverInfo):
        parser = DataNormalizer().factory(serverInfo.parser)
        parser.setUrl(serverInfo.url)
        parser.setApiKey(serverInfo.apiKey)
        parser.sendRequest()

    def loadConfigs(self):
        filename = "configs\servers.json"
        serverList = None
        with open(filename) as dataFile:
            serverList = json.load(dataFile)

        for server in serverList:
            info = ServerInfo()
            info.name = server["name"]
            info.url = server["url"]
            info.apiKey = server["apiKey"]
            info.parser = server["parser"]
            self.__servers.append(info)


