import { uneval } from 'devalue';
import superjson from 'superjson';

export const transformer = {
	input: superjson,
	output: {
		serialize: (object: unknown) => uneval(object),
		deserialize: (object: unknown) => eval(`(${object})`),
	},
};
