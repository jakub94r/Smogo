import hashlib

from datetime import datetime


class HashGenerator:
    def generateHash(self, string):
        timeStr = datetime.now().strftime("%I:%M%p on %B %d, %Y")
        m = hashlib.md5()
        m.update(string.encode('utf-8'))
        m.update(timeStr.encode('utf-8'))
        return m.hexdigest()
