import { z } from 'zod'

const envSchema = z.object({
    VITE_NODE_ENV: z.enum(['development', 'testing', 'production']),
    VITE_SERVER_URL: z.url()
})

export const parsedEnv = envSchema.parse(import.meta.env)
