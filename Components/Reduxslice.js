import { createSlice } from "@reduxjs/toolkit";

const datas = createSlice({
    name: "datalists",
    initialState: {
        username: "",
        isauth:"",
        accesstoken: "",
        chatcreationstatus:"Chatinactive"
    },
    reducers: {
        setuserinfo: (state, action) => {
            state.username = action.payload.username;
            state.accesstoken = action.payload.accesstoken;
            state.isauth = action.payload.isAuth;
        },
        setChatcreationstatus: (state, action) => {
            state.chatcreationstatus = action.payload.status;
        }
        
    }
})

export const { setuserinfo,setChatcreationstatus} = datas.actions;
export default datas.reducer;