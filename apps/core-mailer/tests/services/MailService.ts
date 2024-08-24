import { expect } from 'chai';
import { NodeMailerMailService } from '../../src/services/MailService';
import { Mail } from '../../src/models/Mail';
import { MailServiceResponse } from '../../src/models/MailServiceResponse';
import { randomUUID } from 'node:crypto';

describe('NodeMailerMailService', () => {
  let mailService: NodeMailerMailService;

  beforeEach(() => {
    mailService = new NodeMailerMailService();
  });

  describe('addMailToQueue', () => {
    it('should add a mail to the queue', async () => {
      const mail: Mail = new Mail(
        'sender@email.com',
        'reciever@email.com',
        'Subject',
        'Text content',
        'HTML content',
      );
      const result = await mailService.addMailToQueue(mail);
      expect(result).to.be.true;
    });
  });

  describe('removeAllMailsFromQueue', () => {
    it('should remove all mails from the queue', async () => {
      const mail: Mail = new Mail(
        'sender@email.com',
        'reciever@email.com',
        'Subject',
        'Text content',
        'HTML content',
      );
      await mailService.addMailToQueue(mail);
      const result = await mailService.removeAllMailsFromQueue();
      expect(result).to.be.true;
    });
  });

  describe('send', () => {
    it('should send all mails in the queue', async () => {
      const mail: Mail = new Mail(
        'sender@email.com',
        'reciever@email.com',
        'Subject',
        'Text content',
        'HTML content',
      );
      await mailService.addMailToQueue(mail);
      const responses: MailServiceResponse[] = await mailService.send();
      expect(responses).to.have.lengthOf(1);
      expect(responses[0].mailId).to.equal(mail.mailId);
      expect(responses[0].success).to.be.true;
    });

    it('should return an empty array if no mails are in the queue', async () => {
      const responses: MailServiceResponse[] = await mailService.send();
      expect(responses).to.be.an('array').that.is.empty;
    });
  });
});
