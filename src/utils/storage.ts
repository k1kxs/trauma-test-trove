interface TestResult {
  fullName: string;
  groupNumber: string;
  section: string;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
}

export const saveUserData = (fullName: string, groupNumber: string) => {
  localStorage.setItem('userData', JSON.stringify({ fullName, groupNumber }));
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const saveTestResult = (result: TestResult) => {
  const results = getTestResults();
  results.push(result);
  localStorage.setItem('testResults', JSON.stringify(results));
};

export const getTestResults = (): TestResult[] => {
  const results = localStorage.getItem('testResults');
  return results ? JSON.parse(results) : [];
};

export const clearAllData = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('testResults');
};