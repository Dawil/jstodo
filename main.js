'use strict';

/*
var Item = makeComponent({
	constructor: function() {
		this.attrs = {
			kill: this.node.querySelectorAll('span')[0],
			text: this.node.querySelectorAll('span')[1]
		};
	},
	prototype: {
		render: function() {
			this.attrs.text.innerText = this.state;
		}
	},
	events: {
		'updateText': function(event) {
			this.state = event.detail;
			this.render();
		},
		'click:.kill-todo': function(event) {
			event.stopPropagation();
			this.node.dispatchEvent(new CustomEvent('killTodo', {
				bubbles: true,
				detail: this.state
			}));
		}
	}
});
*/
function NodeMixin(func) {
	return function(node) {
		this.node = node;
		func.call(this);
	};
}
function EventHandlerMixin(func, events) {
	return function() {
		var self = this;
		Object.keys(this.events||{}).map(function(key) {
			var parts = key.split(':');
			var eventName = parts[0];
			var selector = parts.slice(1).join(':');
			var handler = function(event) {
				if (!selector || event.target.matches(selector)) {
					events[key].apply(self, [event]);
				}
			};
			self.node.addEventListener(eventName, handler);
		});
		func.call(this);
	};
}
var Item = NodeMixin(EventHandlerMixin(function() {
	this.attrs = {
		kill: this.node.querySelectorAll('span')[0],
		text: this.node.querySelectorAll('span')[1]
	};
}, {
	'updateText': function(event) {
		this.state = event.detail;
		this.render();
	},
	'click:.kill-todo': function(event) {
		event.stopPropagation();
		this.node.dispatchEvent(new CustomEvent('killTodo', {
			bubbles: true,
			detail: this.state
		}));
	}
}));
Item.prototype.render = function() {
	this.attrs.text.innerText = this.state;
}

function makeItemElement() {
	var li = document.createElement('li');
	var span = document.createElement('span');
	span.innerText = 'X';
	span.classList.add('kill-todo');
	li.appendChild(span);
	li.appendChild(document.createElement('span'));
	return li;
}

var App = makeComponent({
	constructor: function() {
		this.attrs = {
			search: this.node.querySelector('input#search'),
			list: this.node.querySelector('ul#list'),
			children: new Map()
		};
		var self = this;
		this.onKeypress = function(event) {
			if (event.code == 'Enter') {
				var todo = event.target.value;
				event.target.value = '';
				self.state.push(todo);
				self.render();
			}
		};
		this.killTodo = function(event) {
			var todo = event.target.parentNode.children[1].innerText;
			var index = self.state.indexOf(todo);
			self.state.splice(index, 1);
			self.render();
		};
	},
	prototype: {
		render: function() {
			var newVdom = [
				h('input', {
					id: 'search',
					onkeypress: this.onKeypress
				}, []),
				h('ul', {id: 'list'}, this.state.map(function(text) {
						return h('li', {}, [
							h('span', {
								class: 'kill-todo',
								onclick: this.killTodo
							}, ['X']),
							h('span', {}, [text])
						]);
					}, this)
				)
			];
			patch(this.node, this.vdom || [], newVdom);
			this.vdom = newVdom;
			return this;
		}
	},
	events: {
		/*
		'keypress:input#search': function(event) {
			if (event.code == 'Enter') {
				var todo = event.target.value;
				event.target.value = '';
				this.state.push(todo);
				this.render();
			}
		},
		'killTodo:li': function(event) {
			var todo = event.detail;
			var index = this.state.indexOf(todo);
			this.state.splice(index, 1);
			this.render();
		}
		*/
	}
});

document.addEventListener('DOMContentLoaded', function(event) {
	window.appComponent = new App(document.querySelector('#app'), []).render();
});
