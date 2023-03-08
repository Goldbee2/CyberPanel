const { google } = require("googleapis");

function getRedirectURL(oauth2Client) {
  //<===============FLOW=============>
  //
  //  Based on https://developers.google.com/identity/protocols/oauth2/web-server
  //
  // 1. Get token from files
  // 2. Request user credentials and use them to get access token from google server
  // 3. Examine scopes granted by user
  // 4. Send access token to API
  // 5. Refresh token if necessary

  // scopes -- should be urls from googleapis.com/auth
  const scopes = ["https://www.googleapis.com/auth/calendar.events.readonly"];

  // parameters inc. scopes, access types, incremental authorization. Best practice is incremental auth which uses include_granted_scopes: true
  const authorizationURL = oauth2Client.generateAuthUrl({
    scope: scopes,
    include_granted_scopes: true,
  });

  // note: currently invalid request -- https://www.oauth.com/oauth2-servers/server-side-apps/possible-errors/ has some info

  return authorizationURL;

  // next: update calendar or oauth routes with redirects to auth url on authorization request, and content delivery on oauth2 callback
}

async function exchangeToken(oauth2Client, code) {
  const tokenExchangeResponse = await oauth2Client
    .getToken(code)
    .catch((err) => {
      console.log(err);
      return false;
    });
    
  if (tokenExchangeResponse) {
    oauth2Client.setCredentials(tokenExchangeResponse.tokens);
    return true;
  }
  console.log("Error: token exchange failed");
  return false;
}

module.exports = { getRedirectURL, exchangeToken };
