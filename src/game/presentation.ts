import type {GameState,SceneId} from './model';
export interface DialogueContext {scene:SceneId;epoch:number}
export function dialogueBelongsToScene(context:DialogueContext|null,scene:SceneId,epoch:number){return !!context&&context.scene===scene&&context.epoch===epoch;}
export function boardingAction(g:GameState):string|null{
 switch(g.scene){
  case 'desk':return g.flags.includes('letter')?'前往雾中车站':'拆开邀请函';
  case 'station':return '走进候车大厅';
  case 'hall':return !g.flags.includes('briefed')?'和乘务员打个招呼':!g.ticket?'领取我的车票':g.ticket.checked?'走向站台':'请乘务员检票';
  case 'machine':return g.ticket?'收好车票，前往检票':'领取我的车票';
  case 'gate':return g.ticket?.checked?'走向站台':'出示我的车票';
  case 'platform':return '登上列车';
  case 'carriage':return g.flags.includes('map-seen')?'走向过道尽头的皮箱':'展开七日路线图';
  default:return null;
 }
}
export const previousScene:Partial<Record<SceneId,SceneId>>={station:'desk',hall:'station',machine:'hall',gate:'machine',platform:'gate',carriage:'platform',informant:'carriage',workbench:'informant'};
