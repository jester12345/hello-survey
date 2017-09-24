class helloSurvey {
    /**
     * Kick off the application
     * @param  {obj} data [optional] Data to initialize the survey with.
     * If data is not provided here, the init function may be called at any time
     * with the required initialization data.
     */
    constructor(data) {
        if( data ) {
            // Initialize the survey
            this.init(data);
        }
    }

    init(data) {
        console.log("i data", data);

        this.target;
        if( data.target ) {
            this.target = document.getElementById(data.target);
        }

        if( this.target ) {
            // Build the form
            this.addElementTo(this.target, 'form', {
                method: 'post',
                'accept-charset': 'utf-8'
            }, {
                eventType:      'submit',
                eventAction:    this.submit
            }, data.children);
        } else {
            // Report an error
            console.error('Required target parameter is missing.');
        }
    }

    addElementTo(parent, element, params, evt, children) {
        console.log("addElementTo", parent, element, params, evt, children);
        let elem = document.createElement(element);

        if( params ) {
            for (let key in params) {
                if( key === 'text' ) {
                    // We need to make a text node as a child of the current element
                    let text = document.createTextNode(params[key]);
                    elem.appendChild(text);
                } else if (params.hasOwnProperty(key)) {
                    elem.setAttribute(key, params[key]);
                }
            }
        }

        if( evt ) {
            elem.addEventListener(evt.eventType, (event) => {
                evt.eventAction(event);
            });
        }

        if( children ) {
            for ( let c in children ) {
                this.addElementTo(elem, children[c].element, children[c].params, children[c].event, children[c].children);
            }
        }

        parent.appendChild(elem);
    }

    submit(event) {
        event.preventDefault();
        console.log('submit called!');
    }
}