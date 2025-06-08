sap.ui.define([
    "sap/ui/core/UIComponent",
    "my/bookshop/bookshop/model/models",    
    "./service/BookService",
    "./state/BookState"
], (UIComponent, models, BookService, BookState) => {
    "use strict";

    return UIComponent.extend("my.bookshop.bookshop.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            //Initialize service with the component
            this._oBookService = new BookService(this.getModel());
            //Initialize state with the component
            this._oBookState = new BookState(this._oBookService);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            
            this.setModel(this._oBookState.getModel(), "oJSONModel");

            // enable routing
            this.getRouter().initialize();
        },

         // Return the service name as per parameter
        getService: function (sService) {
            return this["_o" + sService + "Service"];
        },
        // Return the state name as per parameter
        getState: function (sState) {
            return this["_o" + sState + "State"];
        }
    });
});