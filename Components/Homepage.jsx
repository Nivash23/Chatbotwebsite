import React, { useEffect, useState } from "react";
import chatbotimg from "../images/chatbotimage.webp";
import { useNavigate } from "react-router-dom";
import { useSignOut, useAccessToken, useAuthenticationStatus, useResetPassword } from "@nhost/react";

import {useSignInEmailPassword,
  useSignUpEmailPassword,
  useUserData,
} from "@nhost/react";
import { useDispatch, useSelector } from "react-redux";
import { setChatcreationstatus, setuserinfo } from "./Reduxslice";


function Homepage() {
  const { signOut } = useSignOut();
  const dispatch = useDispatch();
  const token = useAccessToken();
  const {resetPassword,isSent,isError} =useResetPassword();
  // const {isAuthenticated } = useAuthenticationStatus();

  const {isauth,username}=useSelector((state)=>state.datastore)
  
  const [forgotpassemail, setForgotpassemail] = useState({
    email:""
  })

  const [forgotpassStatus, setForgotpassStatus] = useState('Forgotinactive');

  
 
  
    const [registerstatus, setRegisterstatus] = useState("Reginactive");
  const [loginstatus, setLoginstatus] = useState("Logactive");
  const [loggedinuserpage, setLoggedinuserpage] = useState("Loggedinactive");
    const {
        signUpEmailPassword,
        isLoading: signUpLoading,
        error: signUpError,
    } = useSignUpEmailPassword();
    const {
        signInEmailPassword,
        isLoading: signInLoading,
        error: signInError,
    } = useSignInEmailPassword();
    // const [loadingstatus, setLoadingstatus] = useState("Loadinactive");
    const navigate = useNavigate();

    const [regdetails, setRegdetails] = useState({
        email: "",
        name: "",
        password: "",
    });
    const [logindetails, setLogindetails] = useState({
        email: "",
        password: "",
    });

    const handleregister = async (e) => {
        e.preventDefault();
        const result = await signUpEmailPassword(
            regdetails.email,
            regdetails.password,
            { displayName: regdetails.name }
        );
        // if (signUpLoading)
        // {

        // }
        if (!result.error) {
          alert("User Registered Sucessfully..");
          alert("Please check your mail and verify it then only you can Login")
          // alert(`Registerd User ${result.user.displayName}`);
          setRegisterstatus("Reginactive");
          setLoginstatus("Logactive");
          // setLoadingstatus('Logactive');
            return;
        } else {
            alert(`SignUp failed :${result.error.message}`);
        }

        // alert('Hello')
    };
    const handlelogin = async (e) => {
        e.preventDefault();
        // setLoadingstatus("Loadactive");
        const result = await signInEmailPassword(
            logindetails.email,
            logindetails.password
        );
        if (!result.error) {
            // setLoadingstatus("Loadinactive");
            setLogindetails({ email: "", password: "" });
          alert("User Login Sucessfully..");
          setLoginstatus("Loginactive");
          setLoggedinuserpage("Loggedactive")
      
        
    
        } else {
    
            alert(`SignIn failed : ${result.error.message}`);
          // setLoadingstatus('Loadinactive');
        }
        // alert('Hello')
  };

  const Forgotpasshandler = async (e) => {
    e.preventDefault();

    // console.log(isSent)

    resetPassword(forgotpassemail.email)
    if (isError)
    {
      alert('Error',isError)
    }
    else {
      alert('Password Reset mail has been sent to your mail');
      setForgotpassStatus('Forgotinactive');
      setLoginstatus('Logactive')
    }

    
  }

  useEffect(() => {
    if (isauth)
    {
      setLoginstatus('Loginactive');
      setLoggedinuserpage('Loggedactive');
    }
    else {
      setLoginstatus('Logactive');
      setLoggedinuserpage('Loggedinactive');
    }
  },[isauth])

  
    
    
  return (
    <div id="chatbotcontainer">
      <div id="chatbotdesign">
        <div style={{ display: "flex" }}>
          <div>
            <div id="head">Chat with our chatbot</div>
            <div
              style={{
                width: "300px",
                color: "brownwhite",
                lineHeight: "25px",
              }}
            >
              Ask common questions,get instant answers,and find the information
              you need.
            </div>
            <div>
              <button
                id="startchatbut"
                type="button"
                onClick={() => {
                  if (isauth)
                  {
                    dispatch(setChatcreationstatus({status:"Chatactive"}))

                    navigate("/chatpage");
                  }
                  else {
                    alert('Please login to access the chatbot..')
                  }
                }}
              >
                Start Chat
              </button>
            </div>
          </div>
          <div>
            <div
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "300px",
                overflow: "hidden",
              }}
            >
              <img
                src={chatbotimg}
                style={{ height: "100%", width: "100%" }}
              ></img>
            </div>
          </div>
        </div>
      </div>
      <div id="logininputfields">
        <div>
          <form onSubmit={handlelogin}>
            <div id="loginbox" className={loginstatus}>
              <div className="head">Login</div>
              <div className="field">
                <div>
                  <label>Email</label>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your Email.."
                    value={logindetails.email}
                    onChange={(e) => {
                      setLogindetails({
                        ...logindetails,
                        email: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div>
                  <label>Password</label>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter the password.."
                    value={logindetails.password}
                    required
                    onChange={(e) => {
                      setLogindetails({
                        ...logindetails,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <div style={{ cursor: "pointer" }} onClick={() => {
                  setLoginstatus('Loginactive');
                  setForgotpassStatus('Forgotactive');
                 }}>Forgot password ?</div>
              </div>
              <div>
                <button type="submit" id="loginbut">
                  Log In
                </button>
              </div>
              {/* <div className={loadingstatus}>
                <div>Loading..</div>
              </div> */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div>
                  New here ?{" "}
                  <span
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => {
                      setLoginstatus("Loginactive");
                      setRegisterstatus("Regactive");
                    }}
                  >
                    Sign Up
                  </span>
                </div>
              </div>
            </div>
          </form>
          <form onSubmit={handleregister}>
            <div id="regbox" class={registerstatus}>
              <div className="head">Register</div>
              <div className="field">
                <div>
                  <label>Email</label>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your Email.."
                    value={regdetails.email}
                    onChange={(e) => {
                      setRegdetails({ ...regdetails, email: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div>
                  <label>Name</label>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your Name.."
                    value={regdetails.name}
                    onChange={(e) => {
                      setRegdetails({ ...regdetails, name: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div>
                  <label>Password</label>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter the password.."
                    value={regdetails.password}
                    onChange={(e) => {
                      setRegdetails({
                        ...regdetails,
                        password: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <button type="submit" id="registerbut">
                  Register
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div>
                  Already Exists ?{" "}
                  <span
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => {
                      setLoginstatus("Logactive");
                      setRegisterstatus("Reginactive");
                    }}
                  >
                    Sign In
                  </span>
                </div>
              </div>
            </div>
          </form>
          <form onSubmit={Forgotpasshandler}>
            <div className={forgotpassStatus}>
              <div>
                <div>
                  <label>Email</label>
                </div>
                <div>
                  <input type="email" placeholder="Enter your email" value={forgotpassemail.email} required onChange={(e)=>{setForgotpassemail({email:e.target.value})}} />
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <button type="submit" id="forgotpassbut">Get Request</button>
                </div>
              </div>
            </div>
          </form>
          <div  className={loggedinuserpage}  >
            <div style={{fontWeight:"bold",fontSize:"22px"}} >Welcome!,{username }</div>
            <div>
              <button type="button" id="logoutbut" onClick={() => {
                signOut();
                setLoginstatus("Logactive"); 
                setLoggedinuserpage("Loggedinactive");
                dispatch(setuserinfo({username:"",accesstoken:"",isAuth:""}))
              }} >Logout</button>
            </div>

            
                      
                  </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
