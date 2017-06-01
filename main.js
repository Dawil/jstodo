'use strict';

var App = makeComponent({
	prototype: {
		render: function() {
			this.attrs = this.attrs || {};
			this.attrs.spam = this.attrs.spam || this.node.querySelector('#spam');
			this.attrs.spam.innerHTML =
				'<ul>' +
				this.state.map(function(item) {
					return '<li>' + item + '</li>';
				}).join('\n') +
				'</ul>';
			return this;
		}
	},
	events: {
		'click:button': function(event) {
			console.log('Clicked');
			console.log(this);
			this.state.push('You clicked!');
			this.render();
		}
	}
});

document.addEventListener('DOMContentLoaded', function(event) {
	window.appComponent = new App(document.querySelector('#app'), []).render();
});
