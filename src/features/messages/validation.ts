import { z } from 'zod'

export const messageSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.email( { 
    error: (iss) => iss.input === undefined ? "Email is required." : "please provide a valid email address."
  }),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const newMessageSchema = messageSchema.omit({id: true}) 

export type Message = z.infer<typeof messageSchema>;
export type NewMessage = z.infer<typeof newMessageSchema> ;

