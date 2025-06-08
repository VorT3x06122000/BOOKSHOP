sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
    "use strict";
    return Object.extend("my.bookshop.bookshop.state.BaseState", {
       //method to get model
        getModel: function() {
            if (!this.model) {
                this.model = new JSONModel(this.data, true);
            }
            return this.model;
        },
        //method to update model
        updateModel: function(bHardRefresh) {
            if (this.model) {
                this.model.refresh(bHardRefresh ? true : false);
            }
        }
    });
});