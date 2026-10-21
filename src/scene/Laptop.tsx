import { forwardRef, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { aluminiumMatcap } from "./matcap";
import { deckTexture, glowTexture, poolTexture, shadowTexture } from "./studio";

// Procedural laptop (docs/adr/0003). Units: width 3, origin at the base center.
// The lid group pivots on the hinge at the back edge; rotation.x = -angle opens it.
// Materials are unlit (matcap / basic) so the Stage needs no lights or environment.

export const LAPTOP = { w: 3, baseH: 0.09, d: 2.05, lidT: 0.045 } as const;

// The display itself is passed in as children: a 2.8 x 1.75 face, already oriented on the lid.
export const SCREEN = { w: 2.8, h: 1.75 } as const;

type Props = { children: ReactNode };

export const Laptop = forwardRef<THREE.Group, Props>(function Laptop({ children }, lidRef) {
  const matcap = useMemo(() => aluminiumMatcap(), []);
  const [deck, shadow, pool, glow] = useMemo(() => [deckTexture(), shadowTexture(), poolTexture(), glowTexture()], []);
  const { w, baseH, d, lidT } = LAPTOP;
  const base = useMemo(() => new RoundedBoxGeometry(w, baseH, d, 4, 0.04), [w, baseH, d]);
  const shell = useMemo(() => new RoundedBoxGeometry(w, lidT, d - 0.04, 4, 0.02), [w, lidT, d]);

  return (
    <group>
      {/* Floor: the studio light pool, then a soft contact shadow, both under the base. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.004, -0.1]} renderOrder={-2}>
        <planeGeometry args={[w * 3.2, d * 3.6]} />
        <meshBasicMaterial map={pool} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.002, 0.04]} renderOrder={-1}>
        <planeGeometry args={[w * 1.25, d * 1.3]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh geometry={base} position={[0, baseH / 2, 0]}>
        <meshMatcapMaterial matcap={matcap} />
      </mesh>
      {/* Deck top: painted aluminium falloff, keys and trackpad (studio.ts). */}
      <mesh rotation-x={-Math.PI / 2} position={[0, baseH + 0.001, 0]}>
        <planeGeometry args={[w - 0.06, d - 0.06]} />
        <meshBasicMaterial map={deck} toneMapped={false} />
      </mesh>
      {/* The display's light spilling onto the deck behind the keyboard. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, baseH + 0.003, -d / 2 + 0.38]}>
        <planeGeometry args={[w * 0.9, 0.75]} />
        <meshBasicMaterial map={glow} transparent blending={THREE.AdditiveBlending} opacity={0.35} depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={lidRef} position={[0, baseH, -d / 2]}>
        <mesh geometry={shell} position={[0, lidT / 2, d / 2 - 0.02]}>
          <meshMatcapMaterial matcap={matcap} />
        </mesh>
        {/* Inner face: black bezel with the lit display set into it. */}
        <mesh rotation-x={Math.PI / 2} position={[0, -0.001, d / 2 - 0.02]}>
          <planeGeometry args={[w - 0.04, d - 0.08]} />
          <meshBasicMaterial color="#060608" toneMapped={false} />
        </mesh>
        <group rotation-x={Math.PI / 2} position={[0, -0.002, d / 2 + 0.03]}>
          {children}
        </group>
      </group>
    </group>
  );
});
