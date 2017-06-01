'use strict';

function makeComponent(template, options) {
	function Component(state) {
		this.rootNode = document.createElement(template.title);
		this.rootNode.controller = this;
		this.shadowRoot = this.rootNode.createShadowRoot();
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
			self.rootNode.addEventListener(eventName, handler);
			self.shadowRoot.addEventListener(eventName, handler);
		});
		this.dom = document.importNode(template.content, true);
		this.shadowRoot.appendChild(this.dom);
		this.state = state;
		options.constructor.apply(this, []);
		this.render();
	};
	Component.prototype = options.prototype || {};
	return Component;
}

function sync(parent, children, data, linker) {
	for (var i = 0; i < Math.max(children.length, data.length); i++) {
		var oldChild = children[i];
		var newChild;
		if (i < data.length) {
			newChild = linker(children[i], data[i]);
		}
		if (oldChild && newChild) {
			parent.replaceChild(newChild, oldChild);
		} else if (!oldChild && newChild) {
			parent.appendChild(newChild);
		} else if (oldChild && !newChild) {
			oldChild.remove();
		}
	}
}
