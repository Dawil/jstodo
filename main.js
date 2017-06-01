'use strict';

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
					li = document.createElement('li');
					var span = document.createElement('span');
					span.innerText = 'X';
					span.classList.add('kill-todo');
					li.appendChild(span);
					li.appendChild(document.createElement('span'));
				}
				li.children[1].innerText = text;
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
		'click:span.kill-todo': function(event) {
			var todo = event.target.parentElement.children[1].innerText;
			var index = this.state.indexOf(todo);
			this.state.splice(index, 1);
			this.render();
		}
	}
});

document.addEventListener('DOMContentLoaded', function(event) {
	window.appComponent = new App(document.querySelector('#app'), []).render();
});
