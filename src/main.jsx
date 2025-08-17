import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { commonstore } from '../Components/Reduxstore.jsx'
import Homepage from '../Components/Homepage.jsx'
import Chattingpage from '../Components/Chattingpage.jsx'
import { NhostClient, NhostProvider, useAccessToken } from '@nhost/react';
import { ApolloProvider, ApolloClient, split, InMemoryCache, HttpLink } from '@apollo/client'
// import {GraphQLWsLink} from '@apollo/client/'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'





const nhost = new NhostClient({
    subdomain: "hvrlkexmsfkdsngfzifh",
    region:"eu-central-1"
})

// const client = new ApolloClient({

//     cache:new InMemoryCache()
// })








const Routes = createBrowserRouter([
    {
        path: "/",
        element:<App/>,
        children: [{
            path: "/",
            element:<Homepage/>
        },
            {
                path: "/chatpage",
                element:<Chattingpage/>
        }]
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(


        
    <NhostProvider nhost={nhost}>
        <Provider store={commonstore}>

    <RouterProvider router={Routes}/>

    
        </Provider>

    </NhostProvider>

)
