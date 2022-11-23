import mongoose from 'mongoose';

const StudentResults = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  studentUUID: {
    type: String,
    unique: true,
  },
  results: {
    type: Map,
  },
});

/*
results: {
    CLASS_ONE: {
        MIDTERM_1: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        }, 
        QUIZ_1: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        },
        TERMINAL: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        },
        ANNUAL: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        }
    },
    SECOND_CLASS: {
        MIDTERM_1: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        }, 
        QUIZ_1: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        },
        TERMINAL: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        },
        ANNUAL: {
            MATHS: 20
            HINDI: 30,
            SOCIAL_SCIENCE: 40
        }
    }
}
*/

const Results = mongoose.model('StudentResults', StudentResults);

export default Results;
