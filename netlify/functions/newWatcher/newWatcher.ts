import { Handler } from '@netlify/functions'
import { sendEmail } from "@netlify/emails"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flzspbfkoqkewbrerqze.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

async function createNewUser(email) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { email: email },
    ])
    .select()

  // Handle error
  if (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error creating user`,
      }),
    }
  }

  if (data.length > 0) {
    return data[0].id;
  }

  return null;

}

async function checkIfUserExists(email) {
  // Create a new user in the supabase database table "users"
  // return the user ID

  // Check if user already exists
  const { data: data1, error: error1 } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)

  // Handle error
  if (error1) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error checking if user exists`,
      }),
    }
  }

  // If user exists, return the user ID
  if (data1.length > 0) return data1[0].id;

  return null;
}


// Create a new watcher in the supabase database table "watchers" and send an email to the user
// with a link to the watcher
// return the watcher ID
export const handler: Handler = async (event, context) => {
  let userID = null;

  const { url, selector, email } = JSON.parse(event.body);
  console.log(event.body);

  // Check if user already exists
  userID = checkIfUserExists(email);

  // If user doesn't exist, create a new user
  if (userID == null) userID = createNewUser(email);


  // Create a new row in watchers table
  const { data, error } = await supabase
    .from('watchers')
    .insert([
      { url: url, selector: selector, userId: userID },
    ])
    .select()

  // Handle error
  if (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error creating watcher`,
      }),
    }
  }

  // Send email to user with link to watcher
  console.log("Sending email");


  await sendEmail({
    from: "",
    to: email,
    subject: `new watcher created for ${url}`,
    template: "newWatcher",
    parameters: {
      url: url,
      selector: selector,
      sessionId: data[0].sessionId
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Email sent`,
      watcherID: data[0].id,
      userID: userID
    }),
  }
}


