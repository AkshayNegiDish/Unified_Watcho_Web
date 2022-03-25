export class LayoutConfig {
    id: number;
    name: string;
    channelType: string;
    channelViewType: string;
    layout: string;
    carouselDots?: string;
    thumbnailUrl?: string;
    imageSource?: string;
    landingPage?: LandingPage;
    heroAssetId?: string;
    ADUnitId?: string;
    showMoreButton?: string;
    moreListingLayout?: string;
    imageType?: string;
    assetType?: string;
    isWatchListRail?: boolean;
    isContinueWatching?: boolean;
    listingLayout?: string;
    moreViewConfig?: MoreViewConfig;
    listingLayoutContentSize?: number;
    pageSize?: number;
    isProgram?: boolean;
    forLoggedInUser?: boolean;
    status?: string;
    showHeader?: boolean;
    isBecauseYouWatchedRail?: boolean;
    isRecommendedForYouRail?: boolean;
}

export class MoreViewConfig {
    filters: boolean;
    id: number;
    sortable: boolean;
}

export class LandingPage {
    type?: string;
    link?: string;
    landingPageTitle?: string;
    target?: string;
    assetType?: string;
    assetId?: string;
    playlist?: any;
    isProgram?: boolean;

}