import { Link } from "react-router-dom";
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

export default function OCRPage() {
    //Do whatever you want here
    const hi = 0;
    const [imagePath, setImagePath] = useState("");
    const [text, setText] = useState("Extracted Text");

    const handleChange = (event) => {
        setImagePath(URL.createObjectURL(event.target.files[0]));
    }

    const handleClick = () => {
  
        Tesseract.recognize(
          imagePath,'eng',
          { 
            logger: m => console.log(m) 
          }
        )
        .catch (err => {
            console.log("Tesseract ran into an error!");
            console.error(err);
        })
        .then(result => {
          // Get Confidence score
          console.log(result.data.text);
          let confidence = result.confidence;
          let extractedText = result.data.text;
          setText(extractedText);
      
        })
      }

    return (
        <>
            <div>
                <main>
                    <h3>Actual image uploaded</h3>
                    <img src={imagePath} className="App-logo" alt="logo"/>
                    <h3>Extracted text</h3>
                    <div className="text-box">
                        <p> {text} </p>
                    </div>
                    <input type="file" onChange={handleChange} />
                    <button onClick={handleClick} style={{height:50}}> convert to text</button>
                </main>
            </div>
            <div> OCR Page </div>
            <div> {hi} </div>
            <Link to="/">Go Home</Link>
        </>
    )
};