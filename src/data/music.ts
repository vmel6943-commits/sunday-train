import type {SceneId} from '../game/model';
export type MusicId='invitation'|'departure'|'investigation'|'night'|'dining'|'finale';
export const musicTracks:Record<MusicId,{title:string;description:string;src:string}>={
 invitation:{title:'一封午夜来信',description:'钟琴与轻柔钢琴',src:'music/invitation.mp3'},
 departure:{title:'最后一声汽笛',description:'轻快的三拍启程曲',src:'music/departure.mp3'},
 investigation:{title:'皮箱里的回声',description:'拨弦与钟琴的轻悬念',src:'music/investigation.mp3'},
 night:{title:'月光越过车窗',description:'温暖、舒缓的夜行曲',src:'music/night.mp3'},
 dining:{title:'餐车的甜点华尔兹',description:'轻盈的钢琴华尔兹',src:'music/dining.mp3'},
 finale:{title:'把今夜好好收藏',description:'回到最初旋律的温柔尾声',src:'music/finale.mp3'}
};
export function musicForScene(scene:SceneId,completed=false):MusicId{
 if(scene==='desk')return 'invitation';
 if(['station','hall','machine','gate','platform'].includes(scene))return 'departure';
 if(scene==='informant'||scene==='workbench')return 'investigation';
 if(scene==='dining')return 'dining';
 if(scene==='end'||scene==='journal'&&completed)return 'finale';
 return 'night';
}
