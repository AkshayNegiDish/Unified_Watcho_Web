import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from "aws-sdk/global";
import * as Creds from 'aws-sdk/lib/credentials';
import { MediaUploadConstants } from "./media-upload-constants";

export class SignUpCommand {
    OTTSubscriberID: number;
    UserID: string;
    Name: string;
    MobileNo: number;
    MobileVerified: boolean;
    EmailID: string;
    EmailVerified: boolean;
    Password: string;
    DateOfBirth: string;
    Gender: string;
    AccountStatus: string;
    isRegisteredWithSocialID: boolean;
    SocialAccountType: number;
    UniqueDeviceID: string;
    Platform: string;
}

export class NewUserRegisterCommand {
    SocialAccountType: any;
    UserID: any;
    Name: any;
    EmailID: any;
    isRegisteredWithSocialID: any;
    MobileNo: any;
    Password: any;
    Gender: any;
    DateOfBirth: any;
    ProfileImagePath: string;
    UniqueDeviceID: string;
    Platform: string;
    EmailVerified?: boolean;
}

export class SignInCommand {
    UserID: string;
    Password: string;
    Platform: string;
    UserIDType: string;
}
export class SignInCommandMob {
    UserID: string;
    password: string;
    IsLoggedInFromOTP: string;
    UserIDType: string;
}
export class UserDetails {
    id: number;
    email: string;
    password: string;
    name: string;
}

export class ForgotPasswordCommand {
    email: string;
}

export class ChangePasswordCommand {
    newPassword: string;
}



export class FacebookCommand {
    fbId: string;
    accessToken: string;
    name: string;
    emailId: string;
    profilePicUrl: string;
    fbMail: boolean;
}

export class AWSConstants {
    static ACCESS_KEY = null;
    static SECRET_KEY = null;
    static SOURCE_BUCKET_NAME = null;
}

export class AWSServiceClients {
    private awsCredentials: Creds.Credentials;
    private s3: S3;
    private userPoolCredentials: AWS.CognitoIdentityCredentials;
    private usePoolId: boolean;

    constructor(bucketName: string, usePoolId: boolean) {
        this.usePoolId = usePoolId;
        if (usePoolId === false) {
            this.awsCredentials = new Creds.Credentials({ accessKeyId: AWSConstants.ACCESS_KEY, secretAccessKey: AWSConstants.SECRET_KEY });
            AWS.config.update({ region: 'us-east-1', credentials: this.awsCredentials });
            this.s3 = new S3({ params: { Bucket: bucketName }, credentials: this.awsCredentials });
        } else if (usePoolId === true) {
            this.userPoolCredentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: MediaUploadConstants.awsS3CognitoPoolID });
            AWS.config.update({ region: 'ap-southeast-1', credentials: this.userPoolCredentials });
            this.s3 = new S3({ params: { Bucket: bucketName }, credentials: this.userPoolCredentials });
        }
    }

    getCredentialsObject(): Creds.Credentials {
        if (this.usePoolId === false) {
            return this.awsCredentials;
        } else {
            return this.userPoolCredentials;
        }
    }


    getS3Object(): S3 {
        return this.s3;
    }
}

export class MessageServiceConstants {
    static RESET_MEDIA_UPLOADER = 'RESET_MEDIA_UPLOADER';
    static RESET_IMAGE_UPLOADER = 'RESET_IMAGE_UPLOADER';
    static FILE_ALREADY_UPLOADED = 'FILE_ALREADY_UPLOADED';
    static SHOW_UPLOADED_IMAGE = 'SHOW_UPLOADED_IMAGE';
    static RESET_SEARCH_QUERY = 'RESET_SEARCH_QUERY';
}

export class SearchQueryCommand {
    query: string;
}

export class ObserverData {
    isLive: boolean;
    channelName: string;
}

export class UrlObserverDate {
    url: string
}

export class ContentPrefencesObserverData {
    res: any;
}

export class EntryIds {
    entryId: string
}

export class Entries {
    entries: EntryIds[]
}

