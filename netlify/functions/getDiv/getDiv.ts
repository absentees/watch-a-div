import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  
  const { name = 'stranger' } = event.body

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  }
}