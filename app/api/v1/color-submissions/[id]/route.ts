import { Schema } from '@/app/api/_lib/db/index';
import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import { V1ModifyColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/v1/modify-color-submission.dto';
import { colorsCacheService } from '@/app/api/_lib/teams/colors/cache/colors-cache.service';
import { savedColorsService } from '@/app/api/_lib/teams/colors/saved-colors/saved-colors.service';
import { verificationRequestsService } from '@/app/api/_lib/teams/verification-requests/verification-requests.service';
import { NextRouteHandlerContext, validateBody, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { exceptionRouteWrapper } from '../../../_lib/exception-route-wrapper';
import { ColorSubmissionsSerializer } from '../../../_lib/teams/color-submissions/color-submissions.serializer';
import { colorSubmissionsService } from '../../../_lib/teams/color-submissions/color-submissions.service';

export const PUT = exceptionRouteWrapper.wrapRoute<ColorSubmissionSchema, NextRouteHandlerContext<{ id: string }>>(
	async (request, context) => {
		const params = validateParams(
			context,
			z.object({
				id: z
					.string()
					.transform((id) => Number(id))
					.pipe(z.number().int().positive()),
			}),
		);
		const body = await validateBody(request, V1ModifyColorSubmissionSchema);

		const updated = await colorSubmissionsService.modifyColorSubmissionStatus(params.id, body.status);

		if (body.status === Schema.VerificationRequestStatus.Finished) {
			const updatedColors = {
				primary: updated.primaryHex,
				secondary: updated.secondaryHex,
			};

			await Promise.all([
				savedColorsService.saveTeamColors(updated.teamNumber, updatedColors),
				colorsCacheService.setTeamColors(updated.teamNumber, { ...updatedColors, verified: true }),
				verificationRequestsService.updateVerificationStatusByTeam(
					updated.teamNumber,
					Schema.VerificationRequestStatus.Finished,
				),
			]);
		}

		return NextResponse.json(ColorSubmissionsSerializer.colorSubmissionToV1Dto(updated));
	},
);
