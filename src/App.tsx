import './App.css'
import PropToggleButton from './components/PropToggleButton';
import DownloadButton from './components/DownloadButton';
import { useState, useEffect } from 'react';

function App() {
  const props = ['Test 1', 'Test 2', 'Test 3'];
  const [enabledStates, setEnabledStates] = useState<boolean[]>([]);

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
      <div className="w-100 h-[80vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-5">Props:</h2>
        <div>
          {props.map((prop, index) => (
            <PropToggleButton label={prop} enabledStates={enabledStates} setEnabledStates={setEnabledStates} index={index} key={index} />
          ))}
        </div>
        <DownloadButton />
      </div>
    </div>
  )
}

export default App
