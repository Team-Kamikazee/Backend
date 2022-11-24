import User from '../models/userModel';
import uuid4 from 'uuid4';
import bcrypt from 'bcrypt';
import isNil from 'lodash/isNil';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({
        message: 'Not Found, Add some',
      });
    }

    return res.status(200).json({
      message: 'success',
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// As a school admin, I should be able to register new teachers
export const addUser = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, gender, role, dob } =
      req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      uuid: uuid4(),
      email,
      role,
      dob,
      gender,
      password: hash,
      passwordConfirm: hash,
    };

    if (role === 'STUDENT') {
      newUser.sponsorship = req.body.sponsorship || 'SELF';
      newUser.familyAnnualIncome = req.body.familyAnnualIncome;
      newUser.disability = req.body.disability;
      newUser.siblings = req.body.siblings;
      newUser.distance = req.body.distance;
      newUser.transportFacility = req.body.transportFacility;
      newUser.toiletFacility = req.body.toiletFacility;
      newUser.drinkingWater = req.body.drinkingWater;
      newUser.pregnancy = req.body.pregnancy;
    }

    const user = await User.create(newUser);

    // TODO: if user is a student, assign to a class
    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isNil(email) || isNil(password))
      return res.status(400).json({
        message: 'Please provide email and password',
        success: false,
      });

    // check if user with this email exists
    const user = await User.findOne({
      email,
    });

    if (isNil(user))
      return res.status(404).json({
        message: "This user doesn't exist",
        success: false,
      });

    // check if password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Passwords don't match",
        success: false,
      });
    }

    const { password: pwd, ...rest } = user._doc;

    const token = jwt.sign(
      { _id: rest._id, uuid: rest.uuid, role: rest.role },
      'secret'
    );

    return res.status(200).json({
      user: rest,
      token,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { studentUUID } = req.params;

    const student = await User.findOne({
      uuid: studentUUID,
    });

    if (isNil(student))
      return res.status(404).json({
        message: "This student doesn't exist",
        success: false,
      });

    let count = 0;

    if (student.gender === 'MALE') count += 1;
    else count += 2;

    if (student.disability === 'true') count += 5;

    if (student.familyIncome > 200000) count += 4;

    if (student.scholarship === 'SELF') count += 2;
    if (student.scholarship === 'GOVERNMENT') count += 1.5;
    if (student.scholarship === 'OTHER') count += 1.5;

    if (student.transportFacility === 'true') count += 1.5;

    if (student.transportFacility === 'false') count += 5;

    if (student.siblings > 2) count += 2;

    if (student.toiletFacility === 'true') count += 1.5;
    else count += 5;

    if (student.distance > 10) count += 5;
    else count += 1.5;

    if (student.pregnancy === 'true') count += 5;
    else count += 1.5;

    const dropOutIndex = (count / 46) * 100;

    const { password, passwordConfirm, ...rest } = student._doc;

    return res.status(200).json({
      message: 'success',
      student: {
        ...rest,
        dropOutIndex,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// get any user by uuid, role or id passed on search query
export const searchUser = async (req, res) => {
  try {
    const { uuid, role, id } = req.query;

    if (uuid) {
      const user = await User.findOne({
        uuid,
      });

      if (user)
        return res.status(200).json({
          user,
        });

      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (role) {
      const users = await User.find({
        role,
      });

      if (users)
        return res.status(200).json({
          users,
        });

      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (id) {
      const user = await User.findOne({
        _id: id,
      });

      if (user)
        return res.status(200).json({
          user,
        });

      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    return res.status(400).json({
      message: 'Please provide a search query',
      success: false,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
