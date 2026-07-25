export type Track = {
  id: number;
  title: string;
  artist: string;
  src: string;
  cover: string;
};

export const playlist: Track[] = [
  {
    id: 1,
    title: "ขี้แง (Boys Don't Cry)",
    artist: "COVER VERSION [Original Song by PROXIE]",
    src: "/music/dreamy-cat-cafe.mp3",
    cover: "/music/cover.jpg",
  },
  {
    id: 2,
    title: "Princess Night",
    artist: "Manhwa Duchess OST",
    src: "/music/Lovely.mp3",
    cover: "/music/eiei.webp",
  },
  {
    id: 3,
    title: "ตุ๊บป่อง",
    artist: "ily",
    src: "/music/ily.mp3",
    cover: "/music/cute.webp",
  },
];