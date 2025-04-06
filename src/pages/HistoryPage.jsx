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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const goToPreviousQuiz = () => {
    setCurrentIndex(currentIndex === 0 ? quizData.length - 1 : currentIndex - 1);
  };

  const goToNextQuiz = () => {
    setCurrentIndex(currentIndex === quizData.length - 1 ? 0 : currentIndex + 1);
  };

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
      backgroundColor: "#615756",
      padding: "1.5rem",
      borderRadius: "16px",
      margin: "1rem auto",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.2s ease",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      color: "#FDE8E9",
    },
    arrowButton: {
      backgroundColor: "#ADDC92",
      color: "#503D3F",
      border: "none",
      fontSize: "1.5rem",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      borderRadius: "50%",
    },
    cardBody: {
      color: "#503D3F",
      fontSize: "1.1rem",
      padding: "0.5rem",
      borderRadius: "8px",
      backgroundColor: "#615756"
    },
    question: {
      marginBottom: "4rem",
    },
    questionText: {
      fontWeight: "bold",
      color: "#FDE8E9",
    },
    answerText: {
      color: "#ADDC92",
    },
    explanationText: {
      color: "#E3BAC6",
      fontStyle: "italic",
    },
    choiceText: {
      color: "#FDE8E9",
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
          <>
            <div className="card" style={styles.card}>
              <div style={styles.cardHeader}>
                <button
                  onClick={goToPreviousQuiz}
                  style={styles.arrowButton}
                  className="btn btn-light"
                >
                  &#8592; {/* Left arrow */}
                </button>
                <h4 style={{ flex: 1, textAlign: "center" }}>
                  {quizData[currentIndex].quizName || `Quiz #${currentIndex + 1}`}
                </h4>
                <button
                  onClick={goToNextQuiz}
                  style={styles.arrowButton}
                  className="btn btn-light"
                >
                  &#8594; {/* Right arrow */}
                </button>
              </div>

              <div className="card-body" style={styles.cardBody}>
                {quizData[currentIndex].questions && quizData[currentIndex].questions.map((q, i) => (
                  <div key={i} style={styles.question}>
                    <p style={styles.questionText}>Q{i + 1}: {q.question}</p>
                    <p style={styles.answerText}><strong>A:</strong> {q.answer}</p>
                    {q.explanation && (
                      <p style={styles.explanationText}><em>{q.explanation}</em></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
