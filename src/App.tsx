import './App.css'
import GridCell from './components/GridCell';
import DownloadButton from './components/DownloadButton';
import { useState, useEffect } from 'react';

function App() {
  const props = [
    'Start Gate A',
    'Start Marker A',
    'Path Marker A',
    'Buoy A',
    'Path Marker A2',
    'Bin A',
    'Pinger A1',
    'Torpedoes A',
    'Pinger A2',
    'Octagon A',
    'Table A',
    'Tubeworm A',
    'Nautilus A',
    'Coral A',
    'Start Gate B',
    'Path Marker B1',
    'Buoy B',
    'Path Marker B2',
    'Bin B',
    'Pinger B1',
    'Torpedoes B',
    'Pinger B2',
    'Octagon B',
    'Table B',
    'Tubeworm B',
    'Nautilus B',
    'Coral B',
    'Start Gate C',
    'Path Marker C1',
    'Buoy C',
    'Path Marker C2',
    'Bin C',
    'Pinger C1',
    'Torpedoes C',
    'Pinger C2',
    'Octagon C',
    'Table C',
    'Tubeworm C',
    'Nautilus C',
    'Coral C',
    'Start Gate D',
    'Path Maker D1',
    'Buoy D',
    'PathMarker D2',
    'Bin D',
    'Pinger D1',
    'Torpedoes D',
    'Pinger D2',
    'Octagon D',
    'Table D',
    'Marble',
    'Tubeworm D',
    'Nautilus D',
    'Coral D'
  ].sort();
  const [enabledStates, setEnabledStates] = useState<boolean[]>([]);

  const gridWidth: number = 12;
  const gridHeight: number = 12;

  useEffect(() => {
    for (let i = 0; i < props.length; i++) {
      setEnabledStates((prevStates: boolean[]) => {
        const newEnabledStates = [...prevStates];
        newEnabledStates.push(true);

        return newEnabledStates;
      })
    }
  }, [])



  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="mb-4">MIL Sim World Builder</h1>
      <div className="w-full h-[80vh] flex flex-col justify-center items-center">
        <div className={`w-full h-full border-2 bg-gray-700 grid grid-cols-${gridWidth} grid-rows-${gridHeight}`}>
          {
            [...Array(gridWidth * gridHeight)].map(_ =>
              <GridCell />
            )
          }

        </div>
        {/* <h2 className="text-2xl font-bold mb-5">Props:</h2>
        <div className="max-h-100 overflow-auto">
          {props.map((prop, index) => (
            <PropToggleButton label={prop} enabledStates={enabledStates} setEnabledStates={setEnabledStates} index={index} key={index} />
          ))}
        </div> */}
        < DownloadButton />
      </div>
    </div>
  )
}

export default App
