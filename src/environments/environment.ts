export const environment = {
  SMS_API_VERSION: "Api/UserManagement/",
  production: false,
  env: "dev",
  FACEBOOK_APP_ID: '1034953240009851',
  IMAGE_CLOUD_FRONT_URL: 'https://d1f8xt8ufwfd45.cloudfront.net/',
  PLACEHOLDER_IMAGES_KEY: 'web/placeholder-images/',
  KALTURA_UICONF_ID: "43123181",       // Prod Setting
  KALTURA_CLIENT_TAG: 'watcho-web',
  KALTURA_API_VERSION: '/restful_v5_0/api_v3',
  BRANCH_KEY: 'key_live_ccQao1mM1VBbmplDExd0OplnuyckXC44',
  TERMS_OF_USE: 'https://web-qa.watcho.com/terms-of-use',
  PRIVACY_POLICY: 'https://web-qa.watcho.com/privacy-policy',
  ABOUT_US: 'https://web-qa.watcho.com/about-us',
  AWS_S3_UGC_IMAGE_BUCKET_NAME: 'dishtvugc/images',
  AWS_S3_UGC_VIDEO_BUCKET_NAME: 'dishtvugc/videoAssets',
  UGC_AWS_Identity_POOL_ID: 'ap-southeast-1:d45fc715-4d24-4716-abc6-b48b53f15c60',
  UGC_API_BASE_URL: 'https://api-qa.watcho.com/',
  DMS_CONFIG_URL: 'https://bkc4kmwwm0.execute-api.ap-southeast-1.amazonaws.com/qa',
  ALL_CHANNEL_ID: '332562',
  googleAnalytics: {
    domain: 'none',
    trackingId: 'UA-128621595-2' // replace with your Tracking Id
  },
  CREATOR_IMAGE_BUCKET_NAME: 'watchostgimagess',
  PROFILE_PIC_CLOUDFRONT_URL: 'https://d2t1cdkk9r8oq8.cloudfront.net/',
  UGC_CAMPUS_CONNECT_TERMS_OF_USE: 'https://web-qa.watcho.com/watcho_campus_connect_terms_of_use',
  FAQ: 'https://web-qa.watcho.com/faq',
  GTM_ID: 'GTM-NHLZ4NH',
  URL: 'http://localhost:4200/',
  YOUBORA_ACCOUNT_CODE: 'dishindiadev',
  SEO: {
    KS: 'djJ8NDg3fCP3uxbwuNJTtlKJgB-DViZbt3fYRRFwVQJCopQbx6GPhy_-nF_E3KVlK_tDiy4QeJMdkaUKUq2M0EeTiYA-m7nmXGemRDRLubCWQGv4S2IwG_zl9VN9xAH3E7qXYhfRFYWdG0vrjhex5nv7H1hiTbDlHj14MCdOdYXe7fXR3hqVgYdoq_MIYf_9uNv1Hct6TQ==',
    partnerid: '487',
    JsonGW: 'https://rest-sgs1.ott.kaltura.com',
    apiUrl: 'https://rest-sgs1.ott.kaltura.com/api_v3/service/asset/action/get',
    apiUrlOTTCategory: 'https://rest-sgs1.ott.kaltura.com/api_v3/service/ottCategory/action/get',
    apiUrlChannels: 'https://rest-sgs1.ott.kaltura.com/api_v3/service/channel/action/get',
    apiUrlAssets: 'https://rest-sgs1.ott.kaltura.com/api_v3/service/asset/action/list'
  },

  TERMS_OF_USE_PWA: "https://web-qa.watcho.com/web/terms-of-use.html",
  PRIVACY_POLICY_PWA: "https://web-qa.watcho.com/web/privacy-policy.html",
  ENVEU: {
    MOBILE: {
      API_KEY: "Wn5sKXsan69uHyhGAhdndaVjDmFceUeM4B3J6024",
      SERVICE_URL: "https://167yl6nndd.execute-api.ap-south-1.amazonaws.com",
      SERVICE_ENVIRONMENT: "Prod"
    },
    DESKTOP: {
      API_KEY: "bvhHBClepI9m7sTB9sBr85xhX3WJ1lrr1tT2CoBt",
      SERVICE_URL: "https://167yl6nndd.execute-api.ap-south-1.amazonaws.com",
      SERVICE_ENVIRONMENT: "Prod"
    },
    SCREEN_IDS: {
      HOME: "0",
      ORIGINALS: "1",
      SPOTLIGHT: "2",
      LIVE_TV: "3",
      MOVIE: "4",
      WEB_EPISODE_DETAIL: "7",
      WEB_SERIES_DETAIL: "9",
      SPOTLIGHT_EPISODE_DETAIL: "8",
      SPOTLIGHT_SERIES_DETAIL: "10",
      MOVIE_DETAIL: "5",
      CLIP_DETAIL: "16",
      SHORT_FILM_DETAIL: "6",
      FORWARD_EPG_DETAIL: "11",
      CATCHUP_DETAIL: "12",
      UGC_PROFILE_DETAIL: "14",
      UGC_VIDEO_DETAIL: "15",
      UGC_VIDEOS: "17"
    }
  },
  SITEMAPID: "3346",
  ZENDESK_API_TOKEN: "iVJCIEIQ9Ivfq9juu0cc1gpC5vDtNzl5hdD3xwXi",
  ZENDESK_LAMBDA: {
    getTickets: 'https://l3x2zkz2mb.execute-api.ap-south-1.amazonaws.com/QA/zendesk-lambda',
    getTicketsComments: 'https://l3x2zkz2mb.execute-api.ap-south-1.amazonaws.com/QA/zendaskComment',
    addComment: 'https://l3x2zkz2mb.execute-api.ap-south-1.amazonaws.com/QA/zendeskAddComment'
  },
  SMS_SUBSCRIPTION_MANAGER: "Api/SubscriptionManagement/",
  PAYNIMO_MERCHANT_ID: 'T514975',
  PAYMENTGATEWAY_ID: 'PAYNIMO',
  PAYMENTGATEWAY_RETURN_URL: 'https://xojyysusvd.execute-api.ap-south-1.amazonaws.com/qa/v1/svod',
  SMS_RECHARGE_URL: 'Api/Recharge/',
  RECHARGE_RETURN_URL: 'https://gpixr6tfmk.execute-api.ap-south-1.amazonaws.com/qa/v1/recharge',
  PAYNIMO_MERCHANT_ID_RECHARGE_DISH_USER: 'T186469',
  PAYNIMO_MERCHANT_ID_RECHARGE_D2H_USER: 'T186469',
  RECHARGE_PG_SCHEME_ID_D2H_USER: 'vide',
  RECHARGE_PG_SCHEME_ID_DISH_USER: 'vide',
  RECHARGE_PAYTM_CALLBACK_URL: "https://inh9pwupze.execute-api.ap-south-1.amazonaws.com/qa/v1/recharge",
  MID_DISH: "DishTV09095959111483", // Dish provide
  MID_D2H: "D2HTVW09505722728568", // Dish provide
  WEBSITE: "WEBPROD", // Dish provide
  INDUSTRY_TYPE_ID: "Retail", // paytm provide
  CHANNEL_ID: "WEB",
  KALTURA_PLAYER_API_VERSION: '/api_v3',
  IMAGES_CLOUDFRONT_URL: "https://d2nwj7mtazokqw.cloudfront.net",
  WATCHO_QUIZ:"https://quiz.watcho.com/",
  WEBP_JPEG_CLOUDFRONT_URL: 'https://d33ziwki8ny9c1.cloudfront.net/',
  WEBP_CLOUDFRONT_URL: "filters:format(webp):quality(60)/",
  JPEG_CLOUDFRONT_URL: "filters:format(jpeg):quality(60)/",
  MULTIREQUEST_API_URL: "https://rest-sgs1.ott.kaltura.com/api_v3/service/multirequest",
  USERINTEREST_API_URL: "https://rest-sgs1.ott.kaltura.com/api_v3/service/userinterest/action/list",
  METAID_FOR_USERINTEREST_API: "NDg4XzBfMV8xMTE=",
  SVOD_PAYTM : {
    MID: 'Watcho36897122033146',
    MERCHANT_KEY: '%czb99QE1d&7V2eZ',
    WEBSITE: 'WEBSTAGING',
    CHANNEL_ID: "WEB",
    INDUSTRY_TYPE_ID: "Retail",
    PAYMENTGATEWAY_ID: 'PAYTM',
    INITIAL_PAYTM_URL: 'https://securegw-stage.paytm.in/subscription/create',
    PAYTM_SHOWPAYMENTPAGE_URL: 'https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=',
    PAYMENTGATEWAY_RETURN_URL: 'https://xojyysusvd.execute-api.ap-south-1.amazonaws.com/qa/v2/svod',
    INITIAL_CANCEL_SUBSCRIPTION_URL: 'https://securegw-stage.paytm.in/subscription/cancel',
  }
};
