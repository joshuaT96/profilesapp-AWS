import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a.model({
        email: a.string(),
        profileOwner: a.string(),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),  
            
    /*
    Post: a.customType({
      id: a.id().required(),
      author: a.string().required(),
      title: a.string(),
      content: a.string(),
      url: a.string(),
      ups: a.integer(),
      downs: a.integer(),
      version: a.integer(),
    }),
      
    getPost: a
      .query()
      .arguments({ id: a.id().required() })
      .returns(a.ref("Post"))
      .authorization(allow => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "ExternalPostTableDataSource",
          entry: "./getPost.js",
        })
      ),      

    */

    VCOM_SMS_BESS_Data: a.customType({
      index: a.string().required(),
      commsLost: a.integer(),
      commsLostCounter: a.integer(),
      genPowerAbbreviation: a.string().required(),
      genRunning: a.integer(),
      key: a.string().required(),
      plantName: a.string().required(),
      soc: a.integer(),
      socAbbreviation: a.string().required(),
      socMinLevel: a.integer()
    }),
      
    getVcomBessData: a
    .query()
    .arguments({ index: a.integer().required() })
    .returns(a.ref("VCOM_SMS_BESS_Data"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "VCOM_SMS_BESS_DataTable",
        entry: "./getVcomBessData.js",
      })
    ),

  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

