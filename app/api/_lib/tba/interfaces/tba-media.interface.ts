import { TbaMediaKind } from '../enums/tba-media-kind';

export type TbaMediaBase<Type extends TbaMediaKind, Details extends Record<string, unknown>> = {
	type: Type;
	// biome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	foreign_key: string;
	details?: Details;
	preferred?: boolean;
	// biome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	direct_url?: string;
	// biome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	view_url?: string;
};

export type TbaMediaAvatar = TbaMediaBase<
	TbaMediaKind.Avatar,
	{
		base64Image: string;
	}
>;
