var dom =
	h('div', {}, [
		h('p', {class: 'foo'}, ['hello world'])
	]
);

var dom2 =
	h('div', {}, [
		h('p', {class: 'bar'}, ['goodbye world']),
		h('p', {}, ['waddup'])
	]
);

function h(tag, attrs, children) {
	return {
		tag: tag,
		attrs: attrs,
		children: children
	};
}

function patch(node, a, b) {
	if (typeof b == 'string' && a !== b) {
		var newChild = createElement(b)
		node.replaceWith(newChild);
		return newChild;
	}
	console.log(node, a, b)
	if (!a || a.tag != b.tag) {
		var newChild = createElement(b);
		node.parentElement.replaceChild(newChild, node);
		return newChild;
	}

	for (var attr in a.attrs) {
		var eventName = getAttrEventName(attr);
		if (!(attr in b.attrs)) {
			eventName
				? node.removeEventListener(eventName, a.attrs[attr])
				: node.removeAttribute(attr);
		} else if (a.attrs[attr] !== b.attrs[attr]) {
			eventName
				? ( node.removeEventListener(eventName, a.attrs[attr])
					&& node.addEventListener(eventName, b.attrs[attr]) )
				: node.setAttribute(attr, b.attrs[attr]);
		}
	}
	for (var attr in b.attrs) {
		if (!(attr in a.attrs)) {
			node.setAttribute(attr, b.attrs[attr]);
		}
	}

	for (var i = 0; i < Math.max(a.children.length, b.children.length); i++) {
		if (!node.childNodes[i] && b.children[i]) {
			node.appendChild(createElement(b.children[i]));
		} else if (a.children[i] && !b.children[i]) {
			node.parentElement.removeChild(a.children[i]);
		} else {
			patch(node.childNodes[i], a.children[i], b.children[i]);
		}
	}
	return node;
}

function getAttrEventName(attr) {
	return attr.slice(0,2) == 'on' ? attr.slice(2) : null;
}

function createElement(dom) {
	if (dom.tag === undefined) return new Text(dom);
	var element = document.createElement(dom.tag);
	for (var attr in dom.attrs) {
		var eventName = getAttrEventName(attr);
		if (eventName) {
			element.addEventListener(eventName, dom.attrs[attr]);
		} else {
			element.setAttribute(attr, dom.attrs[attr]);
		}
	}
	for (var child in dom.children) {
		var childElement = createElement(dom.children[child], document);
		element.appendChild(childElement);
	}
	return element;
}
