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

import * as messaging from "messaging";
import { settingsStorage } from "settings";

const KEY_COLOR = "color";
const KEY_LEADING_ZERO = "leadingzero";

/**
 * Establishes values for default settings on fresh install.
 */
export function setDefaultSettings() {
  setDefaultSetting(KEY_COLOR, "green");
  setDefaultSetting(KEY_LEADING_ZERO, true);
}

/**
 * If the given key does not have a value set for display 
 * on phone settings screen, then the provided value is set. 
 * This only affects what is set as selection on phone screen, 
 * does not communicate to watch, so default setting must be 
 * manually matched in watch "app" code. 
 * @param {*} key 
 * @param {*} value 
 */
function setDefaultSetting(key, value) {
  // get the actual currently set value 
  let extantValue = settingsStorage.getItem(key);
  if (extantValue === null) {
    // we don't have set selected item, so set the default
    settingsStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * Initializes getting of settings and processing inputs. 
 */
export function initialize() {
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {

      let newValue = "";
      if (evt.key == KEY_COLOR) {
        newValue = evt.newValue;

      } else if (evt.key == KEY_LEADING_ZERO) {
        newValue = evt.newValue;
      }

      sendValue(evt.key, newValue);
    }
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
