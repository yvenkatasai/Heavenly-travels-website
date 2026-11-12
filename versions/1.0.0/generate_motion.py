"""Create real MP4 motion edits from generated stills and extract scroll frames.

These are camera-motion edits, not text-to-video model generations.
"""
from pathlib import Path
import subprocess, json
import imageio_ffmpeg
from PIL import Image

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT/'src/assets/mountains'
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
clips=[('mountain-dawn','01-hero-dawn.webp'),('mountain-blue-hour','02-ridge-blue-hour.webp'),('mountain-forest-road','05-forest-road.webp')]
for name,source in clips:
    dest=ASSETS/(name+'.mp4')
    # A cosine curve returns to the original crop for a smooth looping camera move.
    vf="scale=1920:1080,zoompan=z='1.04+0.065*(1-cos(2*PI*on/191))':x='iw/2-iw/zoom/2+16*sin(2*PI*on/191)':y='ih/2-ih/zoom/2':d=192:s=1280x720:fps=24,format=yuv420p"
    subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-y','-i',str(ASSETS/source),'-vf',vf,'-frames:v','192','-an','-c:v','libx264','-crf','23','-preset','fast','-movflags','+faststart',str(dest)],check=True)
    print('Created',dest.name,flush=True)
    # Extract all 96 frames at 12fps for each film, independently of the still originals.
    folder=ASSETS/'frames' if name=='mountain-dawn' else ASSETS/('frames-'+name.removeprefix('mountain-'))
    folder.mkdir(exist_ok=True)
    subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-y','-i',str(dest),'-vf','fps=12,scale=960:540','-start_number','0',str(folder/'frame-%03d.png')],check=True)
    for i,p in enumerate(sorted(folder.glob('frame-*.png'))):
        Image.open(p).convert('RGB').save(folder/f'dawn-{i:03d}.webp','WEBP',quality=75,method=4)
        p.unlink()
    print('Extracted',len(list(folder.glob('*.webp'))),'frames',flush=True)
(ASSETS/'motion-manifest.json').write_text(json.dumps({'method':'FFmpeg camera-motion edits from AI-generated still images; not text-to-video generation','fps':24,'seconds':8,'extracted_fps':12,'frames_per_clip':96,'clips':[x[0]+'.mp4' for x in clips]},indent=2),encoding='utf-8')
