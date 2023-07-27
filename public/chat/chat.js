import {
  database,
  ref,
  onValue,
  push,
} from "../app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const auth = getAuth();
const users = auth.currentUser;

const urlParams = new URLSearchParams(window.location.search);
const ownerName = urlParams.get('name');
const ownerID = urlParams.get('a');
const recordId = urlParams.get('rid');
let clientName;

let IDs = []

onAuthStateChanged(auth, (users) => {
  Swal.showLoading()
  const userID = auth.currentUser.uid;
  IDs = [ownerID, userID];
  IDs.sort()
  if (auth.currentUser) {
    const accName = document.createElement('span');
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
        clientName = obj.Name;

      }
    })



    const valSnap = ((snapshot) => {

      const objList = [];
      const chatData = snapshot.val();
      for (let chatId of Object.keys(chatData || {})) {
        const obj = chatData[chatId]
        objList.push({ ...obj, key: chatId })
      }
      document.getElementById('chat').innerHTML = ''
      let uId;
      for (const obj of objList) {
        const chatbox = document.getElementById('chat');
        if (obj.uid === auth.currentUser.uid) {
          const element = `
      <div class=" flex flex-col ml-auto my-2 p-2 bg-rose-300 rounded-lg w-[80%]" id="usermsg">
      <span class="py-1 px-2 text-rose-700" id="offermsg">${obj.offer ? obj.offer : ''}</span>
      <span class="py-1 text-rose-700">${obj.message ? obj.message : ''}</span>
      <span class=" text-right text-xs">${obj.time ? obj.time : ''}</span>
      </div>
      `
          chatbox.innerHTML += element;
        }
        else {
          const element = `
      <div class="m-2 flex flex-col p-2 bg-rose-200 rounded-lg w-[80%]" id="usermsg">
      <span class="py-1 px-2 text-rose-700" id="offermsg">${obj.offer ? obj.offer : ''}</span>
      <span class="py-1 text-rose-700">${obj.message ? obj.message : ''}</span>
      <span class=" text-right text-xs">${obj.time ? obj.time : ''}</span>
      </div>
      `

          chatbox.innerHTML += element;
        }
        if (!obj.offer) {
          document.getElementById('offermsg').style.display = 'none'
        }
      }


      document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight

      Swal.close()
    })


    onValue(nameRef, nameSnap)
    accName.className = 'self-center mr-[13px] font-semibold max-[930px]:hidden';
    document.getElementById('chatHead').textContent = ownerName;
    const chatRef = ref(database, 'endchat/' + IDs[0] + IDs[1])


    onValue(chatRef, valSnap)
  } else {
    window.location.href = '../home/home.html';
    accName.textContent = 'Account'
    accName.className = 'self-center mr-[13px] font-semibold max-[930px]:hidden';
  }
  // Swal.close()
})


function pushChat(chatRef, uid, name = "", message, time) {
  const ownerRef = ref(database, ownerID + '/chatlist');
  const clientID = auth.currentUser.uid;
  const clientRef = ref(database, clientID + '/chatlist');
  const chatID = IDs[0] + IDs[1];
  const ownchat = push(ownerRef, { chatID })
  const clientchat = push(clientRef, { chatID })
  console.log(chatRef, uid, name, message, time)
  const abc = push(chatRef, { uid, name, message, time })
    .then(() => {
      document.getElementById('msgType').value = '';
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: `Error: ${error.message}`,
        showConfirmButton: true
      })
    })
}


document.getElementById('sendmsg').addEventListener('click', () => {
  const message = document.getElementById('msgType').value;
  const chatRef = ref(database, 'endchat/' + IDs[0] + IDs[1])
  if (message) {
    // const currentTime = new Date();
    const messageTime = new Date(); // Replace this with the actual message timestamp

    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = messageTime.toLocaleString(undefined, timeOptions);

    const dateOptions = { weekday: 'short' };
    const dateString = messageTime.toLocaleString(undefined, dateOptions);

    const currentTimeString = `${timeString} ${dateString}`;
    pushChat(chatRef, auth.currentUser.uid, clientName, message, currentTimeString);
  }
  else {
    Swal.fire({
      icon: 'error',
      title: `Empty message can't be sent`,
      showConfirmButton: false,
      timer: 1500
    })
  }
})


document.getElementById('profile').addEventListener('click', () => {
  window.location.href = '../profile/profile.html';
})
document.getElementById('home').addEventListener('click', () => {
  window.location.href = '../home/home.html';
})

document.getElementById('message').addEventListener('click', () => {
  window.location.href = '../messages/messages.html';
})
document.getElementById('messages').addEventListener('click', () => {
  window.location.href = '../messages/messages.html';
})

document.getElementById('seller').addEventListener('click', () => {
  window.location.href = '../seller/seller.html';
})
document.getElementById('sellers').addEventListener('click', () => {
  window.location.href = '../seller/seller.html';
})

document.getElementById('signout').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '../home/home.html';

  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: `Signing out failed: ${error.message}`,
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