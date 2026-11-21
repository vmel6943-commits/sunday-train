import {create} from 'zustand';
import {persist,createJSONStorage} from 'zustand/middleware';
import {initialState,validateImport,type GameState,type SceneId,type Vote,type Meal,type Ticket} from './model';
export const SAVE_KEY='goose-express-save-v1';
let storageFailed=false;
const storage={getItem:(key:string)=>{try{const v=localStorage.getItem(key);if(v){const parsed=JSON.parse(v);if(!validateImport(parsed.state?.game)){localStorage.setItem(key+'-recovery',v);return null;}}return v;}catch{return null;}},setItem:(key:string,v:string)=>{try{localStorage.setItem(key,v);}catch{storageFailed=true;window.dispatchEvent(new Event('save-error'));}},removeItem:(key:string)=>{try{localStorage.removeItem(key);}catch{storageFailed=true;}}};
interface Store{game:GameState;update:(fn:(g:GameState)=>Partial<GameState>)=>void;flag:(id:string)=>void;collect:(id:string,achievement?:string)=>void;go:(scene:SceneId)=>void;choose:(key:string,value:string)=>void;log:(speaker:string,text:string)=>void;issue:(ticket:Ticket)=>void;check:()=>void;vote:(vote:Vote,final?:boolean)=>void;investigate:(id:string)=>void;meal:(m:Meal)=>void;reset:()=>void;restore:(g:unknown)=>boolean;}
export const useGame=create<Store>()(persist((set,get)=>({
 game:initialState(),
 update:fn=>set(s=>({game:{...s.game,...fn(s.game),savedAt:new Date().toISOString()}})),
 flag:id=>get().update(g=>({flags:[...new Set([...g.flags,id])]})),
 collect:(id,achievement)=>get().update(g=>({inventory:[...new Set([...g.inventory,id])],achievements:achievement?[...new Set([...g.achievements,achievement])]:g.achievements})),
 go:scene=>get().update(g=>({scene,unlocked:[...new Set([...g.unlocked,scene])],visited:[...new Set([...g.visited,scene])]})),
 choose:(key,value)=>get().update(g=>({choices:{...g.choices,[key]:value}})),
 log:(speaker,text)=>get().update(g=>({history:[...g.history,{speaker,text}].slice(-250)})),
 issue:ticket=>get().update(g=>g.ticket?{}:{ticket,inventory:[...new Set([...g.inventory,'ticket'])]}),
 check:()=>get().update(g=>g.ticket?{ticket:{...g.ticket,checked:true,boardedAt:new Date().toISOString()},flags:[...new Set([...g.flags,'checked'])]}:{}),
 vote:(vote,final=false)=>get().update(g=>final?g.finalVote?{}:{finalVote:vote}:g.firstVote?{}:{firstVote:vote}),
 investigate:id=>get().update(g=>({evidence:[...new Set([...g.evidence,id])]})),
 meal:m=>get().update(g=>({meals:[...g.meals,m]})),
 reset:()=>set({game:initialState()}),restore:g=>{if(!validateImport(g))return false;set({game:g});return true;}
}),{name:SAVE_KEY,storage:createJSONStorage(()=>storage),partialize:s=>({game:s.game}),version:1}));
export const saveUnavailable=()=>storageFailed;
