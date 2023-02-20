import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import rootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['isPlaying', 'currentTime'],
  stateReconciler: autoMergeLevel2
}

const myPersistReducer: any = persistReducer(persistConfig, rootReducer)

const store = createStore(
  myPersistReducer
)

export const persistor = persistStore(store)
export default store
