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

function patch(parentNode, aNodes, bNodes) {
	for (var i = 0; i < Math.max(aNodes.length, bNodes.length); i++) {
		var a = aNodes[i], b = bNodes[i], node = parentNode.childNodes[i];
		console.log(node, a, b)

		/* Create new element */
		if (!a) {
			var newChild = createElement(b);
			parentNode.appendChild(newChild);
			continue;
		}
		if (typeof b == 'string') {
			if (a !== b) {
				var newChild = createElement(b);
				node.textContent = b;
			}
			continue;
		}
		if (!b) {
			parentNode.removeChild(node);
			continue;
		}
		if (a.tag != b.tag) {
			var newChild = createElement(b);
			parentNode.replaceChild(newChild, node);
			continue;
		}
		/* ****************** */

		/* Synchronize attributes */
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
		/* ********************** */

		patch(node, a.children, b.children);
	}
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
