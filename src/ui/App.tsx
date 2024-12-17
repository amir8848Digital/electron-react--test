import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewFormPage from "./componenets/NewFormPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "",
          Component: NewFormPage,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      {/* <Header /> */}
      <div>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
