const userModel = require('../model/userModel');
const sendEmail = require('../service/sendEmail');

const createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    
    const userExists = await userModel.findUser({ email });
    
    if (userExists) return res.status(409).json({
      error: "User already exists!"
    });
    
    await userModel.createNewUser({
      name,
      email,
      password
    });

    await sendEmail(email, name);

    res.status(201).json({
      message: "User registred with success!"
    });
  } catch (error) {
    res.status(500).json({
      "error": `Something whent wrong erro: ${error}`
    })
  }
};

module.exports = {
  createUser
};
