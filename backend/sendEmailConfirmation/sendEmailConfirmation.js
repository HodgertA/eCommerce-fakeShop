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
      throw new Error('Something went wrong sending a confirmation email.', { cause: e });
    }
  }

  async sendEmail(orderConfirmation) {
    const toAddress = [];
    toAddress.push(orderConfirmation.email);
    
    await this.emailService.sendEmail(toAddress, orderConfirmation);
  }
}
module.exports = SendEmailConfirmation;
