import React from 'react';
import Search from './Search';
import MovieComponent from './Movies_main';
import DetailView from './movie_detail';
import './App.css';

import {
  Link,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div>
      <nav className="nav">
        <ul className="nav">
          <li>
            <Link to="/" className="link">Popular Movies</Link>
          </li>
          <li>
            <Link to="/search" className="link">Search</Link>
          </li>
        </ul>
      </nav>
      <div className="layout">
        <MovieComponent />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/detail/:id",
    Component: DetailView,
  }
]);

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </div>
  );
}

export default App;
