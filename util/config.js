module.exports = {
  creds: {
    redirectUrl: 'http://localhost:3000/token',
    clientID: 'd8494be6-42ca-4376-bf3f-92dc71dd7307',
    clientSecret: 'c47hthZG5aZeVwfnPcLks6i',
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    allowHttpForRedirectUrl: true, // For development only
    responseType: 'code',
    validateIssuer: false, // For development only
    responseMode: 'query',
    scope: ['User.Read', 'Mail.Send', 'Files.ReadWrite']
  }
};
