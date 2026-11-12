'use strict';
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.cinema-hero'),scene=document.querySelector('.hills-scene');
 let target=0,current=0,visible=false,hidden=document.hidden,frame=0,last=0,ready=false,pointerX=0,pointerY=0;
 function scrollState(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress').style.transform=`scaleX(${max?scrollY/max:0})`;target=Math.max(0,Math.min(1,scrollY/(hero.offsetHeight*.9)));start();}
 addEventListener('scroll',scrollState,{passive:true});
 const canvas=document.querySelector('#seven-hills'),image=scene.querySelector('img');
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!gl){scrollState();return;}
 // Tessellated textured depth surface: foreground ridges respond more than the
 // distant sky to the scroll-controlled camera. Normal page scrolling is preserved.
 const vertex=`attribute vec2 point;uniform vec2 camera;uniform float progress;varying vec2 uv;
 void main(){uv=point*.5+.5;float near=pow(1.0-uv.y,2.2);vec3 p=vec3(point,near*.58);float c=cos(camera.x),s=sin(camera.x);p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);c=cos(camera.y);s=sin(camera.y);p=vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);float perspective=1.0/(1.0-p.z*.17);float zoom=1.08+progress*.035;p.y+=progress*.032*(.25+near);gl_Position=vec4(p.xy*perspective*zoom,p.z*.05,1.0);}`;
 const fragment=`precision mediump float;uniform sampler2D photo;uniform vec2 cover;uniform float time;uniform float motion;varying vec2 uv;
 void main(){vec2 st=(uv-.5)*cover+.5;vec3 col=texture2D(photo,st).rgb;float band=exp(-pow((uv.y-.48)*7.,2.));float mist=(sin(uv.x*5.+time*.045)+sin(uv.x*11.-time*.028))*.0035*band*motion;col=mix(col,vec3(.91,.88,.75),max(mist,0.));gl_FragColor=vec4(col,1.0);}`;
 function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Landscape shader unavailable');return s;}
 let program;
 try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;}catch{return;}
 gl.useProgram(program);
 const points=[],columns=64,rows=48;
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){const x0=x/columns*2-1,x1=(x+1)/columns*2-1,y0=y/rows*2-1,y1=(y+1)/rows*2-1;points.push(x0,y0,x1,y0,x1,y1,x0,y0,x1,y1,x0,y1);}
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'point');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 const uniforms={};['camera','progress','cover','time','motion'].forEach(name=>uniforms[name]=gl.getUniformLocation(program,name));
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 function resize(){const r=scene.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);gl.viewport(0,0,canvas.width,canvas.height);const aspect=canvas.width/canvas.height,photo=image.naturalWidth/image.naturalHeight;gl.uniform2f(uniforms.cover,Math.min(1,aspect/photo),Math.min(1,photo/aspect));}
 function load(){if(!image.naturalWidth)return;try{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);}catch{return;}ready=true;resize();scene.classList.add('depth-ready');start();}
 function render(t){frame=0;if(!ready||!visible||hidden)return;if(t-last>=33||reduced.matches){last=t;current+=(target-current)*.075;const moving=!reduced.matches,travel=moving?current:0,drift=moving?Math.sin(t*.00013)*.008:0;gl.uniform2f(uniforms.camera,moving?pointerX*.035+drift+travel*.07:0,moving?pointerY*.018+travel*.055:0);gl.uniform1f(uniforms.progress,travel);gl.uniform1f(uniforms.time,t*.001);gl.uniform1f(uniforms.motion,moving?1:0);gl.drawArrays(gl.TRIANGLES,0,points.length/2);scene.dataset.scroll=travel.toFixed(2);}if(!reduced.matches)frame=requestAnimationFrame(render);}
 function start(){if(ready&&visible&&!hidden&&!frame)frame=requestAnimationFrame(render);}
 if(matchMedia('(pointer:fine)').matches)scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;start();},{passive:true});
 scene.addEventListener('pointerleave',()=>{pointerX=pointerY=0;});
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(scene);
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden){cancelAnimationFrame(frame);frame=0;}else start();});
 reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;current=target;start();});
 addEventListener('resize',()=>{if(ready){resize();start();}scrollState();},{passive:true});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;cancelAnimationFrame(frame);frame=0;scene.classList.remove('depth-ready');});
 if(image.complete)load();else image.addEventListener('load',load,{once:true});scrollState();
})();
