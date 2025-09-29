import { configureStore } from "@reduxjs/toolkit";
import testReducer from "../slice/tests"
import questionReducer from "../slice/questions";
import answerReducer from "../slice/answers";
import fileReducer from "../slice/files";
import resourceReducer from "../slice/resource";
const reducer = {
    tests: testReducer,
    questions: questionReducer,
    answers: answerReducer,
    file: fileReducer,
    resource: resourceReducer,
}
export const store = configureStore({
    reducer: reducer,
    devTools: true
});
