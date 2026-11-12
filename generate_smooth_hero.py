"""Render a slow, seamless hero using subpixel transforms, without zoompan rounding."""
from pathlib import Path
import json, math, subprocess
import cv2
import numpy as np
from PIL import Image, ImageOps
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT/'src/assets/mountains'
ORIGINAL=Path('C:/Users/jkvam/.codex/generated_images/01a1ab74-6da2-71e2-af1c-4676d9bac211/exec-75d0a617-f73a-4a29-a15a-88ae836d3e1f.png')
source=ORIGINAL if ORIGINAL.exists() else ASSETS/'01-hero-dawn.webp'
photo=Image.open(source).convert('RGB')
poster=ImageOps.fit(photo,(1920,1080),method=Image.Resampling.LANCZOS)
poster.save(ASSETS/'hero-poster-v2.webp','WEBP',quality=92,method=6)
# Resample the source once; every output frame uses continuous, floating point
# affine coordinates instead of zoompan's integer source-crop positions.
large=np.asarray(ImageOps.fit(photo,(3840,2160),method=Image.Resampling.LANCZOS))[:,:,::-1].copy()
fps=60;seconds=20;count=fps*seconds
dest=ASSETS/'mountain-dawn-smooth-v2.mp4'
command=[imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','bgr24','-s','1920x1080','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart',str(dest)]
process=subprocess.Popen(command,stdin=subprocess.PIPE)
try:
 for i in range(count):
  # A gentle 2% move over twenty seconds; position and velocity match at loop.
  z=1.012+.01*(1-math.cos(2*math.pi*i/count))
  scale=.5*z
  transform=np.array([[scale,0,960-1920*scale],[0,scale,540-1080*scale]],dtype=np.float64)
  frame=cv2.warpAffine(large,transform,(1920,1080),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT_101)
  process.stdin.write(frame.tobytes())
  if i%300==0:print(f'Rendered {i}/{count} smooth frames',flush=True)
finally:
 process.stdin.close()
if process.wait()!=0:raise RuntimeError('Hero encode failed')
mobile=ASSETS/'mountain-dawn-smooth-mobile-v2.mp4'
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(dest),'-vf','scale=1920:1080','-r','30','-c:v','libx264','-preset','fast','-crf','20','-maxrate','3M','-bufsize','6M','-an','-movflags','+faststart',str(mobile)],check=True)
(ASSETS/'smooth-hero-manifest.json').write_text(json.dumps({'method':'Subpixel affine camera motion from original AI-created still; no frame-sequence handoff','resolution':[1920,1080],'fps':fps,'seconds':seconds,'frames':count,'zoom_range':[1.012,1.032],'desktop':dest.name,'mobile':mobile.name,'mobile_resolution':[1920,1080],'mobile_fps':30,'mobile_max_bitrate':'3 Mbps','loop':'Position and velocity continuous at loop boundary'},indent=2),encoding='utf-8')
print('Smooth desktop and mobile hero films complete',flush=True)
