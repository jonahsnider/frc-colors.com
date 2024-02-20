import { colorsService } from '../colors/colors.service';
import { ManyTeamColors } from '../colors/dtos/colors.dto';
import { tbaService } from '../tba/tba.service';

export class EventsService {
	async getColorsForEvent(event: string): Promise<ManyTeamColors> {
		const teams = await tbaService.getTeamsForEvent(event);

		return colorsService.stored.getTeamColors(teams);
	}
}

export const eventsService = new EventsService();
