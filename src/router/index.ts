import { createRouter } from './createRouter'
import { signUp, signIn, signOut } from '../resolvers/Mutations/index'
import { all } from '../resolvers/Querys/index'
export const appRouter = createRouter().merge('users.', all)
// .merge('user.', signUp)
// .merge('user.', signIn)
// .merge('user.', signOut)
