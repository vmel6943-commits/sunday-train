import {useEffect,useRef,useSyncExternalStore} from 'react';
import {useGame} from '../game/store';
import {musicForScene,musicTracks} from '../data/music';
import {installMusicPlayers,configureSound,selectMusic,duckMusic,syncAudioVisibility,getAudioState,subscribeAudio} from '../utils/audio';
import type {SceneId} from '../game/model';
export function useMusic(){return useSyncExternalStore(subscribeAudio,getAudioState,getAudioState);}
export function Music({scene,dialogue}:{scene:SceneId;dialogue:boolean}){
 const a=useRef<HTMLAudioElement>(null),b=useRef<HTMLAudioElement>(null);const settings=useGame(s=>s.game.settings);const completed=useGame(s=>!!s.game.completedAt);
 useEffect(()=>{if(!a.current||!b.current)return;return installMusicPlayers(a.current,b.current);},[]);
 useEffect(()=>configureSound(settings.muted,settings.volume),[settings.muted,settings.volume]);
 useEffect(()=>selectMusic(musicForScene(scene,completed)),[scene,completed]);
 useEffect(()=>duckMusic(dialogue),[dialogue]);
 useEffect(()=>{document.addEventListener('visibilitychange',syncAudioVisibility);return()=>document.removeEventListener('visibilitychange',syncAudioVisibility);},[]);
 return <div className="music-media" aria-hidden="true"><audio ref={a} data-music-player="a"/><audio ref={b} data-music-player="b"/></div>;
}
export function MusicStatus(){const music=useMusic();return <span className={`music-status status-${music.status}`} aria-live="polite"><span className="music-bars"><i/><i/><i/></span><span>{music.status==='playing'?musicTracks[music.track].title:music.status==='loading'?'配乐准备中':music.status==='muted'?'配乐已静音':music.status==='blocked'?'轻触开启配乐':'随旅程开启配乐'}</span></span>;}
