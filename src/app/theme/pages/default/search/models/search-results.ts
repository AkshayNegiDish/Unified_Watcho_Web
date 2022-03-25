export class SearchResults  {
    id: number;
    title: string;
    description:string;
    assetType: string;
    status: string;
    genreSearchDTOList: GenreSearchDTOList[];
    keywordSearchDTOList : any[];
    thumbnailURL: string;
    landscapeImage: string;
    portraitImage: string;
    premium: boolean;
    duration: number;
}

export class GenreSearchDTOList {
    id: number;
    genreName: string;
    genreKey: string;
}

export class SearchResultsData {
    episodesCount: number;
    id: number;
    name: string;
    picture: string;
    type: string;
    status: string;
}
