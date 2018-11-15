import logging
import os

from robot.api.deco import keyword

from tools.Logger import Logger


class LoggerMock(Logger):
    def __init__(self):
        super().__init__()
        logging.getLogger().handlers.clear()

    def setOutputFilePathTo(self, path):
        self.setLoggingPath(path)

    def getLinesFromLog(self, path):
        return open(path, "r").readlines()

    @keyword('get lines from list ${lines} with ${pattern}')
    def grepLinesWith(self, lines, pattern):
        return list(filter(lambda x: pattern in x, lines))

    def clear(self):
        if self.path is not None:
            try:
                self.logger.handlers.clear()
            except:
                pass
            try:
                os.remove(self.path)
            except Exception as e:
                pass