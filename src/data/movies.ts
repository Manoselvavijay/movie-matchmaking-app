export interface Movie {
    id: string;
    title: string;
    year: number;
    genre: string[];
    rating: number;
    poster: string;
    summary: string;
}

export const movies: Movie[] = [
    {
        id: '1',
        title: 'Inception',
        year: 2010,
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        rating: 8.8,
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        summary: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    },
    {
        id: '2',
        title: 'Interstellar',
        year: 2014,
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        rating: 8.6,
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniL6C8z1dY4uvReqETvDn.jpg',
        summary: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    },
    {
        id: '3',
        title: 'The Dark Knight',
        year: 2008,
        genre: ['Action', 'Crime', 'Drama'],
        rating: 9.0,
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        summary: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    },
    {
        id: '4',
        title: 'Pulp Fiction',
        year: 1994,
        genre: ['Crime', 'Drama'],
        rating: 8.9,
        poster: 'https://image.tmdb.org/t/p/w500/fIE3lAGcZDV1G6XM5KmuWnNsPp1.jpg',
        summary: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    },
    {
        id: '5',
        title: 'The Matrix',
        year: 1999,
        genre: ['Action', 'Sci-Fi'],
        rating: 8.7,
        poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        summary: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    },
    {
        id: '6',
        title: 'Forrest Gump',
        year: 1994,
        genre: ['Drama', 'Romance'],
        rating: 8.8,
        poster: 'https://image.tmdb.org/t/p/w500/h5J4W4veyxMXDmjeNxjLXpR51TM.jpg',
        summary: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    },
    {
        id: '7',
        title: 'Fight Club',
        year: 1999,
        genre: ['Drama'],
        rating: 8.8,
        poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        summary: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.',
    },
];
