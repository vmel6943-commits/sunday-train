import {musicTracks,type MusicId} from '../data/music';
let ctx:AudioContext|null=null;
let enabled=true,volume=.55,unlocked=false,ducked=false,desired:MusicId='invitation';
let players:HTMLAudioElement[]=[];let active=0;let generation=0;let fadeFrame=0;
let snapshot:{track:MusicId;status:'ready'|'loading'|'playing'|'muted'|'paused'|'blocked'}={track:'invitation',status:'ready'};
const listeners=new Set<()=>void>();
function announce(status:typeof snapshot.status){if(snapshot.track===desired&&snapshot.status===status)return;snapshot={track:desired,status};listeners.forEach(fn=>fn());}
export const subscribeAudio=(fn:()=>void)=>{listeners.add(fn);return()=>listeners.delete(fn);};
export const getAudioState=()=>snapshot;
function targetVolume(){return enabled?volume*(ducked?.46:1):0;}
function ramp(targets:number[],duration:number,after?:()=>void){cancelAnimationFrame(fadeFrame);const from=players.map(p=>p.volume);const start=performance.now();const step=(now:number)=>{const t=Math.min(1,(now-start)/duration);players.forEach((p,i)=>p.volume=Math.max(0,Math.min(1,from[i]+((targets[i]||0)-from[i])*t)));if(t<1)fadeFrame=requestAnimationFrame(step);else{players.forEach((p,i)=>{if(i!==active&&(targets[i]||0)===0)p.pause();});after?.();}};fadeFrame=requestAnimationFrame(step);}
export function installMusicPlayers(a:HTMLAudioElement,b:HTMLAudioElement){players=[a,b];for(const p of players){p.loop=true;p.volume=0;p.preload='auto';p.setAttribute('playsinline','');}players[0].src=musicTracks[desired].src;players[0].load();if(unlocked&&enabled)void playTrack();return()=>{generation++;cancelAnimationFrame(fadeFrame);for(const p of players)p.pause();players=[];};}
async function playTrack(){
 if(!players.length||!unlocked||!enabled||document.hidden)return;
 const current=players[active];const wanted=musicTracks[desired].src;
 if(current.getAttribute('src')===wanted&&!current.paused){announce('playing');const targets=players.map((_,i)=>i===active?targetVolume():0);ramp(targets,300);return;}
 const same=current.getAttribute('src')===wanted;
 const next=same?active:1-active;const player=players[next];const token=++generation;
 if(!same){player.pause();player.src=wanted;player.load();player.volume=0;}announce('loading');
 try{await player.play();if(token!==generation)return;if(!enabled||document.hidden){player.pause();return;}const previous=active;active=next;announce('playing');ramp(players.map((_,i)=>i===active?targetVolume():0),same?700:1800,()=>{if(previous!==active)players[previous]?.pause();});}
 catch{if(token===generation&&enabled)announce('blocked');}
}
export function configureSound(muted:boolean,v:number){enabled=!muted;volume=Math.max(0,Math.min(1,v));if(!enabled){generation++;ramp([0,0],220,()=>{players.forEach(p=>p.pause());});announce('muted');}else if(unlocked)void playTrack();else announce('ready');}
export function unlockAudio(){if(!enabled)return;const first=!unlocked;unlocked=true;if(ctx?.state==='suspended')void ctx.resume().catch(()=>{});if(first||['ready','blocked','paused'].includes(snapshot.status))void playTrack();}
export function selectMusic(track:MusicId){if(track===desired)return;desired=track;if(enabled&&unlocked)void playTrack();else announce(enabled?'ready':'muted');}
export function duckMusic(value:boolean){ducked=value;if(!players.length)return;ramp(players.map((_,i)=>i===active?targetVolume():0),380);}
export function syncAudioVisibility(){if(document.hidden){generation++;cancelAnimationFrame(fadeFrame);players.forEach(p=>p.pause());announce(enabled?'paused':'muted');}else if(unlocked&&enabled)void playTrack();}
function context(){ctx??=new AudioContext();if(ctx.state==='suspended')void ctx.resume().catch(()=>{});return ctx;}
function noise(c:AudioContext,duration:number,cutoff:number,loudness:number){const b=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=b;filter.type='lowpass';filter.frequency.value=cutoff;gain.gain.setValueAtTime(loudness,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);source.connect(filter);filter.connect(gain);gain.connect(c.destination);source.start();source.stop(c.currentTime+duration);}
export function sound(kind:'paper'|'bell'|'stamp'|'success'|'click'|'radio'='click'){
 if(!enabled||!unlocked)return;try{const c=context();if(['paper','stamp','radio'].includes(kind)){noise(c,.22,kind==='stamp'?400:1800,volume*.045);if(kind==='paper')return;}
 const o=c.createOscillator(),gain=c.createGain();o.type='sine';o.frequency.setValueAtTime(({paper:190,bell:850,stamp:110,success:620,click:380,radio:130})[kind],c.currentTime);o.frequency.exponentialRampToValueAtTime(kind==='success'?980:120,c.currentTime+.18);gain.gain.setValueAtTime(volume*.07,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+.35);o.connect(gain);gain.connect(c.destination);o.start();o.stop(c.currentTime+.36);}catch{}}
