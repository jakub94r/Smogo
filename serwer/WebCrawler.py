import json
import os


class WebCrawler:
    def __init__(self):
        self.__servers = None
        self.loadConfigs()

    def start(self):
        print('Crawler Started.')

    def stop(self):
        print('Crawler Stopped.')

    def loadConfigs(self):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, 'configs\servers.json')
        with open(filename) as dataFile:
            self.__servers = json.load(dataFile)

