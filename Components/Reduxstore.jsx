import { configureStore } from "@reduxjs/toolkit";
import datas from './Reduxslice'

export const commonstore = configureStore({
    reducer: {
        datastore:datas
    }
})