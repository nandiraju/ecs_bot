// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const terms = {
  EITS: "",
  CIS: "Customer Information Systems",
  ECS: "Experian Consumer Services",
  GIC: "Global Innovation Center"
};

// All the room in the world for your code

app.message(/^(define:).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  const greeting = context.matches[0];
  let asking = greeting.split(":")[1];
  let meaning = terms[asking];
  await say(`Here are some explanations for ${asking} \n ` + meaning);
});


app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    await say({"blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Thanks for the mention <@${event.user}>! Here's a button`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Button",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "first_button"
        }
      }
    ]});
  }
  catch (error) {
    console.error(error);
  }
});


// app.message(async ({ message, say }) => {

//   console.log("In message.....")

// //    const reversedText = [...message.text].reverse().join("");
// //     await say(reversedText);

//   // Filter out message events with subtypes (see https://api.slack.com/events/message)
//   if (message.subtype === undefined || message.subtype === 'bot_message') {
//     const reversedText = [...message.text].reverse().join("");
//     await say(reversedText);
//   }
// });

// app.message('hello', async ({ message, say }) => {
//   await say(`_Who's there?_`);
// });

app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Rian Welcomes you :tada:" + event.user,
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "I can help you understand a lot of jargons that are used here at Experian. You can ask me any term and I will do my best to explain.",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.command("/rian", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Ahh. Click it",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click me!",
            },
            action_id: "button_abc",
          },
        },
      ],
      // Text in the notification
      text: "Message from Rian App",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
