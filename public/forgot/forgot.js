import {
    app,
    database,
    ref,
    set,
    update,
    remove,
    onValue,
    push,
    child,
    orderByChild,
    onChildAdded,
    query,
    startAt,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
  } from "../app.js";
   

  
  
  document.getElementById('reset').addEventListener('click', () => {
      const auth = getAuth();
      const email = document.getElementById('email').value;
    sendPasswordResetEmail(auth, email)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: `Password reset link sent to ${email}`,
        showConfirmButton: true
      })
      window.location.href = '../signin/signin.html'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: `User not found`,
        showConfirmButton: true
      })
      
    });
  })