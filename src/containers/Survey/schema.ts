import { z } from 'zod';

export const surveySchema = z.object({
  brands: z.array(z.string()).min(1, 'Select at least one brand'),
  colors: z.array(z.string()).min(1, 'Select at least one color'),
  transmission: z.enum(['Manual', 'Automatic']).optional(),
});
