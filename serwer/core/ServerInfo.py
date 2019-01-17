
class ServerInfo:
    def __init__(self):
        self.name = ""
        self.url = ""
        self.nearbyUrl = ""
        self.apiKey = ""
        self.parser = ""

    def __str__(self):
        return "ServerInfo\n\tname:{}\n\turl:{}\n\tnearbyUrl:{}\n\tparser:{}\n".format(self.name, self.url, self.nearbyUrl, self.parser)
