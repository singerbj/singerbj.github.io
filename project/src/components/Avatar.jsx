import React, { useEffect, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from 'three'
import { ANIMATIONS_NAMES } from "./Animations";
import { rand } from './Util';

const MODEL_FILEPATH = '/models/rpm.glb';
const ANIMATION_FADE_RATE = 0.5;
const KEYS = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'jump',
  KeyE: 'wave',
};

// const KEYS = {
//   KeyW: 'Walking Backwards', //'forward',
//   KeyS: 'Walking', //'backward',
//   KeyA: 'Right Strafe',  //'left',
//   KeyD: 'Left Strafe', //right',
//   Space: 'Jump',
// };

const FINAL_TARGETS = [new Vector3(-1, 1, 5), new Vector3(1, 2, 5), new Vector3(1, 1, 5) , new Vector3(-1, 1, 3)];
let currentTarget = new Vector3(1, 1, 5);
let finalTarget = FINAL_TARGETS[0];

export function Avatar(props) {
  const { innerRef } = props;
  // const { wireframe } = useControls({
  //   wireframe: false,
  // });
  const { nodes, materials } = useGLTF(MODEL_FILEPATH);

  const animations = [];
  ANIMATIONS_NAMES.forEach((animationName) => {
    const fbx = useFBX(`/animations/${animationName}.fbx`);
    if(fbx.animations[0]){
      fbx.animations[0].name = animationName;
      animations.push(fbx.animations[0]);
    }
  });

  const { actions } = useAnimations(animations, innerRef);
  const moveFieldByKey = (key) => KEYS[key]

  const [headFollow, setHeadFollow] = useState(false);
  const [animation, setAnimation] = useState('Idle');
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    wave: false,
  })

  // useEffect(() => {
  //   Object.values(materials).forEach((material) => {
  //     material.wireframe = wireframe;
  //   });
  // }, [wireframe]);
 
  useFrame((state) => {
    if(headFollow){
      if(!!finalTarget){
        finalTarget = undefined;
      }
      currentTarget.lerp(state.camera.position, 0.02);
    } else {
      if(!finalTarget){
        finalTarget = FINAL_TARGETS[rand(0, 1)];
      }
      currentTarget.lerp(finalTarget, 0.02);
    }
    innerRef.current.getObjectByName("Head").lookAt(currentTarget);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) { return; }
      setMovement((m) => {
        return { ...m, [moveFieldByKey(e.code)]: true };
      });
    }
    const handleKeyUp = (e) => {
      if (e.repeat) { return; }
      setMovement((m) => {
        return { ...m, [moveFieldByKey(e.code)]: false };
      });
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, []);

  useEffect(() => {
    const headFollowSetter = () => {
      setHeadFollow((v) => !v);
    };
    const timeout = setTimeout(headFollowSetter, rand(10000, 5000));
    return () => {
      clearTimeout(timeout);
    };
  }, [headFollow]);

  useEffect(() => {
    if(actions && animation) {
      actions[animation].reset().fadeIn(ANIMATION_FADE_RATE).play();
    }
    return () => {
      actions[animation].fadeOut(ANIMATION_FADE_RATE);
    };
  }, [animation]);

  useEffect(() => {
    if(actions) {
      
      if (movement['forward'] && !movement['backward']) {
        setAnimation('Walking Backwards');
      } else if (movement['backward'] && !movement['forward']) {
        setAnimation('Walking');
      } else if (movement['left'] && !movement['right']) {
        setAnimation('Right Strafe Walking');
      } else if (movement['right'] && !movement['left']) {
        setAnimation('Left Strafe Walking');
      } else if (movement['wave']) {
        setAnimation('Waving');
      } else {
        setAnimation('Idle');
      }
    }
  }, [movement]);

  return (
    <group  {...props} ref={innerRef} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh 
        castShadow
        name="Wolf3D_Avatar" 
        geometry={nodes.Wolf3D_Avatar.geometry} 
        material={materials.Wolf3D_Avatar} 
        skeleton={nodes.Wolf3D_Avatar.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary} 
        morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences} 
      />
    </group>
  )
}

useGLTF.preload(MODEL_FILEPATH)
