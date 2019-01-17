from core.Parsers.AirlyParser import AirlyParser


class ParserFactory(object):
    @staticmethod
    def factory(type):
        if type == "AirlyParser":
            return AirlyParser()
        raise Exception("Invalid factory parser type: {}".format(type))