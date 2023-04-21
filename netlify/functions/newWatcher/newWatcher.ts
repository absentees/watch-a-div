import { Handler } from '@netlify/functions'
import { sendEmail } from "@netlify/emails"
import { createClient } from '@supabase/supabase-js'


// Create a new watcher in the supabase database table "watchers" and send an email to the user
// with a link to the watcher
// return the watcher ID
export const handler: Handler = async (event, context) => {
  const supabaseUrl = 'https://flzspbfkoqkewbrerqze.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey)
  let userID = null;

  const { url, selector, email } = JSON.parse(event.body);
  console.log(event.body);

  // Check if user already exists
  const { data: data1, error: error1 } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)

  // Handle error
  if (error1) {
    console.log(error1);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error checking if user exists`,
      }),
    }
  }

  if(data1.length > 0){
    userID = data1[0].id;
  }
  
  // Create a new user in the users table if they dont exist
  if (userID == null) {
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

    userID = data[0].id;
  }




  // Create a new row in watchers table
  const { data: data2, error: error2 } = await supabase
    .from('watchers')
    .insert([
      { url: url, selector: selector, userId: userID },
    ])
    .select()

  // Handle error
  if (error2) {
    console.log(error2);
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
      sessionId: data2[0].sessionId
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Email sent`,
      watcherID: data2[0].id,
      userID: userID
    }),
  }
}


