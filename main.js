'use strict';

function fire(node, eventType, data) {
	node.dispatchEvent(new CustomEvent(eventType, {
		bubbles: true,
		detail: data
	}));
}

function applyPatch(dom, render, state) {
	dom.state = dom.state || state;
	var newVdom = render(dom.state);
	patch(dom, dom.vdom || [], newVdom);
	dom.vdom = newVdom;
}

function getRoot(node) {
	while (true) {
		if (node.state !== undefined) return node;
		node = node.parentElement;
	}
}

var Todo = {
	click: function(event) {
		fire(this, 'killTodo', this.parentElement.dataset.index);
	},
	render: function(state) {
		return h('li', {'data-index': state[1]}, [
			h('span', {
				class: 'kill-todo',
				onclick: Todo.click
			}, ['X']),
			h('span', {}, [state[0]])
		]);
	}
};

var App = {
	keypress: function(event) {
		if (event.code == 'Enter') {
			var todo = event.target.value;
			event.target.value = '';
			var root = getRoot(this);
			root.state.push(todo);

			applyPatch(root, App.render);
		}
	},
	killTodo: function(event) {
		var index = event.detail;
		var root = getRoot(this);
		root.state.splice(index, 1);

		applyPatch(root, App.render);
	},
	render: function(state) {
		return [
			h('input', {
				id: 'search',
				onkeypress: App.keypress
			}, []),
			h('ul', {id: 'list', onkillTodo: App.killTodo},
				state.map(function(text, index) {
					return Todo.render(arguments);
				})
			)
		];
	}
};

document.addEventListener('DOMContentLoaded', function(event) {
	var app = document.querySelector('#app');
	applyPatch(app, App.render, []);
});
