import datetime

import requests

from core.AirData import AirData
from core.Parsers.AbstractParser import AbstractParser


class AirlyParser(AbstractParser):
    def _sendRequest(self):
        headers = {'Accept': 'application/json', 'apikey': self.getApiKey()}
        return requests.get(self.getUrl(), headers=headers)

    def sendRequest(self, crawler):
        response = self._sendRequest()
        self.prepareData(response)
        crawler.saveRequestData(self.getData())

    def prepareData(self, response):
        json = response.json()
        self._data = AirData()
        self._data.parserType = self.getParserType()
        self._data.requestTime = datetime.datetime.now()
        self._data.measureTime = json["current"]["fromDateTime"]
        values = json["current"]["values"]
        for value in values:
            name = value["name"]
            val = value["value"]
            self._data.values[name] = val

    def getParserType(self):
        return "AirlyParser"


