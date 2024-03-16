import type { Server } from 'bun';

export type Env = {
	// biome-ignore lint/style/useNamingConvention: This is using the structure from Hono's Env type
	Bindings: { server: Server };
};
