import { Mail, parse } from '../models/Mail';
import { randomUUID, UUID } from 'node:crypto';

import { MailingList } from '../models/MailingList';
import { MailServiceResponse } from '../models/MailServiceResponse';
import {
  MailingListRepository,
  PrismaPostgresMailingListRepository,
} from '../repositories/MailingListRepository';
import { MailService } from './MailService';

interface MailingListService {
  createMailingList(tenantId: UUID, name: String): Promise<UUID | null>;

  deleteMailingList(tenantId: UUID, id: UUID): Promise<boolean>;

  renameMailingList(tenantId: UUID, id: UUID, name: string): Promise<boolean>;

  addEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean>;

  removeEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean>;

  getAllEmails(tenantId: UUID, id: UUID): Promise<string[]>;

  emailExists(tenantId: UUID, id: UUID, email: string): Promise<boolean>;

  sendMailToMailingList(
    tenantId: UUID,
    id: UUID,
    from: string,
    to: MailingList,
    subject: string,
    text: string,
    html: string,
  ): Promise<MailServiceResponse | null>;
}

class MailingListServiceImpl {
  private _mailingListRepository: PrismaPostgresMailingListRepository;
  private _mailService: MailService;

  constructor(mailingListRepository: MailingListRepository, mailService: MailService) {
    this._mailingListRepository = mailingListRepository;
    this._mailService = mailService;
  }

  async createMailingList(tenantId: UUID, name: String): Promise<UUID | null> {
    try {
      const mailingListId = await this._mailingListRepository.createMailingList(tenantId, name);
      if (!mailingListId) {
        console.error('Could not create mailing list');
        return null;
      }

      return mailingListId as UUID;
    } catch (error) {
      console.error('Could not create mailing list');
      return null;
    }
  }

  async deleteMailingList(tenantId: UUID, id: UUID): Promise<boolean> {
    try {
      const mailingListDeleted = await this._mailingListRepository.deleteMailingList(tenantId, id);
      if (!mailingListDeleted) {
        console.error('Could not delete mailing list');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Could not delete mailing list');
      return false;
    }
  }

  async renameMailingList(tenantId: UUID, id: UUID, name: string): Promise<boolean> {
    try {
      const mailingListRenamed = await this._mailingListRepository.renameMailingList(
        tenantId,
        id,
        name,
      );
      if (!mailingListRenamed) {
        console.error('Could not rename mailing list');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Could not rename mailing list');
      return false;
    }
  }

  async addEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean> {
    try {
      const emailAdded = await this._mailingListRepository.addEmail(tenantId, id, email);
      if (!emailAdded) {
        console.error('Could not add email to mailing list');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Could not add email to mailing list');
      return false;
    }
  }

  async removeEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean> {
    try {
      const emailRemoved = await this._mailingListRepository.removeEmail(tenantId, id, email);
      if (!emailRemoved) {
        console.error('Could not remove email from mailing list');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Could not remove email from mailing list');
      return false;
    }
  }

  async getAllEmails(tenantId: UUID, id: UUID): Promise<string[]> {
    try {
      const emails = await this._mailingListRepository.getAllEmails(tenantId, id);
      if (!emails) {
        console.error('Could not get emails from mailing list');
        return [];
      }

      return emails;
    } catch (error) {
      console.error('Could not get emails from mailing list');
      return [];
    }
  }

  async emailExists(tenantId: UUID, id: UUID, email: string): Promise<boolean> {
    try {
      const emailExists = await this._mailingListRepository.emailExists(tenantId, id, email);
      if (!emailExists) {
        console.error('Could not check if email exists in mailing list');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Could not check if email exists in mailing list');
      return false;
    }
  }

  async sendMailToMailingList(
    tenantId: UUID,
    id: UUID,
    from: string,
    to: MailingList,
    subject: string,
    text: string,
    html: string,
  ): Promise<MailServiceResponse[] | null> {
    try {
      let responses: MailServiceResponse[] = [];

      const toEmailIds = await this._mailingListRepository.getAllEmails(tenantId, to.id);
      if (!toEmailIds) {
        console.error('Could not get to emails from mailing list');
        return null;
      }

      for (const emailId of toEmailIds) {
        const mail = new Mail(from, emailId, subject, text, html);

        if (!(await this._mailService.addMailToQueue(mail))) {
          responses.push(new MailServiceResponse(mail.mailId, false));
        }
      }

      let _r = await this._mailService.send();

      for (const _mail of _r) {
        responses.push(_mail);
      }

      return responses;
    } catch (error) {
      console.error('Could not send mail to mailing list');
      return null;
    }
  }
}
