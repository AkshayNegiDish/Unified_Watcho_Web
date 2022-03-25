export interface Genre {
    id: number,
    name: string
}

export class Genres {
    private static genreList: Genre[] = [{
        id: 1,
        name: 'Humour'
    }, {
        id: 2,
        name: 'Dance'
    }, {
        id: 3,
        name: 'Drama'
    }, {
        id: 4,
        name: 'Fashion'
    }, {
        id: 5,
        name: 'Music'
    }, {
        id: 6,
        name: 'Prank'
    }, {
        id: 7,
        name: 'Travel'
    }, {
        id: 8,
        name: 'Thriller'
    }, {
        id: 9,
        name: 'Vlog'
    }];

    static getGenres() {
        return Genres.genreList;
    }
}

export enum VideoStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    IN_PROCESS,
    FAILED,
    DELETED
}