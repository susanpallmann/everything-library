# Component actions

## Contents
* [How to use](#how-to-use)
* [Functions](#functions)
  * [getMotionFromPoints()](#getmotionfrompoints)
* [Classes](#classes)
  * [Component()](#component)
    * [Methods](#methods)
    * [Actions](#actions)
    * [Uses](#uses)
* [IIFEs](#iifes)
  * [everythingUI](#everythingui)

## How to use
Add the following to your HTML before the closing body tag and before any code that aims to use this.
```html
<script type="text/javascript" src="https://susanpallmann.github.io/everything-library/ui-v2/component-actions.js"></script>
```

## Functions
### getMotionFromPoints()
Function that, given two event "points," returns information comparing the two.

#### Parameters

``(point1, point2)``

**point1** must have occurred before **point2** chronologically (point1.time <= point2.time). Both points should be objects with key/values as follows:
```javascript
{
  x: [number], // representing horizontal position of touch or mouse event
  y: [number], // representing vertical position of touch or mouse event
  time: [number] // timestamp when event occurred
}
```


#### Output

``{object}``

Function returns an object with key/values as follows:
```javascript
{
  time: [number], // difference in time in milliseconds
  yDifference: [number], // vertical difference in position
  xDifference: [number], // horizontal difference in position
  trueDifference: [number], // true difference in position (calculated hypotenuse based on xDifference and yDifference
  directions: [[left/right], [up/down]] // human-friendly description of directional movement
}
```
*Note: When horizontal movement is 0, left/right direction is set to **'right'**. When vertical movement is 0, up/down direction is set to **down**.*


##### Example uses
The returned information is designed to be used for drag/swipe actions. 

The inclusion of both **xDifference** and **yDifference** can be used to determine if an action was *more* left/right than up/down and vice versa.
```javascript
const motion = getMotionFromPoints(startPoint, endPoint);

let primaryDirection = motion.directions[0];

if (motion.yDifference > motion.xDifference) {
  primaryDirection = motion.directions[1];
}
```


The movement between any two mouse or touch points can be compared to see if a started drag/swipe should be canceled, such as canceling a started "swipe left" if the last movement in the swipe instead went right.
```javascript
const initialMotion = getMotionFromPoints(eventPoints[0], eventPoints[1]);
const endMotion = getMotionFromPoints(eventPoints[eventPoints.length - 2], eventPoints[eventPoints.length - 1]);

const getPrimaryMotion = function(motion) {
  let primaryDirection = motion.directions[0];

  if (motion.yDifference > motion.xDifference) {
    primaryDirection = motion.directions[1];
  }
}

if (endMotion.direction[0] !== getPrimaryMotion(initialMotion) && 
    endMotion.direction[1] !== getPrimaryMotion(initialMotion)) {
  // Cancel the swipe
} else {
  // Swipe completed successfully
}
```


## Classes
### Component()
This is a foundational class for UI elements with one or more user interaction "actions" (such as click/tap, tap and hold, etc.).


#### Methods
##### constructor()

###### Properties
There are 4 primary properties created upon construction: element, events, flagTouched, and actions. Actions are populated by an object passed in to the constructor (see parameters below), but 
new classes that extend Component may have actions built into them instead. In many cases we may want Components to behave in a consistent, expected manner.
```javascript
this.element = [HTML element]; // HTML element representing this Component
this.events = {}; // Storing event information as it occurs for use in actions
this.flagTouched = [true/false]; // Mark touch events so that duplicative click events are prevented
this.actions = {}; // Stores parameter {actions}, a set of functions to run upon certain event listeners triggering
```

###### Parameters

``{actions}``

Class expects an object containing one or more "action functions" assigned to expected keys:
```
tap
doubleTap
hold
drag
swipe
rightClick
```

Additional keys/functions can appear within the actions object without breaking any functionality, but by default these will not be run. More
information on expected actions can be found in the dedicated section [below](#Actions). It is not required that all (or any) of these anticipated
actions be present. Missing actions are simply not performed.

Additional keys/functions within the actions object can be leveraged by new classes that extend the Component class.


##### build()

###### Parameters
``<HTML element>``

**build()** method takes a provided HTML element and appends an element representing the Component to it. The Component's element is assigned to the 
corresponding property at this time as well.

By default the created HTML element is a div with the class "component."

After the element is added to the DOM, the Component's bindEvents() method is automatically invoked.



##### bindEvents()
No parameters are needed for bindEvents(). This method uses the existing Component **element**, **events**, **flagTouched**, and **actions** properties.

Event listeners for mouse and touch events are only activated if there are any expected actions that utilize these events. If no expected actions
related to mouse/touch events are present, the related listeners will not be activated.


#### Actions
Actions is an object parameter required by the Component's constructor. The actions object is expected to be made up of key/value pairs where each value is a function, and keys 
represent expected triggers within the Component's bindEvents() method.

Additional keys/functions can appear within the actions object without breaking any functionality, but by default these will not be run. More
information on expected actions can be found in the dedicated section [below](#Actions). It is not required that all (or any) of these anticipated
actions be present. Missing actions are simply not performed.

Additional keys/functions within the actions object can be leveraged by new classes that extend the Component class.

##### Expected actions
"Expected actions" refers to the base action functions the Component's bindEvents() method checks for. The keys for these "expected actions" are as follows:
```
tap
doubleTap
hold
drag
swipe
rightClick
```

Most of the expected actions do not have required parameters. All expected actions are called so that the Component can be passed in and interacted with using "this."

The expected actions that do have required parameters are:
```
drag
swipe
```

For these actions, the expected parameters are:

``(flagComplete, interaction)``

**flagComplete** indicates if the drag or swipe event is still ongoing. **flagComplete** is set to **false** while the user is holding down the left mouse button or holding a finger to the screen, 
and set to **true** when the user releases the mouse button or removes their finger after previously moving a touch or click while pressed. This indicator can be used to visually indicate in-progress drag or 
swipe events (for example, partially moving a menu that will be closed if the user completes their swipe), or to handle the completion of a drag or swipe event (for example, treating the end of a drag as a "drop").

**interaction** is an object containing the related interaction data logged by the Component. For touch events, this is the specific touch interaction history that triggered the action, and for mouse events this is the mouse interaction 
history. This history includes the key **points** which maps to an array of logged movements and flags. Used in tandem with the function **getMotionFromPoints()** the drag/swipe action functions can determine what behavior is appropriate 
based on the user's movement and speed during the drag or swipe.


#### Uses
The Component class can be used on its own to make UI elements that respond to expected user actions. 

The following example creates an element that, when clicked or tapped, turns red.
```javascript
const redComponent = new Component({
  tap: function() {this.element.style.backgroundColor = 'red'}
});
const destination = document.getElementById('container');
redComponent.build(destination);
```

The following example creates an element that, when dragged, turns red, and when dropped after dragging, turns blue and logs the direction and travel distance dragged to the console.
```javascript
const dragComponent = new Component({
  drag: function(flagComplete, interaction) {
    if (flagComplete) {
      let motion = getMotionFromPoints(interaction.points[0], interaction.points[interaction.points.length - 1]);
      console.log(`Traveled ${motion.trueDifference}px ${motion.directions[1]} and to the ${motion.directions[0]}.`);
      this.element.style.backgroundColor = 'blue';
    } else {
      this.element.style.backgroundColor = 'red';
    }
  }
});
const destination = document.getElementById('container');
dragComponent.build(destination);
```

Classes that extend Component can also be created to allow for different HTML elements, consistent action functions, and/or new types of actions.

In the following example, the new class "Toggle" creates a different HTML element in its build() method and actions are preset and limited to click and tap events.
```javascript
class Toggle extends Component {
  constructor() {
    super({
      tap: function () {
        for (const child of this.element.children) {
          if (child.textContent === 'Off') {
            child.textContent = "On";
          } else {
            child.textContent = "Off";
          }
        }
      }
    });
  }

  build(destination) {
    destination.innerHTML += `<div class="component toggle new-component"><p>Off</p></div>`;
    this.element = destination.querySelector('.new-component');
    this.element.classList.remove('new-component');
    this.bindEvents();
  }
}
```

In the following example, the new class "Hoverer" includes new actions in its constructor that are triggered by additions to the bindEvents() method.
```javascript
class Hoverer extends Component {
    constructor() {
        super({
            tap: function () {
                console.log('We clicked!');
            },
            mouseEnter: function () {
                console.log('The mouse entered!');
            }
        });
    }

    bindEvents() {
        super.bindEvents();
        this.element.addEventListener('mouseenter', (event) => {
            if (this.actions.mouseEnter) {
                this.actions.mouseEnter.call(this);
            }
        });
    }
}
```

## IIFEs
### everythingUI
This IIFE stores and surfaces key configurable values for triggering expected actions from user events.

#### Constants
Constant **eventConfig** allows for tweaks to sensitivity for double-taps and holds. The values that can be modified are as follows:

```javascript
doubleTapSensitivity: 10, // maximum distance (in pixels) between two consecutive tap events for the events to be considered a "double tap"
doubleTapTimeout: 1000, // maximum time (in milliseconds) between two consecutive tap events for the events to be considered a "double tap"
tapHoldTime: 1000, // minimum time (in milliseconds) for a prolonged tap to be considered a "tap and hold"
```
#### Global functions
**getEventConfig()** returns the **eventConfig** constant for use within other functions and methods.

## To-do
### Issues
[ ] Mouse movements that move outside of the element aren't tracked; they may need to be for accurate swipe and drag behavior.
