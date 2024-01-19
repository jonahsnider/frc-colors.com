import { z } from 'zod';
import { ColorSubmissionSchema } from '../color-submission.dto';

export const V1FindManyColorSubmissionsSchema = z.object({ colorSubmissions: z.array(ColorSubmissionSchema) });
export type V1FindManyColorSubmissionsSchema = z.infer<typeof V1FindManyColorSubmissionsSchema>;
