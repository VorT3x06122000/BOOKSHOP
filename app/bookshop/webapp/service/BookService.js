sap.ui.define([
    "./CoreService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    
], function (CoreService,Filter,FilterOperator) {
    "use strict";

    var PLMService = CoreService.extend("my.bookshop.bookshop.service.BookService", {
        constructor: function (model) {
            CoreService.call(this, model);
        },

        /**
        * Odata service for Update operation
        * **/
        
        updateRM: function (oSaveData) {
            return this.odata("/UpdateReadMark").post(oSaveData);
        },
        triggerPosting: function (oSaveData) {
            return this.odata("/NewBookPost").post(oSaveData);
        },
    

    });
    return PLMService;
});