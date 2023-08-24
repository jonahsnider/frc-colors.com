import { TbaMediaKind } from '../enums/tba-media-kind';

export type TbaMediaBase<Type extends TbaMediaKind, Details extends Record<string, unknown>> = {
	type: Type;
	foreign_key: string;
	details?: Details;
	preferred?: boolean;
	direct_url?: string;
	view_url?: string;
};

export type TbaMediaAvatar = TbaMediaBase<
	TbaMediaKind.Avatar,
	{
		base64Image: string;
	}
>;
