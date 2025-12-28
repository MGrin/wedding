import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { MotionValue } from "framer-motion";
import { useGlitch } from "./GlitchContext";

function NeonLines({
  position,
  rotation,
  color,
  direction = 1,
  isGlitching = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  direction?: number;
  isGlitching?: boolean;
}) {
  const [opacity, setOpacity] = useState(1);
  const beamsRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Flickering effect
    if (Math.random() > 0.98) {
      setOpacity(0.5 + Math.random() * 0.5);
    } else {
      setOpacity(1);
    }

    // Move beams along the lines
    if (beamsRef.current) {
      beamsRef.current.children.forEach((beam, i) => {
        beam.position.x += (0.8 + i * 0.2) * direction;

        if (direction > 0 && beam.position.x > 200) {
          beam.position.x = -200;
          beam.visible = Math.random() > 0.6;
        } else if (direction < 0 && beam.position.x < -200) {
          beam.position.x = 200;
          beam.visible = Math.random() > 0.6;
        }
      });
    }

    // Sinusoidal random waves for lines
    if (linesRef.current) {
      linesRef.current.children.forEach((lineMesh, i) => {
        const mesh = lineMesh as THREE.Mesh;
        const geometry = mesh.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position;
        if (!positions) return;

        if (isGlitching) {
          for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j);
            // Small amplitude sinusoidal wave + noise in Z (depth)
            // This avoids collapsing the Y-thickness of the line
            const wave = Math.sin(x * 0.1 + time * 10) * 0.8;
            const noise = (Math.random() - 0.5) * 0.3;
            positions.setZ(j, wave + noise);

            // Ensure Y is restored if it was collapsed
            const originalY = j < positions.count / 2 ? 0.1 : -0.1;
            if (positions.getY(j) !== originalY) {
              positions.setY(j, originalY);
            }
          }
          positions.needsUpdate = true;
        } else {
          // Reset Z to flat and restore Y thickness
          let needsUpdate = false;
          for (let j = 0; j < positions.count; j++) {
            const originalY = j < positions.count / 2 ? 0.1 : -0.1;
            if (positions.getZ(j) !== 0 || positions.getY(j) !== originalY) {
              positions.setZ(j, 0);
              positions.setY(j, originalY);
              needsUpdate = true;
            }
          }
          if (needsUpdate) {
            positions.needsUpdate = true;
          }
        }
      });
    }
  });

  const lines = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      // Create a plane with many segments for the wave effect
      const geometry = new THREE.PlaneGeometry(400, 0.2, 100, 1);
      return {
        y: (i - 2.5) * 4,
        geometry,
      };
    });
  }, []);

  const beams = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      y: (Math.floor(Math.random() * 6) - 2.5) * 4,
      x: Math.random() * 400 - 200,
    }));
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Horizontal Lines */}
      <group ref={linesRef}>
        {lines.map((line, i) => (
          <mesh key={i} position={[0, line.y, 0]} geometry={line.geometry}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity * 0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Moving Beams - Glowy Spheres */}
      <group ref={beamsRef}>
        {beams.map((beam, i) => (
          <group key={i} position={[beam.x, beam.y, 0]}>
            {/* Core */}
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Inner Glow */}
            <mesh>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
            {/* Outer Glow */}
            <mesh>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Wall Grid */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[400, 40]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03 * opacity}
          wireframe
        />
      </mesh>
    </group>
  );
}

function GridFloor({ isGlitching = false }: { isGlitching?: boolean }) {
  const gridRef = useRef<THREE.GridHelper>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [glitchOffset, setGlitchOffset] = useState([0, 0]);

  // Create points for the "random field"
  const pointsCount = 2000;
  const pointsPositions = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.position.z = (time * 5) % 5;
      gridRef.current.visible = !isGlitching;
    }

    if (pointsRef.current) {
      pointsRef.current.visible = isGlitching;
      if (isGlitching) {
        const positions = pointsRef.current.geometry.attributes.position;
        if (positions) {
          for (let i = 0; i < pointsCount; i++) {
            // Randomize Y and slightly X/Z for "vacuum" effect
            positions.setY(i, (Math.random() - 0.5) * 10);
            positions.setX(i, positions.getX(i) + (Math.random() - 0.5) * 0.5);
            positions.setZ(i, positions.getZ(i) + (Math.random() - 0.5) * 0.5);
          }
          positions.needsUpdate = true;
        }
      }
    }

    if (isGlitching && Math.random() > 0.9) {
      setGlitchOffset([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2]);
    }
  });

  return (
    <group position={[0, -8, -150]}>
      <gridHelper
        ref={gridRef}
        args={[400, 80, "#00ffff", "#00ffff"]}
        rotation={[0, 0, 0]}
      />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointsCount}
            array={pointsPositions}
            itemSize={3}
            args={[pointsPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ffff"
          size={0.2}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      {isGlitching && (
        <gridHelper
          args={[400, 80, "#ff00ff", "#ff00ff"]}
          position={[glitchOffset[0] || 0, glitchOffset[1] || 0, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Scene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const { camera } = useThree();
  const initialZ = 20;
  const targetZ = -100;
  const [isGlitching, setIsGlitching] = useState(false);
  const { isGlitchMode } = useGlitch();

  useEffect(() => {
    if (!isGlitchMode) {
      setIsGlitching(false);
    }
  }, [isGlitchMode]);

  useFrame((state) => {
    const progress = scrollProgress.get();
    // Smoothly interpolate camera Z position based on scroll
    camera.position.z = THREE.MathUtils.lerp(initialZ, targetZ, progress);

    // Optional: Add a slight tilt or shake as we "speed up"
    camera.rotation.z = progress * 0.1;
    camera.position.y = Math.sin(Date.now() * 0.001) * 0.1;

    // Global glitch state
    if (isGlitchMode) {
      setIsGlitching(true);
    } else {
      // If we are not in glitch mode, we only glitch randomly
      if (Math.random() > 0.995) {
        setIsGlitching(true);
      } else if (isGlitching && Math.random() > 0.8) {
        setIsGlitching(false);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 100, 500]} />
      <ambientLight intensity={1} />

      <GridFloor isGlitching={isGlitching} />
      {/* Left Wall */}
      <NeonLines
        position={[-15, 0, -150]}
        rotation={[0, Math.PI / 2, 0]}
        color="#ff00ff"
        direction={1}
        isGlitching={isGlitching}
      />
      {/* Right Wall */}
      <NeonLines
        position={[15, 0, -150]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#ff00ff"
        direction={-1}
        isGlitching={isGlitching}
      />
      {/* Ceiling Lines */}
      <group position={[0, 12, -150]}>
        <mesh position={[-4, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 400]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <mesh position={[4, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 400]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[12, 0.1, 400]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.05} />
        </mesh>
      </group>

      {/* Vertical framing lines */}
      <mesh position={[-15, 0, 10]}>
        <boxGeometry args={[0.2, 30, 0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[15, 0, 10]}>
        <boxGeometry args={[0.2, 30, 0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </>
  );
}

export function CyberpunkBackground({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
        <Scene scrollProgress={scrollProgress} />
      </Canvas>

      {/* Vignette effect to focus center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,black_85%)]" />

      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
