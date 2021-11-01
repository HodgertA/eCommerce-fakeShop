class SendEmailConfirmation {
  constructor(emailDB, emailService) {
    this.emailDB = emailDB;
    this.emailService = emailService;
  }

  async process(orderConfirmations) {
    try {
      for (const orderConfirmation of orderConfirmations) {
        if(await this.emailDB.verifyEmailAddress(orderConfirmation.shippingData?.email)) {
          await this.sendEmail(orderConfirmation);
        }
      }

    }
    catch (e) {
      console.log(e);
    }
  }

  async sendEmail(orderConfirmation) {
    const toAddress = [];
    toAddress.push(orderConfirmation.shippingData?.email);

    try {
      await this.emailService.sendEmail(toAddress);
    }
    catch (e) {
      console.log(e);
    }
  }
}
module.exports = SendEmailConfirmation;
