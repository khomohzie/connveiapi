import preSignup from "./handlers/presignup.handler";
import signup from "./handlers/signup.handler";
import signin from "./handlers/signin.handler";
import signout from "./handlers/signout.handler";
import { forgotPassword, resetPassword } from "./handlers/reset.handler";
import googleLogin from "./handlers/google.handler";

export {
  preSignup,
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  googleLogin,
};
