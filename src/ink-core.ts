const SIM = 64;
const DYE = 512;
const PRESSURE_ITERATIONS = 10;
// How fast stirred ink fades away, and how fast velocity calms down.
const DYE_FADE = 0.35;
const VELOCITY_FADE = 1.2;
// Swirl kept in the flow, so stirring curls instead of smearing.
const CURL = 22;
// The headline pulls its ink back at this rate per frame once left alone,
// after this long.
const GATHER = 0.06;
const GATHER_AFTER = 1200;
// The loop stops after this long with nothing moving it.
const SLEEP_AFTER = 5000;
const STIR_FORCE = 5200;
const STIR_RADIUS = 0.0018;
const DROP_RADIUS = 0.0035;

const VERTEX = `#version 300 es
in vec2 aPos;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texel;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texel.x, 0.0);
  vR = vUv + vec2(texel.x, 0.0);
  vT = vUv + vec2(0.0, texel.y);
  vB = vUv - vec2(0.0, texel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 o;
`;

const SHADERS = {
  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float aspect;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspect;
  vec3 s = exp(-dot(p, p) / radius) * color;
  o = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,
  advect: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 simTexel;
uniform float dt;
uniform float fade;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * simTexel;
  o = texture(uSource, coord) / (1.0 + fade * dt);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float l = texture(uVelocity, vL).x;
  float r = texture(uVelocity, vR).x;
  float t = texture(uVelocity, vT).y;
  float b = texture(uVelocity, vB).y;
  vec2 c = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { l = -c.x; }
  if (vR.x > 1.0) { r = -c.x; }
  if (vT.y > 1.0) { t = -c.y; }
  if (vB.y < 0.0) { b = -c.y; }
  o = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float l = texture(uVelocity, vL).y;
  float r = texture(uVelocity, vR).y;
  float t = texture(uVelocity, vT).x;
  float b = texture(uVelocity, vB).x;
  o = vec4(0.5 * (r - l - t + b), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float l = texture(uCurl, vL).x;
  float r = texture(uCurl, vR).x;
  float t = texture(uCurl, vT).x;
  float b = texture(uCurl, vB).x;
  float c = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
  force /= length(force) + 0.0001;
  force *= curl * c;
  force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * dt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float l = texture(uPressure, vL).x;
  float r = texture(uPressure, vR).x;
  float t = texture(uPressure, vT).x;
  float b = texture(uPressure, vB).x;
  float d = texture(uDivergence, vUv).x;
  o = vec4((l + r + b + t - d) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float l = texture(uPressure, vL).x;
  float r = texture(uPressure, vR).x;
  float t = texture(uPressure, vT).x;
  float b = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(r - l, t - b);
  o = vec4(v, 0.0, 1.0);
}`,
  scale: `${HEAD}
uniform sampler2D uTarget;
uniform float value;
void main() {
  o = value * texture(uTarget, vUv);
}`,
  // Pulls the headline's ink (red channel) back toward the letters. Dropped
  // ink (green) is left to drift and fade.
  gather: `${HEAD}
uniform sampler2D uDye;
uniform sampler2D uMask;
uniform float rate;
void main() {
  vec4 d = texture(uDye, vUv);
  float m = texture(uMask, vUv).r;
  o = vec4(mix(d.r, m, rate), d.g, 0.0, 1.0);
}`,
  display: `${HEAD}
uniform sampler2D uDye;
uniform vec3 paper;
uniform vec3 ink;
uniform vec3 accent;
void main() {
  vec4 d = texture(uDye, vUv);
  // A soft knee, so thin washes stay pale and dense ink goes solid.
  float a = smoothstep(0.02, 0.85, d.r);
  float b = smoothstep(0.02, 0.85, d.g);
  vec3 c = mix(paper, ink, a);
  c = mix(c, accent, b * 0.92);
  o = vec4(mix(ink, accent, b), max(a, b) * 0.65);
}`,
};

type ProgramName = keyof typeof SHADERS;

interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}

interface Double {
  read: Target;
  write: Target;
  swap: () => void;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

function link(gl: WebGL2RenderingContext, vertex: WebGLShader, source: string) {
  const fragment = compile(gl, gl.FRAGMENT_SHADER, source);
  const program = gl.createProgram();
  if (!(fragment && program)) {
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return null;
  }
  const uniforms: Program["uniforms"] = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) {
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
  }
  return { program, uniforms };
}

/** Parses any CSS color, oklch included, by painting it into one pixel. */
function toRgb(color: string, probe: CanvasRenderingContext2D) {
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

interface Fluid {
  resize: (w: number, h: number) => void;
  setMask: (source: HTMLCanvasElement) => void;
  setColors: (paper: number[], ink: number[], accent: number[]) => void;
  splat: (
    x: number,
    y: number,
    vx: number,
    vy: number,
    ink: number[],
    radius: number
  ) => void;
  step: (dt: number, gather: number) => void;
  draw: () => void;
  destroy: () => void;
}

/**
 * A small stable-fluids solver (semi-Lagrangian advection, vorticity
 * confinement, Jacobi pressure), in the spirit of Jos Stam's paper and
 * Pavel Dobryakov's WebGL port. Returns null where half-float render
 * targets aren't available.
 */
function createFluid(gl: WebGL2RenderingContext): Fluid | null {
  if (!gl.getExtension("EXT_color_buffer_float")) {
    return null;
  }
  gl.getExtension("OES_texture_float_linear");
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  if (!vertex) {
    return null;
  }
  const programs = {} as Record<ProgramName, Program>;
  for (const name of Object.keys(SHADERS) as ProgramName[]) {
    const made = link(gl, vertex, SHADERS[name]);
    if (!made) {
      return null;
    }
    programs[name] = made;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];

  const target = (
    w: number,
    h: number,
    internal: number,
    format: number
  ): Target => {
    const tex = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internal,
      w,
      h,
      0,
      format,
      gl.HALF_FLOAT,
      null
    );
    const fbo = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    textures.push(tex);
    framebuffers.push(fbo);
    return { tex, fbo, w, h };
  };

  const double = (
    w: number,
    h: number,
    internal: number,
    format: number
  ): Double => {
    const pair = {
      read: target(w, h, internal, format),
      write: target(w, h, internal, format),
      swap: () => {
        const t = pair.read;
        pair.read = pair.write;
        pair.write = t;
      },
    };
    return pair;
  };

  let velocity: Double;
  let dye: Double;
  let pressure: Double;
  let divergence: Target;
  let curl: Target;
  let aspect = 1;
  const mask = gl.createTexture() as WebGLTexture;
  gl.bindTexture(gl.TEXTURE_2D, mask);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8,
    1,
    1,
    0,
    gl.RED,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0])
  );

  const free = () => {
    for (const t of textures) {
      gl.deleteTexture(t);
    }
    for (const f of framebuffers) {
      gl.deleteFramebuffer(f);
    }
    textures.length = 0;
    framebuffers.length = 0;
  };

  const sizeFor = (short: number) =>
    aspect >= 1
      ? [Math.round(short * aspect), short]
      : [short, Math.round(short / aspect)];

  // Binds a program, its textures and its output, and draws the quad.
  let unit = 0;
  const run = (name: ProgramName, texel: [number, number]) => {
    const p = programs[name];
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
    gl.useProgram(p.program);
    gl.uniform2f(p.uniforms.texel, texel[0], texel[1]);
    unit = 0;
    return p;
  };
  const bind = (p: Program, uniform: string, tex: WebGLTexture) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(p.uniforms[uniform], unit);
    unit++;
  };
  const blit = (out: Target | null, w?: number, h?: number) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fbo : null);
    gl.viewport(0, 0, out ? out.w : (w ?? 1), out ? out.h : (h ?? 1));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  let paper = [1, 1, 1];
  let inkColor = [0, 0, 0];
  let accentColor = [0, 0, 0];
  let canvasW = 1;
  let canvasH = 1;

  return {
    resize(w, h) {
      canvasW = w;
      canvasH = h;
      aspect = w / h;
      free();
      const [sw, sh] = sizeFor(SIM);
      const [dw, dh] = sizeFor(DYE);
      velocity = double(sw, sh, gl.RG16F, gl.RG);
      pressure = double(sw, sh, gl.R16F, gl.RED);
      divergence = target(sw, sh, gl.R16F, gl.RED);
      curl = target(sw, sh, gl.R16F, gl.RED);
      dye = double(dw, dh, gl.RGBA16F, gl.RGBA);
    },
    setMask(source) {
      gl.bindTexture(gl.TEXTURE_2D, mask);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, source);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    },
    setColors(p, i, a) {
      paper = p;
      inkColor = i;
      accentColor = a;
    },
    splat(x, y, vx, vy, ink, radius) {
      const r = radius * (aspect > 1 ? aspect : 1);
      let p = run("splat", [1 / velocity.read.w, 1 / velocity.read.h]);
      bind(p, "uTarget", velocity.read.tex);
      gl.uniform1f(p.uniforms.aspect, aspect);
      gl.uniform2f(p.uniforms.point, x, y);
      gl.uniform3f(p.uniforms.color, vx, vy, 0);
      gl.uniform1f(p.uniforms.radius, r);
      blit(velocity.write);
      velocity.swap();
      if (ink[0] || ink[1]) {
        p = run("splat", [1 / dye.read.w, 1 / dye.read.h]);
        bind(p, "uTarget", dye.read.tex);
        gl.uniform1f(p.uniforms.aspect, aspect);
        gl.uniform2f(p.uniforms.point, x, y);
        gl.uniform3f(p.uniforms.color, ink[0], ink[1], 0);
        gl.uniform1f(p.uniforms.radius, r);
        blit(dye.write);
        dye.swap();
      }
    },
    step(dt, gather) {
      const sim: [number, number] = [1 / velocity.read.w, 1 / velocity.read.h];
      let p = run("curl", sim);
      bind(p, "uVelocity", velocity.read.tex);
      blit(curl);

      p = run("vorticity", sim);
      bind(p, "uVelocity", velocity.read.tex);
      bind(p, "uCurl", curl.tex);
      gl.uniform1f(p.uniforms.curl, CURL);
      gl.uniform1f(p.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      p = run("divergence", sim);
      bind(p, "uVelocity", velocity.read.tex);
      blit(divergence);

      p = run("scale", sim);
      bind(p, "uTarget", pressure.read.tex);
      gl.uniform1f(p.uniforms.value, 0.8);
      blit(pressure.write);
      pressure.swap();

      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        p = run("pressure", sim);
        bind(p, "uPressure", pressure.read.tex);
        bind(p, "uDivergence", divergence.tex);
        blit(pressure.write);
        pressure.swap();
      }

      p = run("gradient", sim);
      bind(p, "uPressure", pressure.read.tex);
      bind(p, "uVelocity", velocity.read.tex);
      blit(velocity.write);
      velocity.swap();

      p = run("advect", sim);
      bind(p, "uVelocity", velocity.read.tex);
      bind(p, "uSource", velocity.read.tex);
      gl.uniform2f(p.uniforms.simTexel, sim[0], sim[1]);
      gl.uniform1f(p.uniforms.dt, dt);
      gl.uniform1f(p.uniforms.fade, VELOCITY_FADE);
      blit(velocity.write);
      velocity.swap();

      p = run("advect", [1 / dye.read.w, 1 / dye.read.h]);
      bind(p, "uVelocity", velocity.read.tex);
      bind(p, "uSource", dye.read.tex);
      gl.uniform2f(p.uniforms.simTexel, sim[0], sim[1]);
      gl.uniform1f(p.uniforms.dt, dt);
      gl.uniform1f(p.uniforms.fade, DYE_FADE);
      blit(dye.write);
      dye.swap();

      if (gather > 0) {
        // Calm the water as the letters gather, so they settle crisp.
        p = run("scale", sim);
        bind(p, "uTarget", velocity.read.tex);
        gl.uniform1f(p.uniforms.value, 1 - gather);
        blit(velocity.write);
        velocity.swap();

        p = run("gather", [1 / dye.read.w, 1 / dye.read.h]);
        bind(p, "uDye", dye.read.tex);
        bind(p, "uMask", mask);
        gl.uniform1f(p.uniforms.rate, gather);
        blit(dye.write);
        dye.swap();
      }
    },
    draw() {
      const p = run("display", [1 / dye.read.w, 1 / dye.read.h]);
      bind(p, "uDye", dye.read.tex);
      gl.uniform3fv(p.uniforms.paper, paper);
      gl.uniform3fv(p.uniforms.ink, inkColor);
      gl.uniform3fv(p.uniforms.accent, accentColor);
      blit(null, canvasW, canvasH);
    },
    destroy() {
      free();
      gl.deleteTexture(mask);
      gl.deleteBuffer(quad);
      for (const p of Object.values(programs)) {
        gl.deleteProgram(p.program);
      }
      gl.deleteShader(vertex);
    },
  };
}

