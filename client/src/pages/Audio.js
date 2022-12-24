import React, { useState } from 'react';
import axios from 'axios';

const Audio = () => {
    const [songData , setSongData ] = useState({
        title : "new Song" ,
        category : "633fd1703e6af91b58762989",
    })


    const handleChange = (e) => { 
        console.log(e.target.files);
        const file = e.target.files[0];
        const { name } = e.target;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (readerEvent) => {
            console.log(readerEvent.target.result);
            setSongData({...songData , [name] : readerEvent.target.result})
        }
    }

    const uploadHandler = async () => { 
        console.log(songData);
        try {
            const { data } = await axios.post('/api/song' , songData , {
                headers : { 
                    authorization : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNmZDBmYzExMTM2NWVmNWQxZGNkMzEiLCJpYXQiOjE2NjUxNDIzOTgsImV4cCI6MTY2NTc0NzE5OH0.a5Lh9b-0Hlge-WXRzEjTzJmAfnIwieIcYGj2xR4sU_M'
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Upload Mp3 File</h1>
            <div>
                <input type="file" name='audio' onChange={handleChange}/>
            </div>
            < br />
            <h1>Upload Song Cover File</h1>
            <div>
                <input type="file" name='songCover' onChange={handleChange}/>
            </div>
            <br />
            <button onClick={uploadHandler}>Upload</button>
        </div>
    )
}

export default Audio