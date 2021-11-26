// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createProductForm = (categories,tags) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer(), validators.min (0)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'ageGroup':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'brand': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'condition': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'category_id': fields.string({
            label:'Category',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices:tags
        }),
        'image_url':fields.string({
            widget: widgets.hidden()
        })
    })
};

// User registration

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            'required': true,
            'errorAfterField': true,
        }),
        'email': fields.email({
            'required': true,
            'errorAfterField': true
        }),
        'role': fields.string({
            'required': true,
            'errorAfterField': true,
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'widget': widgets.password()
        }),
        'confirm_password': fields.string({
            'required': true,
            'errorAfterField': true,
            'widget': widgets.password(),
            'validators': [validators.matchField('password')]
        })
    })
}

// login form
const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
}

// search engine
const createSearchForm = function (categories, tags) {
    return forms.create({
        "name": fields.string({
            required: false,
            errorAfterField: true,
        }),
        "brand": fields.string({
            required: false,
            errorAfterField: true,
        }),
        "category_id": fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(), 
            choices: categories
        }),
        // "min_cost": fields.string({
        //     required: false,
        //     errorAfterField: true,
        //     validators: [validators.integer(), validators.min(0)]
        // }),
        "max_cost": fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),       
        
        "tags": fields.string({
            required: false,
            erorrAfterField: true,
            widget: widgets.multipleSelect(),
            choices: tags
        })      
    })
}

// orders search engine
const SearchOrderForm = function () {
    return forms.create({
        "order_id": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        "max_amount": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }),       
        "user_id": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // 'validators': [validators.integer()]

        }),
    })
}

// order status update form
const orderStatusForm = () => {
    return forms.create({
        'order_status': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
};
module.exports = { createProductForm, createRegistrationForm, createLoginForm, createSearchForm ,bootstrapField, SearchOrderForm, orderStatusForm };

