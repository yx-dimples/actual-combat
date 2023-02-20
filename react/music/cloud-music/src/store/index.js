import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'


const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['isPlaying', 'songUrl', 'playMode'],
  stateReconciler: autoMergeLevel2
}

const myPersistReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  myPersistReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)
export default store
