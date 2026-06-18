import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout/AppLayout';

// Import Pages
import Home from './pages/Home/Home';
import ProductsList from './pages/Products/ProductsList/ProductsList';
import ProductView from './pages/Products/ProductView/ProductView';
import CategoriesList from './pages/Categories/CategoriesList/CategoriesList';
import CategoryView from './pages/Categories/CategoryView/CategoryView';
import UsersList from './pages/Users/UsersList/UsersList';
import UserView from './pages/Users/UserView/UserView';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductView />} />
          <Route path="/products/:id" element={<ProductView />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/new" element={<CategoryView />} />
          <Route path="/categories/:id" element={<CategoryView />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UserView />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
