import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)


export const handler: Handler = async (event, context) => {
  const { id } = event.queryStringParameters

  if (id === undefined || id === null || id === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `No parameters provided!`,
      }),
    }
  }

  try {
    const { data, error } = await supabase
      .from('watchers')
      .delete()
      .eq('sessionId', id)

      console.log(data);


    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `SessionID: ${id}`
      }),
    }
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error deleting watcher`,
      })
    }
  }

}
