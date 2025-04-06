import { useLocation, useNavigate, Link } from "react-router-dom";

export default function ResultsPage() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const styles = {
      body: {
        background: "linear-gradient(to bottom, #503D3F, #2A1F21)",
        maxHeight: "100vh",
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
    };
  
    return (
      <div style = {styles.body}>
        <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#FDE8E9" }}>Up-Grade</h3>
        </div>
        <nav>
          <Link to="/quizMe" style={styles.navLink}>Home</Link>
          <Link to="/QuizPage" style={{ ...styles.navLink, ...styles.activeLink }}>Create a Quiz</Link>
        </nav>
      </header>


        <div className = "container vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-3" style = {styles.header}>Your Score: {state.score} / {state.total}</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/quizMe")}>Back to Home</button>
        </div>
      </div>
    );
    // return (
    //     <>
    //         <div> Select page </div>
    //         <Link to="/QuizPage">Quiz Page</Link>
    //     </>
    // )
};