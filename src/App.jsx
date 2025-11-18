import './App.css';
import { Prop } from './components/Prop';
import { generateWorldFile } from './scripts/generateWorldFile';
import React, { useState, useRef, useCallback, useMemo, memo } from 'react';

// Coordinates of pool's top left and bottom right corners
const X_SIM_MAX = 11.35;
const X_SIM_MIN = -11.35;
const Y_SIM_MAX = 24.90;
const Y_SIM_MIN = -24.90;

// Calculates valid range for prop based on pool's dimensions
const X_SIM_RANGE = X_SIM_MAX - X_SIM_MIN;
const Y_SIM_RANGE = Y_SIM_MAX - Y_SIM_MIN;

// Temporary values for testing. Gives prop object a fixed size to offset its center
const PROP_SIZE = 80;
const PROP_HALF_SIZE = PROP_SIZE / 2;

// Helper function to ensure that numbers don't carry excessive floating point error during calculations
const roundToDecimals = (num, decimals = 9) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// Helper function to convert coords on canvas object to coords in simulation
function translateCoordinates(canvasRef, containerX, containerY) {
  const rect = canvasRef.current.getBoundingClientRect();
  const WIDTH = rect.width;
  const HEIGHT = rect.height;

  const ratioX = (containerX + PROP_HALF_SIZE) / WIDTH;
  const ratioY = (containerY + PROP_HALF_SIZE) / HEIGHT;

  const x = X_SIM_MAX - (ratioX * X_SIM_RANGE);
  const y = Y_SIM_MAX - (ratioY * Y_SIM_RANGE);

  return {
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3)),
  };
}

// Properties panel that appears on right of screen when a prop is selected
const PropertiesPanel = memo(({ prop, coords, updatePosition }) => {
  // Initialize temporary value to current sim coords
  const [tempX, setTempX] = useState(coords.simX);
  const [tempY, setTempY] = useState(coords.simY);

  // Update temporary values when coords get changed during drag
  React.useEffect(() => {
    setTempX(coords.simX);
    setTempY(coords.simY);
  }, [coords.simX, coords.simY]);

  // Attempt to update the X coord's position
  const updateXPos = () => {
    const numValue = parseFloat(tempX);

    // If inputted value is not a proper number, reset it to its previous value
    if (isNaN(numValue)) {
      setTempX(coords.simX);
    } else {  // Otherwise, update x value!
      updatePosition(prop.id, numValue, coords.simY);
    }
  };

  // Attempt to update the Y coord's position
  const updateYPos = () => {
    const numValue = parseFloat(tempY);

    // If inputted value is not a proper number, reset it to its previous value
    if (isNaN(numValue)) {
      setTempY(coords.simY);
    } else {  // Otherwise, update y value!
      updatePosition(prop.id, coords.simX, numValue);
    }
  };

  return (
    <aside className="absolute right-0 top-0 bottom-0 w-80 p-4 bg-white bg-opacity-90 backdrop-blur-sm shadow-2xl z-10">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Properties</h3>
      <div className="text-black font-medium p-2 rounded-md flex justify-center items-center flex-col">
        <p>[ <b>{prop.type} ( ID: {prop.id} )</b> is selected. ]</p>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">X:</label>
            <input
              type="number"
              step="0.001"
              value={tempX}
              onChange={(e) => { setTempX(e.target.value); }}
              onBlur={updateXPos}  // Blur is called when input field loses focus
              onKeyDown={(e) => { if (e.key == "Enter") updateXPos(); }}  // Trigger
              className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Y:</label>
            <input
              type="number"
              step="0.001"
              value={tempY}
              onChange={(e) => { setTempY(e.target.value); }}
              onBlur={updateYPos}  // Blur is called when input field loses focus
              onKeyDown={(e) => { if (e.key == "Enter") updateYPos(); }}
              className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-center mt-4">
          <div className="flex gap-2">
            Vertical:
            <div className="bg-red-200 w-32 h-6"></div>
          </div>
          <div className="flex gap-2">
            Rotation:
            <div className="bg-red-200 w-32 h-6"></div>
          </div>
        </div>
      </div>
    </aside>
  );
});

function App() {
  const [props, setProps] = useState([]);  // Tracks all props on canvas
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });  // Tracks current scale and position on view

  const [selectedPropId, setSelectedPropId] = useState(null);  // Tracks the selected prop's ID
  const [dragState, setDragState] = useState(null);  // Tracks whether the screen or a prop is being dragged (and data based on it)
  const [liveCoords, setLiveCoords] = useState(null);  // Tracks the live-updated coordinates of the prop being dragged (to display in X/Y of properties panel)

  // Reference values for DOM manipulation
  const canvasRef = useRef(null);
  const draggedPropRef = useRef(null);
  const nextId = useRef(1);

  // Determines selected prop object based on current prop ID
  const selectedProp = useMemo(() => {
    return props.find(p => p.id === selectedPropId) || null;
  }, [props, selectedPropId]);

  //
  // Functionality for handling props
  //

  // Creates a new prop at the center of the screen
  const addProp = useCallback((type) => {
    // Grab current canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Determine new prop's unique ID
    const newId = nextId.current++;

    // Spawn a new prop at the center of the screen
    const centerCoords = { x: canvas.offsetWidth / 2 - PROP_HALF_SIZE, y: canvas.offsetHeight / 2 - PROP_HALF_SIZE };
    const simCoords = translateCoordinates(canvasRef, centerCoords.x, centerCoords.y);
    const newProp = { id: newId, type, canvasX: centerCoords.x, canvasY: centerCoords.y, simX: simCoords.x, simY: simCoords.y };

    // Append new prop to end of props collection
    setProps((currProps) => [...currProps, newProp]);
  }, []);

  // Remove a target prop from the collection of props
  const removeProp = useCallback((targetId) => {
    // If the prop that is meant to be deleted is selected, deselect it!
    if (selectedPropId === targetId) setSelectedPropId(null);

    // Remove the prop from the props collection
    setProps((currProps) => currProps.filter(prop => prop.id !== targetId));
  }, [selectedPropId]);

  // Updates the selected prop's attributes when user types in proper values into the X/Y input fields in properties panel
  const handleCoordInputs = useCallback((propId, newSimX, newSimY) => {
    // Grabs current canvas object
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert inputted simulation coords into usable canvas coords
    const rect = canvas.getBoundingClientRect();
    const WIDTH = rect.width;
    const HEIGHT = rect.height;

    const ratioX = (X_SIM_MAX - newSimX) / X_SIM_RANGE;
    const ratioY = (Y_SIM_MAX - newSimY) / Y_SIM_RANGE;

    const canvasX = (ratioX * WIDTH) - PROP_HALF_SIZE;
    const canvasY = (ratioY * HEIGHT) - PROP_HALF_SIZE;

    // Ensure that the newly inputted position falls within the canvas' bounds
    const clampedX = Math.max(0, Math.min(canvasX, canvas.offsetWidth - PROP_SIZE));
    const clampedY = Math.max(0, Math.min(canvasY, canvas.offsetHeight - PROP_SIZE));

    // Update the sim coords based on the newly clamped canvas position
    const finalSimCoords = translateCoordinates(canvasRef, clampedX, clampedY);

    // Update the prop's attributes in the props collection
    setProps(currProps => currProps.map(prop =>
      prop.id === propId ? {
        ...prop,
        canvasX: clampedX,
        canvasY: clampedY,
        simX: finalSimCoords.x,
        simY: finalSimCoords.y
      } : prop
    ));
  }, []);

  // Moves prop around screen on mouse drag
  const updatePropPosition = useCallback((clientX, clientY) => {
    if (!dragState || dragState.type !== 'prop' || !draggedPropRef.current) return;

    // Grab current canvas object
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasBounds = canvas.getBoundingClientRect();

    // Convert mouse position to canvas coordinates
    const mouseX_canvas = clientX - canvasBounds.left;
    const mouseY_canvas = clientY - canvasBounds.top;

    // Convert the prop's position to unscaled coordinates
    const newX_unscaled = roundToDecimals((mouseX_canvas - view.x) / view.scale);
    const newY_unscaled = roundToDecimals((mouseY_canvas - view.y) / view.scale);

    // Adjust the prop's position in relation to the its center
    const adjustedX = newX_unscaled - PROP_HALF_SIZE;
    const adjustedY = newY_unscaled - PROP_HALF_SIZE;

    // Clamp position within the bounds of the canvas
    const clampedX = Math.max(0, Math.min(adjustedX, canvas.offsetWidth - PROP_SIZE));
    const clampedY = Math.max(0, Math.min(adjustedY, canvas.offsetHeight - PROP_SIZE));

    // Update the prop's DOM element directly (makes movement instant)
    draggedPropRef.current.style.left = `${clampedX}px`;
    draggedPropRef.current.style.top = `${clampedY}px`;

    // Update simulation coordinates for the properties panel X/Y input
    const simCoords = translateCoordinates(canvasRef, clampedX, clampedY);
    setLiveCoords({
      simX: simCoords.x,
      simY: simCoords.y,
      canvasX: clampedX,
      canvasY: clampedY
    });
  }, [dragState, view]);

  //
  // Event Handlers
  //

  // Handle mouse clicking on prop
  const handlePropMouseDown = useCallback((e, prop) => {
    e.stopPropagation();

    // Update selected and dragged prop to store newly selected prop
    setSelectedPropId(prop.id);
    draggedPropRef.current = e.currentTarget;

    // Update drag state to reflect that a prop is being dragged and not the canvas
    setDragState({
      type: 'prop',
      id: prop.id,
    });

    setLiveCoords({ simX: prop.simX, simY: prop.simY, canvasX: prop.canvasX, canvasY: prop.canvasY });
  }, []);

  // Handle mouse clicking on canvas
  const handleCanvasMouseDown = useCallback((e) => {
    // If left click occurs on the canvas itself, deselect any selected prop
    if (e.button === 0) {
      setSelectedPropId(null);
    }

    // If right click occurs on the canvas, start panning the screen
    if (e.button === 2) {
      // Prevent right click menu from popping open
      e.preventDefault();

      // Update drag state to reflect that the canvas is being dragged
      setDragState({
        type: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        viewX: view.x,
        viewY: view.y,
      });
    }
  }, [view]);

  // Handles zooming in and out on canvas using the scroll wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();

    // Grabs current canvas object
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Grab the canvas' bounds and the stored attributes of the canvas (scale and current x and y positional offsets)
    const rect = canvas.getBoundingClientRect();
    const { scale, x, y } = view;

    // Calculate the canvas' new scale based on scroll
    const zoomFactor = 0.1;
    const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    const newScale = Math.max(0.2, Math.min(5, scale * delta));

    // Calculate the new mouse's position in relation to the canvas' bounds
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Determine the new x and y position based on the mouse and new scale
    // This ensure that zoom in/out occurs in relation to the mouse's current position
    const newX = mouseX - ((mouseX - x) * (newScale / scale));
    const newY = mouseY - ((mouseY - y) * (newScale / scale));

    // Update the values stored in view!
    setView({ scale: newScale, x: newX, y: newY });
  }, [view]);

  //
  // Mouse Handlers
  //

  // Update either the prop or pan x and y positions based on what drag state is active
  const handleMouseMove = useCallback((e) => {
    if (!dragState) return;

    // If dragging, update the low-cost prop position values rather than the prop's actual properties
    // (This avoids having to go through the entire props collection every render just to update a single prop's values)
    if (dragState.type === 'prop') {
      updatePropPosition(e.clientX, e.clientY);
    }
    else if (dragState.type === 'pan') {  // Otherwise, update the position of view to reflect the mouse's movement (allows panning of canvas)
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setView({
        scale: view.scale,
        x: dragState.viewX + dx,
        y: dragState.viewY + dy,
      });
    }
  }, [dragState, view, updatePropPosition]);

  // Updates the selected prop's positional properties (both canvas and simulation) on mouse release 
  const handleMouseUp = useCallback(() => {
    if (dragState?.type === 'prop' && liveCoords) {
      setProps(currProps => currProps.map(prop =>
        prop.id === dragState.id ? {
          ...prop,
          canvasX: liveCoords.canvasX,
          canvasY: liveCoords.canvasY,
          simX: liveCoords.simX,
          simY: liveCoords.simY
        } : prop
      ));
    }

    // Reset values relating to dragging prop since it is no longer being dragged
    draggedPropRef.current = null;
    setLiveCoords(null);
    setDragState(null);
  }, [dragState, liveCoords]);

  // Connects global mouse listeners to the DOM window
  React.useEffect(() => {
    if (!dragState) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Prevents opening up the context menu on right click of canvas!
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.oncontextmenu = (e) => e.preventDefault();
    }

    // Clean up listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Downloads world file when download button is pressed
  const downloadWorldFile = useCallback(() => {
    // Generates a world file with the current props applied
    const worldData = generateWorldFile(props);

    // Semi-round about way of forcing a download from a button since it is traditionally done using a link
    // Essentially creates a temporary, invisible link, auto clicks it to provoke download, and then deletes the link
    const blob = new Blob([worldData], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated.world';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [props]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-900">

      {/* Header */}
      <header className="flex-shrink-0 bg-gray-800 p-4 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">
            MIL Simulation World Builder
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => addProp("Test Prop")}  // Creates a test prop on button press
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-105 cursor-pointer"
            >
              Add Prop
            </button>

            <button
              onClick={downloadWorldFile}  // Calls download functionality on button press
              disabled={props.length === 0}  // Prevents download if no props have been added
              className={`px-6 py-2 font-bold rounded-xl shadow-md transition duration-150
                ${props.length > 0
                  ? 'bg-green-700 text-white hover:bg-green-800 transform hover:scale-105 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Generate World File
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow relative overflow-hidden">

        {/* Full-page, interactive canvas */}
        <div
          ref={canvasRef}
          className={`absolute inset-0 bg-gray-100 overflow-hidden`}
          onWheel={handleWheel}
          onMouseDown={handleCanvasMouseDown}
          onMouseLeave={() => setDragState(null)}
        >
          {/* Displays scaled/translated viewing area of the canvas */}
          <div
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'absolute',
              pointerEvents: dragState?.type === 'pan' ? 'none' : 'auto'
            }}
          >
            {/* Renders the borders of the basic pool shape */}
            <div
              className="
                absolute inset-0 pointer-events-none
                border-4 border-dashed border-black
              "
            />

            {/* Displays basic instructions when no prop is on screen*/}
            {props.length === 0 && (
              <div
                className="text-center absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-light pointer-events-none"
              >
                Click 'Add Prop' to start.
                <br />
                (Right-click and drag to pan the screen, Scroll to zoom in / out)
              </div>
            )}

            {/* Renders all props in collection onto screen based on their stored canvas positions */}
            {props.map((prop) => (
              <Prop
                key={prop.id}
                prop={prop}
                onMouseDown={(e) => handlePropMouseDown(e, prop)}
                onRemoveProp={removeProp}
                isSelected={selectedPropId === prop.id}
                isMoving={dragState?.id === prop.id}
                style={{
                  left: `${prop.canvasX}px`,
                  top: `${prop.canvasY}px`,
                  position: 'absolute',
                }}
              />
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedProp !== null && (
          <PropertiesPanel
            prop={selectedProp}
            coords={liveCoords || selectedProp}  // Renders live coordinates while dragging or the prop's static coordinates when not
            updatePosition={handleCoordInputs}
          />
        )}
      </main>
    </div>
  )
}

export default App