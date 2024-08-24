import { Mail } from './Mail';
import { randomUUID, UUID } from 'node:crypto';

/**
 * Represents a mailing list object to be used in conjunction with MailServices.
 */
export class MailingList {
  /**
   * Unique identifier for the mailing list object.
   */
  readonly id: UUID;
  readonly tenantId: UUID;
  accessor name: string;
  accessor emailIds: string[];

  /**
   * Constructs a new MailingList object.
   * @param tenantId - Tenant identifier.
   * @param id idOptional unique identifier for the mailing list. If not provided, a UUID will be generated.
   * @param name - Name for the mailing list.
   * @param emailIds - Optional array of Mail objects.
   */
  constructor(tenantId: UUID, name: string, id?: UUID, emailIds: string[] = []) {
    this.tenantId = tenantId;
    this.name = name;
    this.id = id ? id : randomUUID();
    this.emailIds = emailIds ? emailIds : [];
  }
}
