import { forwardRef, useMemo, type ReactNode } from "react";
import type * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { aluminiumMatcap } from "./matcap";

// Procedural laptop (docs/adr/0003). Units: width 3, origin at the base center.
// The lid group pivots on the hinge at the back edge; rotation.x = -angle opens it.
// Materials are unlit (matcap / basic) so the Stage needs no lights or environment.

export const LAPTOP = { w: 3, baseH: 0.09, d: 2.05, lidT: 0.045 } as const;

// The display itself is passed in as children: a 2.8 x 1.75 face, already oriented on the lid.
export const SCREEN = { w: 2.8, h: 1.75 } as const;

type Props = { children: ReactNode };

export const Laptop = forwardRef<THREE.Group, Props>(function Laptop({ children }, lidRef) {
  const matcap = useMemo(() => aluminiumMatcap(), []);
  const { w, baseH, d, lidT } = LAPTOP;
  const base = useMemo(() => new RoundedBoxGeometry(w, baseH, d, 4, 0.04), [w, baseH, d]);
  const shell = useMemo(() => new RoundedBoxGeometry(w, lidT, d - 0.04, 4, 0.02), [w, lidT, d]);

  return (
    <group>
      <mesh geometry={base} position={[0, baseH / 2, 0]}>
        <meshMatcapMaterial matcap={matcap} />
      </mesh>
      {/* Keyboard well and trackpad, read as insets on the deck. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, baseH + 0.001, -0.3]}>
        <planeGeometry args={[2.62, 0.98]} />
        <meshBasicMaterial color="#17171b" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, baseH + 0.001, 0.58]}>
        <planeGeometry args={[1.05, 0.64]} />
        <meshMatcapMaterial matcap={matcap} color="#d9dce2" />
      </mesh>

      <group ref={lidRef} position={[0, baseH, -d / 2]}>
        <mesh geometry={shell} position={[0, lidT / 2, d / 2 - 0.02]}>
          <meshMatcapMaterial matcap={matcap} />
        </mesh>
        {/* Inner face: black bezel with the lit display set into it. */}
        <mesh rotation-x={Math.PI / 2} position={[0, -0.001, d / 2 - 0.02]}>
          <planeGeometry args={[w - 0.04, d - 0.08]} />
          <meshBasicMaterial color="#060608" />
        </mesh>
        <group rotation-x={Math.PI / 2} position={[0, -0.002, d / 2 + 0.03]}>
          {children}
        </group>
      </group>
    </group>
  );
});
