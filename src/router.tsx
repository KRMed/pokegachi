
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pokemon from "./pages/Pokemon";
import Battle from "./pages/Battle";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/pokemon", element: <Pokemon /> },
    { path: "/battle", element: <Battle /> },
]);