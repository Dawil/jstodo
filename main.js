'use strict';

function fire(node, eventType, data) {
	node.dispatchEvent(new CustomEvent(eventType, {
		bubbles: true,
		detail: data
	}));
}

var Todo = {
	render: function(state) {
		return [h('li', {'data-index': state[1]}, [
			h('span', {
				class: 'kill-todo',
				onclick: Todo.click
			}, ['X']),
			h('span', {}, [state[0]])
		])];
	},
	click: function(event) {
		fire(this, 'killTodo', this.parentElement.dataset.index);
	}
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
	this.render = function(state) {
		return [
			h('input', {
				id: 'search',
				onkeypress: self.keypress
			}, []),
			h('ul', {id: 'list', onkillTodo: self.killTodo},
				state.map(function(text, index) {
					return Todo.render(arguments)[0];
				})
			)
		];
	};
	this.applyPatch();
};

document.addEventListener('DOMContentLoaded', function(event) {
	var app = new App(
		document.querySelector('#app'),
		[]
	);
});
