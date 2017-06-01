'use strict';

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
			list: this.node.querySelector('ul#list')
		};
	},
	prototype: {
		render: function() {
			sync(this.attrs.list, this.state, function(li, text) {
				if (!li) {
					li = makeItemElement();
					new Item(li);
				}
				li.dispatchEvent(new CustomEvent('updateText', {
					detail: text
				}));
				return li;
			});
			return this;
		}
	},
	events: {
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
	}
});

document.addEventListener('DOMContentLoaded', function(event) {
	window.appComponent = new App(document.querySelector('#app'), []).render();
});
