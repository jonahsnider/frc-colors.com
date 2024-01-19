'use server';

import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { verificationRequestsService } from '../api/_lib/teams/verification-requests/verification-requests.service';

export async function requestVerification(teamNumber: TeamNumberSchema): Promise<void> {
	await verificationRequestsService.requestVerification(teamNumber);
}
