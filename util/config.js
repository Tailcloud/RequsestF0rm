var config = {}
config.endpoint = "";
config.primaryKey = "";
config.database = {
  "id":"f0rmdb"
};
config.collection = {
  "id":"Collection1"
};
config.creds= {
  redirectUrl: 'http://localhost:3000/token',
  clientID: '',
  clientSecret: '',
  identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
  allowHttpForRedirectUrl: true, // For development only
  responseType: 'code',
  validateIssuer: false, // For development only
  responseMode: 'query',
  scope: ['User.Read', 'Mail.Send', 'Files.ReadWrite','Sites.FullControl.All']
};
module.exports = config;
