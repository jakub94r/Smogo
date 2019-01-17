import datetime
import json
import time
import requests

class AbstractParser(object):
    def __init__(self):
        self._url = None
        self._data = None
        self._apiKey = None
        self._lastRefresh = None

    def __normalize(self, data):
        self._data = data

    def refresh(self):
        self._lastRefresh = time.time()

    def setUrl(self, url):
        self._url = url

    def getUrl(self):
        return self._url

    def setApiKey(self, apiKey):
        self._apiKey = apiKey

    def getApiKey(self):
        return self._apiKey

    def getData(self):
        return self._data

    def sendRequest(self, crawler):
        return

    def prepareData(self, response):
        return

    def getParserType(self):
        return "Unknown/Invalid"