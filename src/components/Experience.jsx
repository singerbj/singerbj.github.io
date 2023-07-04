import { useThree } from "@react-three/fiber";
import {
  ContactShadows,
  SpotLight,
  useProgress
} from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Physics } from '@react-three/cannon'
import { Floor } from "./Floor";
import { useRef, useEffect } from "react";
import { Color } from "three";

const CAMERA_SIDE_OFFSET = 0.75;

function Experience({ setLoading }) {
  const { progress } = useProgress();
  const { camera } = useThree();
  const avatarRef = useRef();

  useEffect(() => {
    if(avatarRef.current){
      if(window.innerWidth > 1000){
        camera.position.set(CAMERA_SIDE_OFFSET, 2, 5);
        camera.lookAt(avatarRef.current.position.x + CAMERA_SIDE_OFFSET, 1, avatarRef.current.position.z);
      } else {
        camera.position.set(0, 2, 5);
        camera.lookAt(avatarRef.current.position.x, 1, avatarRef.current.position.z);
      }
    }
  }, [avatarRef, window.innerWidth]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [progress]);

  return (
    <>
      <color attach="background" args={['#171720']} />
      <fog attach="fog" args={['#171720', 6, 50]} />
      <ambientLight 
        intensity={0.2}
      />
      <pointLight castShadow position={[0, 5, 5]} intensity={0.5} color="white" />
      <SpotLight
        position={[-1, 7, 5]}
        castShadow
        target={avatarRef.current}
        penumbra={0.2}
        radiusTop={0.4}
        radiusBottom={10}
        distance={40}
        angle={0.45}
        attenuation={20}
        anglePower={5}
        intensity={0.005}
        opacity={0.1}
        color={new Color(200, 30, 30)}
      />
      <SpotLight
        position={[3, 7, 5]}
        castShadow
        target={avatarRef.current}
        penumbra={0.1}
        radiusTop={0.2}
        radiusBottom={10}
        distance={40}
        angle={0.45}
        attenuation={20}
        anglePower={5}
        intensity={0.0025}
        opacity={0.1}
        color={new Color(30, 30, 200)}
      />
      <ContactShadows
          opacity={0.42}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
      <Physics allowSleep={false} iterations={15} gravity={[0, -200, 0]}>
        <Avatar innerRef={avatarRef} />
        <Floor position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      </Physics>
    </>
  );
}

export default Experience;
