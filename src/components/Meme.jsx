/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import MemesData from "../MemesData.js"

import Draggable from 'react-draggable';
import { toPng } from "html-to-image";


const Meme = () => {

    const memeRef = useRef(null);

    // let [memeImage, setMemeImage] = useState("");
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "https://i.imgflip.com/2za3u1.jpg"
    });

    const [allMemes, setAllMemes] = useState([]);


    useEffect(() => {

        async function getMemes() {
            const res = await fetch("https://api.imgflip.com/get_memes");
            const data = await res.json();

            setAllMemes(data.data.memes);
        }

        getMemes();

    }, []);


    const getMemeImage = () => {
        const memesArray = MemesData.data.memes;

        const randomNumber = Math.floor(Math.random() * memesArray.length);

        const url = memesArray[randomNumber].url;

        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
    }


    const handleChange = (event) => {
        const { name, value } = event.target;

        setMeme(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const downloadMeme = async () => {
        toPng(memeRef.current, {cacheBust: false})
            .then((dataURL) => {
                const link = document.createElement("a");

                link.download = "meme.png";
                link.href = dataURL;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <main>

            <form className="form">


                <div>
                    {/* <label htmlFor="top-text">
                        Top Text
                    </label> */}
                    <input
                        type="text"
                        placeholder="Top text"
                        className="form--input"
                        id="top-text"
                        name="topText"
                        onChange={(e) => handleChange(e)}
                        value={meme.topText}
                    />

                </div>

                <div>
                    {/* <label htmlFor="bottom-text">
                        Bottom Text
                    </label> */}
                    <input
                        type="text"
                        placeholder="Bottom text"
                        className="form--input"
                        id="bottom-text"
                        name="bottomText"
                        onChange={(e) => handleChange(e)}
                        value={meme.bottomText}
                    />

                </div>

                <button
                    type="button"
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 🖼
                </button>

            </form>
            <div className="meme" id="meme" ref={memeRef}>
                <img src={meme.randomImage} className="meme--image" />

                <Draggable>
                    <h2 className="meme--text top" draggable={true}>{meme.topText}</h2>
                </Draggable>

                <Draggable>
                    <h2 className="meme--text bottom" draggable={true}>{meme.bottomText}</h2>
                </Draggable>
            </div>

            <div>
                <button onClick={downloadMeme} className="download-btn">
                    Download
                    <img src="/download.svg" alt="Download" height="16" />    
                </button>
            </div>
        </main>
    )
}

export default Meme