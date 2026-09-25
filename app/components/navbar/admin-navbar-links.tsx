'use client';

import { useApiKey } from '@/app/hooks/use-api-key';
import { NavbarLink } from './navbar-link';

export function AdminNavbarLink() {
	const [apiKey] = useApiKey();

	if (apiKey) {
		return <NavbarLink item={{ content: 'Admin', href: '/admin' }} />;
	}
}
