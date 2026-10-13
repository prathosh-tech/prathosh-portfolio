/* WebGL2 animated gradient inspired by the public Hamenath portfolio shader.
   Parameters mirror its published hero configuration; gracefully falls back to CSS if WebGL2 is unavailable. */
(() => {
  const canvas = document.getElementById('heroGradient');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return;
  const vertexSource = `#version 300 es
  in vec4 a_position;
  void main(){ gl_Position = a_position; }`;
  const fragmentSource = `#version 300 es
  precision highp float;
  uniform float u_time; uniform float u_pixelRatio; uniform vec2 u_resolution;
  uniform float u_scale; uniform float u_rotation; uniform vec4 u_color1; uniform vec4 u_color2; uniform vec4 u_color3;
  uniform float u_proportion; uniform float u_softness; uniform float u_distortion; uniform float u_swirl; uniform float u_swirlIterations;
  out vec4 fragColor;
  #define TWO_PI 6.28318530718
  vec2 rotate(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
  float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
  float noise(vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1.,0.));float c=random(i+vec2(0.,1.));float d=random(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
  vec4 blend_colors(vec4 c1,vec4 c2,vec4 c3,float mixer,float edgesWidth,float edge_blur){
    vec3 color1=c1.rgb*c1.a;vec3 color2=c2.rgb*c2.a;vec3 color3=c3.rgb*c3.a;
    float r1=smoothstep(.0+.35*edgesWidth,.7-.35*edgesWidth+.5*edge_blur,mixer);
    float r2=smoothstep(.3+.35*edgesWidth,1.-.35*edgesWidth+edge_blur,mixer);
    vec3 blended_color_2=mix(color1,color2,r1);float blended_opacity_2=mix(c1.a,c2.a,r1);
    return vec4(mix(blended_color_2,color3,r2),mix(blended_opacity_2,c3.a,r2));
  }
  void main(){
    vec2 uv=gl_FragCoord.xy/u_resolution.xy;float t=.5*u_time;float noise_scale=.0005+.006*u_scale;
    uv-=.5;uv*=noise_scale*u_resolution;uv=rotate(uv,u_rotation*.5*3.141592653589793);uv/=u_pixelRatio;uv+=.5;
    float n1=noise(uv+t);float n2=noise(uv*2.-t);float angle=n1*TWO_PI;
    uv.x+=4.*u_distortion*n2*cos(angle);uv.y+=4.*u_distortion*n2*sin(angle);
    float iterations_number=ceil(clamp(u_swirlIterations,1.,30.));
    for(float i=1.;i<=iterations_number;i++){uv.x+=clamp(u_swirl,0.,2.)/i*cos(t+i*1.5*uv.y);uv.y+=clamp(u_swirl,0.,2.)/i*cos(t+i*uv.x);}
    float proportion=clamp(u_proportion,0.,1.);vec2 shape_uv=uv*(.5+3.5*.1);float shape=.5+.5*sin(shape_uv.x)*cos(shape_uv.y);
    float mixer=shape+.48*sign(proportion-.5)*pow(abs(proportion-.5),.5);
    vec4 color_mix=blend_colors(u_color1,u_color2,u_color3,mixer,1.-clamp(u_softness,0.,1.),.01+.01*u_scale);
    fragColor=vec4(color_mix.rgb,color_mix.a);
  }`;
  const shader = (type, source) => { const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ gl.deleteShader(s); return null; } return s; };
  const vs=shader(gl.VERTEX_SHADER,vertexSource), fs=shader(gl.FRAGMENT_SHADER,fragmentSource); if(!vs||!fs)return;
  const program=gl.createProgram(); gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const names=['u_time','u_pixelRatio','u_resolution','u_scale','u_rotation','u_color1','u_color2','u_color3','u_proportion','u_softness','u_distortion','u_swirl','u_swirlIterations'];
  const u=Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(program,n)]));
  const rgba = hex => { const n=parseInt(hex.slice(1),16); return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255,1]; };
  const c1=rgba('#020203'),c2=rgba('#e4184f'),c3=rgba('#020203');
  const resize=()=>{const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.75);canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);};
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  const start=performance.now();let frame=0;
  const render=now=>{if(!document.hidden){gl.uniform1f(u.u_time,((now-start)/1000)*.75);gl.uniform1f(u.u_pixelRatio,Math.min(window.devicePixelRatio||1,1.75));gl.uniform2f(u.u_resolution,canvas.width,canvas.height);gl.uniform1f(u.u_scale,.3);gl.uniform1f(u.u_rotation,-50*Math.PI/180);gl.uniform4fv(u.u_color1,c1);gl.uniform4fv(u.u_color2,c2);gl.uniform4fv(u.u_color3,c3);gl.uniform1f(u.u_proportion,.3);gl.uniform1f(u.u_softness,.85);gl.uniform1f(u.u_distortion,6/50);gl.uniform1f(u.u_swirl,.5);gl.uniform1f(u.u_swirlIterations,8);gl.drawArrays(gl.TRIANGLES,0,6);}frame=requestAnimationFrame(render);};
  frame=requestAnimationFrame(render);window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);ro.disconnect();gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.deleteBuffer(buffer);},{once:true});
})();
