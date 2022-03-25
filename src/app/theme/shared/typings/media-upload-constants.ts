import { environment } from "../../../../environments/environment";

export class MediaUploadConstants {
    static imageUploadS3Bucket = environment.AWS_S3_UGC_IMAGE_BUCKET_NAME;
    static videoUploadS3Bucket = environment.AWS_S3_UGC_VIDEO_BUCKET_NAME;
    static awsS3CognitoPoolID = environment.UGC_AWS_Identity_POOL_ID;
    static creatorUploadS3Bucket = environment.CREATOR_IMAGE_BUCKET_NAME;
}