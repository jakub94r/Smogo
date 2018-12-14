import json
import logging
import os
from unittest.mock import Mock

from robot.api.deco import keyword

from core.Parsers.AirlyParser import AirlyParser
from core.WebCrawler import WebCrawler
from ut.libraries.LoggerMock import LoggerMock


class AirlyParserMock(AirlyParser):
    def __init__(self):
        super().__init__()
        self.responseQueue = []

    def getCrawler(self):
        return Mock()

    def _sendRequest(self):
        response = self.responseQueue.pop(0)
        responseMock = Mock()
        responseMock.json = Mock()
        responseMock.json.return_value = response
        return responseMock

    def addResponseFromFile(self, path):
        try:
            with open(path, "r") as f:
                response = json.load(f)
        except:
            raise Exception("Loading response from \"{}\" failed".format(path))
        self.responseQueue.append(response)

    def isAirlyParser(self, element):
        return isinstance(element, AirlyParser)