import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uMouseTarget;
  uniform float uAspect;
  varying vec2 vUv;

  // Hash + value noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  // Soft circular blob with smooth edges
  float blob(vec2 p, vec2 c, float r) {
    return smoothstep(r, 0.0, distance(p, c));
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);

    float t = uTime * 0.12;

    // Slow drifting blob centers
    vec2 c1 = vec2(0.30 * uAspect + sin(t * 0.7) * 0.18, 0.35 + cos(t * 0.5) * 0.22);
    vec2 c2 = vec2(0.75 * uAspect + cos(t * 0.6) * 0.20, 0.65 + sin(t * 0.8) * 0.18);
    vec2 c3 = vec2(0.50 * uAspect + sin(t * 0.4 + 1.5) * 0.30, 0.20 + cos(t * 0.45) * 0.18);
    vec2 c4 = vec2(0.55 * uAspect + cos(t * 0.55 + 2.0) * 0.25, 0.85 + sin(t * 0.35) * 0.18);

    float b1 = blob(p, c1, 0.55);
    float b2 = blob(p, c2, 0.55);
    float b3 = blob(p, c3, 0.50);
    float b4 = blob(p, c4, 0.50);

    // Wedding palette (peach, sage, sand, blush, cream)
    vec3 cBg    = vec3(0.984, 0.965, 0.937); // cream base
    vec3 cPeach = vec3(0.961, 0.792, 0.659);
    vec3 cSage  = vec3(0.722, 0.824, 0.702);
    vec3 cBlue  = vec3(0.737, 0.831, 0.878);
    vec3 cSand  = vec3(0.905, 0.831, 0.643);

    vec3 color = cBg;
    color = mix(color, cPeach, b1 * 0.78);
    color = mix(color, cSand,  b2 * 0.55);
    color = mix(color, cSage,  b3 * 0.45);
    color = mix(color, cBlue,  b4 * 0.40);

    // Subtle noise wash for organic texture
    float n = noise(uv * 6.0 + t * 0.5);
    color = mix(color, color * (0.94 + n * 0.10), 0.6);

    // Cursor highlight: gentle warm glow following mouse
    float cursor = smoothstep(0.35, 0.0, distance(vec2(uMouse.x * uAspect, uMouse.y), p));
    color += vec3(0.05, 0.03, 0.02) * cursor;

    // Soft vignette
    float v = 1.0 - smoothstep(0.55, 1.05, distance(uv, vec2(0.5)));
    color = mix(color * 0.92, color, v);

    // Fine grain
    float g = (noise(uv * 900.0 + t * 4.0) - 0.5) * 0.03;
    color += g;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function GradientPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseTarget: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: size.width / Math.max(size.height, 1) },
    }),
    [size.width, size.height]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / size.width;
      const y = 1 - e.clientY / size.height;
      uniforms.uMouseTarget.value.set(x, y);
    };
    const onLeave = () => uniforms.uMouseTarget.value.set(0.5, 0.5);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [size.width, size.height, uniforms]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    uniforms.uTime.value += delta;
    uniforms.uMouse.value.lerp(uniforms.uMouseTarget.value, 0.06);
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#faf6ef']} />
      <GradientPlane />
    </Canvas>
  );
}
