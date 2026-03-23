'use client';

// The @react-three/postprocessing module relies on deprecated THREE.js exports
// like sRGBEncoding in recent versions. Until all dependencies are aligned perfectly,
// we just skip the decorative bloom. The network natively glows via AdditiveBlending.
export function PostProcessing() {
  return null;
}
