import instance from "../config/AxiosConfig";

export const getAllTests = async (params) => {
    const URL = `/api/v1/test/all?${params}`;
    const response = await instance.get(URL);
    return response;
}
export const getOneTest = async (id) => {
    const URL = `/api/v1/test/${id}`;
    const response = await instance.get(URL);
    return response;
}
export const addTest = async (test) => {
    const URL = `/api/v1/test/add`;
    const response = await instance.post(URL, test);
    if (response.status === 500) {
        alert("failed to create test");
        console.log("failed to create test");
    }
    return response;
}
export const updateTest = async (id, updateTest) => {
    const URL = `/api/v1/test/update/${id}`;
    const response = await instance.put(URL, updateTest);
    return response;
}
export const deleteTest = async (id) => {
    const URL = `/api/v1/test/delete/${id}`;
    const response = await instance.delete(URL);
    return response;
}

//crud question
export const getAllQuestions = async () => {
    const URL = "/question/all";
    const response = await instance.get(URL);
    return response;
}
export const getOneQuestion = async (id) => {
    const URL = `/api/v1/question/${id}`;
    const response = await instance.get(URL);
    return response;
}
export const addQuestion = async (question) => {
    const URL = `/api/v1/question/add`;
    const response = await instance.post(URL, question);
    if (response.status === 500) {
        alert("failed to create question");
        console.log("failed to create question");
    }
    return response;
}
export const updateQuestion = async (id, updateQuestion) => {
    const URL = `/api/v1/question/update/${id}`;
    const response = await instance.put(URL, updateQuestion);
    return response;
}
export const deleteQuestion = async (id) => {
    const URL = `/api/v1/question/delete/${id}`;
    const response = await instance.delete(URL);
    return response;
}
export const addMultipleQuestions = async (questionList) => {
    const URL = `/api/v1/question/bulk`;
    const response = await instance.post(URL, questionList);
    return response;
}
export const getAllQuestionForTest = async (testId) => {
    const URL = `/api/v1/question/all/${testId}`;
    const response = await instance.get(URL, testId);
    return response;
}
//crud media resource
export const getAllResource = async () => {
    const URL = "/resource/all";
    const response = await instance.get(URL);
    return response;
}
export const getOneResource = async (id) => {
    const URL = `/api/v1/resource/${id}`;
    const response = await instance.get(URL);
    return response;
}
export const addResource = async (resource) => {
    const URL = `/api/v1/resource/add`;
    const response = await instance.post(URL, resource);
    if (response.status === 500) {
        alert("failed to create resource");
        console.log("failed to create resource");
    }
    return response;
}
export const updateResource = async (resourceContent, updateResource) => {
    const URL = `/api/v1/resource/update/${resourceContent}`;
    const response = await instance.put(URL, updateResource);
    return response;
}
export const deleteResource = async (id) => {
    const URL = `/api/v1/resource/delete/${id}`;
    const response = await instance.delete(URL);
    return response;
}

// crud for answer
export const getAllAnswers = async () => {
    const URL = "/answer/all";
    const response = await instance.get(URL);
    return response;
}
export const getOneAnswer = async (id) => {
    const URL = `/api/v1/answer/${id}`;
    const response = await instance.get(URL);
    return response;
}
export const addAnswer = async (answer) => {
    const URL = `/api/v1/answer/add`;
    const response = await instance.post(URL, answer);
    if (response.status === 500) {
        alert("failed to create answer");
        console.log("failed to create answer");
    }
    return response;
}
export const updateAnswer = async (id, updateAnswer) => {
    const URL = `/api/v1/answer/update/${id}`;
    const response = await instance.put(URL, updateAnswer);
    return response;
}
export const deleteAnswer = async (id) => {
    const URL = `/api/v1/answer/delete/${id}`;
    const response = await instance.delete(URL);
    return response;
}

export const addMultipleAnswers = async (answerList) => {
    const URL = `/api/v1/answer/bulk`;
    const response = await instance.post(URL);
    return response;
}
