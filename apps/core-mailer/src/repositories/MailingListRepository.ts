import { UUID } from 'node:crypto';
import prisma from './prisma';

export interface MailingListRepository {
  createMailingList(tenantId: UUID, name: String): Promise<UUID | null>;

  deleteMailingList(tenantId: UUID, id: UUID): Promise<boolean>;

  renameMailingList(tenantId: UUID, id: UUID, name: string): Promise<boolean>;

  addEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean>;

  removeEmail(tenantId: UUID, id: UUID, email: string): Promise<boolean>;

  getAllEmails(tenantId: UUID, id: UUID): Promise<string[]>;

  emailExists(tenantId: UUID, id: UUID, email: string): Promise<boolean>;
}

export class PrismaPostgresMailingListRepository {
  async createMailingList(tenantId: UUID, name: String): Promise<UUID | null> {
    try {
      const mailingList = await prisma.mailingList.create({
        data: {
          tenantId: tenantId,
          name: name,
        },
      });

      if (!mailingList) {
        console.error('Could not create mailing list');
        return null;
      }

      return mailingList.id as UUID;
    } catch (error) {
      console.error('Could not create mailing list');
      return null;
    }
  }

  async deleteMailingList(tenantId: UUID, id: UUID): Promise<boolean> {
    try {
      const mailingList = await prisma.mailingList.delete({
        where: {
          tenantId: tenantId,
          id: id,
        },
      });

      if (!mailingList) {
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
      const mailingList = await prisma.mailingList.update({
        where: {
          tenantId: tenantId,
          id: id,
        },
        data: {
          name: name,
        },
      });

      if (!mailingList) {
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
      const mailingList = await prisma.mailingList.update({
        where: {
          tenantId: tenantId,
          id: id,
        },
        data: {
          emails: {
            push: email,
          },
        },
      });

      if (!mailingList) {
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
      const mailingList = await prisma.mailingList.update({
        where: {
          tenantId: tenantId,
          id: id,
        },
        data: {
          emails: {
            set: {
              delete: email,
            },
          },
        },
      });

      if (!mailingList) {
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
      const mailingList = await prisma.mailingList.findUnique({
        where: {
          tenantId: tenantId,
          id: id,
        },
      });

      if (!mailingList) {
        console.error('Could not get emails from mailing list');
        return [];
      }

      return mailingList.emails;
    } catch (error) {
      console.error('Could not get emails from mailing list');
      return [];
    }
  }

  async emailExists(tenantId: UUID, id: UUID, email: string): Promise<boolean> {
    try {
      const mailingList = await prisma.mailingList.findUnique({
        where: {
          tenantId: tenantId,
          id: id,
        },
      });

      if (!mailingList) {
        console.error('Could not check if email exists in mailing list');
        return false;
      }

      return mailingList.emails.includes(email);
    } catch (error) {
      console.error('Could not check if email exists in mailing list');
      return false;
    }
  }
}
