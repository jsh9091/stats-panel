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

import clock from "clock";
import * as document from "document";
import { preferences, units } from "user-settings";
import { today as activity } from "user-activity";
import { me as appbit } from "appbit";
import { battery } from "power";
import * as newfile from "./newfile";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";

// Update the clock every second
clock.granularity = "minutes";

// Get a handle on the <text> elements
const minuteLabel = document.getElementById("minuteLabel");
const hourLabel = document.getElementById("hourLabel");
const hourShadow = document.getElementById("hourShadow");
const minuteShadow = document.getElementById("minuteShadow");
const dayOfWeekLabel = document.getElementById("dayOfWeekLabel");
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const stepCountLabel = document.getElementById("stepCountLabel");
const batteryLabel = document.getElementById("batteryLabel");
const batteryIcon = document.getElementById("batteryIcon");
const tempLabel = document.getElementById("tempLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const distanceLabel = document.getElementById("distanceLabel");
const calorieLabel = document.getElementById("calorieLabel");

/**
 * Update the display of clock values.
 * @param {*} evt 
 */
clock.ontick = (evt) => {

    // get time information from API
    let todayDate = evt.date;
    let rawHours = todayDate.getHours();
    let mins = todayDate.getMinutes();
    let displayMins = zeroPad(mins);

    let hours;
    if (preferences.clockDisplay === "12h") {
        // 12 hour format
        hours = rawHours % 12 || 12;
        // leading zeros for hour
        hours = zeroPad(hours);
    } else {
        // 24 hour format
        if (rawHours > 9) {
            hours = zeroPad(rawHours);
        } else {
            hours = rawHours;
        }
    }

    // display time on main clock
    hourLabel.text = `${hours}`;
    minuteLabel.text = `${displayMins}`;

    // update drop shadow
    hourShadow.text = hourLabel.text;
    minuteShadow.text = minuteLabel.text;

    updateDayField(evt);
    updateDateFields(evt);
    updateExerciseFields();
    updateBattery();
}

/**
 * Front appends a zero to an integer if less than ten.
 * @param {*} i 
 * @returns 
 */
function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/**
 * Updates day of week displayed. 
 * @param {*} evt 
 */
function updateDayField(evt) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let index = evt.date.getDay();
    dayOfWeekLabel.text = dayNames[index];
}

/**
 * Updates the month and year fields.
 * @param {*} evt 
 */
function updateDateFields(evt) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let month = monthNames[evt.date.getMonth()];
  let dayOfMonth = evt.date.getDate();
  let year = evt.date.getUTCFullYear();

  monthLabel.text = `${month}` + " " + `${dayOfMonth}`;
  yearLabel.text = `${year}`;
}

/**
 * Updates exercise fields in the GUI. 
 */
function updateExerciseFields() {
  if (appbit.permissions.granted("access_activity")) {
    stepCountLabel.text = getSteps().formatted;
    distanceLabel.text = getDistance();
    calorieLabel.text = getCalories().formatted;

  } else {
    stepCountLabel.text = "----";
    distanceLabel.text = "----";
    calorieLabel.text = "----";
  }
}

/**
 * Gets and formats user step count for the day.
 * @returns 
 */
function getSteps() {
    let val = activity.adjusted.steps || 0;
    return {
        raw: val,
        formatted:
            val > 999
                ? `${Math.floor(val / 1000)},${("00" + (val % 1000)).slice(-3)}`
                : val,
    };
}

/**
 * Calculates distance values for display based on user settings.
 * @returns 
 */
function getDistance() {
  let val = activity.adjusted.distance || 0;
  let suffix;

  if (units.distance === "metric") {
    let km = val / 1000;

    // if user walked at least 100 km
    if (Math.floor(km) >= 100) {
      // get value that is a whole number
      val = Math.floor(km)
    } else {
      // we have room for one decimal number
      val = km.toFixed(1);
    }
    suffix = " k"

  } else {
    // distance setting is miles
    let mi = val * 0.000621371192;

    // if user walked at least 100 miles
    if (Math.floor(mi) >= 100) {
      // get value that is a whole number
      val = Math.floor(mi)
    } else {
      // we have room for one decimal number
      val = mi.toFixed(1);
    }
    suffix = " m"
  }

  return val + suffix;
}

/**
 * Gets and formats user calories burned for the day.
 * @returns
 */
function getCalories() {
  let val = activity.adjusted.calories || 0;
  return {
    raw: val,
    formatted:
      val > 999
        ? `${Math.floor(val / 1000)},${("00" + (val % 1000)).slice(-3)}`
        : val,
  };
}

/**
 * Update the displayed battery level. 
 * @param {*} charger 
 * @param {*} evt 
 */
battery.onchange = (charger, evt) => {
  updateBattery();
};

/**
 * Updates the battery battery icon and label.
 */
function updateBattery() {
  updateBatteryLabel();
  updateBatteryIcon();
}

/**
 * Updates the battery lable GUI for battery percentage. 
 */
function updateBatteryLabel() {
  let percentSign = "&#x25";
  batteryLabel.text = battery.chargeLevel + percentSign;
}

/**
 * Updates what battery icon is displayed. 
 */
function updateBatteryIcon() {
  const minFull = 70;
  const minHalf = 30;
  
  if (battery.charging) {
    batteryIcon.image = "battery-charging.png"
  } else if (battery.chargeLevel > minFull) {
    batteryIcon.image = "battery-full.png"
  } else if (battery.chargeLevel < minFull && battery.chargeLevel > minHalf) {
    batteryIcon.image = "battery-half.png"
  } else if (battery.chargeLevel < minHalf) {
    batteryIcon.image = "battery-low.png"
  }
}

/**
 * Receive and process new tempature data. 
 */
newfile.initialize(data => {
  if (appbit.permissions.granted("access_location")) {
    
    data = units.temperature === "C" ? data : toFahrenheit(data);
    let degreeSymbol = "\u00B0";
    let lettertMarker = units.temperature === "C" ? `C` : `F`;
    
    // set values in GUI
    tempLabel.text = `${data.temperature}` + degreeSymbol + lettertMarker;
  } else {
    tempLabel.text = "----";
  }
});

/**
* Convert temperature value to Fahrenheit
* @param {object} data WeatherData
*/
function toFahrenheit(data) {
  if (data.unit.toLowerCase() === "celsius") {
     data.temperature =  Math.round((data.temperature * 1.8) + 32);
     data.unit = "Fahrenheit";
  }
  return data
}

////////////////////////
// HeartRateSensor code
////////////////////////
// default value for heart rate label
heartRateLabel.text = "---";

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  if (HeartRateSensor) {
    let hrm = new HeartRateSensor();

    hrm.onreading = function () {
      // Peek the current sensor values
      heartRateLabel.text = hrm.heartRate;
    }

    display.addEventListener("change", () => {
      // Automatically stop the sensor when the screen is off to conserve battery
      display.on ? hrm.start() : hrm.stop();
    });
    hrm.start();

    // And update the display every 1 second
    setInterval(hrm.onreading, 1000);
  }
}
