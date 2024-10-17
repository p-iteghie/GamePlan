import React, {useEffect, useState} from 'react'
import Visuals from './Visuals';

function App()
{
  const[backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return(
    <div>
      <Visuals />
    </div>
  );
}



export default App;
