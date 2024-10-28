import Visuals from './Visuals';
import Register from './Register';
import { Login, GetUserButton} from './Login';






function App()
{

  return(
    <div>
      <Visuals/>

      <Register/>

      <Login/>

      <GetUserButton/>
      
     </div>
  );
}



export default App;
