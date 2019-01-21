class StationInfo(object):
    def __init__(self, x, y, data):
        self.coords = (x, y)
        self.data = data

    def __len__(self):
        return len(self.coords)

    def __getitem__(self, i):
        return self.coords[i]

    def __repr__(self):
        return 'SationInfo({}, {}, {})'.format(self.coords[0], self.coords[1], self.data)