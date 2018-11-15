import json
import os

from serwer.core.ServerInfo import ServerInfo

class WebCrawler:
    def __init__(self):
        self.__servers = []
        self.loadConfigs()
        self.crawlerThread = None

    def start(self):
        print('Crawler Started.')

    def stop(self):
        print('Crawler Stopped.')

    def _listen(self):
        pass

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


