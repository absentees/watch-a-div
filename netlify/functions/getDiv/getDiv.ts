import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  console.log('queryStringParameters', event.queryStringParameters)
  console.log(context);

  const { name = 'stranger' } = event.queryStringParameters

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  }
}
