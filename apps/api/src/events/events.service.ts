import { colorsService } from '../colors/colors.service.ts';
import type { ManyTeamColors } from '../colors/dtos/colors.dto.ts';
import { tbaService } from '../tba/tba.service.ts';

class EventsService {
	async getColorsForEvent(event: string): Promise<ManyTeamColors> {
		const teams = await tbaService.getTeamsForEvent(event);

		return colorsService.stored.getTeamColors(teams);
	}
}

export const eventsService = new EventsService();
