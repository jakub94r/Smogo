import kdtree
from math import radians, sin, cos, atan2, sqrt

import time

from core.DataManager import DataManager
from core.StationInfo import StationInfo


class StationManager(object):
    def __init__(self, logger):
        self._logger = logger
        dataManager = DataManager("StationInfo", logger=logger)
        dataManager.load("data/stationInfo.json")

        stations = dataManager.get("stations")
        pointsList = []
        for station in stations:
            stationInfo = StationInfo(
                station["location"]["latitude"],
                station["location"]["longitude"],
                station
            )
            pointsList.append(stationInfo)
        self._size = len(pointsList)
        self._data = kdtree.create(pointsList)
        self._lastMeasureTime = None
        self._lastMeasurement = []
        self._stationToMeasure = {}
        self.getCurrentMeasurement()

    def getMeasureForLocation(self, latitude, longitude):
        point = StationInfo(latitude, longitude, {"description": "myGeo"})
        result = self._data.search_knn(point, 1, self._distance)

        if result:
            return result[0][0].data.data

        return {
        }

    def getNearStations(self, latitude, longitude, radius, limit):
        point = StationInfo(latitude, longitude, {"description": "myGeo"})
        if limit == -1:
            limit = self._size

        stations = self._data.search_knn(point, limit, self._distance)

        stationsResult = []

        for result in stations:
            if result[1] < radius:
                stationsResult.append(result[0].data.data)

        return {
            "percentage": 0,
            "measurement": []
        }

    def _distance(self, a, b):
        R = 6373.0

        lat1 = radians(a[0])
        lon1 = radians(a[1])
        lat2 = radians(b[0])
        lon2 = radians(b[1])

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = R * c

        return distance

    def getCurrentMeasurement(self):
        if self._lastMeasureTime and not (time.time() - self._lastMeasureTime) < 60 * 60:
            return self._lastMeasurement

        self._lastMeasureTime = time.time()

        currentData = DataManager("CurrentMeasurement", self._logger)
        currentData.load("data/currentMeasurement.json")

        standardsJson = DataManager("StandardsAirQuality", self._logger)
        standardsJson.load("data/standards.json")
        standards = standardsJson.get()

        maxAirIndex = -1
        airStatus = "No data"

        self._lastMeasurement = []
        self._stationToMeasure = {}

        for stationMeasure in currentData.get():
            measurement = []
            maxLocalPercentage = 0
            if not ("measurements" in stationMeasure and "current" in stationMeasure["measurements"] and "values" in stationMeasure["measurements"]["current"]):
                continue
            for parameter in stationMeasure["measurements"]["current"]["values"]:
                if parameter["name"] in standards:
                    status, percentage, value, airIndex = self._calculateAirIndex(parameter["value"], standards[parameter["name"]])
                    if airIndex > maxAirIndex:
                        maxAirIndex = airIndex
                        airStatus = status

                    if percentage > maxLocalPercentage:
                        maxLocalPercentage = percentage

                    measurement.append(
                        {
                            "name": parameter["name"],
                            "status": status,
                            "percentage": percentage,
                            "value": value,
                            "airIndex": airIndex
                        }
                    )
            self._lastMeasurement.append(
                {
                    "id": stationMeasure["installationId"],
                    "percentage": maxLocalPercentage,
                    "measurement": measurement
                }
            )
        self._lastMeasurement.sort(key=lambda x: x["percentage"])

        for id, measurement in enumerate(self._lastMeasurement):
            self._stationToMeasure[measurement["id"]] = id

        return self._lastMeasurement

    def _calculateAirIndex(self, value, standards):
        index = -1

        for id, standard in enumerate(standards):
            if standard["limit"] < value:
                continue
            index = id
            break

        airIndex = index
        if airIndex == -1:
            airIndex = len(standards) - 1

        return standards[index]["status"], 100 * (float(value) / float(standards[1]["limit"])), value, airIndex


