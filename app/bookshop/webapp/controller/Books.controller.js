sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("my.bookshop.bookshop.controller.Books", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteBooks").attachPatternMatched(this._onObjectMatched, this);
            this.BookSrv = this.getOwnerComponent().getService('Book');
            this.BookState = this.getOwnerComponent().getState('Book');
        },
        getResourceBundleText: function (sTextProperty) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextProperty);
        },

        _onObjectMatched: function () {
        },

        onItemSelect: function(oEvent){
            let Indices = oEvent.getSource().getSelectedIndices();
            if(Indices.length >0){
                this.getView().byId("btnAction").setEnabled(true);
            }
            else{
                this.getView().byId("btnAction").setEnabled(false);
            }


        },

        onPress : function (){
            var that=this;
            var sSelData = this.getView().byId("oTable").getSelectedIndices();
            var count = 0;
            for (var i=0; i<sSelData.length;i++){;
                let index =sSelData[i]
                let selectedObj = this.getView().byId("oTable").getContextByIndex(index).getObject();
                if(selectedObj.FlagRead!=null && selectedObj.FlagRead!=0){
                    count++;
                }
            }
            if(count!=0){
                MessageBox.confirm(this.getResourceBundleText("UpdateRecQues"), {
                    icon: "QUESTION",
                    title: "Confirm",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                    if (oAction === "YES") {
                        that._savedata();
                    }else{
                        return;
                    }}})
            }
            else{
                this._savedata();
            }

        },

        _savedata : async function (){
            var that=this;
            var sSelData = this.getView().byId("oTable").getSelectedIndices();
            var oPayload = [];
            for (var i=0; i<sSelData.length;i++){
                var oData={};
                let index =sSelData[i]
                let selectedObj = this.getView().byId("oTable").getContextByIndex(index).getObject();
                oData.ID=selectedObj.ID;
                oData.title=selectedObj.title;
                oData.FlagRead="X";
                oPayload.push(oData);
            }

            if(oPayload!=0){
                var oView = this.getView();
                var oSaveData = { PostingData: oPayload };
                oView.setBusy(true);

                return this.BookSrv.updateRM(oSaveData).then(
                    function(data){
                        oView.setBusy(false);
                        MessageBox.success(this.getResourceBundleText("savesucc"));
                        this.getView().byId("smarttable").rebindTable(true);
                        this.getView().byId("btnAction").setEnabled(false);
                    }.bind(this),
                    function (error) {
                        MessageBox.error(this.getResourceBundleText("Error"));
                        oView.setBusy(false);
                    }.bind(this)
                );
                
            }
            else{
                MessageBox.error(this.getResourceBundleText("RecNotSelected"));
                this.getView().byId("btnAction").setEnabled(false);
                return;
            }

        },

        onAddPress: function (){
            var oModel = this.getOwnerComponent().getModel("oBasicDataModel");
                if (!this.fragmentOpen) {
                    this.fragmentOpen = sap.ui.xmlfragment("my.bookshop.bookshop.fragments.addBook", this);
                }
                this.getView().addDependent(this.fragmentOpen);
                this.fragmentOpen.setModel(oModel);
                this.fragmentOpen.open();
        },

        onPressCancel: function () {
            this.fragmentOpen.close();
        },

        onPressAddBook: function(){
            var sConid = this.fragmentOpen.getModel().oData;
            var Idval =sConid.ID;
            var Titleval=sConid.title;
            var Stckval =sConid.stock;
            var oPayload = {};
            if(Idval.match(/^-?\d+$/) && Idval.length<=10){
                oPayload.ID=Idval
                this.fragmentOpen.getModel().oData.IDvaluState = "None";
                this.fragmentOpen.getModel().oData.IDstateText = "";
                this.fragmentOpen.getModel().refresh(true);
            }
            else{
                this.fragmentOpen.getModel().oData.IDvaluState = "Error";
                this.fragmentOpen.getModel().oData.IDstateText = "Please Enter Integer Only";
                this.fragmentOpen.getModel().refresh(true);
            }
            if(Titleval.match(/^[a-zA-Z\s]*$/) && Titleval.length<=30){
                oPayload.title=Titleval
                this.fragmentOpen.getModel().oData.TitleState = "None";
                this.fragmentOpen.getModel().oData.TitleStateText = "";
                this.fragmentOpen.getModel().refresh(true);
            }
            else{
                this.fragmentOpen.getModel().oData.TitleState = "Error";
                this.fragmentOpen.getModel().oData.TitleStateText = "Please Enter String Value Only";
                this.fragmentOpen.getModel().refresh(true);
            }
            if(Stckval.match(/^-?\d+$/) && Stckval.length<=10){
                oPayload.stock=Stckval
                this.fragmentOpen.getModel().oData.StockState = "None";
                this.fragmentOpen.getModel().oData.StockStateText = "";
                this.fragmentOpen.getModel().refresh(true);
            }
            else{
                this.fragmentOpen.getModel().oData.StockState = "Error";
                this.fragmentOpen.getModel().oData.StockStateText = "Please Enter String Value Only";
                this.fragmentOpen.getModel().refresh(true);
            }

            if(oPayload.ID.match(/^-?\d+$/) && oPayload.title.match(/^[a-zA-Z\s]*$/) && oPayload.stock.match(/^-?\d+$/)){
                var oView = this.getView();
                oView.setBusy(true);
                return this.BookSrv.triggerPosting({ PostingData: JSON.stringify(oPayload)}).then(
                    function () {
                        oView.setBusy(false);
                        this.getView().byId("smarttable").rebindTable(true);
                        this.fragmentOpen.close();
                        MessageBox.success(this.getResourceBundleText("savesucc"));
                    }.bind(this),
                    function (error) {
                        oView.setBusy(false);
                        MessageBox.error(this.getResourceBundleText("Error"));
                    }.bind(this));   
            } 
            else{
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("InvInp"));
                return;
            }

        },
    });
});