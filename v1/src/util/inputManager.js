export class KeyboardManager {
    constructor() {
        this.keyStatus = {};
    }

    isPressed(keyName) {
        return keyName in this.keyStatus ? this.keyStatus[keyName] : false;
    }

    handler(e) {
        console.log(e.type, e.code);
        if (e.type == 'keydown') {
            this.keyStatus[e.code] = true;
        } else if (e.type == 'keyup') {
            this.keyStatus[e.code] = false;
        }
    }
    activate() {
        // TODO 이러면 KeyboardManager는 딱 하나 글로벌하게 만들어야 하나?
        window.addEventListener('keydown', this.handler.bind(this));
        window.addEventListener('keyup', this.handler.bind(this));
    }

    deactivate() {
        window.removeEventListener('keydown', this.handler.bind(this));
        window.removeEventListener('keyup', this.handler.bind(this));
    }
}

export class MouseHandler {
    constructor() {
        //
    }

    handler(e) {
        console.log(e.type, e.screenX, e.screenY)
        if (e.type == 'click') {
            //
        }
    }

    activate() {
        window.addEventListener('click', this.handler.bind(this));
    }

    deactivate() {
        window.removeEventListener('click', this.handler.bind(this));
    }
}


// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code - key name
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key - key event