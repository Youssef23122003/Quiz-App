export const validation = {
  login: {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  },

  register: {
    firstNameValidation: {
      required: "Firstname is required",
    },
    lastNameValidation: {
      required: "Lastname is required",
    },
    roleValidation: {
      required: "Role is required",
    },
  },

  resetPassword: {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    otp: {
      required: "OTP is required",
      minLength: {
        value: 4,
        message: "OTP must be at least 4 characters",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  },
};



export const quizValidation = {
  title: {
    required: "Title is required",
    minLength: {
      value: 3,
      message: "Title must be at least 3 characters",
    },
    maxLength: {
      value: 100,
      message: "Title must be less than 100 characters",
    },
  },

  duration: {
    required: "Duration is required",
  },

  numberOfQuestions: {
    required: "Number of questions is required",
  },

  scorePerQuestion: {
    required: "Score per question is required",
  },

  description: {
    maxLength: {
      value: 500,
      message: "Description must be less than 500 characters",
    },
  },

  scheduleDate: {
    required: "Schedule date is required",
  },

  scheduleTime: {
    required: "Schedule time is required",
  },

  groupName: {
    required: "Group is required",
  },
};


// src/validations/questionValidations.ts
export const questionValidation = {
  title: {
    required: "Title is required",
    minLength: {
      value: 3,
      message: "Title must be at least 3 characters",
    },
    maxLength: {
      value: 200,
      message: "Title must be less than 200 characters",
    },
  },

  description: {
    maxLength: {
      value: 1000,
      message: "Description must be less than 1000 characters",
    },
  },

  options: {
    A: {
      required: "Option A is required",
      maxLength: {
        value: 200,
        message: "Option A must be less than 200 characters",
      },
    },
    B: {
      required: "Option B is required",
      maxLength: {
        value: 200,
        message: "Option B must be less than 200 characters",
      },
    },
    C: {
      required: "Option C is required",
      maxLength: {
        value: 200,
        message: "Option C must be less than 200 characters",
      },
    },
    D: {
      required: "Option D is required",
      maxLength: {
        value: 200,
        message: "Option D must be less than 200 characters",
      },
    },
  },

  answer: {
    required: "Right answer is required",
  },
};
