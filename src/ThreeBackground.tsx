import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type SpatialEnvironmentMode = 'dual' | 'corporate' | 'flagship' | 'workbench';

interface ThreeBackgroundProps {
  pulseCount: number;
  activeColor?: string;
  environmentMode?: SpatialEnvironmentMode;
  activeArchitectureId?: string;
  cameraPreset?: 'overview' | 'left-wing' | 'right-wing' | 'core-zoom';
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  pulseCount,
  activeColor = '#00f2fe',
  environmentMode = 'dual',
  activeArchitectureId = 'swarm-factory',
  cameraPreset = 'overview',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const boostVelocityRef = useRef<number>(0);
  const targetColorRef = useRef<THREE.Color>(new THREE.Color('#00f2fe'));
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 42));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const archModeRef = useRef<string>(activeArchitectureId);

  useEffect(() => {
    boostVelocityRef.current = 0.06;
  }, [pulseCount]);

  useEffect(() => {
    try {
      targetColorRef.current.set(activeColor);
    } catch {
      targetColorRef.current.set('#00f2fe');
    }
  }, [activeColor]);

  useEffect(() => {
    archModeRef.current = activeArchitectureId;
  }, [activeArchitectureId]);

  // Update 3D camera target based on Business Side / Architecture selection
  useEffect(() => {
    if (cameraPreset === 'left-wing' || environmentMode === 'corporate') {
      targetCamPosRef.current.set(-12, 4, 34);
      targetLookAtRef.current.set(-6, 0, 0);
    } else if (cameraPreset === 'right-wing' || environmentMode === 'flagship') {
      targetCamPosRef.current.set(12, 4, 34);
      targetLookAtRef.current.set(6, 0, 0);
    } else if (cameraPreset === 'core-zoom' || environmentMode === 'workbench') {
      targetCamPosRef.current.set(0, 6, 26);
      targetLookAtRef.current.set(0, 0, 0);
    } else {
      targetCamPosRef.current.set(0, 2, 42);
      targetLookAtRef.current.set(0, 0, 0);
    }
  }, [environmentMode, cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.013);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 42);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      const isHeadless =
        navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
      renderer.setPixelRatio(
        isHeadless ? 1 : Math.min(window.devicePixelRatio, 2)
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 1. 900 3D Spatial Stars & Neural Particles
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 140;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 120;

      // Dual-tone cyan and indigo spatial particles
      const isLeft = positions[i] < 0;
      colors[i] = isLeft ? 0.0 : 0.31;
      colors[i + 1] = isLeft ? 0.95 : 0.67;
      colors[i + 2] = 0.99;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.75,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // 2. Central Swarm Factory Gyroscopic Rings
    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    const ringGeo = new THREE.TorusGeometry(16.5, 0.11, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    centerGroup.add(ringMesh);

    const innerRingGeo = new THREE.TorusGeometry(11.5, 0.08, 12, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x4facfe,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = -Math.PI / 4;
    innerRingMesh.rotation.y = Math.PI / 6;
    centerGroup.add(innerRingMesh);

    // 3. LEFT WING 3D HOLOGRAM: GreedysLinks AI Developer Enterprise Node Lattice
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(-22, 1, -8);
    scene.add(leftWingGroup);

    const corpGeo = new THREE.IcosahedronGeometry(6.5, 1);
    const corpMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const corpMesh = new THREE.Mesh(corpGeo, corpMat);
    leftWingGroup.add(corpMesh);

    const corpOrbitGeo = new THREE.RingGeometry(8.2, 8.4, 48);
    const corpOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const corpOrbitMesh = new THREE.Mesh(corpOrbitGeo, corpOrbitMat);
    corpOrbitMesh.rotation.x = Math.PI / 2.3;
    leftWingGroup.add(corpOrbitMesh);

    // 4. RIGHT WING 3D HOLOGRAM: Flagship Architectures Morphing Lattice
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(22, 1, -8);
    scene.add(rightWingGroup);

    const flagshipGeo = new THREE.OctahedronGeometry(6.8, 2);
    const flagshipMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const flagshipMesh = new THREE.Mesh(flagshipGeo, flagshipMat);
    rightWingGroup.add(flagshipMesh);

    const flagshipRingGeo = new THREE.TorusKnotGeometry(4.2, 0.35, 64, 8, 2, 3);
    const flagshipRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const flagshipKnot = new THREE.Mesh(flagshipRingGeo, flagshipRingMat);
    rightWingGroup.add(flagshipKnot);

    // 5. Lower 3D Perspective Cybernetic Horizon Grid
    const gridHelper = new THREE.GridHelper(160, 40, 0x00f2fe, 0x1e293b);
    gridHelper.position.y = -20;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.18;
    scene.add(gridHelper);

    // Interactive Mouse Parallax
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 3.5;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Exponentially damp boost velocity
      boostVelocityRef.current = THREE.MathUtils.damp(
        boostVelocityRef.current,
        0,
        4.0,
        delta
      );

      const boost = boostVelocityRef.current;

      // Smoothly interpolate camera position & lookAt target
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetCamPosRef.current.x + mouse.x,
        3.2,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetCamPosRef.current.y + mouse.y,
        3.2,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCamPosRef.current.z,
        3.2,
        delta
      );

      currentLookAtRef.current.x = THREE.MathUtils.damp(
        currentLookAtRef.current.x,
        targetLookAtRef.current.x,
        3.5,
        delta
      );
      currentLookAtRef.current.y = THREE.MathUtils.damp(
        currentLookAtRef.current.y,
        targetLookAtRef.current.y,
        3.5,
        delta
      );
      camera.lookAt(currentLookAtRef.current);

      // Animate stars and central rings
      particles.rotation.y += 0.0005 + boost * 0.8;
      particles.rotation.x += 0.00015 + boost * 0.3;

      ringMesh.rotation.z += 0.0018 + boost * 1.3;
      innerRingMesh.rotation.z -= 0.0024 + boost * 1.0;

      // Animate Left Wing (GreedysLinks Enterprise Hub)
      corpMesh.rotation.y += 0.004 + boost;
      corpMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.25;
      corpOrbitMesh.rotation.z -= 0.006;

      // Animate Right Wing (Flagship Architectures)
      flagshipMesh.rotation.y -= 0.0045 + boost;
      flagshipKnot.rotation.x += 0.007 + boost * 1.2;
      flagshipKnot.rotation.y += 0.005;

      // Dynamic tinting
      ringMat.color.lerp(targetColorRef.current, 0.05);
      flagshipRingMat.color.lerp(targetColorRef.current, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      particlesGeometry.dispose();
      particleMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      corpGeo.dispose();
      corpMat.dispose();
      corpOrbitGeo.dispose();
      corpOrbitMat.dispose();
      flagshipGeo.dispose();
      flagshipMat.dispose();
      flagshipRingGeo.dispose();
      flagshipRingMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
