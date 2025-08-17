import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa6'
import Homepage from '../Components/Homepage'
import { Outlet } from 'react-router-dom';
import { useAccessToken, useAuthenticationStatus, useUserData } from '@nhost/react';
import { useDispatch, useSelector } from 'react-redux';
import { setuserinfo } from '../Components/Reduxslice';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache,split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
// import  } from 'graphql';


function App() {
  const token = useAccessToken();
  const httpLink = new HttpLink({
    uri: "https://hvrlkexmsfkdsngfzifh.graphql.eu-central-1.nhost.run/v1",
    headers: {
          "x-hasura-admin-secret":"aSU^oSK1*G+YV%mZW)&Jyew+a&1(PqQm"
        }
  })
  const wsLink = new GraphQLWsLink(
    createClient({
      url: "wss://hvrlkexmsfkdsngfzifh.graphql.eu-central-1.nhost.run/v1",
      connectionParams: {
        headers: {
          "x-hasura-admin-secret":"aSU^oSK1*G+YV%mZW)&Jyew+a&1(PqQm"
        }
      }
    })
  )

  const splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink
  )


  const client = new ApolloClient({
   link:splitLink,
    cache:new InMemoryCache()
});

  const { isAuthenticated } = useAuthenticationStatus();

  const dispatch = useDispatch();
  const userdata = useUserData();
  const { accesstoken} = useSelector((state) => state.datastore);


  useEffect(() => {
    if (userdata)
    {

      dispatch(setuserinfo({ username:userdata.displayName, accesstoken: token, isAuth: isAuthenticated }))
    }

  },[isAuthenticated])

    
  return (
      <div>
      <div id="wholecontainer">
        <ApolloProvider client={client}>

        <Outlet />
        </ApolloProvider>
        
             
          </div>
          
    </div>
  )
}

export default App