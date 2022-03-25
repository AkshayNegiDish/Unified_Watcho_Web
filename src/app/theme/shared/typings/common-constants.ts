import { environment } from "../../../../environments/environment";

export class AppConstants {
    static AUTH_HEADER_KEY = 'Authorization';
    static IMAGE_CLOUD_FRONT_URL = environment.IMAGE_CLOUD_FRONT_URL;
    static DEFAULT_VIDEO_THUMBNAIL_URL = environment.IMAGE_CLOUD_FRONT_URL + 'statics/watcho-default.png';
    static KS_KEY = 'ks';
    static USER_DETAILS = 'user'
    static TERMS_OF_USE = environment.TERMS_OF_USE;
    static PRIVACY_POLICY = environment.PRIVACY_POLICY;
    static UDID_KEY = 'udid';
    static GTM_UDID = 'gtmUserId';
    static PLACEHOLDER_IMAGES_KEY = environment.PLACEHOLDER_IMAGES_KEY;
    static DMS_KEY = 'dms';
    static APP_NAME_CAPS = "Watcho";
    static APP_NAME = "watcho";
    static DMS_EXPIRY_KEY = "dms-exp";
    static KS_EXPIRY_KEY = "ks-exp";
    static UGC_CAMPUS_CONNECT_TERMS_OF_USE = environment.UGC_CAMPUS_CONNECT_TERMS_OF_USE;
    static USER_DETAILS_SMS = 'user-sms'
    static FAQ = environment.FAQ;
    static VIDEO_QUALITY = "video-quality"
    static AUTOPLAY = 'auto-play'
    static IS_DISH_USER = 'dish-user';
    static USER_CATEGORY = 'user-category'
    static ABOUT_US = environment.ABOUT_US;
    static Dishd2hSubscriberID = "Dishd2hSubscriberID";

}

export class CommonMessageServiceConstant {
    static SEARCH_DEFAULT = 'SEARCH_DEFAULT';
}

// export class KalturaIdConstants {
//     static HOME_SCREEN_CATEGORY_ID = environment.HOME_SCREEN_CATEGORY_ID;
//     static EXCLUSIVE_SCREEN_CATEGORY_ID = environment.EXCLUSIVE_SCREEN_CATEGORY_ID;
//     static SPOTLIGHT_SCREEN_CATEGORY_ID = environment.SPOTLIGHT_SCREEN_CATEGORY_ID;
//     static LIVE_TV_SCREEN_CATEGORY_ID = environment.LIVE_TV_SCREEN_CATEGORY_ID;
//     static TREANDING_SCREEN_CATEGORY_ID = environment.TREANDING_SCREEN_CATEGORY_ID;
//     static MOVIE_DETAIL_SCREEN_CATEGORY_ID = environment.MOVIE_DETAIL_SCREEN_CATEGORY_ID;
//     static SHORTFILM_DETAIL_SCREEN_CATEGORY_ID = environment.SHORTFILM_DETAIL_SCREEN_CATEGORY_ID;
//     static WEB_SERIES_DETAIL_SCREEN_CATEGORY_ID = environment.WEB_SERIES_DETAIL_SCREEN_CATEGORY_ID;
//     static WEB_EPISODE_DETAIL_SCREEN_CATEGORY_ID = environment.WEB_EPISODE_DETAIL_SCREEN_CATEGORY_ID;
//     static LIVETV_ON_NOW_DETAIL_SCREEN_CATEGORY_ID = environment.LIVETV_ON_NOW_DETAIL_SCREEN_CATEGORY_ID;
//     static UGC_CREATOR_PROFILE_SCREEN_CATEGORY_ID = environment.UGC_CREATOR_PROFILE_SCREEN_CATEGORY_ID;
//     static UGC_VIDEO_DETAIL_SCREEN_CATEGORY_ID = environment.UGC_VIDEO_DETAIL_SCREEN_CATEGORY_ID;
//     static SPOTLIGHT_EPISODE_DETAIL_SCREEN_CATEGORY_ID = environment.SPOTLIGHT_EPISODE_DETAIL_SCREEN_CATEGORY_ID;
//     static SPOTLIGHT_SERIES_DETAIL_SCREEN_CATEGORY_ID = environment.SPOTLIGHT_SERIES_DETAIL_SCREEN_CATEGORY_ID;
//     static CATCHUP_DETAIL_SCREEN_CATEGORY_ID = environment.CATCHUP_DETAIL_SCREEN_CATEGORY_ID;
//     static VLOG_GENRE_ID = environment.VLOG_GENRE_ID;
//     static SCIENCE_GENRE_ID = environment.SCIENCE_GENRE_ID;
//     static SPORTS_GENRE_ID = environment.SPORTS_GENRE_ID;
//     static CRIME_GENRE_ID = environment.CRIME_GENRE_ID;
//     static CHAT_SHOWS_GENRE_ID = environment.CHAT_SHOWS_GENRE_ID;
//     static BIOPIC_GENRE_ID = environment.BIOPIC_GENRE_ID;
//     static FAMILY_GENRE_ID = environment.FAMILY_GENRE_ID;
//     static KIDS_GENRE_ID = environment.KIDS_GENRE_ID;
//     static DOCUMENTARY_GENRE_ID = environment.DOCUMENTARY_GENRE_ID;
//     static REALITY_GENRE_ID = environment.REALITY_GENRE_ID;
//     static HORROR_GENRE_ID = environment.HORROR_GENRE_ID;
//     static ACTION_GENRE_ID = environment.ACTION_GENRE_ID;
//     static THRILLER_GENRE_ID = environment.THRILLER_GENRE_ID;
//     static ROMANCE_GENRE_ID = environment.ROMANCE_GENRE_ID;
//     static DRAMA_GENRE_ID = environment.DRAMA_GENRE_ID;
//     static LIFESTYLE_GENRE_ID = environment.LIFESTYLE_GENRE_ID;
//     static COMEDY_GENRE_ID = environment.COMEDY_GENRE_ID;
//     static KALTURA_PLAYER_PARTNER_ID = environment.KALTURA_PLAYER_PARTNER_ID;
//     static KALTURA_UICONF_ID = environment.KALTURA_UICONF_ID;
//     static POPULAR_SEARCH_CATEGORY_ID = environment.POPULAR_SEARCH_CATEGORY_ID;
//     static KALTURA_CLIENT_TAG = environment.KALTURA_CLIENT_TAG;
//     static KALTURA_API_VERSION = environment.KALTURA_API_VERSION;
//     static ALL_CHANNEL_ID = environment.ALL_CHANNEL_ID;
//     static IFP_CONTEST_CATEGORY_ID = environment.IFP_CHANNEL_ID;
// }

export enum AppPages {
    HOME_SCREEN,
    LIVETV,
    PREMIUM,
    SPOTLIGHT,
    TRENDING
}

export class SMSConstants {
    static API_VERSION = environment.SMS_API_VERSION;
    static REGISTER_TYPE_EMAIL_KEY = 'email';
    static REGISTER_TYPE_MOBILE_KEY = 'mobile';
    static NEW_USER_REGISTER_KEY = 'NewRegistration';
    static WATCHO_LOGIN_KEY = 'DishOTT';
    static DISH_LOGIN_KEY = 'DishD2H';
    static USER_SOCIAL_LOGIN_KEY = 'Social';
    static FACEBOOK_LOGIN_KEY = 'Facebook';
}

export class UGCConstants {
    static API_BASE_URL = environment.UGC_API_BASE_URL;
    static API_APP_KEY = 'wvcZ20BJp7uUXfqJujpmsqadF3DilDkW'
}

export class KalturaMediaType {
    static HLS_MAIN = "HLS_Main";
    static DASH_MAIN = "DASH_Main";
    static SS_MAIN = "SS_Main";
}

export class LoginModalName {
    static LOGIN = "LOGIN";
    static REGISTER = "REGISTER"
    static REGISTER_FORM = "REGISTER_FORM";
    static OTP = "OTP";
    static FORGOT_PASSWORD = "FORGOT_PASSWORD";
    static PASSWORD = "PASSWORD";
    static OTP_REGISTER = "OTP_REGISTER";

}

export class Branch {
    static KEY = environment.BRANCH_KEY;
}

export class PlaceholderImage {
    static NO_WATCHLIST = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-watchlist.png';
    static NO_RESULT = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-result.png';
    static NO_LIST = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-list.png';
    static NO_UPLOADS = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-uploads.png';
    static NEW_UPLOADS = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'upload-icon.png';
    static MALE1 = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'male1.png';
    static MALE2 = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'male2.png';
    static FEMALE = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'female.png';
    static WATCHO_APP_LOGO = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'watcho_app_logo.png';
    static USER = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'user.png';
    static UGC_CREATOR = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'ugc-creator-banner.png';
    static UGC_CREATOR_BANNER = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'ugc-creator-banner.png';
    static PROFILE_BACKGROUND = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'profile-background-landscape.jpg';
    static PROFILE_BACKGROUND_BANNER = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'profile-background-banner.jpg';
    static NO_CREATOR = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-creator.png';
    static NO_SERIES = environment.IMAGE_CLOUD_FRONT_URL + environment.PLACEHOLDER_IMAGES_KEY + 'no-series.png';

}

export class DMS_ENV {
    static DMS_CONFIG_URL = environment.DMS_CONFIG_URL;
    static DMS_API_KEY = 'x-api-key';
    static DMS_API_VALUE = 'I6G7N8GigK7RfhnjaAv4O6KqIFGveQijaWk2hzSL';
}

export class EntitlementConstants {
    static PLAY = "PLAY";
    static NOT_SUBSCRIBED = "NOT_SUBSCRIBED"
    static ERROR = "ERROR";
    static GEO_LOCATION_BLOCKED_ERROR = "GEO_LOCATION_BLOCKED_ERROR";
    static DEVICE_NOT_ACTIVE = "DEVICE_NOT_ACTIVE";
    static USER_NOT_LOGGED_IN = "USER_NOT_LOGGED_IN";
    static PARENTAL_ERROR = "PARENTAL_ERROR";
    static PARENTAL_PASSED = 'PARENTAL_PASSED'
}


export class QUALITYBITRATE {
    static Auto = 'Auto';
    static Low = '300000';
    static Medium = '500000';
    static High = '800000';
}

export enum QUALITY {
    Auto,
    Low,
    Medium,
    High
}

export class ParentalConstants {
    static Acivate = 'active';
    static Deactivate = 'inactive'
}


export class PKErrorCode {
    static failedToLoadAssetFromKeys = 7000
    static assetNotPlayable = 7001
    static playerItemFailed = 7002
    static playerFailed = 7003
    static missingDependency = 7004
    static playerItemErrorLogEvent = 7100
}

export class UserAttributes {
    static ottSubscriberId = "OTT_SUBSCRIBER_ID"
    static mobileVarified = "MOBILE_VERIFIED"
    static emailVerified = "EMAIL_VERIFIED"
    static accountStatus = "ACCOUNT_STATUS"
    static isEmailAllowed = "EMAIL_ALLOWED"
    static isSMSAllowed = "SMS_ALLOWED"
    static dateOfBirth = "DATE_OF_BIRTH"
    
}