import { Injectable } from "@angular/core";
import { RailSlideConfig, RailViewType } from '../models/rail.model';
import { ImageType } from "../typings/enveu-constants";


@Injectable({
    providedIn: 'root'
})
export class RailConfigService {

    railViewType = RailViewType;

    constructor() {

    }

    getViewTypeConfig(viewType: string, isMobile?: boolean): any {

        let config: RailSlideConfig = new RailSlideConfig();

        viewType = viewType.toUpperCase();

        config = {
            adaptiveHeight: false,
            infinite: false,
            slidesToScroll: isMobile ? 2 : 5,
            slidesToShow: isMobile ? 2.2 : 5.4,
            speed: 1000,
            draggable: false,
            centerMode: false,
            variableWidth: false,
            lazyLoad: 'ondemand',
            touchThreshold: 10
        }

        if (viewType) {

            if (viewType === RailViewType[RailViewType.CIRCLE].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 3 : 8,
                    slidesToShow: isMobile ? 3.9 : 8.7,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.SQUARE].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 3 : 9,
                    slidesToShow: isMobile ? 3.8 : 9.2,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.LANDSCAPE].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 2 : 5,
                    slidesToShow: isMobile ? 2.2 : 5.4,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10,
                    // responsive: [
                    //     {
                    //         breakpoint: 1024,
                    //         settings: {
                    //             slidesToShow: 5.4,
                    //             slidesToScroll: 5.4,
                    //             infinite: true,
                    //             dots: true
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 600,
                    //         settings: {
                    //             slidesToShow: 3.2,
                    //             slidesToScroll: 3.2
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 480,
                    //         settings: {
                    //             slidesToShow: 2.2,
                    //             slidesToScroll: 2.2
                    //         }
                    //     }
                    //     // You can unslick at a given breakpoint now by adding:
                    //     // settings: "unslick"
                    //     // instead of a settings object
                    // ]
                }
            } else if (viewType === RailViewType[RailViewType.PORTRAIT].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 3 : 7,
                    slidesToShow: isMobile ? 3.2 : 7.55,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.PORTRAIT_2_3].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 3 : 7,
                    slidesToShow: isMobile ? 3.2 : 7.55,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.Linear].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 3 : 7,
                    slidesToShow: isMobile ? 3 : 7.5,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.ContinueWatching].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 2 : 5,
                    slidesToShow: isMobile ? 2.2 : 5.4,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.Recommended].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 2 : 5,
                    slidesToShow: isMobile ? 2.2 : 5.4,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.VOD].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 2 : 5,
                    slidesToShow: isMobile ? 2.2 : 5.4,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            } else if (viewType === RailViewType[RailViewType.UGCIFP].toString().toUpperCase() || viewType === RailViewType[RailViewType.SERIESBANNER].toString().toUpperCase()) {
                config = {
                    adaptiveHeight: false,
                    infinite: false,
                    slidesToScroll: isMobile ? 1 : 1,
                    slidesToShow: isMobile ? 1 : 1,
                    speed: 1000,
                    draggable: false,
                    centerMode: false,
                    variableWidth: false,
                    lazyLoad: 'ondemand',
                    touchThreshold: 10
                }
            }
        } else {

        }

        return config
    }

    getRailTypeCssClass(viewType: string, isMobile?: boolean): string {
        viewType = viewType.toUpperCase();

        if (viewType) {
            if (viewType === RailViewType[RailViewType.CIRCLE].toUpperCase()) {
                return 'circle-item'
            } else if (viewType === RailViewType[RailViewType.SQUARE].toUpperCase()) {
                return 'square-item'
            } else if (viewType === RailViewType[RailViewType.LANDSCAPE].toUpperCase()) {
                return 'widescreen-landscape-item'
            } else if (viewType === RailViewType[RailViewType.PORTRAIT].toUpperCase()) {
                return 'widescreen-portrait-item'
            } else if (viewType === RailViewType[RailViewType.PORTRAIT_2_3].toUpperCase()) {
                return 'widescreen-portrait-2-3'
            } else if (viewType === RailViewType[RailViewType.Linear].toUpperCase()) {
                return 'square-item'
            } else if (viewType === RailViewType[RailViewType.ContinueWatching].toUpperCase()) {
                return 'widescreen-landscape-item'
            } else if (viewType === RailViewType[RailViewType.Recommended].toUpperCase()) {
                return 'widescreen-landscape-item'
            } else if (viewType === RailViewType[RailViewType.VOD].toUpperCase()) {
                return 'widescreen-landscape-item'
            } else if (viewType === RailViewType[RailViewType.UGCIFP].toUpperCase()) {
                return 'widescreen-landscape-item-ugc'
            } else if (viewType === RailViewType[RailViewType.SERIESBANNER].toString().toUpperCase()) {
                return 'widescreen-landscape-item-seriesBanner'
            }
            else {
                return 'widescreen-landscape-item'
            }
        } else {
            return 'widescreen-landscape-item';
        }

    }

    getEnveuRailViewType(viewType: string): string {
        switch (viewType) {
            case ImageType[ImageType.CIR].toString():
                return RailViewType[RailViewType.CIRCLE].toString();
            case ImageType[ImageType.LDS].toString():
                return RailViewType[RailViewType.LANDSCAPE].toString();
            case ImageType[ImageType.PR1].toString():
                return RailViewType[RailViewType.PORTRAIT].toString();
            case ImageType[ImageType.SQR].toString():
                return RailViewType[RailViewType.SQUARE].toString();
            case ImageType[ImageType.PR2].toString():
                return RailViewType[RailViewType.PORTRAIT_2_3].toString();
            case ImageType[ImageType.LDS2].toString():
                return RailViewType[RailViewType.LANDSCAPE].toString();
            default: return RailViewType[RailViewType.LANDSCAPE].toString();
        }
    }
}