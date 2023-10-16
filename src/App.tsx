import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";

import './App.css';

import { Home, Pokemon } from "pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
    >
      <Route index element={<Home />} />
      <Route path="/:pokemon" element={<Pokemon />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />

export default App;