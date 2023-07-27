import {
  database,
  ref,
  onValue,
} from "../app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
const auth = getAuth()
const user = auth.currentUser;
let uId;
onAuthStateChanged(auth, (user) => {
  Swal.showLoading()
  const accName = document.createElement('span');
  dropdownButton.appendChild(accName);
  if (user) {
    uId = user.uid
    let myAds = ref(database, "allAds");
    onValue(myAds, valSnap);
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
  } else {
    window.location.href = '../signin/signin.html'
  }
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
document.getElementById('signout').addEventListener('click', () => {
  Swal.showLoading()
  signOut(auth).then(() => {
    window.location.href = '../signin/signin.html';
  })
})

//account dropdown

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

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

// add new ad

document.getElementById('newAd').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../newAd/newAd.html';
})

//my ads

function details(key) {
  // const recordsRef = ref(database, "allAds");
  const recordId = key;
  window.location.href = `../details/details.html?recordId=${recordId}`
}

const valSnap = ((snapshot) => {
  // document.getElementById('catTitle').innerHTML = 'All Categories';
  document.getElementById('adList').innerHTML = ''
  const data = snapshot.val();
  const objList = [];
  for (let objId of Object.keys(data || {})) {
    const obj = data[objId]
    objList.push({ ...obj, key: objId })
  }
  objList.sort((a, b) => b.time - a.time)

  for (let obj of objList) {
    if (obj.UserID === auth.currentUser.uid) {
      let currentDate = new Date();
      let targetDate = obj.time;
      let differenceMs = currentDate.getTime() - targetDate;
      let days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      let element = `
      <div class="flex flex-col  bg-rose-100  ">
      <div class="flex-3 h-[210px]">
      <img src= "data:image/jpeg;base64,${btoa(obj.Files[0])}" class="h-[100%] w-[100%]">
      </div>
      <div class="flex-1 p-1">
      <div class="flex justify-between p-1 my-2">
      <span class="text-rose-500 text-lg font-semibold">Rs ${obj.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
      <button id="viewDetails${targetDate}" class="bg-rose-400 rounded-lg p-[5px] text-rose-50 hover:bg-rose-500 active:bg-rose-600 focus:outline-none duration-300 hover:text-rose-50 details-button" data-key="${obj.key}" >View Details</button>
      </div>
      <div class="mt-auto">
      <p class="text-rose-400 text-xl my-2 font-semibold">${obj.Brand}</p>
      <p class="text-rose-400 text-xl my-2">${obj.Description}</p>
      <p class="text-rose-400 text-xl my-2">${obj.Address ? obj.Address : ''}</p>
      <p class="text-rose-400 my-2">${days} days ago</p>
      </div>
      </div>
      </div>
      
      `
      // htmlContent+=element
      if (!obj.sold) {
        document.getElementById('adList').innerHTML += element
      }
      if (obj.request) {
        if (!obj.sold) {
          document.getElementById('request').innerHTML += element
        }
      }
      // if(obj.sold){
      //   document.getElementById(`viewDetails${targetDate}`).textContent = 'Sold';
      //   document.getElementById(`viewDetails${targetDate}`).disabled = 'true';
      //   document.getElementById(`viewDetails${targetDate}`).style.backgroundColor = 'gray'
      // }
    }
  }
  document.getElementById('adList').addEventListener('click', (event) => {
    if (event.target.classList.contains('details-button')) {
      const key = event.target.dataset.key;
      details(key);
    }
  });
  document.getElementById('request').addEventListener('click', (event) => {
    if (event.target.classList.contains('details-button')) {
      const key = event.target.dataset.key;
      details(key);
    }
  });
  Swal.close()
})
  // console.log(auth);