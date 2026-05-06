import { gamesData } from "../../constants/pages/exhibits/games";
import { pages } from "../../constants/pages/pages";
import { GetPagesExcept } from "../../components/Pages";
export default function GamesPage() {
  const Pages = GetPagesExcept(pages.games, false)
  return (
    <div>
      <div className="min-h-screen w-full flex flex-col items-center px-6 py-16 text-white">
        <h1 className="text-4xl font-bold mb-4">Games</h1>

        <p className="text-white/70 mb-10 text-center max-w-xl">
          A collection of my small games
        </p>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesData.map((game) => (
            <a
              key={game.title}
              href={game.url}
              className="group border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition"
            >
              {/* Thumbnail */}
              <div className="h-48 w-full overflow-hidden bg-black/30">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-semibold group-hover:text-purple-200 transition">
                  {game.title}
                </h2>

                <p className="text-white/60 text-sm">
                  {game.description}
                </p>

                <span className="text-xs text-white/40 mt-2">
                  Click to play →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
      <Pages/>
    </div>
  );
}