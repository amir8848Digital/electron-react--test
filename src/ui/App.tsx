import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import NewFormPage from "./componenets/NewFormPage";
import CustomerForm from "./componenets/CustomerForm";
import SalesOrderList from "./componenets/SalesOrderList";
import Layout from "./componenets/Layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          Component: SalesOrderList,
        },
        {
          path: "order-design-new/",
          Component: NewFormPage,
        },
        {
          path: "/customer-form",
          Component: CustomerForm,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
