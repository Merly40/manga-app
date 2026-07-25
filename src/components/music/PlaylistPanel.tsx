"use client";

import { playlist } from "./PlaylistData";
import { useMusic } from "./MusicContext";

export default function PlaylistPanel() {
  const {
    currentTrack,
    nextTrack,
    prevTrack,
  } = useMusic();

  return (
    <div className="music-card mt-4 p-4">
      <h3 className="music-title mb-3 text-lg font-bold">
        Playlist
      </h3>

      <div className="space-y-2">
        {playlist.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center gap-3 rounded-xl p-2 ${
              index === currentTrack
                ? "bg-pink-100"
                : "hover:bg-pink-50"
            }`}
          >
            <img
              src={track.cover}
              alt={track.title}
              className="h-12 w-12 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="font-medium">{track.title}</div>
              <div className="text-xs text-gray-500">
                {track.artist}
              </div>
            </div>

            {index < currentTrack && (
              <button
                onClick={prevTrack}
                className="text-xs rounded bg-pink-200 px-2 py-1"
              >
                ก่อนหน้า
              </button>
            )}

            {index > currentTrack && (
              <button
                onClick={nextTrack}
                className="text-xs rounded bg-pink-500 px-2 py-1 text-white"
              >
                เล่น
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}