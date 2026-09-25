export function isAdmin(password: string): boolean {
	const configuredPassword = process.env['ADMIN_PASSWORD'];
	return Boolean(configuredPassword && password === configuredPassword);
}

export function requireAdmin(password: string): void {
	if (!isAdmin(password)) throw new Error('Incorrect API token');
}
