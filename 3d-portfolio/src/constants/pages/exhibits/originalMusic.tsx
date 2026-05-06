type Track = {
  title: string,
  file: string,
  description?: string;
};

type Category = {
  name: string,
  description? : string,
  tracks: Track[],
};

export const musicData: Category[] = [
  {
    name: "Polygon Tower Defense OST",
    description : "Soundtrack for Polygon Tower Defense",
    tracks: [
      {
        title : "Not Boss Music",
        file : "/music/polygonTD/Level4.mp3",
        description: "[Level 4 music in Polygon Tower Defense]"
      },
      {
        title : "Keystorm",
        file : "/music/polygonTD/Level3.mp3",
        description: "[Level 3 music in Polygon Tower Defense]"
      },
      {
        title : "New Beginnings",
        file : "/music/polygonTD/Level2.mp3",
        description: "[Level 2 music in Polygon Tower Defense]"
      },
      {
        title : "8-Bit Crusade",
        file : "/music/polygonTD/Level1.mp3",
        description: "[Level 1 music in Polygon Tower Defense]"
      },
      {
        title: "Just The Lobby",
        file: "/music/polygonTD/Lobby.mp3",
        description: "[Lobby music in Polygon Tower Defense]",
      },
    ],
  },
  {
    name: "Sidestep² OST",
    description : "My original soundtracks for Sidestep²",
    tracks: [
      {
        title: "Wonky Trip",
        file: "/music/sidestep2/WonkyTrip.wav",
        description: "The weird synth music in level 2 of Sidestep²",
      },
      {
        title: "Endless",
        file: "/music/sidestep2/EndlessExtended.mp3",
        description: "The looping music for endless mode of Sidestep² [extended version]",
      },
    ],
  },
];
