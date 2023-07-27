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
const users = auth.currentUser;
// Get the dropdown button and dropdown menu elements
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

let userName = '';
let userEmail = '';
let userPhone = '';
let userDOB = '';
let userGender = '';
let userAddress = '';
let userImage = [];




onAuthStateChanged(auth, (users) => {
  if (users) {
    Swal.showLoading()
    const accName = document.createElement('span');
    dropdownButton.appendChild(accName);
    accName.className = 'self-center mr-[13px] font-semibold max-[930px]:hidden';
    document.getElementById('signinDiv').style.display = 'none';

    const valSnap = ((snapshot) => {
      const data = snapshot.val();
      const objList = [];
      for (let objId of Object.keys(data || {})) {
        const obj = data[objId]
        objList.push({ ...obj, key: objId })
      }
      document.getElementById('main').innerHTML = ''
      const el = `
      <div class="p-2 border-2 my-10 border-rose-500 rounded-lg mx-auto w-[370px] md:w-[650px] lg:w-[850px] xl:w-[1000px] " id="profileData">
      
      </div>
      `
      document.getElementById('main').innerHTML = el

      for (const obj of objList) {
        accName.textContent = obj.Name;
        document.getElementById('accName').textContent = obj.Name;
        userName = obj.Name;
        userEmail = obj.Email;
        userPhone = obj.Phone;
        userDOB = obj.DOB;
        userGender = obj.Gender;
        userAddress = obj.Address;
        // userImage.push(obj.ProfileUrl[0]?obj.ProfileUrl[0]:'a');
        const element = `
        <div class=" p-2 flex border-b border-rose-500">
        <div class=" p-2 flex-[5] border-r border-rose-500">
        <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Name:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Name ? obj.Name : ''}</div></div>
        <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">DOB:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.DOB ? obj.DOB : ''}</div></div>
        <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Gender:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Gender ? obj.Gender : ''}</div></div>
        </div>
        <div class="p-2 flex-[3] flex justify-center" id="profilePic">
        <img src="data:image/jpeg;base64,${btoa(obj.ProfileUrl[0])?btoa(obj.ProfileUrl[0]):''}" alt="" class="w-56 mx-auto">
        </div>
        </div>
        <div class=" p-2 flex border-b border-rose-500">
        <div class=" p-2 flex-[5] ">
        <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Contact Information:
        <div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Phone ? obj.Phone : ''}</div>
        <div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Email ? obj.Email : ''}</div>
        </div>
        </div>
        </div>
        <div class=" p-2 flex">
        <div class=" p-2 flex-[5] ">
        <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Address:
        <div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Address ? obj.Address : ''}</div>
        </div>
        </div>
        </div>
        `
        document.getElementById('profileData').innerHTML = element;
      }
      swal.close()
    })
    let addRef = ref(database, auth.currentUser.uid + "/UserProfile");
    const myAddress = onValue(addRef, valSnap)


  } else {
    window.location.href = '../signin/signin.html';
  }
})







document.getElementById('home').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../home/home.html';
})

document.getElementById('Homes').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../home/home.html';
})

document.getElementById('message').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../messages/messages.html';
})
document.getElementById('messages').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../messages/messages.html';
})

document.getElementById('seller').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../seller/seller.html';
})
document.getElementById('sellers').addEventListener('click', () => {
  swal.showLoading()
  window.location.href = '../seller/seller.html';
})

document.getElementById('signout').addEventListener('click', () => {
  swal.showLoading()
  signOut(auth).then(() => {
    window.location.href = '../signin/signin.html';

  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: `Signing out failed ${error}`,
      showConfirmButton: true
    })
  })
})
// console.log(auth.currentUser);



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

