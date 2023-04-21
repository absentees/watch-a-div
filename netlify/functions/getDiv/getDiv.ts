import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  
  // Extract event.body into an object
  const { url, selector } = JSON.parse(event.body);

  console.log(event.body);


  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
      selector
    }),
  }
}
