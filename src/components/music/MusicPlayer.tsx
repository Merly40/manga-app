"use client";

import { useState } from "react";
import PlaylistPanel from "./PlaylistPanel";
import { AnimatePresence, motion } from "framer-motion";
import * as Slider from "@radix-ui/react-slider";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";

import { playlist } from "./Playlist";
import { useMusic } from "./MusicContext";
import "./music-princess.css";
import MusicCover from "./MusicCover";
import MusicButton from "./MusicButton";
import RequestSongButton from "./RequestSongButton";
import RequestSongForm from "./RequestSongForm";

function timeText(sec:number){
  if(!isFinite(sec)) return "00:00";
  const m=Math.floor(sec/60);
  const s=Math.floor(sec%60);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export default function MusicPlayer(){
  const {
    playing,toggle,volume,setVolume,uiOpen,setUiOpen,
    currentTime,duration,seek,currentTrack,nextTrack,prevTrack
  }=useMusic();

  const [screen,setScreen]=useState<"player"|"request">("player");

  const track=playlist[currentTrack];

  return (
    <>
      {!uiOpen && (
        <div className="fixed bottom-6 left-6 z-[9999]">
          <MusicButton playing={playing} onClick={()=>setUiOpen(true)} />
        </div>
      )}

      <AnimatePresence>
        {uiOpen && (
          <motion.div
            initial={{opacity:0,y:30}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:30}}
            className="fixed bottom-6 left-6 z-[9999] w-[380px] p-5 music-card">

            {screen === "player" ? (
              <>
                <button onClick={()=>setUiOpen(false)} className="absolute right-4 top-4">
                  <X size={18}/>
                </button>

                <div className="flex gap-4">
                  <MusicCover cover={track.cover} title={track.title} playing={playing} />

                  <div className="flex-1">
                    <h2 className="music-title text-xl font-bold">{track.title}</h2>
                    <p className="text-sm text-gray-500">{track.artist}</p>

                    <Slider.Root
                      min={0}
                      max={Math.max(duration,1)}
                      value={[Math.min(currentTime,duration||0)]}
                      step={1}
                      onValueChange={([value])=>seek(value)}
                      className="relative mt-4 flex h-5 items-center">
                      <Slider.Track className="relative h-1 grow rounded-full bg-pink-200">
                        <Slider.Range className="absolute h-full rounded-full bg-pink-500"/>
                      </Slider.Track>
                      <Slider.Thumb className="block h-4 w-4 rounded-full bg-pink-500"/>
                    </Slider.Root>

                    <div className="mt-1 flex justify-between text-xs">
                      <span>{timeText(currentTime)}</span>
                      <span>{timeText(duration)}</span>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-6">
                      <button className="music-btn flex h-10 w-10 items-center justify-center" onClick={prevTrack}><SkipBack/></button>
                      <button onClick={toggle} className="music-btn flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg">
                        {playing?<Pause/>:<Play/>}
                      </button>
                      <button className="music-btn flex h-10 w-10 items-center justify-center" onClick={nextTrack}><SkipForward/></button>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <Volume2 size={18}/>
                      <Slider.Root
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={([v])=>setVolume(v)}
                        className="relative flex h-5 flex-1 items-center">
                        <Slider.Track className="relative h-1 grow rounded-full bg-pink-200">
                          <Slider.Range className="absolute h-full rounded-full bg-pink-500"/>
                        </Slider.Track>
                        <Slider.Thumb className="block h-4 w-4 rounded-full bg-pink-500"/>
                      </Slider.Root>
                    </div>
                  </div>
                </div>

                <PlaylistPanel />
                <RequestSongButton onClick={()=>setScreen("request")} />
              </>
            ) : (
              <RequestSongForm
                onBack={()=>setScreen("player")}
                onClose={()=>{setUiOpen(false);setScreen("player");}}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}