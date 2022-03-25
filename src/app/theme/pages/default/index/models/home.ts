
export enum ScreenTypes {
    HOME,
    ORIGINAL,
    PREMIUM,
    SINETRON
}

export class Playlist {
    id: number;
    index: number;
    name: string;
}

export class ScreenConfig extends Playlist {
    screenName: string;
    screenIdentifier: string;
    screenType: string;
    playlists: Playlist[];
    noOfPlaylists: number;
}

export class Contents {
    id: number;
    name: string;
    picture: string;
    title: string;
    description: string;
    status: string;
    thumbnailURL: string;
    assetType: string;
    transcodingJobId: string;
    assetKeywords: string;
    assetCast: string;
    assetGenres: string;
    assetLink: string;
    landscapeImage: string;
    portraitImage: string;
    contentUniquenessType: string;
    premium: boolean;
    series: string;
    season: string;
    contentProvider: string;
    duration: number;
    publishedDate: number;
    transcodedMasterPlaylistLink: string;
    transcodedFlavoursPlaylistLinks: string;
}

export class PlaylistDetails extends Contents {
    id: number;
    displayName: string;
    identifier: string;
    playlistType: string;
    contentType: string;
    layoutType: string;
    contentImageType: string;
    playlistContentAlgorithm: string;
    maxContent: number;
    defaultDetailView: string;
    verticalGridSize: string;
    contents: Contents[];
}
export class SlideConfig {
    slidesToShow: number;
    slidesToScroll: number;
    infinite: boolean;
    adaptiveHeight: boolean;
    speed: number;
    draggable: boolean;
    centerMode?: boolean;
    variableWidth?: boolean;
}

export class RailResponse {
    id: number;
    title: string;
    thumbnailUrl: string;
}


export class AjaxResultRails {
    idx: number;
    playlistId: number;
    title: string;
    viewType: string;
    slideConfig: SlideConfig;
    railresponse: RailResponse[];
    contentType: string;
}

export class RecomendedDetail {
    channelId: number;
    channelName: string;
}

export class RecomendedDetails {
    recomendedDetails: RecomendedDetail[];
}


export enum Recommended {
    RECOMMENDED
}

export class CreatorCommand {
    name: string;
    type: number;
    id: number;
    nameInitials: string;;
    bgColor: {}
}

export interface CreatorsArray {
    creatos: CreatorCommand[];
}

export interface UgcVideoCommand {
    name: string;
    type: number;
    id: number;
    image: string;
    nameInitials: string;
    bgColor: {};
    portraitImage: string;
    description: string;
    creatorId: string;
    startLikes?: number;
}

export interface UgcVideosCommand {
    ugcVideos: UgcVideoCommand[];
}
