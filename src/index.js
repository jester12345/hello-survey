/**
 * Builds forms for surveys.
 * @author Arthur McLean <arthur@mclean.ws>
 * @license ISC
 */
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

        // Do we have a submit function?
        this.submitFn = false;
        if( data.submitFn && typeof(data.submitFn) === 'function' ) {
            this.submitFn = data.submitFn;
        }
        console.log("this.submitFn",this.submitFn);

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
        // console.log("addElementTo", parent, element, params, evt, children);
        let elem;
        if( element === 'textNode' ) {
            // We are creating a textNode, and there's only one option, params.text... the text for the textNode
            elem = document.createTextNode(params.text);
        } else {
            // We are creating a regular HTML element
            elem = document.createElement(element);

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
        }

        parent.appendChild(elem);
    }


    /**
     * Called when the form is submitted. First, we parse the form and turn it into a JSON
     * data block. Special thanks to zzzzBov on Stack Overflow for a shove in the right direction:
     * https://stackoverflow.com/questions/30964568/how-to-get-a-key-value-data-set-from-a-html-form
     * Then, we follow the user's directions in terms of what to do with it.
     * 
     * @param  {obj} event  The submit event object
     */
    submit(event) {
        event.preventDefault();
        // console.log('submit called!', event);
        // console.log('form', event.target);
        // console.log('elements', event.target.elements);

        if( event && event.target && event.target.elements ) {
            let data = Array.prototype.slice.call(event.target.elements)
            .filter(function (element) {
                // Remove disabled elements
                return !element.disabled;
            }).filter(function (element) {
                // Remove buttons
                return element.type !== 'submit' && element.type !== 'reset' && element.tagName.toLowerCase() !== 'button';
            }).filter(function(element) {

                let tagName = element.tagName.toLowerCase();
                let tagType = element.type.toLowerCase();
                // console.log("check this one", element.type);
                if( tagName === 'input' && (tagType === 'checkbox' || tagType === 'radio') ) {
                    // Is it checked?
                    return element.checked;
                } else {
                    // Pass it on
                    return true;
                }
            }).map(function (element) {
                
                let key, value;
                switch ( element.tagName.toLowerCase() ) {
                    case 'checkbox':
                    case 'radio':
                        key     = element.name;
                        value   = element.value === null ? 'on' : element.value;
                        return { [key]: value };
                    case 'select':
                        key     = element.name;
                        value   = element.value;
                        if (element.multiple) {
                            value = slice.call(element.selectedOptions)
                                .map(function (option) {
                                    return option.value;
                                })
                            return { [key]: value };
                        } else {
                            return { [key]: value };
                        }
                    default:
                        key     = element.name;
                        value   = element.value || '';
                        return { [key]: value };
                }
            });
            // console.log("newElems", newElems);
            console.log("submit data:", data);

            if( this.submitFn ) {
                // Call a submit function
                this.submitFn(data);
            }
        }

        
    }
}