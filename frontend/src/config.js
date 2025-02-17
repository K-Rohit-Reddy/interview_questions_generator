const config = {
  api: {
    baseUrl: 'https://interviewquestionsgenerator-production.up.railway.app',
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/signup'
      },
      questions: {
        generate: '/questions/generate_questions'
      },
      report: {
        get: '/report'
      },
      history: {
        get: '/history'
      },
      feedback:{
        submit:'/feedback/submit'
      }
    }
  }
};

export default config;
