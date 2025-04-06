import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import wordLess from '../assets/upGradeWordless.png';



export default function HistoryPage() {
  const { user } = useAuth();
  const auth = getAuth();
  const db = getFirestore();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(user);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const quizzesRef = collection(db, "quizzes");
        const q = query(quizzesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const quizzes = querySnapshot.docs.map(doc => doc.data());
        setQuizData(quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, [user, db]);


  

  const styles = {
    body: {
      background: "linear-gradient(to bottom, #503D3F, #2A1F21)",
      minHeight: "100vh",
      minWidth: "100vw",
      display: "flex",
      flexDirection: "column",
      padding: "0 1rem",
      margin: "0",
    },
    header: {
      color: "#FDE8E9",
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
    button: {
      backgroundColor: "#ADDC92",
      color: "#FFFFFF",
      borderRadius: "20px",
      border: "none",
      fontWeight: "bold",
      padding: "0.75rem 1.5rem",
      margin: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    card: {
      backgroundColor: "#FDE8E9",
      padding: "1rem",
      borderRadius: "10px",
      margin: "1rem 0",
      width: "100%",
      maxWidth: "600px",
    },
    question: {
      fontWeight: "bold",
    },
    answer: {
      marginBottom: "0.5rem",
    },
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#FDE8E9" }}>Up-Grade</h3>
        </div>
        <nav>
          <Link to="/quizMe" style={styles.navLink}>Home</Link>
          <Link to="./" style={{ ...styles.navLink, ...styles.activeLink }}>History</Link>
        </nav>
      </header>

      <div className="container d-flex flex-column align-items-center">
        <img
                  src={wordLess}
                  alt="Home Icon"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginBottom: "1rem",
                  }}
                />
        {loading ? (
          <p style={{ color: "#FDE8E9" }}>Loading...</p>
        ) : !user ? (
          <p style={{ color: "#FDE8E9" }}>Please log in to see history...</p>
        ) : quizData.length === 0 ? (
          <p style={{ color: "#FDE8E9" }}>No history found.</p>
        ) : (
          quizData.map((quiz, index) => (
            <div key={index} style={styles.card}>
              <h4>{quiz.quizName || `Quiz #${index + 1}`}</h4>
              {quiz.questions && quiz.questions.map((q, i) => (
                <div key={i}>
                  <p style={styles.question}>Q{i + 1}: {q.question}</p>
                  <p style={styles.answer}>A: {q.answer}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
