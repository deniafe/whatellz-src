import { auth, db } from '@/plugins/firebase'
import notific from '@/utils/notificFunc'
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => {
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_USER_MEMBERSHIP(state, membership) {
      state.user.membership = membership
    },
    SET_IS_AUTHENTICATED(state, status) {
      state.isAuthenticated = status
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_FEEDBACK(state, msg) {
      state.feedback = msg
    },
    SET_ERROR(state, status) {
      state.error = status
    },
    SET_SHOW_RESET_NOTIFICATION(state, status) {
      state.showResetNotification = status
    },
    SET_PASSWORD_RESET_NOTIFICATION(state, message) {
      state.passwordResetNotification = message
    },
  },
  actions: {
    userAuth({ commit, dispatch }, form) {
      let authenticateUser
      commit('SET_LOADING', true)
      if (form.state === 'Sign Up') {
        authenticateUser = auth.createUserWithEmailAndPassword(
          form.email,
          form.password,
        )
      } else if (form.state === 'Log In') {
        authenticateUser = auth.signInWithEmailAndPassword(
          form.email,
          form.password,
        )
      }
      commit('SET_FEEDBACK', '')

      authenticateUser
        .then((cred) => {
          if (form.state === 'Sign Up') {
            cred.user.sendEmailVerification()
          }
          const email = cred.user.email
          const id = cred.user.uid
          const verified = cred.user.emailVerified
          commit('SET_USER', {
            email,
            id,
            verified,
          })
          commit('SET_IS_AUTHENTICATED', true)
          commit('SET_LOADING', false)
          router.push({
            name: 'dashboard',
          })
        })
        .catch((error) => {
          commit('SET_LOADING', false)
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false,
          })
        })

      // authenticateUser
      //   .then((cred) => {
      //     if (form.state === 'Sign Up') {
      //       cred.user.sendEmailVerification()
      //       // After creating a new bot. Add a new skill to it
      //       db.collection('users')
      //         .doc(cred.user.uid)
      //         .set({ email: cred.user.email })
      //         .then(() => {
      //           const email = cred.user.email
      //           const id = cred.user.uid
      //           const verified = cred.user.emailVerified
      //           commit('SET_USER', {
      //             email,
      //             id,
      //             verified,
      //           })
      //           commit('SET_IS_AUTHENTICATED', true)
      //           commit('SET_LOADING', false)
      //           router.push({
      //             name: 'dashboard',
      //           })
      //         })
      //         .catch((error) => {
      //           // Handle any errors
      //           notific({
      //             dispatch,
      //             error,
      //             type: false,
      //           })
      //         })
      //       return
      //     }
      //     const email = cred.user.email
      //     const id = cred.user.uid
      //     const verified = cred.user.emailVerified
      //     commit('SET_USER', {
      //       email,
      //       id,
      //       verified,
      //     })
      //     commit('SET_IS_AUTHENTICATED', true)
      //     commit('SET_LOADING', false)
      //     router.push({
      //       name: 'dashboard',
      //     })
      //   })
      //   .catch((error) => {
      //     commit('SET_LOADING', false)
      //     // Handle any errors
      //     notific({
      //       dispatch,
      //       error,
      //       type: false,
      //     })
      //   })
    },
    checkAuth({ state, commit }, url) {
      // Check if a user is currently registered in the store
      if (state.user) {
        return state.user
      } else {
        // If not check if a user is signed in with firebase
        // If there is, store the user details
        // Then route the person to dashboard if the person is trying to go to page auth or rest password
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            commit('SET_USER', {
              email: user.email,
              id: user.uid,
              verified: user.emailVerified,
            })
            if (url === 'auth' || url === 'reset-pw') {
              router.push({
                name: 'dashboard',
              })
            }
            // If there is no user, make sure the person can only access auth and reset password
          } else if (!user) {
            if (url === 'reset-pw') {
              router.push({
                name: 'reset-pw',
              })
            } else {
              router.push({
                name: 'auth',
              })
            }
          }
        })
      }
    },
    async checkMembership({ commit }, id) {
      console.log('CheckMembership is running in store.js')
      const doc = await db.collection('users').doc(id).get()
      let membership
      if (doc.exists) {
        console.log('CheckMembership: doc does exists')
        membership = doc.data().membership
        console.log('Membership: ', membership)
      }
      commit('SET_USER_MEMBERSHIP', membership)
    },
    sendVerificationEmail({ dispatch }) {
      // eslint-disable-next-line no-console
      auth.currentUser
        .sendEmailVerification()
        .then(() => {
          notific({
            dispatch,
            message: 'Email verification sent',
            type: true,
          })
        })
        .catch((error) => {
          notific({
            dispatch,
            error,
            type: false,
          })
        })
    },
    signOut({ commit }) {
      auth.signOut().then(() => {
        commit('SET_USER', null)
        router.push({
          name: 'auth',
        })
      })
    },
    resetPassword({ dispatch }, email) {
      auth
        .sendPasswordResetEmail(email)
        .then(function () {
          // Handle any errors
          notific({
            dispatch,
            message:
              'Email sent successfully. Check your email inbox to reset your password',
            type: true,
          })
        })
        .catch(function (error) {
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false,
          })
        })
    },
  },
  getters: {
    user: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    loading: (state) => state.loading,
  },
}
