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
  signInWithPopup
} from "../app.js";

const auth = getAuth();


document.getElementById('signinGoogle').addEventListener('click', () => {
  Swal.showLoading()
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.href = '../home/home.html';
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        // title: 'Please! check your email.',
        title: `${error}`,
        showConfirmButton: true,
      })
    });
})

document.getElementById('signin').addEventListener('click', () => {
  Swal.showLoading()
  let email = document.getElementById('email')?.value;
  let password = document.getElementById('password')?.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      window.location.href = '../home/home.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // alert('Invalid email or password!', errorCode, errorMessage)
      Swal.fire({
        icon: 'error',
        // title: 'Please! check your email.',
        title: 'Invalid email or Password',
        showConfirmButton: true,
      })
    });
})