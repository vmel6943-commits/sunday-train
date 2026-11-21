import type {GameState} from '../game/model';
import {voteLabel} from '../data/event';
import {art,ingredients,marks,recipes} from '../data/config';
export type ShareKind='ticket'|'opinion'|'food'|'day';
export interface ShareOptions{hideName:boolean;hideOpinions:boolean}
function loadImage(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
export async function createShare(g:GameState,kind:ShareKind,opts:ShareOptions):Promise<Blob>{
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=kind==='ticket'?660:kind==='day'?1800:1440;const c=canvas.getContext('2d');if(!c)throw new Error('图片生成暂不可用');
 const w=canvas.width,h=canvas.height;c.fillStyle=kind==='ticket'?['#17283d','#efe1ca','#83574b'][g.ticket?.style||0]:'#17283d';c.fillRect(0,0,w,h);c.strokeStyle='#c8a875';c.lineWidth=3;c.strokeRect(35,35,w-70,h-70);c.strokeRect(47,47,w-94,h-94);
 let finalHeight=h;const ink=kind==='ticket'&&g.ticket?.style===1?'#27374b':'#efe1ca';c.fillStyle='#c8a875';c.font='26px sans-serif';c.fillText('WEEK TO SUNDAY   /   MONDAY JOURNEY',80,100);c.fillStyle=ink;c.font='bold 64px sans-serif';c.fillText('开往周日的列车',80,190);
 const title={ticket:'七日旅程 · 专属登车券',opinion:'皮箱里的十五秒 · 我的判断记录',food:'夜行餐车 · 专属美食',day:'第一日 · 夜行旅程纪念'}[kind];c.font='30px sans-serif';c.fillText(title,80,250);c.strokeStyle='#c8a87588';c.beginPath();c.moveTo(80,285);c.lineTo(1000,285);c.stroke();
 let y=340;
 const line=(text:string,size=30)=>{c.font=`${size}px sans-serif`;c.fillStyle=ink;let row='';for(const char of text){if(c.measureText(row+char).width>890){c.fillText(row,80,y);y+=size*1.6;row=char;}else row+=char;}c.fillText(row,80,y);y+=size*1.8;};
 line(opts.hideName?'旅客 · 匿名旅客':`旅客 · ${g.ticket?.nickname||'鹅鹅旅客'}`,34);
 if(kind==='ticket'){line(`G-07    ${g.ticket?.carriage}车厢    ${g.ticket?.seat}`,46);line(`专属编号 ${g.ticket?.id}`,24);line(g.ticket?.checked?'已检票 · 欢迎登车':'待检票 · 车站见',30);if(g.inventory.includes('seal'))line('旧式邀请印章 · 特别纪念',22);}
 if(kind==='opinion'||kind==='day'){
  if(opts.hideOpinions){line('具体观点已隐藏');}else{line('初次判断：'+voteLabel(g.firstVote?.choice),27);line('调查后：'+voteLabel(g.finalVote?.choice),27);}
  line(`把握程度  ${g.firstVote?.confidence||'—'}/5  →  ${g.finalVote?.confidence||'—'}/5`,26);
  line(`已调查 ${g.evidence.length} 份档案`,26);
  if(kind==='opinion')line('影响判断的证据：'+(g.finalVote?.influences.join('、')||'未选择'),26);
 }
 const m=g.meals.at(-1);
 if((kind==='food'||kind==='day')&&m){
  line(m.name||recipes[m.recipe-1].name,34);
  try{const food=await loadImage(art('food'+m.recipe));const x=360,top=y;if(m.recipe===4)c.filter=`hue-rotate(${['#ac635d','#698f99','#aa925e'].indexOf(m.color)*60}deg)`;const scale=Math.min(340/food.width,300/food.height);c.drawImage(food,x,top,food.width*scale,food.height*scale);c.filter='none';for(let i=0;i<m.ingredients.length;i++){const ing=await loadImage(art('ingredient'+m.ingredients[i]));c.drawImage(ing,340+i%3*95,top+60+Math.floor(i/3)*65,105,105);}const mark=await loadImage(art('mark'+m.mark));c.drawImage(mark,720,top+190,100,100);y+=310;}catch{line('专属列车甜点');}
  line('配料：'+m.ingredients.map(n=>ingredients[n-1]).join('、'),24);line('纪念印记：'+marks[m.mark-1],24);
 }
 if(kind==='day'&&g.memory){line('首日见闻：'+g.memory.choice,26);if(g.memory.text)line(g.memory.text,24);}
 if(kind!=='ticket'){finalHeight=Math.max(kind==='day'?1400:1100,y+250);c.clearRect(0,finalHeight-55,w,h-finalHeight+55);c.fillStyle='#17283d';c.fillRect(0,finalHeight-55,w,55);c.strokeStyle='#c8a875';c.lineWidth=3;c.strokeRect(35,35,w-70,finalHeight-70);c.strokeRect(47,47,w-94,finalHeight-94);}
 c.fillStyle='#c8a875';c.font='25px sans-serif';c.fillText(kind==='day'?'DAY 01  /  首日记录已收藏':'一张车票，一段属于你的旅程。',80,finalHeight-105);c.font='21px sans-serif';c.fillText('下一站的故事，等待揭晓。',80,finalHeight-65);
 if(kind==='opinion'){c.fillStyle='#c8a875';c.font='22px sans-serif';c.fillText('虚构图书馆事件 · 交互演示 · 个人判断记录',80,finalHeight-160);}
 const result=document.createElement('canvas');result.width=w;result.height=finalHeight;result.getContext('2d')!.drawImage(canvas,0,0);return new Promise((resolve,reject)=>result.toBlob(blob=>blob?resolve(blob):reject(new Error('图片导出失败')),'image/png'));
}
export function downloadBlob(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
