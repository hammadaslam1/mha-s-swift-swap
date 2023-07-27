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
//   const recordKey = recordId;
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

let username;

const urlParams = new URLSearchParams(window.location.search);
const recordId = urlParams.get('recordId');
const valSnap = ((snapshot) => {
  const data = snapshot.val();
  const objList = [];
  for (let objId of Object.keys(data || {})) {
    const obj = data[objId]
    objList.push({ ...obj, key: objId })

    if (obj === data[recordId]) {
      const nameRef = ref(database, obj.UserID + "/UserProfile");
      const nameSnap = ((snapshot) => {
        const namedata = snapshot.val();
        const list = []
        for (let i of Object.keys(namedata || {})) {
          const object = namedata[i]
          list.push({ ...object, key: i })
        }
        for (let n of list) {
          username = n.Name;
        }
      })
      onValue(nameRef, nameSnap)
      const element = `
      <div class=" flex flex-col m-3  rounded-lg">
      
      <div class="mx-auto mb-6">
      <img src="data:image/jpeg;base64,${btoa(obj.Files[0])}" class="h-[400px] rounded-lg max-[900px]:h-[300px] max-[700px]:h-[200px] max-[500px]:h-[150px]">
      </div>
      <div class="grid grid-cols-2 gap-4 px-4 max-[830px]:grid-cols-1">
      <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Category:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Categories}</div></div>
      <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Title:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Title}</div></div>
      <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Description:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Description}</div></div>
      <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Brand:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Brand}</div></div>
      <div class="text-2xl text-rose-500 font-semibold max-[500px]:text-xl flex flex-col">Price:<div class="text-xl text-rose-500 max-[500px]:pl-24 font-normal bg-rose-50 h-12 rounded-lg pl-36 max-[500px]:text-lg">${obj.Price}</div></div>
      </div>
      </div>
      <div class="flex justify-between">
      <div class="flex flex-col justify-evenly float-left" >
      <div class="flex hidden" id="hidden">
      <input type="number" id="offerText" class="rounded-l-lg pl-4 text-rose-500 bg-rose-50 focus:outline-none border-2 border-rose-500">
      <button type="button" id="sendoffer" class="p-2 bg-rose-500 text-lg text-rose-50 font-semibold rounded-r-lg hover:bg-rose-500 active:bg-rose-700 focus:outline-none duration-300">Send</button>
      </div>
      <button type="button" id="offer" class="p-3 px-4 my-3 bg-rose-400 text-2xl text-rose-50 font-semibold rounded-lg hover:bg-rose-500 active:bg-rose-700 focus:outline-none duration-300">Make an offer</button>
      </div>
      <div class="flex flex-col justify-evenly float-right" >
      <button type="button" id="buy" class="p-3 px-4 my-3 bg-rose-400 text-2xl text-rose-50 font-semibold rounded-lg hover:bg-rose-500 active:bg-rose-700 focus:outline-none duration-300">Buy now</button>
      <button type="button" id="chat" class="p-3 px-4 my-3 mb-5 bg-rose-400 text-2xl text-rose-50 font-semibold rounded-lg hover:bg-rose-500 active:bg-rose-700 focus:outline-none duration-300">Chat now</button>
      
      </div>
      </div>
      `



      const ID = [obj.UserID, auth.currentUser.uid];
      console.log(ID);
      ID.sort();
      console.log(ID);

      document.getElementById('detail').innerHTML = element;

      document.getElementById('offer').addEventListener('click', () => {
        const sendOffer = document.getElementById('hidden');
        sendOffer.style.display = 'flex';

        document.getElementById('sendoffer').addEventListener('click', () => {
          Swal.showLoading()
          const itemOffer = document.getElementById('offerText');
          let userRef = ref(database, 'endchat/' + ID[0] + ID[1]);
          const offer = `My Offer: ${itemOffer.value}`;
          const uid = auth.currentUser.uid
          const messageTime = new Date(); // Replace this with the actual message timestamp

          const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
          const timeString = messageTime.toLocaleString(undefined, timeOptions);

          const dateOptions = { weekday: 'short' };
          const dateString = messageTime.toLocaleString(undefined, dateOptions);

          const currentTimeString = `${timeString} ${dateString}`;

          const usernameRef = ref(database, auth.currentUser.uid + "/UserProfile");
          let name;
          const usernameSnap = ((snapshot) => {
            const namedata = snapshot.val();
            const list = []
            for (let i of Object.keys(namedata || {})) {
              const object = namedata[i]
              list.push({ ...object, key: i })
            }
            for (let n of list) {
              name = n.Name;
            }
          })
          onValue(usernameRef, usernameSnap)
          push(userRef, { offer, uid, currentTimeString, name })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: `Offer sent of Rs ${offer}`,
                timer: 2500
              })
              window.location.href = `../chat/chat.html?a=${obj.UserID}&name=${username}&rid=${recordId}`
            })
        })

      })


      if (obj.UserID === auth.currentUser.uid) {
        document.getElementById('offer').style.display = 'none'
        document.getElementById('buy').textContent = 'Reject';
        document.getElementById('chat').textContent = 'Mark as Sold';

      }
      document.getElementById('chat').addEventListener('click', () => {
        if (obj.UserID === auth.currentUser.uid) {
          let userRef = ref(database, "allAds/" + recordId);
          update(userRef, { sold: true, request: true }).then(() => {
            document.getElementById('chat').disabled = 'true';
            document.getElementById('chat').style.backgroundColor = 'gray'
            document.getElementById('chat').textContent = 'Sold';
            window.location.href = '../seller/seller.html'
          })
        } else {
          window.location.href = `../chat/chat.html?a=${obj.UserID}&name=${username}&rid=${recordId}`
        }
      })

      document.getElementById('buy').addEventListener('click', () => {
        Swal.showLoading()
        let userRef = ref(database, "allAds/" + recordId);
        if (obj.UserID === auth.currentUser.uid) {
          update(userRef, { request: false }).then(() => {
            Swal.fire({
              icon: 'info',
              title: `Client's request desclined`,
              showConfirmButton: false,
              timer: 2000
            })
            window.location.href = '../seller/seller.html'
          })
        } else {
          update(userRef, { request: true, sold: false })
            .then(() => {
              Swal.fire({
                icon: 'info',
                title: 'Request sent to the owner',
                // timer: 2000
              })
            })
          // window.location.href = `../chat/chat.html?a=${obj.UserID}&name=${username}&rid=${recordId}`
        }
      })


      // document.getElementById('buy').addEventListener('click', () => {
      //   let userRef = ref(database, "allAds/"+recordId);

      // })
    }
    else {
      console.log('none');
    }
  }
  Swal.close()
})



onAuthStateChanged(auth, (user) => {
  Swal.showLoading()
  // const accName = document.createElement('span');
  // dropdownButton.appendChild(accName);
  let allAds = ref(database, "allAds");

  onValue(allAds, valSnap);
  if (user) {
    uId = user.uid
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
      title: `Error: ${error.message}`,
      showConfirmButton: true
    })
  })
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
// console.log(auth.currentUser);