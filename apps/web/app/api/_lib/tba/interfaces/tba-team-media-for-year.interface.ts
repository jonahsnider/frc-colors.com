import { TbaMediaKind } from '../enums/tba-media-kind';
import { TbaMediaAvatar, TbaMediaBase } from './tba-media.interface';

type KnownTbaMediaKind = TbaMediaAvatar;

export type TbaMedia =
	| TbaMediaAvatar
	| TbaMediaBase<Exclude<KnownTbaMediaKind['type'], TbaMediaKind>, Record<string, unknown>>;

export type TbaTeamMediaForYear = TbaMedia[];
