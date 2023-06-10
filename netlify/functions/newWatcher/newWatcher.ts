import { Handler } from '@netlify/functions'
import { sendEmail } from "@netlify/emails"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flzspbfkoqkewbrerqze.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

async function createNewUser(email) {
  console.log("Creating new user");

  const { data } = await supabase
    .from('users')
    .insert([
      { email: email },
    ])
    .select()


  if (data.length > 0) {
    return data[0].id;
  }

  return null;

}

async function checkIfUserExists(email) {
  // Create a new user in the supabase database table "users"
  // return the user ID
  console.log("Checking if user exists");

  // Check if user already exists
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)

  console.log(data);

  // If user exists, return the user ID
  if (data.length > 0) return data[0].id;

  return null;
}


// Create a new watcher in the supabase database table "watchers" and send an email to the user
// with a link to the watcher
// return the watcher ID
export const handler: Handler = async (event, context) => {
  let userID: number | null = null;

  const { url, selector, email, div } = JSON.parse(event.body);
  console.log(event.body);


  try {
    userID = await checkIfUserExists(email);

    if (userID == null) userID = await createNewUser(email);

  } catch (error) {
    if (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Error creating user`,
        }),
      }
    }
  }

  try {
    // Create a new row in watchers table
    const { data } = await supabase
      .from('watchers')
      .insert([
        { url: url, selector: selector, userId: userID },
      ])
      .select()

    console.log("Sending email");

    await sendEmail({
      from: process.env.NETLIFY_EMAILS_SENDFROM as string,
      to: email,
      subject: `new watcher created for ${url}`,
      template: "newWatcher",
      parameters: {
        url: url,
        selector: selector,
        div: div,
        sessionId: data[0].sessionId
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent`,
        watcherID: data[0].id,
        userID: userID,
        div: div
      }),
    }
  } catch (error) {
    // Handle error
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error creating watcher`,
      }),
    }

  }
}


