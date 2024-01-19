import { z } from 'zod';
import { VerificationRequestSchema } from '../verification-request.dto';

export const V1FindManyVerificationRequestsSchema = z.object({
	verificationRequests: VerificationRequestSchema.array(),
});
export type V1FindManyVerificationRequestsSchema = z.infer<typeof V1FindManyVerificationRequestsSchema>;
