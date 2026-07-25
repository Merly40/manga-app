"use client";
import { createContext,useContext,useEffect,useRef,useState } from "react";
import { playlist } from "./PlaylistData";
type MusicContextType={playing:boolean;currentTrack:number;currentTime:number;duration:number;volume:number;uiOpen:boolean;toggle:()=>void;nextTrack:()=>void;prevTrack:()=>void;seek:(t:number)=>void;setVolume:(v:number)=>void;setUiOpen:(v:boolean)=>void;};
const MusicContext=createContext<MusicContextType|null>(null);
export function MusicProvider({children}:{children:React.ReactNode}){const audioRef=useRef(new Audio());const[playing,setPlaying]=useState(false);const[currentTrack,setCurrentTrack]=useState(0);const[currentTime,setCurrentTime]=useState(0);const[duration,setDuration]=useState(0);const[volume,setVolume]=useState(.4);const[uiOpen,setUiOpen]=useState(true);
useEffect(()=>{const a=audioRef.current;const t=()=>setCurrentTime(a.currentTime);const m=()=>setDuration(a.duration||0);const e=()=>setCurrentTrack(i=>(i+1)%playlist.length);a.addEventListener("timeupdate",t);a.addEventListener("loadedmetadata",m);a.addEventListener("ended",e);return()=>{a.removeEventListener("timeupdate",t);a.removeEventListener("loadedmetadata",m);a.removeEventListener("ended",e);};},[]);
useEffect(()=>{const a=audioRef.current;a.src=playlist[currentTrack].src;a.load();a.volume=volume;setCurrentTime(0);setDuration(0);if(playing)a.play().catch(()=>{});},[currentTrack]);
useEffect(()=>{audioRef.current.volume=volume;},[volume]);
useEffect(()=>{playing?audioRef.current.play().catch(()=>{}):audioRef.current.pause();},[playing]);
return <MusicContext.Provider value={{playing,currentTrack,currentTime,duration,volume,uiOpen,toggle:()=>setPlaying(v=>!v),nextTrack:()=>setCurrentTrack(i=>(i+1)%playlist.length),prevTrack:()=>setCurrentTrack(i=>(i-1+playlist.length)%playlist.length),seek:(t)=>{audioRef.current.currentTime=t;setCurrentTime(t);},setVolume,setUiOpen}}>{children}</MusicContext.Provider>}
export function useMusic(){const c=useContext(MusicContext);if(!c)throw new Error("useMusic must be used inside MusicProvider");return c;}