import { randomUUID, UUID } from 'node:crypto';

/**
 * Represents a mail object to be used in conjunction with MailServices.
 */
export class Mail {
  /**
   * A unique identifier for the mail.
   */
  readonly mailId: UUID;
  accessor from: string;
  accessor to: string;
  accessor subject: string;
  accessor text: string;
  accessor html: string;

  /**
   * Constructs a new Mail object.
   *
   * @param from - The sender of the mail.
   * @param to - The recipient of the mail.
   * @param subject - The subject of the mail.
   * @param text - The text content of the mail.
   * @param html - The HTML content of the mail.
   * @param mailId - Optional unique identifier for the mail. If not provided, a UUID will be generated.
   */
  constructor(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
    mailId: UUID = randomUUID(),
  ) {
    this.mailId = mailId;
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }

  /**
   * Returns a string representation of the mail with quoted values.
   */
  toString(): string {
    return `{
            mailId: "${this.mailId}",
            from: "${this.from}",
            to: "${this.to}",
            subject: "${this.subject}",
            text: "${this.text}",
            html: "${this.html}"
        }`;
  }
}

/**
 * Parses a string representation of a mail object and returns a Mail instance.
 *
 * @param str - The string representation of a Mail object.
 * @returns A Mail instance.
 */
export function parse(str: string): Mail {
  const parsed = JSON.parse(str.replace(/(\w+):/g, '"$1":')); // Add quotes around keys
  return new Mail(parsed.from, parsed.to, parsed.subject, parsed.text, parsed.html, parsed.mailId);
}
