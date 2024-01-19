'use client';

import { useApiKey } from '@/apps/web/app/hooks/use-api-key';
import NavbarLink from './navbar-link';

export default function AdminNavbarLink() {
	const [apiKey] = useApiKey();

	if (apiKey) {
		return <NavbarLink item={{ content: 'Admin', href: '/admin' }} />;
	}
}
