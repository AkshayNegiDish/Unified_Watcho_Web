export enum RailViewType {
    CIRCLE,
    SQUARE,
    WIDE_SCREEN_PORTRAIT, // TODO remove
    WIDE_SCREEN_LANDSCAPE, // TODO remove
    LANDSCAPE,
    PORTRAIT,
    Linear,
    ContinueWatching,
    CAROUSEL,
    Recommended,
    VOD,
    UGCIFP,
    SERIESBANNER,
    PORTRAIT_2_3,
    PORTRAIT_9_16

}

export class RailItem {
    thumbnailURL: string;
}

export class RailSlideConfig {
    adaptiveHeight: boolean
    infinite: boolean;
    slidesToScroll: number;
    slidesToShow: number;
    speed: number;
    draggable: boolean;
    centerMode: boolean;
    variableWidth: boolean;
    lazyLoad: string;
    touchThreshold: number;
    responsive?: any[]
}