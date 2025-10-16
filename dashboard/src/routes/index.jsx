import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import MenuPage from "@/routes/pages/MenuPage";

import Home from "./pages/Home";
import Orders from "./pages/Orders";
import TableDetails from "./pages/TableDetails";
import Tables from "./pages/Tables";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tables">
          <Route index element={<Tables />} />
          <Route path=":id" element={<TableDetails />} />
        </Route>
        <Route path="orders">
          <Route index element={<Orders />} />
          <Route path=":id" element={<h1>Order</h1>} />
        </Route>
        <Route path="menu" element={<MenuPage />}/>
        <Route path="*" element={<h1>404</h1>} />
      </Route>
    </Route>
  )
);

export default router;
