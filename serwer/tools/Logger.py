import logging

import os


class Logger(object):
    def __init__(self):
        self.logger = logging.getLogger('serwerLogger')
        self.logger.setLevel(logging.DEBUG)
        self.path = None

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
        ch.setLevel(logging.ERROR)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)
        fh.setFormatter(formatter)
        self.logger.addHandler(ch)
        self.logger.addHandler(fh)

    def info(self, message):
        self.logger.info(message)

    def debug(self, message):
        self.logger.debug(message)

    def error(self, message):
        self.logger.error(message)

    def warning(self, message):
        self.logger.warning(message)