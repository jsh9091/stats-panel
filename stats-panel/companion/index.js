/*
 * MIT License
 *
 * Copyright (c) 2025 Joshua Horvath
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";
import { weather } from "weather";
import { dataFile, wakeTime } from "../common/constants";

/**
 * Update tempature data from phone. 
 */
function refreshData() {
  weather
    .getWeatherData()
    .then((data) => {
      if (data.locations.length > 0) {
        sendData({
          temperature: Math.floor(data.locations[0].currentWeather.temperature),
          unit: data.temperatureUnit,
        });
      } else {
        console.warn("No data for this location.");
      }
    })
    .catch((ex) => {
      console.error(ex);
    });
}

/**
 * Send data from phone to watch. 
 * @param {*} data
 */
function sendData(data) {
  outbox.enqueue(dataFile, cbor.encode(data)).catch((error) => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}

if (companion.permissions.granted("access_location")) {
  // Refresh on companion launch
  refreshData();

  // Schedule a refresh every 30 minutes
  companion.wakeInterval = wakeTime;
  companion.addEventListener("wakeinterval", refreshData);
} else {
  console.error("This app requires the access_location permission.");
}

