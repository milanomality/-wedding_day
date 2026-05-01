import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import heroPhoto from '../../res/photo_2026-05-01_17-09-17.jpg';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uMouseTarget;
  uniform float uTime;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    float planeAspect = plane.x / plane.y;
    float imageAspect = image.x / image.y;
    vec2 scale = vec2(1.0);
    if (imageAspect > planeAspect) {
      scale.x = planeAspect / imageAspect;
    } else {
      scale.y = imageAspect / planeAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  // Cheap 2D noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);

    // Subtle idle wave
    float wave = sin(uTime * 0.4 + uv.y * 8.0) * cos(uTime * 0.3 + uv.x * 6.0);
    uv += vec2(wave * 0.0035, wave * 0.0028);

    // Mouse displacement
    float dist = distance(vUv, uMouseTarget);
    float strength = smoothstep(0.45, 0.0, dist);
    vec2 toCenter = normalize(vUv - uMouseTarget + 0.0001);
    vec2 disp = toCenter * strength * 0.05;
    uv -= disp;

    // RGB shift (chromatic aberration) near cursor
    float ca = strength * 0.012;
    float r = texture2D(uTexture, uv + vec2(ca, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(ca, 0.0)).b;
    vec3 color = vec3(r, g, b);

    // Warm tint + subtle vignette
    color *= mix(1.0, 0.84, smoothstep(0.4, 1.1, distance(vUv, vec2(0.5))));
    color = mix(color, color * vec3(1.04, 0.99, 0.94), 0.5);

    // Soft grain
    float grain = (noise(vUv * 800.0 + uTime * 2.0) - 0.5) * 0.04;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function PhotoPlane({ texture }: { texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseTarget: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uPlaneSize: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uImageSize: {
        value: new THREE.Vector2(texture.image?.width || 1, texture.image?.height || 1),
      },
    }),
    [texture, viewport.width, viewport.height]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / size.width;
      const y = 1 - e.clientY / size.height;
      uniforms.uMouseTarget.value.set(x, y);
    };
    const onLeave = () => {
      uniforms.uMouseTarget.value.set(0.5, 0.5);
    };
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
    uniforms.uPlaneSize.value.set(viewport.width, viewport.height);
  });

  return (
    <mesh ref={meshRef}>
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

function HeroScene() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(heroPhoto, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, []);

  if (!texture) return null;
  return <PhotoPlane texture={texture} />;
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
      <color attach="background" args={['#f3ead9']} />
      <HeroScene />
    </Canvas>
  );
}
