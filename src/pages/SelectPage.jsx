import { Link } from "react-router-dom";

export default function SelectPage() {
    return (
        <>
        {/*Navbar for the website using bootstrap */}
        <nav class = "navbar navbar-expand-lg fixed-top" style = {{backgroundColor: /*'#dceed1'*/ '#503d3f'}} data-bs-theme = "light">
            <div class = "container-fluid">
                <Link to = "/" class = "navbar-brand" style = {{color: '#FED8E9'}}>Up-Grade</Link>
                <div class = "collapse navbar-collapse" id = "navbarNav">
                    <ul class = "navbar-nav">
                        <li class = "class-item">
                            <Link to = "/SelectPage" class = "nav-link active" style = {{color: '#FED8E9'}}>Home</Link>
                        </li>
                        <li class = "class-item">
                            <Link to = "/" class = "nav-link active" style = {{color: '#FED8E9'}}>Text</Link>
                        </li>
                        <li class = "class-item">
                            <Link to = "/OCRPage" class = "nav-link active" style = {{color: '#FED8E9'}}>Upload</Link>
                        </li>
                        <li class = "class-item">
                            <Link to = "/" class = "nav-link active" style = {{color: '#FED8E9'}}>Photo</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        {/*The main body and structure of the page using bootstrap */}
        <div class = "position-relative" style = {{ height: "200vh", width: "100%" }}>
            <div class = "position-absolute start-50 translate-middle" style = {{top: "8%"}}>
                <div class = "row justify-content-end align-items-center">
                    <div class = "col">
                        <p class = "text-center fs-1 fw-bold"> Ready to Up-Grade? </p>
                    </div>
                </div>
            </div>

            {/*Div for the Upload section */}
            <div class = "position-relative" style = {{top: "40vh", height: "40vh", width: "90%", backgroundColor: "lightBlue", left: "5%"}}>
                <div class = "position-absolute translate-middle" style = {{top: "15%", left: "20%"}}>
                    <p class = "text-center fs-4 fw-bold"> Input Your Text </p>
                </div>
                <div class = "position-absolute overflow-auto p-3" style = {{top: "30%", left: "7%", width: "55%", wordWrap: "break-word", overflowWrap: "break-word"}}>
                    <p class = "m-0"> Lorem Ipsum asdf asdf asdf assdf asdf asd fasf safasdfsadf asdf as f saf as df asdf sadf asd f asf as fa f assdf asdf asdf asdf asdf as fsadf asf saf sadf 
                        asdf asdf asdf asdf asdf adf asdf asdf sadf asdf asdf asdf asdf asf adf asdf 
                    </p>
                </div>
                <div class = "position-absolute translate-middle" style = {{top : "40%", right: "7%"}}>
                    <p class = "text-center fs-4 fw-bold"> Try It Now! </p>
                    <div class = "position-absolute start-50 translate-middle" style = {{top: "150%"}}>
                        <Link to = "/" class = "btn btn-dark">Upload</Link>
                    </div>
                </div>
            </div>

            <div class = "position-relative" style = {{top: "40vh", height:"40vh", width: "90%", backgroundColor: "lightGreen", left: "5%"}}>

            </div>
            
            {/*<div class = "position-relative" style = {{height: "60vh", width: "100%"}}>
                <div class = "position-absolute translate-middle" style = {{top: "50%", left: "20%"}}>
                    <div class = "row justify-content-end align-items-center">
                        <div class = "col">
                            <p class = "text-center fs-4 fw-bold"> Text Input </p>
                        </div>
                    </div>
                </div>

                <div class = "position-absolute start-50 translate-middle" style = {{top: "50%"}}>
                    <div class = "row justify-content-end align-items-center">
                        <div class = "col">
                            <p class = "text-center fs-4 fw-bold"> PDF Upload </p>
                        </div>
                    </div>
                </div>

                <div class = "position-absolute translate-middle" style = {{top: "50%", left: "80%"}}>
                    <div class = "row justify-content-end align-items-center">
                        <div class = "col">
                            <p class = "text-center fs-4 fw-bold"> Photo Upload </p>
                        </div>
                    </div>
                </div>
            </div>*/}
            <Link to="/QuizPage">Quiz Page</Link>
        </div>
        </>
    )
};