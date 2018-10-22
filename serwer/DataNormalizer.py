import time

class DataNormalizer(object):
    def __init__(self):
        self.__url = None
        self.__data = None
        self.__lastRefresh = None

    def __normalize(self, data):
        self.__data = data

    def refresh(self):
        self.__lastRefresh = time.time()

    def setUrl(self, url):
        self.__url = url

    def getUrl(self):
        return self.__url

    def getData(self):
        return self.__data

