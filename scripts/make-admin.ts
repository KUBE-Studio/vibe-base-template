/**
 * Makes an existing, confirmed account an approved admin — the only way to the
 * first admin of a fresh installation, since nobody can approve the first sign-up.
 *
 *   bun run make-admin you@example.com
 *
 * Reads DATABASE_URL from the environment (bun loads .env on its own). On a server,
 * see README ("Ersten Admin anlegen").
 */
import postgres from 'postgres';

const email = process.argv[2]?.trim().toLowerCase();
const databaseUrl = process.env.DATABASE_URL;

if (!email) {
	console.error('Aufruf: bun run make-admin <E-Mail-Adresse>');
	process.exit(1);
}

if (!databaseUrl) {
	console.error('DATABASE_URL ist nicht gesetzt (siehe .env.example).');
	process.exit(1);
}

const sql = postgres(databaseUrl);

try {
	const updated = await sql`
		update "user"
		set role = 'admin', registration_status = 'approved'
		where lower(email) = ${email} and deleted_at is null
		returning email, email_verified
	`;

	if (updated.length === 0) {
		console.error(`Kein aktives Konto mit ${email}. Erst in der App registrieren, dann erneut ausführen.`);
		process.exitCode = 1;
	} else {
		console.log(`${email} ist jetzt Admin.`);

		if (!updated[0].email_verified) {
			console.log(
				'Die Adresse ist noch nicht bestätigt: den Link aus der Bestätigungsmail öffnen (ohne BREVO_API_KEY steht er in der Konsole von `bun run dev`).'
			);
		}
	}
} finally {
	await sql.end();
}
