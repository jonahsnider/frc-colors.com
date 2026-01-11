import { colorsService } from '../colors/colors.service';
import type { ManyTeamColors } from '../colors/dtos/colors.dto';
import { tbaService } from '../tba/tba.service';

class EventsService {
	async getColorsForEvent(event: string): Promise<ManyTeamColors> {
		const teams = await tbaService.getTeamsForEvent(event);

		return colorsService.stored.getTeamColors(teams);
	}
}

export const eventsService = new EventsService();
