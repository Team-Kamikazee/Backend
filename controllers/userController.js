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
    const { name, email, password, passwordConfirm, gender, role, age } =
      req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      uuid: uuid4(),
      email,
      role,
      age,
      gender,
      password: hash,
      passwordConfirm: hash,
    });

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
