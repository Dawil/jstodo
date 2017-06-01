'use strict';

function makeComponent(options) {
	function Component(node, state) {
		this.node = node;
		var self = this;
		Object.keys(options.events||{}).map(function(key){
			var parts = key.split(':');
			var eventName = parts[0];
			var selector = parts.slice(1).join(':');
			var handler = function(event) {
				if (!selector || event.target.matches(selector)) {
					options.events[key].apply(self, [event]);
				}
			};
			self.node.addEventListener(eventName, handler);
		});
		this.state = state;
		options.constructor.apply(this, []);
	};
	Component.prototype = options.prototype || {};
	return Component;
}

function sync(node, data, linker) {
	var children = node.children;
	for (var i = 0; i < Math.max(children.length, data.length); i++) {
		var oldChild = children[i];
		var newChild;
		if (i < data.length) {
			newChild = linker(children[i], data[i]);
		}
		if (oldChild && newChild) {
			node.replaceChild(newChild, oldChild);
		} else if (!oldChild && newChild) {
			node.appendChild(newChild);
		} else if (oldChild && !newChild) {
			oldChild.remove();
		}
	}
}
