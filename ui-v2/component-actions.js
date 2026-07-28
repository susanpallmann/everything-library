// Given position and timestamp data for two points, returns x and y difference, hypotenuse distance, direction, and time elapsed
// Point 1 should have happened first
function getMotionFromPoints(point1, point2) {
    if (point1.time > point2.time) {
        console.error('First point must have occurred first chronologically.');
    } else {
        return {
            time: point2.time - point1.time,
            yDifference: Math.abs(point2.y - point1.y),
            xDifference: Math.abs(point2.x - point1.x),
            trueDifference: Math.sqrt(((point2.y - point1.y)*(point2.y - point1.y)) + ((point2.x - point1.x)*(point2.x - point1.x))),
            directions: [point1.x > point2.x ? 'left' : 'right', point1.y > point2.y ? 'up' : 'down']
        };
    }
}

class Component {
    constructor(actions) {
        this.element;
        this.events = {
            doubleTouchListeners: {},
            touches: {}
        };
        this.actions = actions;
    }

    build(destination) {
        destination.innerHTML += `<div class="component new-component"></div>`;
        this.element = destination.querySelector('.new-component');
        this.element.classList.remove('new-component');
        this.bindEvents();
    }

    bindEvents() {
        const eventConfig = getEventConfig();

        // If we have actions for touch-related events
        if (this.actions.tap || this.actions.hold ||
            this.actions.drag || this.actions.swipe ||
            this.actions.doubleTap) {

            // Listen for fingers touching the screen
            this.element.addEventListener('touchstart', (event) => {

                // For each new touch beginning as a part of this event
                for (const touch of event.changedTouches) {

                    // Handle the current touch
                    const touchEvent = touch;

                    // Initialize a flag for tracking double taps
                    let flagDoubleTap = false;

                    // Get the current timestamp
                    let timestamp = Date.now();

                    // Touch is already logged (this shouldn't happen as we delete touches as they end and this event is for new touches)
                    if (this.events.touches[touchEvent.identifier]) {
                        console.error('New touch shares an identifier with an existing tracked touch.');

                    // This is a new touch
                    } else {

                        // Check if we are listening for a repeat touch
                        if (Object.keys(this.events.doubleTouchListeners).length && this.actions.doubleTap) {

                            // For each listener
                            for (const oldTouch in this.events.doubleTouchListeners) {

                                // Handle the old touch listener
                                const prevTouch = this.events.doubleTouchListeners[oldTouch];

                                // Check if this new touch is within our sensitivity range to be considered a double tap
                                if ((Math.abs(prevTouch.x - touchEvent.screenX) < eventConfig.doubleTapSensitivity) &&
                                    (Math.abs(prevTouch.y - touchEvent.screenY) < eventConfig.doubleTapSensitivity) &&
                                    (timestamp - prevTouch.time) < eventConfig.doubleTapTimeout) {

                                    // If so, set the flag for double taps to true
                                    flagDoubleTap = true;
                                }
                            }
                        }

                        // Helper function for identifying a touch that has been held
                        const flagHeld = function (identifier) {
                            if (this.events.touches[identifier]) {
                                this.events.touches[identifier].points[0].holdStatus = true;

                                this.actions.hold.call(this);

                                // Clear any double tap listeners
                                if (flagDoubleTap && this.actions.doubleTap) {
                                    for (const doubleTouchListener in this.events.doubleTouchListeners) {
                                        delete this.events.doubleTouchListeners[doubleTouchListener];
                                    }
                                }
                            }
                        };

                        // Log the new touch with details
                        let reference = this;
                        this.events.touches[touchEvent.identifier] = {
                            points: [{
                                x: touchEvent.screenX,
                                y: touchEvent.screenY,
                                time: timestamp,
                                doubleTapStatus: flagDoubleTap, // Flag set above
                                holdStatus: false, // Set by timeout below
                                timeout: this.actions.hold ? setTimeout(function () {
                                    flagHeld.call(reference, touchEvent.identifier);
                                }, eventConfig.tapHoldTime) : null
                            }]
                        };

                        // If this is a double tap, we'll clear the double tap listener(s)
                        if (flagDoubleTap && this.actions.doubleTap) {
                            for (const doubleTouchListener in this.events.doubleTouchListeners) {
                                delete this.events.doubleTouchListeners[doubleTouchListener];
                            }

                        // If it's not a double tap, we'll add it as a listener for the next tap
                        } else if (this.actions.doubleTap) {
                            this.events.doubleTouchListeners[touchEvent.identifier] = {
                                x: touchEvent.screenX,
                                y: touchEvent.screenY,
                                time: Date.now()
                            }
                        }
                    }
                }

            });

            // Handle touchend/touchcancel helper function to keep functionality identical
            const endTouchEvent = function(event) {

                // For each touch ending as a part of this event
                for (const touch of event.changedTouches) {

                    // Handle the current touch
                    const touchEvent = touch;

                    // Get the logged information associated with the touch we're handling
                    const loggedTouch = this.events.touches[touchEvent.identifier];

                    // If we're expecting a drop event (we have drag actions and dragging is set to true)
                    if (this.actions.drag && this.events.touches[touchEvent.identifier].dragging === true) {

                        // Trigger our drag action (indicating via parameters that drop occurred)
                        this.actions.drag.call(this, true, this.events.touches[touchEvent.identifier]);

                    // If we have swipe actions and were swiping, trigger the swipe action (indicating via parameters that swipe is complete)
                    } else if (this.actions.swipe && this.events.touches[touchEvent.identifier].swiping === true) {
                        this.actions.swipe.call(this, true, this.events.touches[touchEvent.identifier]);

                    // If we're expecting a double tap event and this is a double tap, trigger the double tap action
                    } else if (loggedTouch.points[0].doubleTapStatus && this.actions.doubleTap) {
                        this.actions.doubleTap.call(this);

                    // Otherwise, treat as a normal tap event
                    } else if (this.actions.tap) {
                        this.actions.tap.call(this);
                    }

                    // Once handled, clear the touch data from our logged touches
                    delete this.events.touches[touchEvent.identifier];
                }
            }

            // Listen for fingers leaving the screen
            this.element.addEventListener('touchend', (event) => {
                endTouchEvent.call(this, event);
            });

            // Listen for fingers leaving the screen
            this.element.addEventListener('touchcancel', (event) => {
                endTouchEvent.call(this, event);
            });

            // When a finger touching the screen moves
            this.element.addEventListener('touchmove', (event) => {

                let timestamp = Date.now();

                // For each touch moving as a part of this event
                for (const touch of event.changedTouches) {

                    // Handle the current touch
                    const touchEvent = touch;

                    // Get timestamp and position
                    const touchData = {
                        x: touchEvent.screenX,
                        y: touchEvent.screenY,
                        time: timestamp
                    };

                    // If we have point data for this touch (should always be true as this was created upon touchstart)
                    if (this.events.touches[touchEvent.identifier].points) {

                        // Add new timestamp and position to touch points
                        this.events.touches[touchEvent.identifier].points.push(touchData);

                        // If we have a drag action
                        if (this.actions.drag) {

                            // Indicate in touch that we are dragging
                            this.events.touches[touchEvent.identifier]['dragging'] = true;

                            // Trigger our drag action
                            this.actions.drag.call(this, false, this.events.touches[touchEvent.identifier]);

                            // If we have swipe actions, trigger them (indicating via parameters that swipe is still in progress)
                        } else if (this.actions.swipe) {
                            this.actions.swipe.call(this, false, this.events.touches[touchEvent.identifier]);

                            // Indicate in touch that we are swiping
                            this.events.touches[touchEvent.identifier]['swiping'] = true;
                        }

                        // If we aren't expecting this touch, throw an error
                    } else {
                        console.error('Touch move unexpected; no touch start occurred previously.');
                    }
                }
            });
        }

        // If we have actions for left-click-related events
        if (this.actions.leftClick || this.actions.clickHold ||
            this.actions.clickDrag || this.actions.clickSwipe ||
            this.actions.doubleClick || this.actions.rightClick) {

            // Listen for mouse click starting (mousedown)
            this.element.addEventListener('mousedown', (event) => {

                // If this is a left click
                if (event.button === 0) {

                    // Initialize a flag for tracking double clicks
                    let flagDoubleClick = false;

                    // Get the current timestamp
                    let timestamp = Date.now();

                    // Click is already logged (this shouldn't happen as we delete clicks as they end and this event is for new clicks)
                    if (this.events.click) {
                        console.error('New click occurred while an existing click is tracked.');

                        // This is a new click
                    } else {

                        // Check if we are listening for a repeat click
                        if (this.events.doubleClickListener && this.actions.doubleClick) {

                            // Check if this new touch is within our sensitivity range to be considered a double tap
                            if ((Math.abs(this.events.doubleClickListener.x - event.pageX) < eventConfig.doubleClickSensitivity) &&
                                (Math.abs(this.events.doubleClickListener.y - event.pageY) < eventConfig.doubleClickSensitivity) &&
                                (timestamp - this.events.doubleClickListener.time) < eventConfig.doubleClickTimeout) {

                                // If so, set the flag for double taps to true
                                flagDoubleClick = true;
                            }
                        }

                        // Helper function for identifying a click that has been held
                        const flagHeld = function () {
                            if (this.events.click) {
                                this.events.click.points[0].holdStatus = true;

                                this.actions.clickHold.call(this);

                                // Clear the double click listener
                                if (flagDoubleClick && this.actions.doubleClick) {
                                    delete this.events.doubleClickListener;
                                }
                            }
                        };

                        // Log the new click with details
                        let reference = this;
                        this.events.click = {
                            points: [{
                                x: event.pageX,
                                y: event.pageY,
                                time: timestamp,
                                doubleClickStatus: flagDoubleClick, // Flag set above
                                holdStatus: false, // Set by timeout below
                                timeout: this.actions.clickHold ? setTimeout(function () {
                                    flagHeld.call(reference);
                                }, eventConfig.clickHoldTime) : null
                            }]
                        };

                        // If this is a double click, we'll clear the double click listener(s)
                        if (flagDoubleClick && this.actions.doubleClick) {
                            delete this.events.doubleClickListener;

                        // If it's not a double click, we'll add it as a listener for the next click
                        } else if (this.actions.doubleClick) {
                            this.events.doubleClickListener = {
                                x: event.pageX,
                                y: event.pageY,
                                time: timestamp
                            }
                        }
                    }

                } else if (event.button === 2) {

                } else {

                }
            });

            // Listen for click ending (mouseup)
            this.element.addEventListener('mouseup', (event) => {

                // If this is a left click
                if (event.button === 0) {

                    // Get the logged click information
                    const clickData = this.events.click;

                    // If we're expecting a drop event (we have drag actions and dragging is set to true)
                    if (this.actions.clickDrag && this.events.click.dragging === true) {

                        // Trigger our drag action (indicating via parameters that drop occurred)
                        this.actions.clickDrag.call(this, true, this.events.click);

                    // If we have swipe actions and were swiping, trigger the swipe action (indicating via parameters that swipe is complete)
                    } else if (this.actions.clickSwipe && this.events.click.swiping === true) {
                        this.actions.clickSwipe.call(this, true, this.events.click);

                    // If we're expecting a double click event and this is a double click, trigger the double click action
                    } else if (this.events.click.points[0].doubleClickStatus && this.actions.doubleClick) {
                        this.actions.doubleClick.call(this);

                    // Otherwise, treat as a normal click event
                    } else if (this.actions.leftClick) {
                        this.actions.leftClick.call(this);
                    }

                    // Once handled, clear the click data from our logged events
                    delete this.events.click;

                } else if (event.button === 2) {

                    if (this.actions.rightClick) {
                        this.actions.rightClick.call(this);
                    }

                } else {

                }
            });

            // When an active (held) click moves
            this.element.addEventListener('mousemove', (event) => {

                if (event.buttons === 1) {

                    // Get timestamp and position
                    const clickData = {
                        x: event.pageX,
                        y: event.pageY,
                        time: Date.now()
                    };

                    // If we have point data for this click (should always be true as this was created upon initial mousedown)
                    if (this.events.click.points) {

                        // Add new timestamp and position to touch points
                        this.events.click.points.push(clickData);

                        // If we have a drag action
                        if (this.actions.clickDrag) {

                            // Indicate in click that we are dragging
                            this.events.click['dragging'] = true;

                            // Trigger our drag action
                            this.actions.clickDrag.call(this, false, this.events.click);

                        // If we have swipe actions, trigger them (indicating via parameters that swipe is still in progress)
                        } else if (this.actions.clickSwipe) {
                            this.actions.clickSwipe.call(this, false, this.events.click);

                            // Indicate in click that we are swiping
                            this.events.click['swiping'] = true;
                        }

                    // If we aren't expecting this click, throw an error
                    } else {
                        console.error('Click move unexpected; no mousedown occurred previously.');
                    }

                } else if (event.buttons === 2) {

                } else {

                }
            });
        }
    }
}

const everythingUI = (function() {
    const eventConfig = {
        doubleTapSensitivity: 10, // maximum distance (in pixels) between two consecutive tap events for the events to be considered a "double tap"
        doubleTapTimeout: 1000, // maximum time (in milliseconds I THINK) between two consecutive tap events for the events to be considered a "double tap"
        tapHoldTime: 1000, // minimum time (in milliseconds) for a prolonged tap to be considered a "tap and hold"
        doubleClickSensitivity: 5, // maximum distance (in pixels) between two consecutive click events for the events to be considered a "double click"
        doubleClickTimeout: 1000, // maximum time (in milliseconds I THINK) between two consecutive click events for the events to be considered a "double tap"
        clickHoldTime: 1000, // minimum time (in milliseconds) for a prolonged mousedown to be considered a "click and hold"
    }

    window.getEventConfig = function() {
        return eventConfig;
    }
})();
