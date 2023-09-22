let Client = require("node-rest-client").Client;

let client = new Client();

function sendMail(actionId, subject, content, recipientEmails) {
  const reqBody = {
    actionId,
    subject,
    content,
    recipientEmails,
  };

  console.log(reqBody);

  try {
    client.post(
      "http://127.0.0.1:7777/notify-service/api/v1/notifications",
      {
        data: reqBody,
        headers: { "Content-Type": "application/json" },
      },
      function (data) {
        console.log(data);
      }
    );
  } catch (ex) {
    console.log("Exception occured");
  }
}

module.exports = sendMail;
