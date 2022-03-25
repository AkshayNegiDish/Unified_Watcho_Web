export class VideoDetail{
    id: number;
    playUrl: string;
    contentTitle: string;
    contentThumbnailUrl: string;
    duration: number;
    description: string;
    casts: Casts[];
    genres: Genres[];
    transcodingJobId: number;
    assetKeywords: string;
    assetLink: string;
    landscapeImage: string;
    portraitImage: string;
    status: string;
    contentType: string;
    videoType: string;
    series: string;
    season: string;
    contentProvider: ContentProvider;
    premium: boolean;
}

export class YouMayLike {
    id: number;
    playUrl: string;
    contentTitle: string;
    contentThumbnailUrl: string;
    duration: number;
    description: string;
    casts: Casts[];
    genres: Genres[];
    transcodingJobId: number;
    assetKeywords: string;
    assetLink: string;
    landscapeImage: string;
    portraitImage: string;
    status: string;
    contentType: string;
    videoType: string;
    series: string;
    season: string;
    contentProvider: ContentProvider;
    premium: boolean;
    slideConfig: SlideConfig;
}

export class Casts {

}

export class Genres {

}

export class ContentProvider{
    id: number;
    name: string;
    premium: boolean;
}

export class SlideConfig {
    slidesToShow: number;
    slidesToScroll: number;
    infinite: boolean;
    adaptiveHeight: boolean;
    speed: number;
    draggable : boolean;
  }

  export class SeriesResult{
      id: number;
      name: string;
      picture: string;
      status: string;
      description: string;
      seasonCount: number;
      vodCount: string;
      seasons: Seasons[];
  }
  export class Seasons{
      id: number;
      name: string;
      seasonNo: number;
  }

  export class RailSeries{
    id: number;
    playUrl: string;
    contentTitle: string;
    contentThumbnailUrl: string;
    duration: number;
    description: string;
    casts: Casts[];
    genres: Genres[];
    transcodingJobId: number;
    assetKeywords: string;
    assetLink: string;
    landscapeImage: string;
    portraitImage: string;
    status: string;
    contentType: string;
    videoType: string;
    series: string;
    season: string;
    contentProvider: ContentProvider;
    premium: boolean;
    slideConfig: SlideConfig;
  }
  
  export class SeasonResult{
      id: number;
      name: string;
      picture: string;
      status: string;
      idx: number;
      portraitImage: string;
      items: Items[];
     

  }

  export class Items{
    contentTitle: string;
    duration: number;
    id: number;
    landscapeImage: string;
    portraitImage: string;
    
  }

export class Days {
    id: number;
    name: string;
    date: string;
    wholeDate: number;
}

export class Week {
    weekday: Days[];
}
