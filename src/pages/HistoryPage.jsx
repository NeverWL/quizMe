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
      padding: "0rem",
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
      padding: "1.5rem",
      borderRadius: "16px",
      margin: "1rem auto",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.2s ease",
    },
    question: {
      fontWeight: "600",
      fontSize: "1.1rem",
      color: "#503D3F",
      marginBottom: "0.25rem",
    },
    answer: {
      marginBottom: "1rem",
      color: "#2A1F21",
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
          <div className="accordion w-100" id="quizAccordion">
            {quizData.map((quiz, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                    style={{
                      backgroundColor: "#615756", // Rose Ebony for the header (background)
                      color: "#FDE8E9", // Light Pink for text
                      fontWeight: "bold",
                    }}
                  >
                    {quiz.quizName || `Quiz #${index + 1}`}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#quizAccordion"
                  style={{
                    backgroundColor: "#FDE8E9", // Translucent light pink background
                    color: "#FDE8E9", // Light Pink for text
                    padding: "1rem", // Add some padding for inner content
                    borderRadius: "10px", // Rounded corners for the dropdown
                  }}
                >
                  <div className="accordion-body" style={{ color: "#FDE8E9", backgroundColor: "#FDE8E9", borderColor: "#FDE8E9", border: "none"}}>
                    {quiz.questions && quiz.questions.map((q, i) => (
                      <div key={i} className="mb-3" style={{ padding: "1rem" }}>
                        <p className="fw-bold mb-1" style={{ color: "#503D3F" }}>Q{i + 1}: {q.question}</p>
                        <p className="mb-1" style={{ color: "#503D3F" }}><strong>A:</strong> {q.answer}</p>
                        {q.explanation && (
                          <p className="text-muted" style={{ color: "#ADDC92" }}><em>{q.explanation}</em></p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
};
