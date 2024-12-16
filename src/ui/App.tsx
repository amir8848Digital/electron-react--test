
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FormPage from './componenets/FormPage';
import { PrimeReactProvider } from 'primereact/api';
import NewFormPage from './componenets/NewFormPage';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
   
      children: [
        {
          path: "",
          Component:NewFormPage ,
          
        },
      ],
    },
  ]);



  return (
    <div className="App">
      {/* <Header /> */}
    <div>
    <PrimeReactProvider >
            <RouterProvider router={router} />
        </PrimeReactProvider>
    </div>
    </div>
  );
}


function Header() {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  );
}



export default App;
