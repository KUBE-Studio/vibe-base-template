import { RegistrationStatus, Role } from '$lib/types';

/**
 * User-facing copy is German, code and identifiers are English. Every enum that
 * reaches the UI gets its labels here — never inline a German string next to an
 * enum value in a component.
 */
export const ROLE_LABELS: Record<Role, string> = {
	[Role.ADMIN]: 'Admin',
	[Role.USER]: 'Benutzer'
};

/** @public */
export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
	[RegistrationStatus.REGISTERED]: 'Registriert',
	[RegistrationStatus.PENDING]: 'In Prüfung',
	[RegistrationStatus.APPROVED]: 'Freigegeben',
	[RegistrationStatus.DECLINED]: 'Abgelehnt'
};
