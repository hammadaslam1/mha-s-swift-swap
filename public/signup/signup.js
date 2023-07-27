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
} from "../app.js";



const auth = getAuth();

document.getElementById('signupGoogle').addEventListener('click', () => {
  Swal.showLoading()
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.href = '../home/home.html';
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        // title: 'Please! check your password.',
        title: `Something went wrong! ${error}`,
        showConfirmButton: true,
      })
    });
})



function profileinfo(Name, Email, Phone, DOB, Gender, Address, ProfileUrl) {
  const addRef = ref(database, auth.currentUser.uid + "/UserProfile");
  const myAddress = push(addRef, { Name, Email, Phone, DOB: JSON.stringify(DOB), Gender, Address, ProfileUrl })
    .then(() => {
      Swal.fire(
        'Great!',
        'The account has been created!',
        'success',
        1500
      )

      window.location.href = '../home/home.html';

    })

}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById('DOB').setAttribute("max", today);

const pictures = document.getElementById('profilePic');
pictures.images = [];

document.getElementById('signup').addEventListener('click', () => {
  Swal.showLoading()
  const name = document.getElementById('name').value;
  const userEmail = document.getElementById('email').value;
  const userPhone = document.getElementById('phone').value;
  const userDOB = document.getElementById('DOB').value;
  const userGender = document.getElementById('gender').value;
  const userAddress = document.getElementById('address').value;
  const userPassword = document.getElementById('password').value;

  if (pictures.files.length >= 1) {

    const img = pictures.files;

    const file = img[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      pictures.images.push(imageUrl)
    }
    reader.readAsBinaryString(file);
  }


  if (name != '' && userEmail != '' && userPhone != '' && userDOB != '' && userGender != '' && userAddress != '' && userPassword != '' && pictures.images != '') {



    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        signInWithEmailAndPassword(auth, userEmail, userPassword)
          .then((userCredential) => {
            const user = userCredential.user;
            profileinfo(name, userEmail, userPhone, userDOB, userGender, userAddress, pictures.images)
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error, "CREATE_USER_EMAIL")
        if (userPassword.length < 6) {
          Swal.fire({
            icon: 'error',
            // title: 'Please! check your password.',
            title: 'Password must be atleast 6 characters',
            showConfirmButton: true,
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            // title: 'Please! check your email.',
            title: 'Invalid email',
            showConfirmButton: true,
          })
        }
      });
  } else {
    Swal.fire({
      // position: 'top-end',
      icon: 'error',
      title: 'Please! Fill all fields carefully',
      // title: `name is missing`,
      showConfirmButton: false,
      timer: 2000
    })
  }
});