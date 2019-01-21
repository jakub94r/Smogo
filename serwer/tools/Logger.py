import logging
from inspect import currentframe, getouterframes
import os


class Logger(object):
    def __init__(self):
        self.logger = logging.getLogger('serwerLogger')
        self.logger.setLevel(logging.DEBUG)
        self.path = None
        self._useDebug = True

    def setLoggingPath(self, path):
        self.logger.handlers.clear()
        if os.path.exists(path):
            if os.path.isdir(path):
                raise Exception("Path to file was expected, found: {}".format(path))
            try:
                os.remove(path)
            except:
                pass
        self.path = path
        fh = logging.FileHandler(path)
        fh.setLevel(logging.DEBUG)
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)
        fh.setFormatter(formatter)
        self.logger.addHandler(ch)
        self.logger.addHandler(fh)

    def info(self, message):
        if self._useDebug:
            message = self.addDebugInfo(message)
        self.logger.info(message)

    def debug(self, message):
        if self._useDebug:
            message = self.addDebugInfo(message)
        self.logger.debug(message)

    def addDebugInfo(self, message):
        curframe = currentframe()
        calframe = getouterframes(curframe, 4)
        return "[{}, line: {}]\t{}".format(
            "\\".join(calframe[2][1].split("\\")[-2:]),
            calframe[2][2],
            message
        )

    def error(self, message):
        if self._useDebug:
            message = self.addDebugInfo(message)
        self.logger.error(message)

    def warning(self, message):
        if self._useDebug:
            message = self.addDebugInfo(message)
        self.logger.warning(message)