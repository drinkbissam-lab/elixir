import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile?.role === role) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
      setLoading(false);
    };

    checkRole();
  }, [role]);

  if (loading) return <div>جارٍ التحقق من الصلاحيات...</div>;
  return allowed ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
