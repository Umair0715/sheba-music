import ReactHlsPlayer from 'react-hls-player';
import ReactPlayer from 'react-player/lazy'

const Player = () => {
  
   
    
    // http://92news.vdn.dstreamone.net/92newshd/92hd/playlist.m3u8?checkedby:iptvcat.com
    return (
        <div>
            <h1>React Player</h1>
            <ReactHlsPlayer
                // poster='/loading.gif'
                src='http://208.86.19.13:81/715.stream/index.m3u8'
                autoPlay={false}
                controls={true}
                width="100%"
                height="auto"
                
            />
            {/* <video src="http://208.86.19.13:81/715.stream/index.m3u8"></video> */}
            {/* <video width="640" height="400" controls="controls" autoPlay src="http://92news.vdn.dstreamone.net/92newshd/92hd/playlist.m3u8?checkedby:iptvcat.com"></video> */}
            {/* <ReactPlayer url='http://208.86.19.13:81/715.stream/index.m3u8' /> */}
 

            
        </div>
    )
}

export default Player