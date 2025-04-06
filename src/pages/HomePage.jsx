import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import wordLess from '../assets/upGradeWordless.png';
import upGradeLogo from '../assets/upgradeWithText.png';
import GoogleLoginButton from "../components/GoogleLoginButton";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [typedText, setTypedText] = useState("");
  const fullText = "Weelcome to the new way to learn.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length - 1) {
        setTypedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval); // stop when done
      }
    }, 50);
  
    return () => clearInterval(interval);
  }, []);

  const styles = {
    body: {
        background: "linear-gradient(to bottom, #503D3F, #2a1f21)",
        color: "#FDE8E9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    header: {
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navLink: {
      margin: "0 1rem",
      color: "#FDE8E9",
      fontWeight: "bold",
      textDecoration: "none",
    },
    activeLink: {
      borderBottom: "2px solid #ADDC92",
    },
    main: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem",
    },
    button: {
      backgroundColor: "#FFFFFF",
      textDecoration: "none",
      color: "#503D3F",
      borderRadius: "20px",
      border: "1px solid #503D3F",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      marginTop: "1rem",
    },
    footer: {
      color: "#FFFFFF",
      textAlign: "center",
      padding: "1rem",
    },
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h3 style={{ marginTop: "10px", marginLeft: "5px" }}>Up-Grade</h3>
        <nav>
          <Link to="/HistoryPage" style={styles.navLink}>History</Link>
          <span style={styles.navLink}>
              {user ? (
                  <span>Hi, {user.displayName}</span>
              ) : (
                  <GoogleLoginButton />
              )}
          </span>
        </nav>
      </header>

      <main style={styles.main}>
        <img
          src={wordLess}
          alt="Home Icon"
          style={{
            width: "100px",
            height: "100px",
            marginLeft: "0px",
            marginRight: "0px",
            marginBottom: "1rem",
            verticalAlign: "middle"
          }}
        />
        <p className="lead" style={{ fontFamily: "monospace", fontSize: "1.25rem" }}>
          {typedText}
          <span style={{ borderRight: "2px solid #FDE8E9", animation: "blink 1s steps(1) infinite" }}></span>
        </p>
        <Link to="/QuizPage" style={styles.button}>Create a Quiz</Link>
      </main>

      <footer style={styles.footer}>
        <p>
          Project by Daniel M., Zheng C., Donovan T., and Jared L.
        </p>
      </footer>

      {/* Typewriter cursor animation */}
      <style>
        {`@keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }`}
      </style>
    </div>
  );
};