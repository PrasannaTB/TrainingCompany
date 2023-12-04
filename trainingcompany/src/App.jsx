import { useState } from 'react'
import TabApp from './components/Tabs';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TabApp />
    </>
  )
}

export default App
