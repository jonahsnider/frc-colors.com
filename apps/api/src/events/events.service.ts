import { ManyTeamColors } from '../colors/dtos/colors.dto';
import { storedColors } from '../colors/stored/stored-colors.service';
import { tbaService } from '../tba/tba.service';

export class EventsService {
	async getColorsForEvent(event: string): Promise<ManyTeamColors> {
		const teams = await tbaService.getTeamsForEvent(event);

		return storedColors.getTeamColors(teams);
	}
}

export const eventsService = new EventsService();
