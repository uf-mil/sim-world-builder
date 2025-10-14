import { ColladaModel } from "../ColladaModel";

export function Buoy({ position }) {
    return (
        <ColladaModel
            modelPath={"/models/buoy.dae"}
            texturePath={"/textures/buoy_texture.png"}
            scale={[5, 5, 5]}
            position={position}
        />
    )
}