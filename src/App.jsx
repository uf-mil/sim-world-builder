import './App.css'
import { Prop } from './components/Prop';
import { generateWorldFile } from './scripts/generateWorldFile';
import { useState, useRef, useCallback, useEffect } from 'react';

function App() {
  const [props, setProps] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [movingPropId, setMovingPropId] = useState(null);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);  // Allows easy access to canvas' information
  const nextId = useRef(1);  // Tracks the unique Id value that the next prop will have

  // Creates a new prop object and appends it to the array
  const addProp = useCallback((type) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newId = nextId.current++;

    const newProp = {
      id: newId,
      type,
      x: canvas.offsetWidth / 2 - 40,
      y: canvas.offsetHeight / 2 - 40
    };

    setProps((currProps) => [...currProps, newProp]);
  }, []);

  // Removes a prop from world by simply filtering it out from the array of props
  const removeProp = useCallback((targetId) => {
    if (selectedProp?.id === targetId) setSelectedProp(null);  // Ensure that deleted props cannot be modified in properties panel
    setProps((currProps) => currProps.filter(prop => prop.id !== targetId));
  }, [selectedProp, setSelectedProp]);

  // Handles initial click/grab of prop element
  const handleMouseDown = useCallback((e, prop) => {
    e.stopPropagation();  //

    setSelectedProp(prop);  // Select prop to show its properties in properties panel

    const propElement = e.currentTarget;  // Grabs prop's DOM element
    const propBounds = propElement.getBoundingClientRect();
    const offset = { x: e.clientX - propBounds.left, y: e.clientY - propBounds.top };

    // Update states involved in moving prop
    setMoveOffset(offset);
    setMovingPropId(prop.id);
    setIsMoving(true);
  }, []);

  // Handles dragging/moving prop element
  const handleMouseMove = useCallback((e) => {
    if (!isMoving || movingPropId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasBounds = canvas.getBoundingClientRect();
    let newX = e.clientX - canvasBounds.left - moveOffset.x;
    let newY = e.clientY - canvasBounds.top - moveOffset.y;

    // Prevent prop from being moved outside of canvas' bounds
    newX = Math.max(0, Math.min(newX, canvasBounds.width - 80));
    newY = Math.max(0, Math.min(newY, canvasBounds.height - 80));

    // Update moving prop's position in canvas!
    setProps((currProps) =>
      currProps.map((prop) =>
        prop.id === movingPropId ? { ...prop, x: newX, y: newY } : prop
      )
    );
  }, [isMoving, movingPropId, moveOffset]);

  // Handles releasing prop element after moving
  const handleMouseUp = useCallback(() => {
    // Simply remove instance of current prop being moved
    if (isMoving) {
      setIsMoving(false);
      setMovingPropId(null);
    }
  }, [isMoving, movingPropId]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Remember to clean up what occurs in useEffect!
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseMove, handleMouseUp])

  const downloadWorldFile = useCallback(() => {
    const worldData = generateWorldFile(props);
    const blob = new Blob([worldData], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated.world';

    // Force download of file using link (cannot download directly from button)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [generateWorldFile, props]);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-6 border-b-4 border-indigo-500 pb-2">
          MIL Simulation World Builder
        </h1>

        {/* Add Prop Panel */}
        <div className="p4 rounded-xl mb-6 flex flex-wrap gap-4 items-center justify-between">

          <button
            onClick={() => addProp("Test Prop")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transorm hover:scale-105 cursor-pointer"
          >
            Add Prop
          </button>

          {/* Properties Panel */}
          <div>
            {selectedProp !== null ? selectedProp.type + "_" + selectedProp.id + " is selected." : 'Select a Prop'}
          </div>

          <button
            onClick={downloadWorldFile}
            disabled={props.length === 0}
            className={`px-6 py-2 font-bold rounded-xl shadow-md transition duration-150
              ${props.length > 0
                ? 'bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Generate World File
          </button>
        </div>

        {/* Canvas Region */}
        <div
          ref={canvasRef}
          className={`relative w-full h-96 border-4 border-solid border-black rounded-xl bg-gray-100 transition-all duration-300`}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {props.length === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-light pointer-events-none"
            >
              Click 'Add Prop' to start.
            </div>
          )}

          {props.map((prop) => (
            <Prop
              key={prop.id}
              prop={prop}
              onMouseDown={handleMouseDown}
              onRemoveProp={removeProp}
              isSelected={selectedProp?.id === prop.id}
              isMoving={movingPropId === prop.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
