from pathlib import Path
from PIL import Image
import json,shutil
root=Path(__file__).resolve().parents[2]/'asset-source'
out=Path(__file__).resolve().parents[1]/'public/assets';out.mkdir(exist_ok=True,parents=True)
files=list(root.rglob('*')); mapping={}; audit=[]
def add(key,pattern,svg=False):
 matches=[f for f in files if f.is_file() and f.name==pattern]
 if not matches: raise Exception(pattern)
 p=matches[0]
 if svg:
  target=out/(key+'.svg');shutil.copyfile(p,target);meta={'type':'vector'}
 else:
  im=Image.open(p);target=out/(key+'.webp');im.save(target,'WEBP',quality=88,method=6);meta={'width':im.width,'height':im.height,'alpha':im.mode=='RGBA'}
 mapping[key]='assets/'+target.name;audit.append({'key':key,'original':str(p.relative_to(root)), 'path':mapping[key],**meta})
for key,n,title in [('desk',1,'邀请函书桌'),('station',3,'雾中车站'),('hall',5,'候车大厅'),('machine',7,'古董出票机'),('platform',9,'月夜站台列车')]:
 add(key+'Mobile',f'A{n:02}_{title}_手机竖屏.png');add(key,f'A{n+1:02}_{title}_桌面横屏.png')
add('carriageMobile','B01_豪华列车车厢_手机竖屏.png');add('carriage','B01b_豪华列车车厢_桌面裁切适配.png')
for key,prefix in [('informant','S11_情报贩子车厢'),('workbench','S15_皮箱工作台')]:
 add(key,prefix+'_桌面.png');add(key+'Mobile',prefix+'_手机.png')
for key,n,title in [('passenger',1,'乘客车厢'),('corridor',3,'观景走廊'),('radio',7,'广播角')]:
 add(key+'Mobile',f'SCENE{n:02}_{title}_移动.png');add(key,f'SCENE{n+1:02}_{title}_桌面.png')
add('dining','SCENE06_美食制作_桌面.png');add('diningMobile','SCENE05_餐车推车_移动.png')
add('journal','SCENE10_首日收尾_桌面.png');add('journalMobile','SCENE09_旅行手账_移动.png')
for key,name in [('attendant','乘务鹅_马雨秋_正面透明.png'),('captain','列车长鹅_胡焯薇_正面透明.png'),('journalist','旅行手账鹅_邓琴_正面透明.png'),('spy','角色_神秘情报鹅_周紫琳_正面_透明抠图.png')]:add(key,name)
for key,base in [('envelope','P_01_神秘邀请信封'),('seal','P_02_火漆封印'),('watch','P_03_黄铜怀表'),('stamp','P_04_检票印章'),('luggage','P_05_复古皮箱'),('tag','P_06_行李牌'),('ticket','P_07_列车车票'),('notebook','P_08_旅行手账本'),('newspaper','P_09_旧新闻报纸'),('bell','P_10_黄铜服务铃'),('key','P_11_神秘钥匙'),('magnifier','P_12_放大镜'),('medal','P_14_徽章纪念章'),('cassette','P17_神秘录音磁带'),('suitcase','P01_三锁皮箱_关闭'),('suitcaseOpen','P02_情报皮箱_打开'),('film','P08_电影胶片卷')]:add(key,base+'.svg',True)
for i,n in enumerate(['反转千层酥','等等再说热可可','多视角拼盘','回声气泡饮'],1):add('food'+str(i),f'FOOD{i:02}_{n}.svg',True)
for i,n in enumerate(['草莓','奶油','焦糖','蓝莓','曲奇','薄荷','柠檬','巧克力'],1):add('ingredient'+str(i),f'ING{i:02}_{n}.svg',True)
for i,n in enumerate(['放大镜印记','保留疑问印记','欢迎讨论印记','记录惊喜印记','DAY01盖章'],1):add('mark'+str(i),f'STAMP{i:02}_{n}.svg',True)
Path(__file__).resolve().parents[1].joinpath('src/data/assets.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2))
Path(__file__).resolve().parents[1].joinpath('docs/美术资源清单.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print('Prepared',len(audit),'assets;',round(sum(f.stat().st_size for f in out.iterdir())/1024/1024,2),'MiB')
