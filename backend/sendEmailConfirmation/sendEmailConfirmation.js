class SendEmailConfirmation {
  constructor(emailDB, emailService) {
    this.emailDB = emailDB;
    this.emailService = emailService;
  }

  async process(orderConfirmations) {
    try {
      for (const orderConfirmation of orderConfirmations) {
        if(await this.emailDB.verifyEmailAddress(orderConfirmation.email)) {
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
    toAddress.push(orderConfirmation.email);
    console.log(orderConfirmation);

    try {
      await this.emailService.sendEmail(toAddress, orderConfirmation);
    }
    catch (e) {
      console.log(e);
    }
  }
}
module.exports = SendEmailConfirmation;
