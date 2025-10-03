export const selectMergedTests = (state) => {
  const { tests = [] } = state.tests;
  const { attempts = [] } = state.attempts;

  console.log("this attempts", attempts);
  console.log("this result", tests);



  return tests.map(test => {
    const found = attempts.find(a => a.quizId === test.id);
    return found ? { ...test, finish: true } : test;
  });
};
