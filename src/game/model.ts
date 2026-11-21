export type SceneId = 'desk'|'station'|'hall'|'machine'|'gate'|'platform'|'carriage'|'informant'|'workbench'|'passenger'|'corridor'|'dining'|'radio'|'journal'|'end';
export type VoteChoice = 'A'|'B'|'C';
export interface Vote {choice:VoteChoice; confidence:number; influences:string[]; at:string}
export interface Ticket {nickname:string;carriage:'A'|'B'|'C';seat:string;style:number;id:string;checked:boolean;issuedAt:string;boardedAt?:string}
export interface Meal {recipe:number;ingredients:number[];mark:number;name:string;color:string;steps:number;at:string}
export interface GameState {
 version:1;started:boolean;scene:SceneId;unlocked:SceneId[];flags:string[];inventory:string[];achievements:string[];choices:Record<string,string>;history:{speaker:string;text:string}[];
 ticket:Ticket|null;firstVote:Vote|null;finalVote:Vote|null;evidence:string[];associations:Record<string,string>;visited:SceneId[];meals:Meal[];
 memory:{choice:string;text:string}|null;radio:{channel:string;frequency:number;sequence:string[]};
 settings:{muted:boolean;volume:number;reducedMotion:boolean;textSpeed:number;auto:boolean};
 savedAt:string;completedAt:string|null;
}
export function initialState():GameState{return {version:1,started:false,scene:'desk',unlocked:['desk'],flags:[],inventory:[],achievements:[],choices:{},history:[],ticket:null,firstVote:null,finalVote:null,evidence:[],associations:{},visited:['desk'],meals:[],memory:null,radio:{channel:'',frequency:72,sequence:[]},settings:{muted:false,volume:.55,reducedMotion:false,textSpeed:34,auto:false},savedAt:'',completedAt:null};}
export const requiredEvidence=['video','notice','timeline'];
export function has(g:GameState,flag:string){return g.flags.includes(flag);}
export function allEvidence(g:GameState){return requiredEvidence.every(id=>g.evidence.includes(id));}
export function canRevote(g:GameState){return !!g.firstVote&&g.evidence.length>0;}
export function canFinish(g:GameState){return !!g.ticket?.checked&&!!g.firstVote&&!!g.finalVote;}
export function isOrdered(actual:string[],expected:string[]){return actual.length===expected.length&&actual.every((id,i)=>id===expected[i]);}
export function isTuned(f:number){return Math.abs(f-94)<=2;}
export function voteFeedback(first:Vote,final:Vote){const delta=final.confidence-first.confidence;return {kind:final.choice==='C'?'保留判断':first.choice===final.choice?'判断保持一致':'判断发生变化',confidence:delta>0?'把握程度提高了':delta<0?'把握程度降低了':'把握程度保持不变'};}
export function task(g:GameState):string{
 if(g.completedAt)return '今晚的故事已经收藏，列车仍欢迎你继续逛逛';
 if(g.scene==='desk')return '一封写给你的邀请，正放在灯下';
 if(g.scene==='station')return '站房的灯还亮着，乘务员正在大厅等你';
 if(g.scene==='hall')return g.ticket?'车票已经备好，站台就在前方':'乘务员替你留好了位置，聊完就可以领票';
 if(g.scene==='machine')return g.ticket?'收好这张车票，准备登车':'写上一个喜欢的名字，领取你的车票';
 if(g.scene==='gate')return '递上车票，留下一枚启程的印章';
 if(g.scene==='platform')return '车门已经打开，旅程从这里开始';
 if(g.scene==='carriage')return '七日路线缓缓展开，一份特别的消息正在车厢尽头等你';
 if(!g.firstVote)return '打开专报，先留下此刻的想法';
 if(!g.flags.includes('suitcase'))return '周紫琳准备打开皮箱，把更多材料交给你';
 if(!g.finalVote)return g.evidence.length?'材料可以自由翻阅，随时记录调查后的想法':'想先看哪一份材料？从你最在意的地方开始';
 return '随意逛逛，尝点甜的，看看窗外；想收藏今晚时，去手账台盖章';
}
const sceneIds:SceneId[]=['desk','station','hall','machine','gate','platform','carriage','informant','workbench','passenger','corridor','dining','radio','journal','end'];
export function validateImport(value:unknown):value is GameState{
 if(!value||typeof value!=='object')return false;
 const g=value as GameState;
 const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string');
 const record=(v:unknown)=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.values(v).every(x=>typeof x==='string');
 const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v);
 const validVote=(v:Vote|null)=>v===null||!!v&&['A','B','C'].includes(v.choice)&&Number.isInteger(v.confidence)&&v.confidence>=1&&v.confidence<=5&&strings(v.influences)&&typeof v.at==='string';
 if(g.version!==1||typeof g.started!=='boolean'||!sceneIds.includes(g.scene)||!strings(g.flags)||!strings(g.inventory)||!strings(g.achievements)||!strings(g.evidence)||!strings(g.unlocked)||!g.unlocked.every(s=>sceneIds.includes(s))||!strings(g.visited)||!g.visited.every(s=>sceneIds.includes(s))||!record(g.choices)||!record(g.associations))return false;
 if(!Array.isArray(g.history)||!g.history.every(h=>h&&typeof h.speaker==='string'&&typeof h.text==='string')||!validVote(g.firstVote)||!validVote(g.finalVote))return false;
 if(g.ticket!==null&&(!g.ticket||typeof g.ticket.nickname!=='string'||g.ticket.nickname.length>12||!['A','B','C'].includes(g.ticket.carriage)||typeof g.ticket.seat!=='string'||![0,1,2].includes(g.ticket.style)||typeof g.ticket.checked!=='boolean'||typeof g.ticket.id!=='string'||typeof g.ticket.issuedAt!=='string'))return false;
 if(g.memory!==null&&(!g.memory||typeof g.memory.choice!=='string'||typeof g.memory.text!=='string'||g.memory.text.length>60))return false;
 if(!Array.isArray(g.meals)||!g.meals.every(m=>m&&[1,2,3,4].includes(m.recipe)&&Array.isArray(m.ingredients)&&m.ingredients.every(n=>Number.isInteger(n)&&n>=1&&n<=8)&&[1,2,3,4].includes(m.mark)&&typeof m.name==='string'&&typeof m.color==='string'&&finite(m.steps)&&typeof m.at==='string'))return false;
 if(!g.radio||typeof g.radio.channel!=='string'||!finite(g.radio.frequency)||!strings(g.radio.sequence))return false;
 if(!g.settings||typeof g.settings.muted!=='boolean'||!finite(g.settings.volume)||g.settings.volume<0||g.settings.volume>1||typeof g.settings.reducedMotion!=='boolean'||!finite(g.settings.textSpeed)||typeof g.settings.auto!=='boolean')return false;
 return typeof g.savedAt==='string'&&(g.completedAt===null||typeof g.completedAt==='string');
}
