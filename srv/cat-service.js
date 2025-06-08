const cds = require('@sap/cds');
const TextBundle = require('@sap/textbundle').TextBundle;
const bundle = new TextBundle('./_i18n/i18n');
const { Books } = cds.entities('my.bookshop');
const { MailClient } = require('@sap-cloud-sdk/mail-client');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');
const { renderTemplate } = require('./utils/templateRenderer');
module.exports = cds.service.impl(async function () {

    this.on('UpdateReadMark',async(req) =>{
        try{
            msgLog = [];
                let oData = req.data;
                var aPayload = oData.PostingData;
                const tx = cds.transaction(req);
                const htmlContent = renderTemplate('welcome', {title:aPayload[0].title});
                console.log(htmlContent);
                for(let i=0;i<aPayload.length;i++){
                    var resLocation = await tx.run(UPDATE.entity(Books).
                    data({
                        FlagRead:aPayload[i].FlagRead
                    }).where({ ID: aPayload[i].ID})).catch((error) => {
                        msgLog.push({ "type": "Error", "message": error.message });
                    });
                }    

                if (resLocation && resLocation > 0) {
                    msgLog.push({ "type": "Success", "message": bundle.getText("RecordUpdate") });
                }
                return JSON.stringify(msgLog);
        }
        catch (error) {
            console.log(error);
            return error;

        }
    });

    this.on('NewBookPost',async(req) =>{
        try{
            msgLog = [];
                let oData = req.data;
                let aPayload = JSON.parse(oData.PostingData);
                const tx = cds.transaction(req);
                let insertresult = await tx.run(INSERT.into(Books).entries(aPayload)).catch((error) => {
                    msgLog.push({ "type": "Error", "message": error.message });
                });    

                if (insertresult > 0) {
                    msgLog.push({ "type": "Success", "message": bundle.getText("BookAdded") });
                }
                return JSON.stringify(msgLog);
        }
        catch (error) {
            console.log(error);
            return error;

        }
    });

    this.on('SendEmailNotification', async (req) => {
        const jwt = retrieveJwt(req); // requires XSUAA-based auth
        const { email, name, username } = req.data;
        const htmlContent = renderTemplate('welcome', { name:'Vyankatesh', username:'Vk0612' });
        const mailClient = new MailClient({ destinationName: 'MAIL_SERVICE_DEST' });
        await mailClient.sendMail(
          {
            from: 'no-reply@example.com',
            to: [email],
            subject: 'Welcome to Our App!',
            html: htmlContent
          },
          { jwt }
        );
        return { message: 'Mail sent successfully' };
      });


    


})


