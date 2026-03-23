'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollCamera() {
  const { camera } = useThree();
  const timeline = useRef<gsap.core.Timeline>();

  useLayoutEffect(() => {
    // Initial camera position
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    // Create a GSAP timeline linked to the main window scroll
    timeline.current = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smooth scrubbing
      },
    });

    // Animate camera moving deep into the network along the Z axis
    // From Hero (z=15) -> About (z=5) -> Services (z=-5) -> Blog (z=-15) -> Contact (z=-25)
    timeline.current.to(camera.position, {
      z: -25,
      ease: 'none',
    }, 0);

    // Add some subtle weaving/panning to make the journey feel more organic
    timeline.current.to(camera.position, {
      x: 3,
      y: 2,
      ease: 'power1.inOut',
      duration: 0.3, // roughly 30% of the scroll
    }, 0);

    timeline.current.to(camera.position, {
      x: -3,
      y: -1,
      ease: 'power1.inOut',
      duration: 0.4,
    }, 0.3);

    timeline.current.to(camera.position, {
      x: 0,
      y: 0,
      ease: 'power1.inOut',
      duration: 0.3,
    }, 0.7);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      timeline.current?.kill();
    };
  }, [camera]);

  // Make the camera continuously look at a point slightly ahead of it on the Z axis
  useFrame(() => {
    const lookTarget = new THREE.Vector3(0, 0, camera.position.z - 10);
    // Smoothly interpolate the lookAt for a floaty feel
    camera.quaternion.slerp(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, lookTarget, new THREE.Vector3(0, 1, 0))
      ),
      0.05
    );
  });

  return null;
}
