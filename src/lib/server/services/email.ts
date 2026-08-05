import { BrevoClient, BrevoError, BrevoTimeoutError } from '@getbrevo/brevo';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { APP_NAME } from '$lib/config';
import type { SendTransacEmailRequest } from '@getbrevo/brevo/transactionalEmails';

/** @public */
export type SendEmailInput = {
	to: string[];
	subject: string;
	content: string;
};

export interface EmailService {
	sendEmail(input: SendEmailInput): Promise<void>;
}

/** @public */
export class EmailSendError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);

		this.name = 'EmailSendError';
	}
}

class BrevoEmailService implements EmailService {
	private readonly client: BrevoClient;
	private readonly sender: SendTransacEmailRequest.Sender;

	constructor() {
		this.client = new BrevoClient({
			apiKey: env.BREVO_API_KEY!,
			timeoutInSeconds: 15,
			maxRetries: 3
		});
		this.sender = {
			name: APP_NAME,
			email: env.BREVO_SENDER_EMAIL!
		};
	}

	async sendEmail(input: SendEmailInput) {
		try {
			const recipients = input.to.map((email) => ({ email }));

			const { messageId, messageIds } = await this.client.transactionalEmails.sendTransacEmail({
				sender: this.sender,
				subject: input.subject,
				to: recipients,
				textContent: input.content
			});

			const sentMessages = messageId ? [messageId] : (messageIds ?? []);

			if (sentMessages.length !== recipients.length) {
				throw new EmailSendError(`Requested Brevo to send ${recipients.length} emails but ${sentMessages.length} got sent`);
			}
		} catch (error) {
			if (error instanceof EmailSendError) {
				throw error;
			}

			if (error instanceof BrevoTimeoutError) {
				throw new EmailSendError(`Timed out sending email via Brevo: ${error.message}`, { cause: error });
			}

			if (error instanceof BrevoError) {
				throw new EmailSendError(`Failed to send email via Brevo: ${error.message}`, { cause: error });
			}

			throw error;
		}
	}
}

/**
 * Dev fallback: without a Brevo key nothing can be sent, and sign-up would dead-end
 * at the verification mail. Printing the mail (including the verification/reset
 * link) to the server console keeps a fresh checkout usable with no external
 * account. Refuses to run in production — there, a missing key is a config error.
 */
class ConsoleEmailService implements EmailService {
	async sendEmail(input: SendEmailInput) {
		console.info(
			[
				'',
				'─── email (dev, not sent) ───',
				`to:      ${input.to.join(', ')}`,
				`subject: ${input.subject}`,
				input.content,
				'─────────────────────────────',
				''
			].join('\n')
		);
	}
}

const useConsoleEmail = dev && !env.BREVO_API_KEY;

if (useConsoleEmail) {
	console.warn('[email] BREVO_API_KEY is not set — mails are printed to this console instead of being sent.');
}

export const emailService: EmailService = useConsoleEmail ? new ConsoleEmailService() : new BrevoEmailService();
