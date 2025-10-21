import { useLoader } from '@react-three/fiber';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { MeshStandardMaterial, TextureLoader } from 'three';

import { useMemo } from 'react';

export function useColladaModel(modelPath, texturePath) {
    // Load model and texture from paths
    const model = useLoader(ColladaLoader, modelPath);
    const texture = useLoader(TextureLoader, texturePath);

    // Use useMemo to memoize the loaded model/texture data
    // This helps enhance the performance of models by caching the results between re-renders
    const prop = useMemo(() => {
        // Create a clone of the current model to allow more than one instance
        const scene = model.scene.clone();

        // Create a basic material using the custom texture
        const material = new MeshStandardMaterial({
            map: texture
        });

        scene.traverse((child) => {
            if (child.isMesh) {
                child.material = material;

                // Allows the model to interact with the scene's lighting
                child.castShadow = true;
                child.receiveShadow = true;

                // Ensures that child's geometry gets disposed properly on deletion
                child.geometry.dispose = null;
            }
        });

        return scene;
    }, [model, texture]);

    return prop;
}