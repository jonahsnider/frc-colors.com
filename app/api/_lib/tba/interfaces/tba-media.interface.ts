import { TbaMediaKind } from '../enums/tba-media-kind';

export type TbaMediaBase<Type extends TbaMediaKind, Details extends Record<string, unknown>> = {
	type: Type;
	// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	foreign_key: string;
	details?: Details;
	preferred?: boolean;
	// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	direct_url?: string;
	// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	view_url?: string;
};

export type TbaMediaAvatar = TbaMediaBase<
	TbaMediaKind.Avatar,
	{
		base64Image: string;
	}
>;
