import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/Details.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


// auth.js (frontend)
const HandleGoogleRedirect = () => {
  const router = useRouter();
  const { setAuth, getCurrentUser } = useAuth();


  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("token");

      if (code) {
        localStorage.setItem("accessToken", code);

        try {
          const data = await getCurrentUser();
          console.log("User:", data);
          setAuth(true, data);


          if (data && data.email) {
            console.log(
              "!data.profileSetupCompleted..",
              !data.profileSetupCompleted
            );
            if (!data.profileSetupCompleted) {
              router.push(`/SelectUseCase?email=${data.email}`);
            } else {
              router.push(`/Main`);
            }
          } else {
            router.push("/");
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
          router.push("/"); // Redirect to home page or handle error appropriately
        }
      } else {
        console.log("No code found in URL parameters.");
      }
    };

    fetchData();
  }, [router, getCurrentUser, setAuth]); // Dependencies for the useEffect hook

  return <p>Loading...</p>;
};

export default HandleGoogleRedirect;
