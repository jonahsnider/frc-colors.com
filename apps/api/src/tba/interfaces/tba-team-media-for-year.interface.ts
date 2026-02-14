import type { TbaMediaKind } from '../enums/tba-media-kind.ts';
import type { TbaMediaAvatar, TbaMediaBase } from './tba-media.interface.ts';

type KnownTbaMediaKind = TbaMediaAvatar;

type TbaMedia =
	| TbaMediaAvatar
	| TbaMediaBase<Exclude<KnownTbaMediaKind['type'], TbaMediaKind>, Record<string, unknown>>;

export type TbaTeamMediaForYear = TbaMedia[];
