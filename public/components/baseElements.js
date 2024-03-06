export class BaseElements {
    createBaseElement(nameElement) {
        return function(id, text, ...classNames) {
            const el = document.createElement(nameElement);
            el.setAttribute('id', id);
            el.innerHTML = text;
            el.classList.add(...classNames);
            return el;
        }
    }
    
    createInput(type, name, placeholder, id, ...classNames) {
        const el = this.createBaseElement('input')(id, '', ...classNames);
        el.setAttribute('type', type);
        el.setAttribute('name', name);
        el.setAttribute('placeholder', placeholder);
        return el;
    }
    
    createImage(id, src, ...classNames) {
        const el = this.createBaseElement('img')(id, '', ...classNames);
        el.setAttribute('src', src);
        return el;
    }
    
    createAnchor(id, href, ...classNames) {
        const el = this.createBaseElement('a')(id, text, ...classNames);
        el.setAttribute('href', href);
        return el;
    }

    createLabel(id, text, forId, ...classNames) {
        const el = this.createBaseElement('label')(id, text, ...classNames);
        el.setAttribute('for', forId);
        return el;
    }

    createDiv = this.createBaseElement('div');
    createButton = this.createBaseElement('button');
    createSpan = this.createBaseElement('span');
}
