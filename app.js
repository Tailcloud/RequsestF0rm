var restify = require('restify');
var builder = require('botbuilder');
var AuthenticationContext = require('adal-node').AuthenticationContext;

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/oauthcallback',(req,res,next)=>{
  var authorizationCode = req.params.code;
  console.log('the authorizationCode is:'+authorizationCode);
})
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector,[function(session){
  session.beginDialog('greeting');
}]);

bot.dialog('greeting',[
  (session, args, next) => {
       session.dialogData.profile = {};
       builder.Prompts.choice(session,'Request Type :','BuildWith|SaleWith',{listStyle: builder.ListStyle.button})
   },
   (session, results, next) => {
       if (results.response) {
           session.dialogData.profile.name = results.response;
       }
       builder.Prompts.choice(session,'Request Segment :','CA Premium| CA| SMB| PSG| EPG| BuildWith',{listStyle: builder.ListStyle.button})

   },
   (session, args, next) => {
        session.dialogData.profile = {};
       builder.Prompts.text(session,'Custonmer Name :')
    },
   (session, args, next) => {
         session.dialogData.profile = {};
        builder.Prompts.number(session,'Opportunity or Booking ID : ',{retryPrompt:'error type?'})
    },
   (session, args, next) => {
        session.dialogData.profile = {};
       builder.Prompts.text(session,'Project Name :')
    },
   (session, args, next) => {
         session.dialogData.profile = {};
        builder.Prompts.number(session,'Est. Rev (K in $USD) :\n If request is Azure rev. = single month ACR * 12, If request are others, rev. = billed rev. ')
    },
  (session, args, next) => {
          session.dialogData.profile = {};
        //  builder.Prompts.text(session,'Est. Close Date :')
         builder.Message(session).addAttachment({
           contentType: "application/vnd.microsoft.card.adaptive",
           content: {
                         type: "AdaptiveCard",
                         speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
                                  body: [
                                       {
                                         "type": "Input.Date",
     "placeholder": "Due Date",
     "id": "DateVal",
     "value": "2017-09-20"

                                       },
                                     ]

      }
      });
   },
   (session, args, next) => {
        session.dialogData.profile = {};
       builder.Prompts.choice(session,'Workload Type :','Apps & Infra(AI)| Business Applications(BA)| Data & Analytic(DA)| Modern Workplace(MW)',{listStyle: builder.ListStyle.button})
    },
   (session, args, next) => {
         session.dialogData.profile = {};
        builder.Prompts.text(session,'Workload Practice :')
    },
  (session, args, next) => {
          session.dialogData.profile = {};
         builder.Prompts.text(session,'Workload Scenario :')
   },
   (seesion,args,next)=>{
    //  session.dialogData.profile={};
     builder.Prompts.text(session,'Business Justification:');
   },
   (session, args, next) => {
        session.dialogData.profile = {};
       builder.Prompts.choice(session,'Partner Type :','Channel Development(CD)| Independent Software Vendor(ISV)| Managed Service Provider(MSP)| SMB-NPL| System Integrators(SI)',{listStyle: builder.ListStyle.button})
    },
   (session, args, next) => {
     session.dialogData.profile = {};
     builder.Prompts.text(session,'Partner PDM :')
   },
   (session, args, next) => {
     session.dialogData.profile = {};
     builder.Prompts.text(session,'Partner List :')
   },
   (session, results) => {
       if (results.response) {
           session.dialogData.profile.from = results.response;
       }
       session.endDialogWithResult({ response: session.dialogData.profile });
   }
]);
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     // session.send("You said: %s", session.message.text);
//     var reply = new builder.Message()
//         .address(session.message.address);
//
//     var text = session.message.text.toLocaleLowerCase();
//     switch (text) {
//         case 'show me a hero card':
//             reply.text('Sample message with a HeroCard attachment')
//                 .addAttachment(new builder.HeroCard(session)
//                     .title('Sample Hero Card')
//                     .text('Displayed in the DirectLine client'));
//             break;
//
//         case 'send me a botframework image':
//             reply.text('Sample message with an Image attachment')
//                 .addAttachment({
//                     contentUrl: 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png',
//                     contentType: 'image/png',
//                     name: 'BotFrameworkOverview.png'
//                 });
//
//             break;
//
//         default:
//             reply.text('You said \'' + session.message.text + '\'');
//             break;
//     }
//
//     session.send(reply);
// });
