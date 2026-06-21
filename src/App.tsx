import { BrowserRouter, Routes, Route } from "react-router-dom";


import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import CreateReservation from "./pages/CreateReservation";
import MyReservations from "./pages/MyReservations";
import ReservationDetail from "./pages/ReservationDetail";
import UserProfile from "./pages/UserProfile";


import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import ViewMenu from "./pages/ViewMenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={
          <ProtectedRoute><UserDashboard /></ProtectedRoute>
        } />

        <Route path="/reservations/create" element={
          <ProtectedRoute><CreateReservation /></ProtectedRoute>
        } />

        <Route path="/reservations/my" element={
          <ProtectedRoute><MyReservations /></ProtectedRoute>
        } />


        <Route path="/reservations/:id" element={
          <ProtectedRoute><ReservationDetail /></ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute><ViewMenu /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><UserProfile /></ProtectedRoute>
        } />

    
        <Route path="/admin" element={
          <ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>
        } />

<Route path="/admin" element={
  <ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>
} />

<Route
  path="/reservation-code/:code"
  element={<ReservationDetail />}
/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;