/**
 * Represents the response from a mail service after sending an email.
 */
export class MailServiceResponse {
  /**
   * Unique identifier for the mail.
   */
  readonly mailId: string;

  /**
   * Indicates whether the mail was sent successfully.
   */
  accessor success: boolean;

  /**
   * Optional message providing additional information about the mail sending process.
   */
  accessor message: string;

  /**
   * Constructs a new MailServiceResponse object.
   *
   * @param mailId - Unique identifier for the mail.
   * @param success - Indicates whether the mail was sent successfully.
   * @param message - Optional message providing additional information about the mail sending process.
   */
  constructor(mailId: string, success: boolean, message: string = '') {
    this.mailId = mailId;
    this.success = success;
    this.message = message;
  }
}
