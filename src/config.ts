import z from 'zod'

const configSchema = z.object({
  NEXT_PUBIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string()
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
})

if (!configProject.success) {
  console.error(configProject.error)
  throw new Error('Environment variables are not valid')
}

const envConfig = configProject.data

export default envConfig
