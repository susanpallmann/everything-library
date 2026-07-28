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

// Foundational class for UI elements with one or more user interaction "actions" (such as tap, tap and hold, etc.).
class Component {
    constructor(actions) {
        this.element;
        this.events = {};
        this.flagTouched = false;
        this.actions = actions;
    }

    // Creates the HTML element, then calls bindEvents() method
    build(destination) {
        destination.innerHTML += `<div class="component new-component"></div>`;
        this.element = destination.querySelector('.new-component');
        this.element.classList.remove('new-component');
        this.bindEvents();
    }

    // Checks for related actions and then binds eventListeners to the element
    bindEvents() {
        const eventConfig = getEventConfig();

        // Helper function for logic upon touchstart/mousedown
        const touchStart = function(event) {

            // Initialize a flag for tracking double taps
            let flagDoubleTap = false;

            // Touch is already logged (this shouldn't happen as we delete touches as they end and this event is for new touches)
            if (this.events.touches && this.events.touches[event.identifier]) {
                console.error('New touch shares an identifier with an existing tracked touch.');

            // This is a new touch
            } else {

                // Check if we are listening for a repeat touch and if there are any actions to perform for a repeat touch
                if (this.events.doubleTouchListeners && Object.keys(this.events.doubleTouchListeners).length && this.actions.doubleTap) {

                    // For each listener
                    for (const oldTouch in this.events.doubleTouchListeners) {
                        const prevTouch = this.events.doubleTouchListeners[oldTouch];

                        // Check if this new touch is within our sensitivity range to be considered a double touch
                        if ((Math.abs(prevTouch.x - event.x) < eventConfig.doubleTapSensitivity) &&
                            (Math.abs(prevTouch.y - event.y) < eventConfig.doubleTapSensitivity) &&
                            (event.time - prevTouch.time) < eventConfig.doubleTapTimeout) {

                            // If so, set the flag for double taps to true
                            flagDoubleTap = true;
                        }
                    }
                }

                // Helper function to run once a touch that has been held
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
                if (!this.events.touches) {
                    this.events.touches = {};
                }
                this.events.touches[event.identifier] = {
                    points: [{
                        x: event.x,
                        y: event.y,
                        time: event.time,
                        doubleTapStatus: flagDoubleTap, // Flag set above
                        holdStatus: false, // Set by timeout below
                        timeout: this.actions.hold ? setTimeout(() => {
                            flagHeld.call(this, event.identifier);
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
                    if (!this.events.doubleTouchListeners) {
                        this.events.doubleTouchListeners = {};
                    }
                    this.events.doubleTouchListeners[event.identifier] = {
                        x: event.x,
                        y: event.y,
                        time: event.time
                    }
                }
            }
        }

        // Helper function for logic upon touchmove/mousemove while mouse button is pressed
        const touchMove = function(event) {

            // Get timestamp and position
            const touchData = {
                x: event.x,
                y: event.y,
                time: event.time
            };

            // If we have point data for this touch (should always be true as this was created upon touchstart)
            if (this.events.touches[event.identifier].points) {

                // Add new timestamp and position to touch points
                this.events.touches[event.identifier].points.push(touchData);

                // If we have a drag action
                if (this.actions.drag) {

                    // Indicate in touch that we are dragging
                    this.events.touches[event.identifier]['dragging'] = true;

                    // Trigger our drag action
                    this.actions.drag.call(this, false, this.events.touches[event.identifier]);

                // If we have swipe actions, trigger them (indicating via parameters that swipe is still in progress)
                } else if (this.actions.swipe) {
                    this.actions.swipe.call(this, false, this.events.touches[event.identifier]);

                    // Indicate in touch that we are swiping
                    this.events.touches[event.identifier]['swiping'] = true;
                }

            // If we aren't expecting this touch, throw an error
            } else {
                console.error('Touch move unexpected; no touch start occurred previously.');
            }
        }

        // Helper function for logic upon touchend/touchcancel/mouseup
        const touchEnd = function(event) {

            // Get the existing information associated with the touch we're handling
            const loggedTouch = this.events.touches[event.identifier];

            // Clear any hold timeout
            clearTimeout(loggedTouch.points[0].timeout);

            // If we're expecting a drop event (we have drag actions and dragging is set to true)
            if (this.actions.drag && this.events.touches[event.identifier].dragging === true) {

                // Trigger our drag action (indicating via parameters that drop occurred)
                this.actions.drag.call(this, true, this.events.touches[event.identifier]);

                // If we have swipe actions and were swiping, trigger the swipe action (indicating via parameters that swipe is complete)
            } else if (this.actions.swipe && this.events.touches[event.identifier].swiping === true) {
                this.actions.swipe.call(this, true, this.events.touches[event.identifier]);

                // If we're expecting a double tap event and this is a double tap, trigger the double tap action
            } else if (loggedTouch.points[0].doubleTapStatus && this.actions.doubleTap) {
                this.actions.doubleTap.call(this);

                // Otherwise, treat as a normal tap event
            } else if (this.actions.tap) {
                this.actions.tap.call(this);
            }

            // Once handled, clear the touch data from our logged touches
            delete this.events.touches[event.identifier];
        };

        // If we have actions for touch-related events
        if (this.actions.tap || this.actions.hold ||
            this.actions.drag || this.actions.swipe ||
            this.actions.doubleTap || this.actions.rightClick) {

            // Listen for fingers touching the screen
            this.element.addEventListener('touchstart', (event) => {

                // Get the time of the event
                let timestamp = Date.now();

                // Flag as a touch event to prevent duplicate click event
                this.flagTouched = true;

                // For each new touch beginning as a part of this event
                for (const touch of event.changedTouches) {

                    touchStart.call(this, {
                        x: touch.screenX,
                        y: touch.screenY,
                        time: timestamp,
                        identifier: touch.identifier,
                        type: 'touch'
                    });
                }
            });

            // Listen for fingers leaving the screen
            this.element.addEventListener('touchend', (event) => {

                // Get the time of the event
                let timestamp = Date.now();

                // Flag as a touch event to prevent duplicate click event
                this.flagTouched = true;

                // For each touch ending as a part of this event
                for (const touch of event.changedTouches) {
                    touchEnd.call(this, {
                        x: touch.screenX,
                        y: touch.screenY,
                        time: timestamp,
                        identifier: touch.identifier,
                        type: 'touch'
                    });
                }
            });

            // Listen for fingers leaving the screen
            this.element.addEventListener('touchcancel', (event) => {
                // Get the time of the event
                let timestamp = Date.now();

                // Flag as a touch event to prevent duplicate click event
                this.flagTouched = true;

                // For each touch ending as a part of this event
                for (const touch of event.changedTouches) {
                    touchEnd.call(this, {
                        x: touch.screenX,
                        y: touch.screenY,
                        time: timestamp,
                        identifier: touch.identifier,
                        type: 'touch'
                    });
                }
            });

            // When a finger touching the screen moves
            this.element.addEventListener('touchmove', (event) => {

                // Get the time of the event
                let timestamp = Date.now();

                // For each touch moving as a part of this event
                for (const touch of event.changedTouches) {

                    touchMove.call(this, {
                        x: touch.screenX,
                        y: touch.screenY,
                        time: timestamp,
                        identifier: touch.identifier,
                        type: 'touch'
                    });
                }
            });

            // Listen for mouse click starting (mousedown)
            this.element.addEventListener('mousedown', (event) => {
                // Get the time of the event
                const timestamp = Date.now();

                // If no touch event is occurring, we'll assume this isn't a duplicate event
                if (!this.flagTouched) {

                    if (event.button === 0) {
                        touchStart.call(this, {
                            x: event.pageX,
                            y: event.pageY,
                            time: timestamp,
                            identifier: 'click',
                            type: 'click'
                        });
                    } else {
                    }
                }
            });

            // Listen for click ending (mouseup)
            this.element.addEventListener('mouseup', (event) => {
                // Get the time of the event
                const timestamp = Date.now();

                // If no touch event is occurring, we'll assume this isn't a duplicate event
                if (!this.flagTouched) {

                    // If this is a left click
                    if (event.button === 0) {
                        touchEnd.call(this, {
                            x: event.pageX,
                            y: event.pageY,
                            time: timestamp,
                            identifier: 'click',
                            type: 'click'
                        });
                    }
                }
            });

            // When an active (held) click moves
            this.element.addEventListener('mousemove', (event) => {
                
                // Get the time of the event
                const timestamp = Date.now();

                // If no touch event is occurring, we'll assume this isn't a duplicate event
                if (!this.flagTouched) {

                    if (event.buttons === 1) {
                        touchMove.call(this, {
                            x: event.pageX,
                            y: event.pageY,
                            time: timestamp,
                            identifier: 'click',
                            type: 'click'
                        });
                    }
                }
            });
        }
    }
}

const everythingUI = (function() {
    const eventConfig = {
        doubleTapSensitivity: 10, // maximum distance (in pixels) between two consecutive tap events for the events to be considered a "double tap"
        doubleTapTimeout: 1000, // maximum time (in milliseconds) between two consecutive tap events for the events to be considered a "double tap"
        tapHoldTime: 1000 // minimum time (in milliseconds) for a prolonged tap to be considered a "tap and hold"
    }

    window.getEventConfig = function() {
        return eventConfig;
    }
})();
