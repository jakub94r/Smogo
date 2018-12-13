import datetime
import json
import time
import requests

from core.AirData import AirData
from datetime import timedelta


class DataNormalizer(object):
    def __init__(self):
        self.__url = None
        self.__data = None
        self.__apiKey = None
        self.__lastRefresh = None

    def factory(type):
        if type == "AirlyParser":
            return AirlyParser()
        elif type == "GiosParser":
            return GiosParser()
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

    def prepareData(self, response, data):
        return

    def getParserType(self):
        return "Unknown/Invalid"

    @staticmethod
    def getLastFullHour():
        last_hour_date_time = datetime.datetime.now() - timedelta(hours=1)
        return last_hour_date_time.strftime('%Y-%m-%d %H:%M:%S')


class AirlyParser(DataNormalizer):
    def sendRequest(self, crawler):
        headers = {'Accept': 'application/json', 'apikey': self.getApiKey()}
        response = requests.get(self.getUrl(), headers=headers)

        with open('parsedData.json', 'w') as outfile:
            json.dump(response.json(), outfile, indent=4, sort_keys=True)

        data = AirData()
        self.prepareData(response, data)
        crawler.saveRequestData(self.getData())

    def prepareData(self, response, data):
        json = response.json()
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


class GiosParser(DataNormalizer):
    def sendRequest(self, crawler):
        sensors = [672, 658, 660, 665, 667, 670, 14395]

        data = AirData()
        data.parserType = self.getParserType()
        data.requestTime = datetime.datetime.now()
        data.measureTime = self.getLastFullHour()

        for sensor in sensors:
            response = requests.get(str.format("{0}{1}", self.getUrl(), sensor))
            self.prepareData(response, data)

        crawler.saveRequestData(self.getData())

    def prepareData(self, response, data):
        json = response.json()
        name = json["key"]
        values = json["values"]
        finalValue = None
        for value in values:
            measuredValue = value["value"]
            if measuredValue is not None:
                finalValue = measuredValue

        if finalValue is not None:
            data.values[name] = finalValue

    def getParserType(self):
        return "GiosParser"
