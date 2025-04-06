// src/components/GoogleLoginButton.jsx
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function GoogleLoginButton({ onLogin }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user); // Pass user back to parent
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button onClick={handleLogin} className="btn btn-outline-light">
      Login
    </button>
  );
}
