"""Original, deterministic instrumental underscore; no external samples."""
from pathlib import Path
import numpy as np
from scipy.signal import lfilter
import wave,subprocess,json
RATE=22050
OUT=Path(__file__).resolve().parents[1]/'public/music'
OUT.mkdir(exist_ok=True)
rng=np.random.default_rng(7026)
notes={'C':0,'Cs':1,'D':2,'Eb':3,'E':4,'F':5,'Fs':6,'G':7,'Ab':8,'A':9,'Bb':10,'B':11}
def midi(n):
 if isinstance(n,(int,float)):return n
 return 12*(int(n[-1])+1)+notes[n[:-1]]
def freq(n):return 440*2**((midi(n)-69)/12)
def envelope(t,d,attack,decay,sustain=0):
 return np.minimum(t/max(attack,.001),1)*np.exp(-t/decay)*np.minimum(np.maximum((d-t)/.1,0),1)
def instrument(n,d,kind):
 t=np.arange(int(d*RATE))/RATE;f=freq(n)
 if kind=='piano':
  s=sum(a*np.sin(2*np.pi*f*k*t+0.003*k*np.sin(2*np.pi*.35*t))*np.exp(-t/(1.8/(k**.65))) for k,a in [(1,1),(2,.4),(3,.16),(4,.08),(6,.018)])
  s*=envelope(t,d,.009,2.5)
 elif kind=='celesta':
  s=(np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*2.001*t)+.12*np.sin(2*np.pi*f*3.99*t))*envelope(t,d,.006,.85)
 elif kind=='pluck':
  s=sum(np.sin(2*np.pi*f*k*t)*a*np.exp(-t/(.65/k)) for k,a in [(1,1),(2,.24),(3,.10),(4,.055)])*envelope(t,d,.005,1.1)
 elif kind=='bass':
  s=(np.sin(2*np.pi*f*t)+.17*np.sin(4*np.pi*f*t))*envelope(t,d,.025,.95)
 else:
  attack=np.minimum(t/.8,1);release=np.minimum(np.maximum((d-t)/.8,0),1)
  s=sum(a*(np.sin(2*np.pi*f*k*t)+np.sin(2*np.pi*(f*k*1.002)*t))*.5 for k,a in [(1,1),(2,.13),(3,.05)])*attack*release
 return s
tracks=[
 dict(id='invitation',title='一封午夜来信',bpm=70,beats=4,bars=16,kind='celesta',chords=[['D3','F3','A3','E4'],['Bb2','D3','F3','A3'],['G2','Bb3','D4','F4'],['A2','Cs4','E4','G4']],melody=['A4','D5','F5','E5','D5','A4','C5','A4','Bb4','D5','F5','A5','G5','F5','E5','D5'],rhythm=[0,1.5,2.5],pad=.032,pluck=.085),
 dict(id='departure',title='最后一声汽笛',bpm=96,beats=3,bars=24,kind='piano',chords=[['D3','Fs3','A3','D4'],['G2','B3','D4','Fs4'],['B2','D3','Fs3','A3'],['A2','Cs3','E3','G3']],melody=['D5','Fs5','A5','Fs5','E5','D5','B4','D5','G5','Fs5','E5','Cs5','D5','A4','B4','Cs5'],rhythm=[0,1,2,2.5],pad=.031,pluck=.09),
 dict(id='investigation',title='皮箱里的回声',bpm=82,beats=4,bars=16,kind='pluck',chords=[['A2','C3','E3','B3'],['F2','A3','C4','E4'],['D3','F3','A3','C4'],['E3','Gs3','B3','D4']],melody=['A4','E5','B4','C5','E5','D5','C5','B4','A4','C5','F5','E5','D5','B4','A4','E4'],rhythm=[0,.75,2,2.75],pad=.025,pluck=.075),
 dict(id='night',title='月光越过车窗',bpm=76,beats=3,bars=24,kind='piano',chords=[['Eb3','G3','Bb3','D4'],['Ab2','C3','Eb3','G3'],['F3','Ab3','C4','Eb4'],['Bb2','D3','F3','Ab3']],melody=['G4','Bb4','D5','Eb5','D5','Bb4','G4','F4','Ab4','C5','Eb5','G5','F5','Eb5','D5','Bb4'],rhythm=[0,1,2],pad=.045,pluck=.078),
 dict(id='dining',title='餐车的甜点华尔兹',bpm=108,beats=3,bars=24,kind='piano',chords=[['F3','A3','C4','E4'],['D3','F3','A3','C4'],['G3','Bb3','D4','F4'],['C3','E3','G3','Bb3']],melody=['A4','C5','F5','E5','D5','C5','A4','G4','Bb4','D5','G5','F5','E5','D5','C5','A4'],rhythm=[0,.5,1.5,2],pad=.023,pluck=.095),
 dict(id='finale',title='把今夜好好收藏',bpm=72,beats=4,bars=16,kind='celesta',chords=[['D3','Fs3','A3','E4'],['G2','B3','D4','Fs4'],['E3','G3','B3','D4'],['A2','Cs4','E4','G4']],melody=['A4','D5','Fs5','E5','D5','A4','B4','A4','B4','D5','Fs5','A5','G5','Fs5','E5','D5'],rhythm=[0,1.5,2.5],pad=.046,pluck=.08)
]
# enharmonic used by investigation
notes['Gs']=8
manifest=[]
for spec in tracks:
 beat=60/spec['bpm'];bar=beat*spec['beats'];duration=bar*spec['bars'];length=round(duration*RATE)
 mix=np.zeros((length,2),np.float64)
 def add(at,n,d,kind,amp,pan=0):
  s=instrument(n,d,kind)*amp
  pan=np.clip(pan,-1,1);g=np.array([np.sqrt((1-pan)/2),np.sqrt((1+pan)/2)])
  start=round(at*RATE);indices=(np.arange(len(s))+start)%length
  np.add.at(mix,indices,s[:,None]*g)
 for b in range(spec['bars']):
  chord=spec['chords'][b%4];base=b*bar
  # Warm sustained harmony, alternating stereo placement.
  for j,n in enumerate(chord[1:]):add(base,n,bar+1.3,'pad',spec['pad'],(j-1)*.55)
  add(base,chord[0],beat*1.5,'bass',.11,-.08)
  if spec['beats']==4:add(base+2*beat,chord[0],beat*1.5,'bass',.06,.08)
  # Rolling piano/pizzicato accompaniment.
  for q in range(spec['beats']*2):
   note=chord[1+q%3];add(base+q*.5*beat,note,1.4,'piano' if spec['id'] in ['night','finale'] else 'pluck',.027 if q%2 else .038,(-.38 if q%2 else .38))
  # Phrased, recurring melody with a small variation in the second half.
  for j,offset in enumerate(spec['rhythm']):
   if b%4==3 and j==len(spec['rhythm'])-1:continue
   index=(b*2+j)%len(spec['melody']);n=midi(spec['melody'][index])
   if b>=spec['bars']//2 and b%4==2:n+=12 if j==0 else 0
   add(base+offset*beat,n,2.1 if spec['kind']=='piano' else 1.65,spec['kind'],spec['pluck']*(.92+.12*rng.random()),.12*np.sin(b))
  if spec['id'] in ['departure','dining','investigation']:
   # Quiet brushed rhythm, no sampled sounds.
   for q in range(spec['beats']):
    d=.06;t=np.arange(int(d*RATE))/RATE;noise=rng.normal(0,1,len(t));noise=np.concatenate(([0],np.diff(noise)))*np.exp(-t/.012)*.006
    indices=(np.arange(len(noise))+round((base+q*beat)*RATE))%length
    np.add.at(mix,indices,np.column_stack((noise*.8,noise)))
 # Circular early reflections and a diffuse, natural tail preserve a seamless loop.
 dry=mix.copy()
 for seconds,gain in [(.113,.13),(.197,.10),(.311,.09),(.439,.075),(.617,.055),(.829,.04)]:mix+=np.roll(dry,round(seconds*RATE),axis=0)[:,::-1]*gain
 mix=np.tanh(mix*1.1);mix*=.88/max(np.max(np.abs(mix)),.001)
 wav=OUT/(spec['id']+'.wav')
 with wave.open(str(wav),'w') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(RATE);f.writeframes((mix*32767).astype('<i2').tobytes())
 target=OUT/(spec['id']+'.mp3')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af','loudnorm=I=-18:TP=-1.5:LRA=8','-codec:a','libmp3lame','-b:a','128k','-ar','44100',str(target)],check=True)
 wav.unlink()
 manifest.append({'id':spec['id'],'title':spec['title'],'bpm':spec['bpm'],'duration_seconds':round(duration,2),'source':'原创程序作曲与合成，无外部采样','path':'/music/'+target.name,'bytes':target.stat().st_size})
 print(spec['id'],round(duration,1),'seconds',target.stat().st_size,flush=True)
(OUT/'credits.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
