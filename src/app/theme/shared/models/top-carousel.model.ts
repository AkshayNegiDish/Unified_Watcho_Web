export class TopCarouselItem {
      isActive: boolean;
      id: number;
      isPremium: boolean;
      tagLine: string;
      title: string;
      playbackLength: number;
      genre: string[];
      contentProvider: string;
      thumbnailURL: string;
      contentId: number;
      contentType: string;
      type: number;
      duration?: number;
      audioLanguage?: string;
      externalId?: string;
      startDate?: number;
      linearAssetId?: number;
      logoUrl: string;
      description?: string;
      showHeader?: boolean;
      channelName?: string;
      tags?: any;
}

export enum Recommendation {
      BYW,
      RFY
}