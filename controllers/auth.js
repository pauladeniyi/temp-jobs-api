const { BadRequestError } = require("../errors/bad-request");
const {} = require("../errors/unauthenticated");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const UnauthenticatedError = require("../errors/unauthenticated");

const register = async (req, res) => {
  // const { name, email, password } = req.body;

  // const salt = await bcryptjs.genSalt(10);

  // const hashedPassword = await bcryptjs.hash(password, salt);
  // const tempUser = { name, email, password: hashedPassword };

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const checkedPassword = await user.comparePassword(password);

  if (!checkedPassword) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
