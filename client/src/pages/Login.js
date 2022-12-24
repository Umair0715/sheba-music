import  GoogleLogin  from 'react-google-login';
import axios from 'axios';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';


export default function Login() {
    const clientId = "994755781645-jg44pbntupegtl08h5amii8icnurvasb.apps.googleusercontent.com";
    const googleSuccess = async (response) => {
        try {
            const result = await axios.post('/api/v1/auth/google-login' , {
                idToken : response.tokenId ,
            })
            console.log(result);
  
        }catch(error) {
          console.log(error);
        }
        console.log('response' , response )
    }
    const googleError = (response) => {
        console.log(response)
    }

 
    const responseFacebook = async (response) => {
        const { userID , accessToken } = response;
        try {
            const { data } = await axios.post('/api/v1/auth/facebook-login' , {
                userID ,
                accessToken 
            });
            console.log('facebook login success' , data );
        } catch (error) {
            console.log('facebook login error' , error)
        }
        console.log(response)
    }
    
    useEffect(() => {
      const initClient = () => {
            gapi.client.init({
            clientId: clientId,
            scope: ''
          });
       };
       gapi.load('client:auth2', initClient);
   });

    return (
        <div className="App">
            <GoogleLogin
            clientId={clientId}
            buttonText="Login with google"
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy={'single_host_origin'}
            />

            <h1>Login with facebook</h1>
            <FacebookLogin
            appId="1087986112080295"
            autoLoad={true}
            callback={responseFacebook} 
            />
        </div>
    );
}
