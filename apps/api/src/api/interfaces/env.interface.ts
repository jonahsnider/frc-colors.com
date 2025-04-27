import type { Server } from 'bun';

export type Env = {
	Bindings: { server: Server };
};
