export enum ContestType {
    UPCOMING,
    LIVE,
    COMPLETED
}


export class ContestModal {
    id: number;
    name: string;
    description: string;
    endDate: any;
    startDate: any;
    thumbnailUrl: string;
}

export class ContestArray {
    contestModal: ContestModal[];
}

export class NotificationDetails {
    id: number;
    name: string;
    description: string;
    pic: string;
    startDate: any;
    endDate: any;
    notified: boolean;
}

export class TimerModal {
    hours: number;
    minutes: number;
    seconds: number;
}

export class LeaderBoardModal {
    videoThumbnailURI: string;
    videoTitle: string;
    refId: string;
    score: number
    assetId: number
    rank: any;
    winner: boolean
}

export class LeaderBoardArray {
    leaderBoard: LeaderBoardModal[];
}

export enum TimeSlab {
    LIFETIME,
    WEEKLY,
    MONTHLY
}

export class AllTimeLeaderboardModal {
    userName: string;
    ottSubcriberId: number;
    score: number;
    assetId: number;
    rank: number;
    bgColor: any;
    nameInitials: string;
}

export class LeaderboardArray {
    leaderboard: AllTimeLeaderboardModal[];
}

export enum ContestStatus {
    PUBLISHED,
    UNPUBLISHED
}