import { Mail, parse } from '../models/Mail';
import { MailServiceResponse } from '../models/MailServiceResponse';
import { randomUUID, UUID } from 'node:crypto';

import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL as string);

import { logger } from '../config/logger';

export interface MailService {
  addMailToQueue(mail: Mail): Promise<boolean>;

  removeAllMailsFromQueue(): Promise<boolean>;

  send(): Promise<MailServiceResponse[]>;
}

export class NodeMailerMailService implements MailService {
  private _queueId: UUID = randomUUID();
  private _count: number = 0;

  async addMailToQueue(mail: Mail): Promise<boolean> {
    await client.set(`${this._queueId.toString()}:${mail.mailId}`, mail.toString());
    this._count++;
    return Promise.resolve(true);
  }

  async removeAllMailsFromQueue(): Promise<boolean> {
    await client.del(`${this._queueId.toString()}:*`);
    this._count = 0;
    return Promise.resolve(true);
  }

  async send(): Promise<MailServiceResponse[]> {
    const responses: MailServiceResponse[] = [];

    const _mailQueue: string[] = await client.keys(`${this._queueId.toString()}:*`);
    for (const _mailId of _mailQueue) {
      try {
        const _m = await client.get(_mailId);
        if (_m) {
          const mail: Mail = parse(_m) as Mail;
          await client.del(_mailId);
          responses.push(new MailServiceResponse(mail.mailId, true));
        }
      } catch (error) {
        logger.info(`Did not find mail specified in MailServer queue: ${this._queueId.toString()}`);
      }
    }
    return responses;
  }
}
