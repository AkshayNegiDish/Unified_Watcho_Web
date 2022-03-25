export class OTTCategory {
    channels: Channel[];
    childCategories: any[];
    id: number;
    images: any[];
    name: string;
    parentCategoryId: number;
    relatedObjects: any[];
}

export class Channel {
    objectType: string;
    createDate: string;
    description: string;
    id: number;
    name: string;
    updateDate: string;
    relatedObjects: any[];
    multilingualName: any[];
    multilingualDescription: any[];
}

export class AssetList {
    relatedObjects: any[];
    totalCount: number;
    objects: AssetListObjects[];
}

export class AssetListObjects {
    objectType?: string;
    createDate?: number;
    description?: string;
    endDate?: number;
    externalId?: string;
    id?: number;
    images?: Images[];
    mediaFiles?: any[];
    metas?: Metas;
    name?: string;
    startDate?: number;
    tags?: Tags;
    type?: string;
    updateDate?: number;
    entryId?: string;
    status?: string;
    typeDescription?: string;
}

export class Images {
    objectType: string;
    height: number;
    id: string;
    isDefault: boolean;
    ratio: string;
    url: string;
    version: number;
    width: number;
}

export class Metas {
    Year: Year;
    Is_Premium: Is_Premium; //TODO space
    Season_number?: TagsSubObject; //TODO space
    Episode_number?: TagsSubObject; //TODO space
    Runtime?: TagsSubObject; //TODO space
    DownloadAllowed?: TagsSubObject;
    Is_Exclusive?: TagsSubObject; //TODO space
    Airtime?: TagsSubObject;

}

export class Year {
    objectType: string;
    value: number;
}

export class Is_Premium {
    objectType: string;
    value: boolean;
}

export class Tags {
    Genre: TagsObject;
    Sub_Genre: TagsObject; //TODO space
    Country: TagsObject;
    Main_Cast: TagsObject; //TODO space
    Parental_Rating: TagsObject; //TODO space
    Director: TagsObject;
    Provider: TagsObject;
    SeriesId: TagsObject;
    Ref_Id: TagsObject; //TODO space
}

export class TagsObject {
    objectType: string;
    objects: TagsSubObject[];
}

export class TagsSubObject {
    objectType: string;
    value: any;
}

export class Assets {
    assets: any;
}