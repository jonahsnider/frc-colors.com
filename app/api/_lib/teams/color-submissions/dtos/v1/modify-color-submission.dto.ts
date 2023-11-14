import { Schema } from '@/app/api/_lib/db/index';
import { z } from 'zod';

export const V1ModifyColorSubmissionSchema = z.object({
	status: z.nativeEnum(Schema.VerificationRequestStatus),
});
export type V1ModifyColorSubmissionSchema = z.infer<typeof V1ModifyColorSubmissionSchema>;
