import sys, json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root))
from app.clipper import ClipOptions,generate_clip
from app.models import AspectRatio,FitMode
from app.paths import get_ffmpeg_bin,CLIPS_DIR
from app.canvas_captions import write_recipe
ff=get_ffmpeg_bin();testdir=root/'tests'/'results';testdir.mkdir(exist_ok=True)
source=testdir/'source.mp4'
subprocess.run([ff,'-y','-f','lavfi','-i','color=blue:s=640x360:r=30:d=2','-f','lavfi','-i','sine=frequency=440:duration=2','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac',str(source)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
outputs={}
for color in ['black','white']:
    opts=ClipOptions(AspectRatio.NINE_16,FitMode.SQUARE,'verify-'+color,0,video_background=color)
    path=generate_clip(source,0,1,opts)
    raw=subprocess.check_output([ff,'-v','error','-i',str(path),'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'])
    def px(x,y):return list(raw[(y*1080+x)*3:(y*1080+x)*3+3])
    pad,center=px(540,100),px(540,960)
    assert all(abs(v-(255 if color=='white' else 0))<5 for v in pad),(color,pad)
    assert center[2]>240 and center[0]<10 and center[1]<10,center
    outputs[color]={'padding_rgb':pad,'video_rgb':center,'dimensions':[1080,1920]}
cat=json.loads((root/'caption_renderer'/'catalog.json').read_text())
style=next(iter(cat)) if isinstance(cat,dict) else cat[0]['id']
print('catalog type',type(cat).__name__,str(style))
recipe=write_recipe(testdir/'native.caption.json',style=style,words=[{'word':'Clipxy4all','start':0,'end':1}],start=0,end=1,overrides={'pos_x':50,'pos_y':85},language='en')
path=generate_clip(source,0,1,ClipOptions(AspectRatio.NINE_16,FitMode.SQUARE,'verify-native',0,ass_path=recipe,video_background='white'))
assert path.stat().st_size>1000
print(json.dumps({'result':'PASS','colors':outputs,'native_export':str(path)},indent=2))
