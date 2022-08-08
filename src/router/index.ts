import { createRouter } from './createRouter'
import { signIn } from '../UserController/SignIn'
import { signUp } from '../UserController/SignUp'
import signOut from '../UserController/SingOut'
import allUsers from '../UserController/Users'
export const appRouter = createRouter()
    .merge('user.', signIn)
    .merge('user.', signUp)
    .merge('other.', signOut)
    .merge('users.', allUsers)
