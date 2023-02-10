const {google} = require('googleapis');

function getRedirectURL() {
  //<===============FLOW=============>
  //
  //  Based on https://developers.google.com/identity/protocols/oauth2/web-server
  //
  // 1. Get token from files
  // 2. Request user credentials and use them to get access token from google server
  // 3. Examine scopes granted by user
  // 4. Send access token to API
  // 5. Refresh token if necessary

  var CLIENT_ID = require("./apiKeys").getKey("oauth2ClientID");
  var CLIENT_SECRET = require("./apiKeys").getKey("oauth2ClientSecret");
  var REDIRECT_URL = require("./apiKeys").getKey("oauth2RedirectURL");

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );
  //client ID, client secret, redirect url

  // scopes -- should be urls from googleapis.com/auth
  const scopes = ["https://www.googleapis.com/auth/calendar.events.readonly"];

  // parameters inc. scopes, access types, incremental authorization. Best practice is incremental auth which uses include_granted_scopes: true
  const authorizationURL = oauth2Client.generateAuthUrl({
    scope: scopes,
    include_granted_scopes: true,
  });
  console.log(authorizationURL);

  // note: currently invalid request -- https://www.oauth.com/oauth2-servers/server-side-apps/possible-errors/ has some info

  return authorizationURL

  // next: update calendar or oauth routes with redirects to auth url on authorization request, and content delivery on oauth2 callback
}

module.exports = {getRedirectURL};