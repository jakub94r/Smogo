import datetime
import json
import time
import requests

from core.AirData import AirData


class DataNormalizer(object):
    def __init__(self):
        self.__url = None
        self.__data = None
        self.__apiKey = None
        self.__lastRefresh = None

    def factory(type):
        if type == "AirlyParser":
            return AirlyParser()
        raise Exception("Invalid factory parser type: {}".format(type))
    factory = staticmethod(factory)

    def __normalize(self, data):
        self.__data = data

    def refresh(self):
        self.__lastRefresh = time.time()

    def setUrl(self, url):
        self.__url = url

    def getUrl(self):
        return self.__url

    def setApiKey(self, apiKey):
        self.__apiKey = apiKey

    def getApiKey(self):
        return self.__apiKey

    def getData(self):
        return self.__data

    def sendRequest(self, crawler):
        return

    def prepareData(self, response):
        return

    def getParserType(self):
        return "Unknown/Invalid"

class AirlyParser(DataNormalizer):
    def sendRequest(self, crawler):
        headers = {'Accept': 'application/json', 'apikey': self.getApiKey()}
        response = requests.get(self.getUrl(), headers=headers)

        with open('parsedData.json', 'w') as outfile:
            json.dump(response.json(), outfile, indent=4, sort_keys=True)

        self.prepareData(response)
        crawler.saveRequestData(self.getData())

    def prepareData(self, response):
        json = response.json()
        data = AirData()
        data.parserType = self.getParserType()
        data.requestTime = datetime.datetime.now()
        data.measureTime = json["current"]["fromDateTime"]
        values = json["current"]["values"]
        for value in values:
            name = value["name"]
            val = value["value"]
            data.values[name] = val

    def getParserType(self):
        return "AirlyParser"


