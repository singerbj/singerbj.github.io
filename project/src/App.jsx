import Experience from "./components/Experience";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { isMobile } from 'react-device-detect';


const bigScreenStyles = { position: 'fixed', top: 0, right: 0, width: 'calc(50%)', height: '100%'};
const smallScreenStyles = { position: 'fixed', bottom: 0, right: 0, width: 'calc(100%)', marginTop: '75%', height: '25%', textAlign: 'center'};

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => {
          setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", onResize);
    
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);
    return windowWidth;
};


function App() {
  const [loading, setLoading] = useState(true);

  const windowWidth = useWindowWidth();
  const styles = windowWidth > 1000 ? bigScreenStyles : smallScreenStyles;

  return (
    <>
      <Canvas 
        frameloop="demand"
        performance={{
          min: 0.1,
          max: 1,
        }}
        style={{ 
          opacity: loading && 0, 
          transition: 'opacity 0.5s' 
        }}
        dpr={[1, 2]} 
        shadows
        camera={{ fov: 30, near: 1, far: 100 }}
      >
        <Experience setLoading={setLoading} />
      </Canvas>
      <div style={{ 
        opacity: loading ? 0 : 1,
        transition: 'opacity 2s',
        transitionDelay: '0.25s',
        ...styles, 
        fontFamily: '"Anonymous Pro", monospace', 
        color: '#222',
        background: windowWidth > 1000 && 'rgba(255, 255, 255, 0.65)',
      }}>
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            background: windowWidth <= 1000 && 'rgba(255, 255, 255, 0.65)',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: windowWidth > 1000 && 60,
            height: windowWidth > 1000 && '50%',
            marginBottom: windowWidth <= 1000 && 40,
          }}
        >
          <h2>Benjamin Singer</h2>
          <h3 style={{ marginBottom: 25 }}>Software Development Manager</h3>
          <a href="https://www.linkedin.com/in/benjamin-singer-a432864b" target="_blank" style={{ marginLeft: windowWidth <= 1000 && 20, marginRight: windowWidth > 1000 && 20 }}>
            <img className="link" height="40" width="40" src="https://cdn.simpleicons.org/linkedin/222222" alt="linkedin" />
          </a>
          <a href="https://github.com/singerbj" target="_blank" style={{ marginLeft: windowWidth <= 1000 && 20, marginRight: 20 }}>
            <img className="link" height="40" width="40" src="https://cdn.simpleicons.org/github/222222" alt="github" />
          </a>
          <div style={{ display: (isMobile || windowWidth <= 1000) && 'none', marginLeft: -3, marginBottom: 40, position: 'absolute', bottom: 0, width: '100%' }}>
            <img width="40" height="40" src="https://img.icons8.com/ios/40/222222/w-key.png" alt="w-key"/>
            <img width="40" height="40" src="https://img.icons8.com/ios/40/222222/a-key.png" alt="a-key"/>
            <img width="40" height="40" src="https://img.icons8.com/ios/40/222222/s-key.png" alt="s-key"/>
            <img width="40" height="40" src="https://img.icons8.com/ios/40/222222/d-key.png" alt="d-key"/>
          </div>
        </div>
      </div>
      <img className='loading' style={{ opacity: loading ? 1 : 0, transition: 'opacity 0.5s', position: 'fixed', width: '100%', top: 'calc(50% - 20px)' }} height="40" width="40"src="http://simpleicon.com/wp-content/uploads/loading_1.svg" />
    </>
  );
}

export default App;
