import { extractColors } from 'extract-colors';
import { PNG } from 'pngjs/browser.js';
import { avatarService } from '../../teams/avatar/avatar.service.ts';
import type { TeamNumber } from '../../teams/dtos/team-number.dto.ts';
import type { ManyTeamColors, TeamColors } from '../dtos/colors.dto.ts';
import type { ColorFetcher } from '../interfaces/color-fetcher.interface.ts';
import { filterBlendArtifacts } from './filter-blends.ts';
import { pickTeamColors } from './pick-colors.ts';
import { classifyPixels, isOpaquePixel } from './pixel-stats.ts';

const AVATAR_WIDTH = 40;
const AVATAR_HEIGHT = 40;

export class GeneratedColors implements ColorFetcher {
	getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
	getTeamColors(teams: TeamNumber | TeamNumber[]): Promise<TeamColors | ManyTeamColors | undefined> {
		if (Array.isArray(teams)) {
			return this.getManyTeamColors(teams);
		}

		return this.getOneTeamColors(teams);
	}

	private async getOneTeamColors(teamNumber: TeamNumber): Promise<TeamColors | undefined> {
		const teamAvatar = await avatarService.getAvatar(teamNumber);

		if (!teamAvatar) {
			return undefined;
		}

		return this.generateTeamColors(teamAvatar);
	}

	private async getManyTeamColors(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, TeamColors | undefined>> {
		const avatarsToExtractFrom = await avatarService.getAvatars(Array.from(teamNumbers));

		return new Map(
			await Promise.all(
				[...avatarsToExtractFrom]
					.filter((tuple): tuple is [TeamNumber, Buffer] => Boolean(tuple[1]))
					.map(async ([teamNumber, avatar]) => [teamNumber, await this.generateTeamColors(avatar)] as const),
			),
		);
	}

	private async decodePixels(teamAvatar: Buffer): Promise<Uint8Array | undefined> {
		return new Promise<Uint8Array | undefined>((resolve) => {
			new PNG({ width: AVATAR_WIDTH, height: AVATAR_HEIGHT }).parse(teamAvatar, (error, data) => {
				if (error) {
					resolve(undefined);
					return;
				}

				resolve(data.data);
			});
		});
	}

	private async generateTeamColors(teamAvatar: Buffer): Promise<TeamColors | undefined> {
		const pixels = await this.decodePixels(teamAvatar);

		if (!pixels) {
			return undefined;
		}

		const stats = classifyPixels(pixels);

		const extracted = await extractColors(
			{ data: Array.from(pixels), width: AVATAR_WIDTH, height: AVATAR_HEIGHT },
			{
				pixels: AVATAR_WIDTH * AVATAR_HEIGHT,
				colorValidator: isOpaquePixel,
			},
		);

		const filtered = filterBlendArtifacts(extracted);

		return pickTeamColors(filtered, stats);
	}
}
