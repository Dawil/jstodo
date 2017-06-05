'use strict';

function fire(node, eventType, data) {
	node.dispatchEvent(new CustomEvent(eventType, {
		bubbles: true,
		detail: data
	}));
}

function getRoot(node) {
	while (true) {
		if (node.state !== undefined) return node;
		node = node.parentElement;
	}
}

var Todo = function() {};
Todo.prototype.render = function(state) {
	return [h('li', {'data-index': state[1]}, [
		h('span', {
			class: 'kill-todo',
			onclick: Todo.click
		}, ['X']),
		h('span', {}, [state[0]])
	])];
};
Todo.prototype.click = function(event) {
	fire(this, 'killTodo', this.parentElement.dataset.index);
};

var App = function(dom, state) {
	var self = this, vdom = [];
	this.keypress = function(event) {
		if (event.code == 'Enter') {
			var todo = event.target.value;
			event.target.value = '';
			state.push(todo);

			self.applyPatch()
		}
	};
	this.killTodo = function(event) {
		var index = event.detail;
		state.splice(index, 1);

		self.applyPatch()
	};
	this.applyPatch = function() {
		var newVdom = self.render(state);
		patch(dom, vdom, newVdom);
		vdom = newVdom;
	};
	this.applyPatch();
};
App.prototype.render = function(state) {
	return [
		h('input', {
			id: 'search',
			onkeypress: App.keypress
		}, []),
		h('ul', {id: 'list', onkillTodo: App.killTodo},
			state.map(function(text, index) {
				return Todo.render(arguments)[0];
			})
		)
	];
};
};

document.addEventListener('DOMContentLoaded', function(event) {
	var app = new App(
		document.querySelector('#app'),
		[]
	);
});
