import random
import json

class DataGenerator:
    def generateData(self, name, pctValueMin, pctValueMax, minRawValue, maxRawValue, status, co2=False):
        value = random.randint(pctValueMin, pctValueMax)
        if co2:
            value = float("{0:.1f}".format(value * 0.1))
        return {"name": name, "value": value, "raw_value": random.randint(minRawValue, maxRawValue), "status": status}

    def generateJson(self):
        entry = {"name": "YOUR_GEO"}
        data = [self.generateData("PM10", 5, 10, 10, 15, "verygood"),
                self.generateData("PM2.5", 20, 25, 15, 25, "good"),
                self.generateData("SO2", 30, 50, 24, 30, "medium"),
                self.generateData("O3", 38, 48, 30, 40, "bad"),
                self.generateData("NO2", 70, 80, 50, 70, "verybad"),
                self.generateData("CO2", 4, 8, 450, 500, "verygood", True),
                self.generateData("C6H6", 1, 2, 1, 3, "verygood")]
        entry["data"] = data
        return json.dumps(entry)
