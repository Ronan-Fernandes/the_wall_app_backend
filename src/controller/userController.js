const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");
const sendEmail = require("../service/sendEmail");
const { generateToken } = require("../service/jwtAuth");

const GENERATED_SALT = bcrypt.genSaltSync(10);

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userModel.findUser({ email });

    if (userExists) {
      return res.status(409).json({
        error: "User already exists!",
      });
    }

    await userModel.createNewUser({
      name,
      email,
      password: bcrypt.hashSync(password, GENERATED_SALT),
    });

    await sendEmail(email, name);

    return res.status(201).json({
      message: "User registred with success!",
    });
  } catch (error) {
    return res.status(500).json({
      error: `Something whent wrong erro: ${error}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUser({ email });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, wrong email or password",
      });
    }

    const authUser = await bcrypt.compare(password, user.password);

    if (!authUser) {
      return res.status(401).json({
        message: "Unauthorized, wrong email or password",
      });
    }

    const userInfo = {
      userId: user._id,
      name: user.name,
    };

    const token = generateToken(userInfo);

    return res.status(200).json({ token, ...userInfo });
  } catch (error) {
    return res.status(500).json({
      error: `Something whent wrong erro: ${error}`,
    });
  }
};

module.exports = {
  createUser,
  login,
};
