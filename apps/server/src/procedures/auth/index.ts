import { router } from "../../server.js";
import { codes } from "./codes.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { reset } from "./reset.js";
import { signup } from "./signup.js";
import { validate } from "./validate.js";

export const auth = router({
    signup,
    codes,
    login,
    logout,
    reset,
    validate,
});
