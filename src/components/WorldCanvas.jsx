import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box } from "./Box";

export default function WorldCanvas() {
    return (
        <div className="w-full aspect-video border-2">
            <Canvas className="w-full h-full">
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Box position={[-1.2, 0, 0]} />
                <OrbitControls />
            </Canvas >
        </div >
    )
}