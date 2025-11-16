import { configureStore } from "@reduxjs/toolkit";
import testListSlice from "../slice/testListSlice";
import attemptSlice from "../slice/attempts"
import accountSlice from "../slice/accounts"
import authReducer from '../slice/authentication';
import testReducer from "../slice/tests"
import questionReducer from "../slice/questions";
import answerReducer from "../slice/answers";
import fileReducer from "../slice/files";
import resourceReducer from "../slice/resource";
import notificationSlice from "../slice/notifications";
import settingsSlice from "../slice/notificationSettings";
const reducer = {
    test: testReducer,
    questions: questionReducer,
    answers: answerReducer,
    file: fileReducer,
    resource: resourceReducer,
    authentication: authReducer,
    tests: testListSlice,
    attempts: attemptSlice,
    accounts: accountSlice,
    notifications: notificationSlice,
    settings: settingsSlice
}
export const store = configureStore({
    reducer: reducer,
    devTools: true
});
