import { z } from 'zod'

export const subscriberSchema = z.object({
  email: z.email( { 
    error: (iss) => iss.input === undefined ? "Email is required." : "Please provide a valid email address."
  }),
});