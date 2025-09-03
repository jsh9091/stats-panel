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
import { preferences } from "user-settings";
import { today as activity } from "user-activity";
import { me as appbit } from "appbit";

// Update the clock every second
clock.granularity = "minutes";

// Get a handle on the <text> elements
const minuteLabel = document.getElementById("minuteLabel");
const hourLabel = document.getElementById("hourLabel");
const dayOfWeekLabel = document.getElementById("dayOfWeekLabel");
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const stepCountLabel = document.getElementById("stepCountLabel");

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

    updateDayField(evt);
    updateDateFields(evt);
    updateSteps();
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
 * Updates steps count label.
 */
function updateSteps() {
    // handle case of user permission for step counts is not there
    if (appbit.permissions.granted("access_activity")) {
        stepCountLabel.text = getSteps().formatted;
    } else {
        stepCountLabel.text = "-----";
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