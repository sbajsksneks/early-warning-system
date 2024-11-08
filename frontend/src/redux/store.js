
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default localStorage untuk web

// import slicer
import DataSlicer from './redux-slicers/data'; // Ganti dengan reducer Anda


const rootReducer = combineReducers({
    data: DataSlicer, // Tambahkan reducer lainnya jika ada
});


// Konfigurasi untuk persistor
const persistConfig = {
    key: 'root',
    storage,
    version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
    ,
});

const persistor = persistStore(store);

export { store, persistor };