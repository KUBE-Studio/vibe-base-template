import { APP_NAME } from '$lib/config';

type EmailTemplate = {
	subject: string;
	content: string;
};

/**
 * All transactional copy lives here, not inline in routers — one place to
 * review wording, and the routers stay readable.
 */
export function buildVerificationEmail(url: string): EmailTemplate {
	return {
		subject: `${APP_NAME} – E-Mail bestätigen`,
		content: `Bitte bestätige deine E-Mail-Adresse: ${url}`
	};
}

export function buildResetPasswordEmail(url: string): EmailTemplate {
	return {
		subject: `${APP_NAME} – Passwort zurücksetzen`,
		content: `Passwort zurücksetzen: ${url}`
	};
}

export function buildRegistrationApprovedEmail(params: { userName: string; loginUrl: string }): EmailTemplate {
	return {
		subject: `${APP_NAME} – Registrierung freigegeben`,
		content:
			`Hallo ${params.userName},\n\n` +
			`deine Registrierung wurde freigegeben.\n\n` +
			`Du kannst dich jetzt anmelden: ${params.loginUrl}\n\n` +
			`Viel Erfolg!`
	};
}

export function buildRegistrationDeclinedEmail(params: { userName: string }): EmailTemplate {
	return {
		subject: `${APP_NAME} – Registrierung abgelehnt`,
		content:
			`Hallo ${params.userName},\n\n` +
			`leider konnte deine Registrierung nicht freigegeben werden.\n\n` +
			`Bei Fragen kannst du dich jederzeit bei uns melden.\n\n` +
			`Viele Grüße`
	};
}
