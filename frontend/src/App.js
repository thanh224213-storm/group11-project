
import { Router } from "express";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

<Routes>
    <Route path="/admin" element={<Admin />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset/:token" element={<ResetPassword />} />
  </Routes>
