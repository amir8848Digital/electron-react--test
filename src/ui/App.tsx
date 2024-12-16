
import './App.css';
import Layout from './layout/layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FormPage from './componenets/FormPage';
import { PrimeReactProvider } from 'primereact/api';
import { LayoutProvider } from './layout/context/layoutcontext';

function App() {

  const router = createBrowserRouter([
    {
      path: "",
      Component: Layout,
      children: [
        {
          path: "",
          Component:FormPage ,
          
        },
      ],
    },
  ]);



  return (
    <div className="App">
      {/* <Header /> */}
    <div>
    <PrimeReactProvider>
          <LayoutProvider>
            <RouterProvider router={router} />
          </LayoutProvider>
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
