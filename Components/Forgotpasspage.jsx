import { useChangePassword } from '@nhost/react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Forgotpasspage() {
    const navigate = useNavigate();
    const [changepass, setChangepass] = useState({
        newpass: "",
        confirmpass:""
    })
    const [ticket, setTicket] = useState();
    
    const [responsemsg, setResponsemsg] = useState("");
    const [responsemsgcolor, setResponsemsgcolor] = useState("black");

    
    const {changePassword,isSuccess,isError} = useChangePassword();
    
    const changepasshandler=async(e)=>{
        e.preventDefault();
        
        if (changepass.newpass != changepass.confirmpass)
            {
                setResponsemsgcolor("red")
                setResponsemsg("Password Mismatching..")
                return;
            }
            if (!ticket)
                {
                    console.log(window.location.search)
                    alert("not found")
            return
        }
        await changePassword({
            newPassword: changepass.confirmpass,
            ticket:ticket
        })
        
        if (!isError)
            {
                setResponsemsgcolor("green")
                setResponsemsg("Password Changed Sucessfully..")
            setChangepass({
                newpass: "",
                confirmpass: ""
            })
            alert(ticket)
            }
            
            
            
        }

        
        useEffect(() => {
            const ticket = new URLSearchParams(window.location.search).get('refreshToken');
            setTicket(ticket)
    },[])

  return (
      <div>
          <form onSubmit={changepasshandler}>
              

          <div id="newpasssettingbox">
              <div style={{margin:"20px 0px 10px 20px"}}>
                  <div style={{margin:"15px 0px 15px 0px"}}><label>New password</label></div>
                  <div style={{width:"300px",height:"35px",borderRadius:"7px",overflow:"hidden"}}><input type="password" placeholder='Enter the password' value={changepass.newpass} onChange={(e)=>{setChangepass({...changepass,newpass:e.target.value})}} /></div>
                  
              </div>
              <div style={{margin:"10px 0px 10px 20px"}}>
                  <div style={{margin:"15px 0px 15px 0px"}}><label>Confirm password</label></div>
                  <div style={{width:"300px",height:"35px",borderRadius:"7px",overflow:"hidden"}}><input type="password" placeholder='Enter the password' value={changepass.confirmpass} onChange={(e)=>{setChangepass({...changepass,confirmpass:e.target.value})}} /></div>

              </div>
              <div style={{display:"flex",justifyContent:"center",marginTop:"20px"}}>
                  <button type="submit" style={{padding:"8px",borderRadius:"7px",width:"280px",cursor:"pointer",height:"35px",backgroundColor:"blue",color:"white",fontSize:"16px",fontWeight:"bold"}}>Change password</button>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",marginTop:"20px"}}>
                      <div style={{color:responsemsgcolor}}>{responsemsg}</div>
                  </div>
                  
          </div>
          </form>
    </div>
  )
}

export default Forgotpasspage