import './App.css'
import WorldCanvas from './components/WorldCanvas';
import DownloadButton from './components/DownloadButton'

function App() {

  return (
    <div className='w-[65vw] flex flex-col items-center'>
      <h1 className="bg-white text-black py-2 px-2 text-3xl font-medium rounded-t-lg w-full">Simulation World Builder</h1>
      <WorldCanvas />
      <DownloadButton />
    </div>
  )
}

export default App
