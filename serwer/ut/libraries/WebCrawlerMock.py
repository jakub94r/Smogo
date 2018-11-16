import logging
import os

from robot.api.deco import keyword
from core.WebCrawler import WebCrawler
from ut.libraries.LoggerMock import LoggerMock


class WebCrawlerMock(WebCrawler):
    def _initLogger(self):
        self.logger = LoggerMock()

    def _queryServer(self, serverInfo):
        pass

    def getAliveCounter(self):
        return self._aliveCounter