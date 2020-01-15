import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchProfile() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/profile', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_PROFILE', payload: response.data });
  } catch (error) {
    console.log('Profile get request failed', error);
  }
}

function* updateProfile(action){
  try{
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
    if(action.payload.noUpdate){
      delete action.payload.noUpdate;
      yield axios.put('/api/profile', action.payload, config);
    } else {
      yield axios.put('/api/profile', action.payload, config);
      yield put({type: 'FETCH_PROFILE'});
    }
  } catch (error) {
    console.log('Profile put request failed', error);
  }
}

function* profileSaga() {
  yield takeLatest('FETCH_PROFILE', fetchProfile);
  yield takeLatest('UPDATE_PROFILE', updateProfile);
}

export default profileSaga;