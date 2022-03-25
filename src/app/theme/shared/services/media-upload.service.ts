import { Injectable } from "@angular/core";
import * as S3 from 'aws-sdk/clients/s3';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { VideoUploadProgress, VideoUploadState } from "../../pages/default/ugc/models/video.upload.model";
import { MediaUploadConstants } from "../typings/media-upload-constants";
import { AWSServiceClients } from "../typings/shared-typing";

@Injectable({
    providedIn: 'root'
})
export class MediaUploadService {
    awsServiceClients: AWSServiceClients;
    awsS3: S3;
    userPool: any;
    imageUploadStateSubject = new BehaviorSubject<any[]>(null);
    videoUploadStateSubject = new BehaviorSubject<VideoUploadProgress>(null);

    imageUploadStateSubject$ = this.imageUploadStateSubject.asObservable();
    videoUploadStateSubject$ = this.videoUploadStateSubject.asObservable();

    constructor() {
        this.awsServiceClients = new AWSServiceClients(MediaUploadConstants.imageUploadS3Bucket, true);
        this.awsS3 = this.awsServiceClients.getS3Object();
    }

    imageUploadStateCallbackSubjectHandler(msg: any) {
        this.imageUploadStateSubject.next(msg);
    }

    videUploadStateCallbackSubjectHandler(msg: VideoUploadProgress) {
        this.videoUploadStateSubject.next(msg);
    }

    uploadImageToS3(imageFile: File, userBucket?: string, imageBlob?: Blob, fileName?: string) {
        let fileUploadObject: S3.Types.PutObjectRequest;
        if (imageFile) {
            fileUploadObject = {
                Body: imageFile,
                Bucket: userBucket ? MediaUploadConstants.creatorUploadS3Bucket : MediaUploadConstants.imageUploadS3Bucket,
                Key: 'thumbnail_' + imageFile.name,
                ACL: 'public-read-write',
                ContentType: 'image/png'
            }
        } else {
            fileUploadObject = {
                Body: imageBlob,
                Bucket: userBucket ? MediaUploadConstants.creatorUploadS3Bucket : MediaUploadConstants.imageUploadS3Bucket,
                Key: 'thumbnail_' + fileName,
                ACL: 'public-read-write',
                ContentType: 'image/png'
            }
        }



        new S3.ManagedUpload({
            params: fileUploadObject,
        }).send((err, data) => {
            if (err) {
                console.error(err);
            } else if (data) {
                this.imageUploadStateCallbackSubjectHandler(data);
            }
        });
    }

    uploadVideoToS3(videoFile: Blob, videoFileName: string) {
        let fileUploadObject: S3.Types.PutObjectRequest = {
            Body: videoFile,
            Bucket: MediaUploadConstants.videoUploadS3Bucket,
            Key: 'web_video_' + videoFileName,
            ACL: 'public-read-write',
            ContentType: 'video/mp4'
        };

        new S3.ManagedUpload({
            params: fileUploadObject,
            partSize: 5 * 1024 * 1024,
            queueSize: 1,
        }).on('httpUploadProgress', (progress) => {
            this.videUploadStateCallbackSubjectHandler({
                progress: Math.round(progress.loaded / progress.total * 100), state: VideoUploadState.UPLOADING
            });
            var uploaded = Math.round(progress.loaded / progress.total * 100);
            console.log("%c" + uploaded, 'background: green; color: white; display: block;')
        }).send((err, data) => {
            if (err) {
                this.videUploadStateCallbackSubjectHandler({
                    progress: 0, state: VideoUploadState.FAILED, failureMsg: err
                });
            } else if (data) {
                this.videUploadStateCallbackSubjectHandler({
                    progress: 100, state: VideoUploadState.COMPLETED, uploadedVideoLocation: data.Location
                });
            }
        });


    }
}