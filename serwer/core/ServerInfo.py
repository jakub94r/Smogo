
class ServerInfo:
    def __init__(self):
        self.name = ""
        self.url = ""
        self.apiKey = ""
        self.parser = ""

    def __str__(self):
        return "ServerInfo\n\tname:{}\n\turl:{}\n\tparser:{}\n".format(self.name, self.url, self.parser)