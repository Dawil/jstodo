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
	return function() {
		this.node = arguments[0];
		func.apply(this, [].slice.call(arguments, 1));
	};
}

var Item = NodeMixin(function() {
	this.attrs = {
		kill: this.node.querySelectorAll('span')[0],
		text: this.node.querySelectorAll('span')[1]
	};
	var self = this;
	this.updateText = function(event) {
		self.state = event.detail;
		self.render();
	};
	this.click = function(event) {
		self.node.dispatchEvent(new CustomEvent('killTodo', {
			bubbles: true,
			detail: this.state
		}));
	};
});
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

var App = NodeMixin(function(state) {
	this.state = state;
	this.attrs = {
		search: this.node.querySelector('input#search'),
		list: this.node.querySelector('ul#list'),
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
});
App.prototype.render = function() {
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
};

document.addEventListener('DOMContentLoaded', function(event) {
	window.appComponent = new App(document.querySelector('#app'), []).render();
});
