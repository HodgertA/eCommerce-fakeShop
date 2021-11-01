class EmailService {
    constructor(ses, templateName, source, configurationSetName) {
        this.SES = ses;
        this.templateName = templateName;
        this.source = source;
        this.configurationSetName = configurationSetName;
    }

    async sendEmail(destinationList) {
        var params = {};
        var templateData = {};
        var desination = {
            "BccAddresses": destinationList
        }

        params.Source = this.source;
        params.Destination = desination;
        params.Template = this.templateName;
        params.TemplateData = JSON.stringify(templateData);
        params.ConfigurationSetName = this.configurationSetName;

        try {
            await this.SES.sendTemplatedEmail(params).promise();
        }
        catch (e){
            console.log(e);
            const errorMsg = "Something went wrong in sending an email";
        }
     }
}
module.exports = EmailService;