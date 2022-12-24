import { useState } from 'react';
import axios from 'axios';


export default function Home() {
    // const [images , setImages] = useState([]);
    const [image , setImage] = useState();

    //create banner 
    // const handleChange = async (e) => {
    //     let files = Array.from(e.target.files);
    //     files.forEach(file => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = (readerEvent) => { 
    //             setImages((prev) => { return [...prev , readerEvent.target.result]});
    //             console.log(readerEvent.target.result);   
    //         }
    //     })
    // }

    // //create banner
    // const handlePostClick = async () => { 
    //     try {
    //         const { data } = await axios.post('/api/banner' , {
    //             images : images 
    //         })
    //         console.log(data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // update banner
    const handleChange = async (e) => {
        let file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (readerEvent) => { 
            setImage(readerEvent.target.result);
            console.log(readerEvent.target.result)
        }
    }
    

    // update 
    const handlePostClick = async () => { 
        try {
            const { data } = await axios.put('/api/banner/633ebd82c7c61e37d1745c91' , {
                image : image 
            })
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="App">
            <h1>Hello World</h1>
            <input type='file' onChange={handleChange} multiple/>
            <button onClick={handlePostClick}>Post</button>
        </div>
    );
}
