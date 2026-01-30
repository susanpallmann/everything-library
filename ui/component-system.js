import iconLibrary from "icon-library.js";

// Series of functions, methods, and classes for creating common UI elements (to be expanded)
// Use with everything-library/ui/component-system.css, requires everything-library/ui/icon-library.js

function checkBounds(element, x, y) {
	return x >= element.offset().left && x <= element.offset().left + parseInt(element.css('width'))
		&& y >= element.offset().top  && y <= element.offset().top + parseInt(element.css('height')); 
}

// Classes
class Interaction {
	constructor(component, event) {
		this.component = component;
		this.identifier = event.identifier;
		this.target = $(event.target);
		this.touchState;
		this.tapCount = 0;
		this.position;
		this.timer = null;
		this.iterations = 0;
		this.points;
	}
	
	setPosition(x, y) {
		if (checkBounds(this.target, x, y)) {
			this.position = 'inside';
		} else {
			this.position = 'outside';
		}
	}
	
	clearTimer() {
		if (this.timer !== null) {
			clearInterval(this.timer);
		}
		this.iterations = 0;
	}
	
	setTimer(time, callback) {
		this.clearTimer();
		let interaction = this;
		this.timer = setInterval(function () {
			interaction.iterations++;
			callback(interaction);
		}, time);
	}
	
	touchStart(x, y) {
		this.setPosition(x, y);
		this.touchState = 'down';
		if (this.time > 4) {
			this.tapCount = 0;
		}
		this.clearTimer();
		if (this.component.functions.hold) {
			this.setTimer(50, function(object) {
				if (object.iterations === 3) {
					object.component.functions.hold(object.component, object);
				}
				object.iterations++;
			});
		}
		this.tapCount++;
		this.points = { start: {
			x: x,
			y: y,
			position: this.position,
			touchState: this.touchState
		}};
		if (this.component.functions.tapStart) {
			this.component.functions.tapStart(this.component, this);
		}
	}
	
	touchEnd(x, y) {
		this.setPosition(x, y);
		this.touchState = 'up';
		this.clearTimer();
		this.setTimer(50, function(object) {
			if (object.iterations > 4) {
				object.tapCount = 0;
				object.clearTimer();
			}
		});
		this.points.end = {
			x: x,
			y: y,
			position: this.position,
			touchState: this.touchState
		};
		if (this.component.functions.tapEnd) {
			this.component.functions.tapEnd(this.component, this);
		}
	}
	
	cleanUp() {
		this.clearTimer();
		delete this.component.interactions[this.identifier];
	}
	
}

class Component {
	constructor(element, defaultStates = {}, destination = null) {
		this.element = element;
		this.states = defaultStates;
		if (destination !== null) {
			destination.append(this.element);
		}
	}
	
	slotIcon(slot, icon = null) {
		slot.empty();
		if (icon !== null) {
			const i = getIcon(icon);
			slot.append(i);
		}
	}
	
	updateState(changes) {
		for (let attribute in changes) {
			if (this.states.hasOwnProperty(attribute)) {
				this.states[attribute] = changes[attribute];
			}
			this.element.attr(attribute, changes[attribute]);
		}
	}
	
	activate() {
		const object = this;
		if (this.functions.tap || this.functions.tapEnd || this.functions.hold) {
			this.element.on('touchstart', this.element, function (event) {
				event.preventDefault();
				const events = {};
				for (const changedTouch of event.changedTouches) {
					events[changedTouch.identifier] = {
						target: event.currentTarget,
						x: changedTouch.clientX,
						y: changedTouch.clientY,
						identifier: changedTouch.identifier
					};
				}
				for (let event in events) {
					if (!object.interactions || !object.interactions.hasOwnProperty(event)) {
						object.interactions[event] = new Interaction(object, events[event]);
					}
					object.interactions[event].touchStart(events[event].x, events[event].y);
				}
			});
			this.element.on('mousedown', this.element, function (event) {
				event.preventDefault();
				const events = {};
				if (event.button === 0) {
					events.mouse = {
						target: event.currentTarget,
						x: event.clientX,
						y: event.clientY,
						identifier: 'mouse'
					};
				}
				for (let event in events) {
					if (!object.interactions || !object.interactions.hasOwnProperty(event)) {
						object.interactions[event] = new Interaction(object, events[event]);
					}
					object.interactions[event].touchStart(events[event].x, events[event].y);
				}
			});
			this.element.on('touchend', this.element, function (event) {
				event.preventDefault();
				const events = {};
				for (const changedTouch of event.changedTouches) {
					events[changedTouch.identifier] = {
						target: event.currentTarget,
						x: changedTouch.clientX,
						y: changedTouch.clientY,
						identifier: changedTouch.identifier
					};
				}
				for (let event in events) {
					if (!object.interactions || !object.interactions.hasOwnProperty(event)) {
						object.interactions[event] = new Interaction(object, events[event]);
					}
					object.interactions[event].touchEnd(events[event].x, events[event].y);
				}
			});
			this.element.on('mouseup', this.element, function (event) {
				event.preventDefault();
				const events = {};
				if (event.button === 0) {
					events.mouse = {
						target: event.currentTarget,
						x: event.clientX,
						y: event.clientY,
						identifier: 'mouse'
					};
				}
				for (let event in events) {
					if (!object.interactions || !object.interactions.hasOwnProperty(event)) {
						object.interactions[event] = new Interaction(object, events[event]);
					}
					object.interactions[event].touchEnd(events[event].x, events[event].y);
				}
			});
			this.element.on('touchcancel', this.element, function (event) {
				event.preventDefault(); 
				const events = {};
				for (const changedTouch of event.changedTouches) {
					events[changedTouch.identifier] = {
						target: event.currentTarget,
						x: changedTouch.clientX,
						y: changedTouch.clientY,
						identifier: changedTouch.identifier
					};
				}
				for (let event in events) {
					if (!object.interactions || !object.interactions.hasOwnProperty(event)) {
						object.interactions[event] = new Interaction(object, events[event]);
					}
					object.interactions[event].touchEnd(events[event].x, events[event].y);
				}
			});
		}
	}
}

class Button extends Component {
	constructor(properties, defaultStates = {}, destination = null) {
		const template = $(`<div class="button-${properties.type} wrapper" mat-style="${properties.style}" size="${properties.size}"><div class="fill"><p>New Button</p></div></div>`);
		super(template, defaultStates, destination);
		this.interactions = {};
		this.functions = {
			tapStart: function(object, interaction) {object.updateState({state: 'active'})},
			tapEnd: function(object, interaction) {object.updateState({state: 'default'})}
		};
		this.activate();
	}
}

class Checkbox extends Component {
	constructor(defaultStates = {}, destination = null) {
		const template = $(`<div class="checkbox wrapper" check="${defaultStates.check}" ><div class="fill"></div></div>`);
		super(template, defaultStates, destination);
		this.interactions = {};
		this.functions = {
			tapStart: function(object, interaction) {},
			tapEnd: function(object, interaction) {
				if (object.states.check === 'unchecked') {
					object.updateState({check: 'checked'});
					object.slotIcon(object.element.children('.fill'), 'checkSmall');
				} else {
					object.updateState({check: 'unchecked'});
					object.slotIcon(object.element.children('.fill'));
				}
			}
		};
		this.activate();
	}
}
