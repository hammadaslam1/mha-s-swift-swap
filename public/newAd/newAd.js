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
  // getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signOut
} from "../app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const auth = getAuth()

const user = auth.currentUser;
let uId = "";

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

onAuthStateChanged(auth, (user) => {
  Swal.showLoading()
  const accName = document.createElement('span');
  dropdownButton.appendChild(accName);
  if (user) {
    uId = user.uid
    let userRef = ref(database, uId + "/myAds");
    const accName = document.createElement('span');
    accName.className = 'font-semibold'
    dropdownButton.appendChild(accName);
    const nameRef = ref(database, auth.currentUser.uid + "/UserProfile");

    const nameSnap = ((snapshot) => {
      const objList = []
      const nameData = snapshot.val();
      for (let nameId of Object.keys(nameData || {})) {
        const obj = nameData[nameId]
        objList.push({ ...obj, key: nameId })
      }
      for (const obj of objList) {
        accName.textContent = obj.Name;

      }
    })
    onValue(nameRef, nameSnap);
    // onValue(userRef, valSnap)allAds
  }
  else {
    window.location.href = '../signin/signin.html'
  }
  Swal.close()
})



document.getElementById('profile').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../profile/profile.html';
})
document.getElementById('home').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../home/home.html';
})

document.getElementById('message').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../messages/messages.html';
})
document.getElementById('messages').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../messages/messages.html';
})


document.getElementById('seller').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../seller/seller.html';
})
document.getElementById('sellers').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../seller/seller.html';
})

document.getElementById('signout').addEventListener('click', () => {
  Swal.showLoading()
  signOut(auth).then(() => {
    window.location.href = '../signin/signin.html';

  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: `Signing out failed: ${error}`,
      showConfirmButton: true
    })
  })
})

const category = document.getElementById('category');
category.addEventListener('change', () => {
  const categories = category.value;

})

// account dropdown
dropdownButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

window.addEventListener("click", (event) => {
  if (!event.target.matches(".dropdownbtn")) {
    dropdownMenu.classList.remove("show");
  }
});

const dropdownItems = document.getElementsByClassName("accountItems");
for (const item of dropdownItems) {
  item.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
  });
}


// pictures

let pictures = document.getElementById('pictures');
pictures.images = []
let files;
pictures.addEventListener('change', () => {
  files = pictures.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;
      const pics = document.createElement('div');
      pics.className = 'p-1 rounded-lg ';
      let image = document.createElement('img');
      image.className = 'max-h-[120px] mx-auto w-auto '
      image.src = 'data:image/jpeg;base64,' + btoa(imageUrl);
      pics.appendChild(image);
      pictures.images.push(imageUrl)
      document.getElementById('pics').appendChild(pics);
    }
    reader.readAsBinaryString(file);
  }
})

const publish = document.getElementById('publish');


publish.addEventListener('click', () => {
  Swal.showLoading()
  const title = document.getElementById('title').value;
  const brand = document.getElementById('brand').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const address = document.getElementById('address').value;
  let photo = document.getElementById('pictures');
  let time = new Date().getTime();
  if (title !== '' && description.files !== '' && price !== '' && brand !== '' && photo.images.length >= 1 && category.value != '' && address != '') {
    const publishRef = ref(database, uId + "/myAds");
    const nameRef = ref(database, auth.currentUser.uid + "/UserProfile");
    let userName;
    const valSnap = ((snapshot) => {
      const data = snapshot.val();
      const objList = [];
      for (const nameid of Object.keys(data || {})) {
        const obj = data[nameid];
        objList.push({ ...obj, key: nameid })
      }
      for (const obj of objList) {
        userName = obj.Name;
      }
      publishAd(publishRef, auth.currentUser.uid, userName, auth.currentUser.email, title, category.value, brand, price, description, photo.images, time, address)
    })
    onValue(nameRef, valSnap)
  }
  else {
    Swal.fire({
      icon: 'error',
      title: 'Fill all fields!',
      showConfirmButton: true
    })
  }
})

function publishAd(publishRef, UserID, Name, Email, Title, Categories, Brand, Price, Description, Files, time, Address) {
  const myAds = push(publishRef, { UserID, Name, Email, Title, Categories, Brand, Price, Description, Files, time })
  const allRef = ref(database, "allAds");
  const allAds = push(allRef, { UserID, Name, Email, Title, Categories, Brand, Price, Description, Files, time, Address })
    .then(e => {
      Swal.fire({
        icon: 'success',
        title: 'Ad published successfully',
        showConfirmButton: true,
        timer: 5000
      })
      window.location.href = '../seller/seller.html'

    }).catch(er => {
      Swal.fire({
        icon: 'error',
        title: `Error: ${er}`,
        showConfirmButton: true
      })
    })
}