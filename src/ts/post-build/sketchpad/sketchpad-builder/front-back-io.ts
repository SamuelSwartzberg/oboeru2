function saveFrontToBack(name: string, value: string) {
  try {
    sessionStorage.setItem(name, value); // for one platform session storage works
  } catch (e) {
    window[name] = value; // for another plattform saving on the window object works
  }
}

function loadFromFront(name, isArray, preserve) {
  try {
    var tempSessionStorageItem;
    try {
      tempSessionStorageItem = sessionStorage.getItem(name);
      if (typeof tempSessionStorageItem === "string" && isArray) {
        tempSessionStorageItem = tempSessionStorageItem.split(",");
      }
      if (!preserve) {
        sessionStorage.setItem(name, "");
      }
    } catch (e) {
      try {
        tempSessionStorageItem = window[name];
        if (!preserve) {
          window[name] = "";
        }
        if (typeof tempSessionStorageItem === "string" && isArray) {
          tempSessionStorageItem = tempSessionStorageItem.split(",");
        }
      } catch (err) {
        console.log(
          "When trying to load " +
            name +
            " a fatal error was encountered:\n" +
            err
        );
      }
    }
    return tempSessionStorageItem;
  } catch (e) {
    console.log(e + "Name was undefined or null.");
  }
}
function saveSketchpad(value: string) {
  saveFrontToBack("sketchpad", value);
}
function loadSketchpad() {
  loadFromFront("sketchpad", false, true);
}
