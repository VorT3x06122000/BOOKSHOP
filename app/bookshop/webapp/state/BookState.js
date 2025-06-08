sap.ui.define([
    "../state/BaseState",
], function (BaseState) {
    "use strict";
    var BookState = BaseState.extend("my.bookshop.bookshop.state.BookState", {
        constructor: function (oService) {
            this.data = {
                display: true,
                busy: true                
            };
            this.BookService = oService;
            BaseState.call(this);
        }
       

    });
    return BookState;
});