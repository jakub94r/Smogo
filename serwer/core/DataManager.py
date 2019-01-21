import codecs
import json
import re


class DataManager(object):
    def __init__(self, name, logger):
        self._config = {}
        self._name = name
        self._logger = logger

    def getName(self):
        return self._name

    def load(self, path):
        self._config = self._loadJsonFrom(path)

    def get(self, *args):
        configRef = self._config
        for i, key in enumerate(args):
            try:
                configRef = configRef[key]
            except:
                path = ''
                if i > 0:
                    path = "[{0}]".format("][".join(args[:i]))
                self._logger.warning("Key \"{0}\" not found in DataManager named \"{2}\" {1}".format(key, path, self.getName()))
                return None

        return configRef

    def _loadJsonFrom(self, pathToConfig):
        try:
            with codecs.open(pathToConfig, "r", encoding='utf-8', errors='ignore') as config:
                data = config.read()
                jsonFile = json.loads(data)
        except Exception as e:
            msg = "Couldn't load config {0}!\nException throw:\n{1}".format(pathToConfig, str(e))
            self._logger.error(msg)
            return {}
        return jsonFile