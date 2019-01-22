from core.Server import Server
from tools.Logger import Logger

logger = Logger()
logger.setLoggingPath("mainServer.log")
hostAddr = "192.168.43.147"
server = Server(hostAddr=hostAddr, port=8080, logger=logger)

server.start()

while True:
    try:
        data = int(input("Type in 0 to close server"))
    except:
        data = 1
    if data == 0:
        break

server.stop()