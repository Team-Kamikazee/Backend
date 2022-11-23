import isNil from 'lodash/isNil';
import StudentResults from '../models/studentResults';
import User from '../models/userModel';

export const getAllStudentResults = async (req, res) => {
  try {
    const { studentUUID } = req.params;

    const studentResults = await StudentResults.find({
      studentUUID,
    });

    if (studentResults)
      return res.status(200).json({
        results: studentResults,
      });

    return res.status(404).json({
      message: 'Student results not found',
      success: false,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const getClassYearResults = async (req, res) => {
  try {
    const { studentUUID, schoolYear } = req.params;

    const studentResults = await StudentResults.findOne({
      studentUUID,
    });

    if (studentResults && studentResults.results) {
      return res.status(200).json(studentResults.results.get(schoolYear));
    }
    return res.status(404).json({
      message: 'Student results not found',
      success: false,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const getTermResults = async (req, res) => {
  try {
    const { studentUUID, schoolYear, term } = req.params;

    const studentResults = await StudentResults.findOne({
      studentUUID,
    });

    if (studentResults && studentResults.results) {
      return res.status(200).json(studentResults.results.get(schoolYear)[term]);
    }
    return res.status(404).json({
      message: 'Student results not found',
      success: false,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const addStudentResults = async (req, res) => {
  try {
    const { studentUUID } = req.params;
    const results = req.body;

    // confirm student exists
    const student = await User.findOne({
      studentUUID,
    });

    if (isNil(student))
      return res.status(404).json({
        message: 'Student not found',
        success: false,
      });

    // confirm student results exist, else create
    const studentResults =
      (await StudentResults.findOne({
        studentUUID,
      })) || new StudentResults({ studentUUID, results: {} });

    const newResults = {};
    // iterate through school years
    Object.keys(results).forEach((year) => {
      const schoolYear = results[year];

      // Iterate through school year terms
      Object.keys(schoolYear).map((term) => {
        const classTerm = schoolYear[term];

        if (isNil(newResults[year])) {
          newResults[year.toString()] = {};
        }

        const termResults = studentResults.results[year]
          ? studentResults.results[year][term]
          : {};

        const updatedResults = {
          ...studentResults.results[year.toString()],
          [term.toString()]: {
            ...(termResults || {}),
            ...classTerm,
          },
        };

        Object.assign(newResults[year], updatedResults);
      });
    });

    studentResults.results = newResults;
    await studentResults.save();

    return res.status(201).json({
      message: 'Student results added successfully',
      results: studentResults.results,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
