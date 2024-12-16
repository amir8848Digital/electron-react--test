
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



export default App;
