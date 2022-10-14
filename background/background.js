let q = selector => document.querySelector(selector);

var currentService;
var currentCategory;
var currentFeature;

function loadUI() {
    currentCategory = appData.categories[0];
    currentFeature = currentCategory.features[0];
    currentService = currentFeature.services[0];
    loadNavBar();
    loadMenu(0);
    loadServicesContainer(appData.categories[0].features[0]);
};

function loadMenu(activeFeatureId) {
    q('#side-menu').appendChild(
        dom.div([
            appData.categories.map(category =>
                dom.div([
                    dom.p({class: 'menu-label'}, [
                        category.label
                    ]),
                    dom.ul({class: 'menu-list'}, [
                        category.features.map(feature =>
                                dom.li([
                                    dom.a({id: `feature-${feature.featureId}-label`}, [
                                        feature.featureName
                                    ])
                                ])
                        )
                    ])
                ])
            )
        ], {
            after: function(el) {
                el.querySelector(`#feature-${activeFeatureId}-label`).classList.add('is-active');
            }
        })
    )
}

function loadServicesContainer(feature) {
    q('#services-container').appendChild(
        dom.div([
            dom.div({class: 'mrgn'}, [
                dom.div([
                    dom.p({class: 'subtitle is-4 mrgn'}, ['Services:'])
                ]),
                dom.div({class: 'dropdown is-hoverable'}, [
                    dom.div({class: 'dropdown-trigger'}, [
                        dom.button({class: 'button', 'aria-haspopup': true, 'aria-controls': 'dropdown-menu'}, [
                            dom.span([currentService.name]),
                            dom.span({class: 'icon is-small'}, [
                                dom.i({class: 'fas fa-angle-down'})
                            ])
                        ])
                    ]),
                    dom.div({class: 'dropdown-menu', id: 'dropdown-menu', role:"menu"}, [
                        dom.div({class: 'dropdown-content'}, [
                            feature.services.map(service => 
                                dom.a({class: 'dropdown-item'}, [
                                    service.name
                                ])
                            )
                        ], {after: function(el) {
                                el.children[0].classList.add('is-active');
                        }})
                    ])
                ]) 
            ]),
            dom.div([
                dom.div({class: 'mrgn'}, [
                    dom.input({id: `service-name-${currentService.serviceId}`, class: 'input', type: 'text', placeholder: 'service name', value: currentService.name })
                ]),
                dom.div({class: 'mrgn'}, [
                    dom.input({id: `service-url-${currentService.serviceId}`, class: 'input', type: 'text', placeholder: 'service url', value: currentService.url })
                ]),
                dom.div({class: 'mrgn'}, [
                    dom.textarea({id: `service-data-${currentService.serviceId}`, class: 'textarea', placeholder: 'service response', value: JSON.stringify(currentService.data, undefined, 4)})
                ], {after: function(el) {
                    el.children[0].value = JSON.stringify(currentService.data, undefined, 4);
                }
                })
            ])
        ])
    );
}

function loadNavBar() {
    q('.navbar-end').appendChild(
        dom.div([
            dom.div({class: 'navbar-item'}, [
                dom.div({class: 'buttons'}, [
                    dom.a({class: 'button is-primary'}, [
                        dom.strong(['Save'])
                    ], {
                        click: saveService
                    }),
                    dom.a({class: 'button is-light'}, [
                        'Settings'
                    ])
                ])
            ])
        ])
    );
}

function saveService() {
    currentService.url = q(`#service-url-${currentService.serviceId}`).value;
    currentService.name = q(`#service-name-${currentService.serviceId}`).value;
    currentService.data = JSON.parse(q(`#service-data-${currentService.serviceId}`).value);

    var newServices = currentFeature.services.map(service => service.serviceId === currentService.serviceId ? currentService :  service);
    currentFeature.services = newServices;
    var newFeatures = currentCategory.features.map(feature => feature.featureId === currentFeature.featureId ? currentFeature : feature);
    currentCategory.features = newFeatures;
    var newCategories = appData.categories.map(category => category.categoryId === currentCategory.categoryId ? currentCategory : category);
    appData.categories = newCategories;
    saveData();
}