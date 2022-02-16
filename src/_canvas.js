if (document.body.globalOptions.sketchpad) {
  /* former anki_globals code*/
  function checkParams() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null) {
        throw (
          "This function expected a non-null or undefined parameter, but recieved a parameter that was " +
          arguments[i] +
          "\n"
        );
      }
    }
  }
  function saveFrontToBack(name, value) {
    try {
      checkParams(name, value);
      try {
        sessionStorage.setItem(name, value);
      } catch (e) {
        try {
          window[name] = value;
        } catch (e) {
          console.log(
            "When trying to save " +
              name +
              " with the value " +
              value +
              " a fatal error was encountered:\n" +
              e
          );
        }
      }
    } catch (e) {
      console.log(e + "Name or value was undefined or null.");
    }
  }
  function loadFromFront(name, isArray, preserve) {
    try {
      checkParams(name);
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
  function isFront() {
    return !document.querySelector("#back-indicator-token");
  }
  function getGenericErrorMessage(err) {
    var errorMessage =
      "Encountered an error while executing code involving these variables:\n";
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null) {
        errorMessage += arguments[i];
      } else {
        if (typeof arguments[i] === "object") {
          errorMessage += JSON.stringify(arguments[i]);
        } else {
          errorMessage += arguments[i];
        }
      }
      errorMessage += "\n";
    }
    errorMessage += "This is the error message:\n" + err;
    return errorMessage;
  }
  function switchDisplayStates(element, state1, state2) {
    return function (e) {
      var elementTemp;
      try {
        elementTemp = document.querySelector(element);
        if (elementTemp.style.display == state1) {
          elementTemp.style.display = state2;
        } else {
          elementTemp.style.display = state1;
        }
      } catch (err) {
        console.log(
          getGenericErrorMessage(err, element, state1, state2, elementTemp)
        );
      }
    };
  }
  function setStrokeWidth(strokeWidthPassing) {
    return function () {
      strokeWidth = strokeWidthPassing;
    };
  }

  function saveImage() {
    saveFrontToBack("sketchpad", canvas.toDataURL("image/png"));
  }

  document.querySelector("#canvas-script").parentNode.after(
    ` <div class="sketchpad-container">
<div class="sketchpad-container__control-container">
  <div class="color-picker-toggle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 1024 1024"
      xml:space="preserve"
    >
      <g>
        <g>
          <path
            d="M799,570.6c0,14.8-1,29.7-3,44.4c0.5-3.5,1-7.1,1.4-10.6c-3.9,28.5-11.6,56.4-22.7,82.9    c1.3-3.2,2.7-6.4,4-9.6c-11,25.9-25.3,50.2-42.4,72.5c2.1-2.7,4.2-5.4,6.3-8.1c-17.1,22.1-37,41.9-59,59c2.7-2.1,5.4-4.2,8.1-6.3    c-22.3,17.2-46.6,31.4-72.5,42.4c3.2-1.3,6.4-2.7,9.6-4c-26.5,11.2-54.4,18.8-82.9,22.7c3.5-0.5,7.1-1,10.6-1.4    c-29.4,3.9-59.3,3.9-88.7,0c3.5,0.5,7.1,1,10.6,1.4c-28.5-3.9-56.4-11.6-82.9-22.7c3.2,1.3,6.4,2.7,9.6,4    c-25.9-11-50.2-25.3-72.5-42.4c2.7,2.1,5.4,4.2,8.1,6.3c-22.1-17.1-41.9-37-59-59c2.1,2.7,4.2,5.4,6.3,8.1    c-17.2-22.3-31.4-46.6-42.4-72.5c1.3,3.2,2.7,6.4,4,9.6c-11.2-26.5-18.8-54.4-22.7-82.9c0.5,3.5,1,7.1,1.4,10.6    c-3.9-29.3-3.9-58.9-0.1-88.2c-0.5,3.5-1,7.1-1.4,10.6c3.9-28.7,11.6-56.8,22.8-83.5c-1.3,3.2-2.7,6.4-4,9.6    c11.1-26.1,25.5-50.6,42.8-73c-2.1,2.7-4.2,5.4-6.3,8.1c15.3-19.6,32.6-37.5,50.2-55c21-21,42.5-41.3,64.3-61.4    c39-36,78.7-71.2,118.8-106c8.4-7.3,16.8-14.5,25.3-21.7c-18.9,0-37.7,0-56.6,0c23.8,20.3,47.4,40.9,70.8,61.6    c44.2,39.1,88,78.7,130,120.1c20.1,19.9,40.2,40.1,57.6,62.4c-2.1-2.7-4.2-5.4-6.3-8.1c17.3,22.4,31.7,46.9,42.8,73    c-1.3-3.2-2.7-6.4-4-9.6c11.2,26.7,18.9,54.8,22.8,83.5c-0.5-3.5-1-7.1-1.4-10.6C798,541.3,799,555.9,799,570.6    c0.1,20.9,18.4,41,40,40c21.6-1,40.1-17.6,40-40c-0.2-61.8-15.8-123-45.5-177.2c-20.8-37.9-49.3-70.5-79.6-101.1    c-28-28.4-57.2-55.6-86.7-82.5c-27.5-25.1-55.3-49.9-83.4-74.4c-14.2-12.4-28.5-24.9-42.9-37.1c-0.2-0.2-0.4-0.3-0.6-0.5    c-7.9-6.7-17.5-12.2-28.3-11.7c-11.1,0.5-19.8,4.5-28.3,11.7c-17.6,15-35,30.2-52.4,45.4c-36.7,32.2-73,64.7-108.6,98.1    c-32,30-64.8,60.3-92.5,94.4c-12.6,15.4-24.4,31.5-34.5,48.6c-10.1,17.1-18.3,35.1-25.7,53.5c-14.2,35.2-21.7,72.8-24.3,110.6    c-4.3,65.1,10.1,130.7,39.3,188.8c27.7,55.1,70.2,101.8,120.7,136.8c51.9,36,113,56.3,175.6,62.1c64.1,6,128.4-6.8,186.7-33.5    c56.3-25.7,103.7-67,140.6-116.3c18.7-25,32.8-52.2,44.6-81c12.1-29.6,19-60.2,23-91.8c1.8-14.3,2.8-28.6,2.8-43    c0-20.9-18.4-41-40-40C817.3,531.6,799,548.2,799,570.6z"
          />
        </g>
      </g>
      <g>
        <path
          d="M839,570.6c0,180.6-146.4,327-327,327V126.2c0,0,192.5,163.8,252.5,236.7C811,419.3,839,491.7,839,570.6z"
        />
      </g>
    </svg>
  </div>
  <div id="stroke-size-small">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 30"
      xml:space="preserve"
    >
      <circle cx="50%" cy="50%" r="15" />
    </svg>
  </div>
  <div id="stroke-size-medium">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 50"
      xml:space="preserve"
    >
      <circle cx="50%" cy="50%" r="25" />
    </svg>
  </div>
  <div id="stroke-size-large">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 90"
      xml:space="preserve"
    >
      <circle cx="50%" cy="50%" r="45" />
    </svg>
  </div>
</div>
<canvas id="sketchpad"></canvas>
</div>
<div class="color-picker">
<div class="color-picker__color" style="--selection-color: red">&nbsp;</div>
<div class="color-picker__color" style="--selection-color: yellow">
  &nbsp;
</div>
<div class="color-picker__color" style="--selection-color: green">
  &nbsp;
</div>
<div class="color-picker__color" style="--selection-color: blue">
  &nbsp;
</div>
<div class="color-picker__color" style="--selection-color: black">
  &nbsp;
</div>
<div class="color-picker__color" style="--selection-color: white">
  &nbsp;
</div>
</div>

</div>`
  );

  //Code for canvas
  /* Variables for referencing the canvas and 2dcanvas context */ var canvas,
    ctx;
  /* Variables to keep track of the mouse position and left-button status*/ var mouseX,
    mouseY,
    mouseDown = 0;
  /*Variables to keep track of the touch position*/ var touchX, touchY;
  /* Keep track of the old/last position when drawing a line - We set it to -1 at the start to indicate that we don't have a good value for it yet*/ var lastX,
    lastY = -1;
  var strokeColor = "rgba(0,0,0,1)";
  var strokeWidth = 3;

  //Drawing functions

  // Draws a line between the specified position on the supplied canvas name
  // Parameters are: A canvas context, the x position, the y position, the size of the dot
  function drawLine(ctx, x, y) {
    if (lastX == -1) {
      lastX = x;
      lastY = y;
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    ctx.closePath();
    lastX = x;
    lastY = y;
  }

  function sketchpad_mouseDown() {
    mouseDown = 1;
    drawLine(ctx, mouseX, mouseY);
  } // Keep track of the mouse button being pressed and draw a dot at current location
  function sketchpad_mouseUp() {
    mouseDown = 0;
    lastX = -1;
    lastY = -1;
    saveImage();
  }
  function sketchpad_mouseMove(e) {
    getMousePos(e);
    if (mouseDown == 1) {
      drawLine(ctx, mouseX, mouseY);
    }
  }
  function getMousePos(e) {
    if (!e) var e = event;
    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
      console.log("offset");
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
      console.log("layer");
    }
  }

  function sketchpad_touchStart() {
    getTouchPos();
    drawLine(ctx, touchX, touchY);
    event.preventDefault();
  }
  function sketchpad_touchEnd() {
    lastX = -1;
    lastY = -1;
    saveImage();
  }
  function sketchpad_touchMove(e) {
    getTouchPos(e);
    drawLine(ctx, touchX, touchY);
    event.preventDefault();
  }
  function getTouchPos(e) {
    if (!e) var e = event;
    if (e.touches) {
      if (e.touches.length == 1) {
        // Only deal with one finger
        var touch = e.touches[0]; // Get the information for finger #1
        touchX = touch.pageX - touch.target.offsetLeft;
        touchY = touch.pageY - touch.target.offsetTop;
      }
    }
  }

  canvas = document.getElementById("sketchpad");
  ctx = canvas.getContext("2d");

  if (ctx) {
    canvas.width = document.querySelector(".sketchpad-container").offsetWidth;
    canvas.height = document.querySelector(".sketchpad-container").offsetHeight;
    // React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener("mousedown", sketchpad_mouseDown, false);
    canvas.addEventListener("mousemove", sketchpad_mouseMove, false);
    window.addEventListener("mouseup", sketchpad_mouseUp, false);
    // React to touch events on the canvas
    canvas.addEventListener("touchstart", sketchpad_touchStart, false);
    canvas.addEventListener("touchend", sketchpad_touchEnd, false);
    canvas.addEventListener("touchmove", sketchpad_touchMove, false);
  }

  document.querySelector(".color-picker-toggle").onclick = switchDisplayStates(
    ".color-picker",
    "flex",
    "none"
  );
  document.querySelector("#stroke-size-small").onclick = setStrokeWidth(3);
  document.querySelector("#stroke-size-medium").onclick = setStrokeWidth(13);
  document.querySelector("#stroke-size-large").onclick = setStrokeWidth(40);

  var colorSelectorNodeList = document.querySelectorAll(".color-picker > div");
  for (var i = 0; i < colorSelectorNodeList.length; i++) {
    colorSelectorNodeList[i].onclick = function (e) {
      strokeColor = getComputedStyle(e.target).backgroundColor;
    };
  }

  if (!isFront()) {
    document.getElementById("sketchpad").style.background =
      "url('" + loadFromFront("sketchpad") + "')";
  }
}
