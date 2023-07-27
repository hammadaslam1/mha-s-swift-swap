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
  limitToLast,
  query,
  startAt,
  // getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  get,
  // signOut
} from "../app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const auth = getAuth();
const users = auth.currentUser;
let clientName;


onAuthStateChanged(auth, (users) => {
  Swal.showLoading()
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
        clientName = obj.Name
      }

    })
    onValue(nameRef, nameSnap)

    let chatName;
    const chatSnap = ((snapshot, j) => {
      let msgname;
      const chatList = [];
      const msgdata = snapshot.val()
      for (let msgID of Object.keys(msgdata || {})) {
        const object = msgdata[msgID]
        chatList.unshift({ ...object, key: msgID })
      }
      for (const i of chatList) {
        if (i.uid !== auth.currentUser.uid) {
          msgname = i.name;
        }
      }
      // msglist.sort((a, b) => b.time - a.time)
      for (const object of chatList) {

        const element = `
        <div id ="${msglist[j]}" class="border-t-2 border-rose-500">
        <button type="button" class="chat-button p-2 flex flex-col w-[100%] hover:bg-rose-100 active:bg-rose-200 focus:outline-none focus:bg-rose-200  duration-200" data-key="${msglist[j]}">
        <span class="font-semibold text-lg text-rose-500">${msgname}</span>
        <span class="text-rose-500">${object.message}</span>
        <span class="text-rose-500 text-xs ml-auto">${object.time}</span>
        </button>
        </div>
        `
        if (!document.getElementById(msglist[j]))
          document.getElementById('list').innerHTML += element
      }
      Swal.close()
    })

    document.getElementById('list').addEventListener('click', (event) => {
      // Swal.showLoading()
      if (event.target.classList.contains('chat-button')) {
        const key = event.target.dataset.key;
        let ownerID;
        const chatviewRef = ref(database, 'endchat/' + key);

        const valSnap = ((snapshot) => {

          const objList = [];
          const chatData = snapshot.val();
          for (let chatId of Object.keys(chatData || {})) {
            const obj = chatData[chatId]
            objList.push({ ...obj, key: chatId })
          }

          const el = `
          <div class="m-2 p-2 rounded-full bg-rose-500 text-2xl text-center font-semibold text-rose-50 " id="chatName">

          </div>
          <div class="border-2 border-rose-500 p-3 rounded-[2rem] flex flex-col h-[500px] mt-auto" id="chatview">
              <div class="p-1 overflow-auto" id="chat">
                  
              </div> 
              <div class="flex justify-evenly mt-auto">
                  <input type="search" class="bg-rose-50 border-2 border-rose-500 rounded-full p-2 w-[85%] focus:outline-none pl-5" id="msgType" placeholder="type your message...">
                  <button type="button" class="w-12 h-12 rounded-full text-rose-50 bg-rose-400 hover:bg-rose-500 active:bg-rose-600 focus:outline-none duration-300" id="sendmsg" accesskey="Enter"><i class="fas fa-paper-plane"></i></button>
              </div>
          </div>
          `
          document.getElementById('box').innerHTML = el

          document.getElementById('chat').innerHTML = ''
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
              document.getElementById('chatName').textContent = obj.name
              const element = `
              <div class="my-2 flex flex-col p-2 bg-rose-200 rounded-lg w-[80%]" id="usermsg">
              <span class="py-1 px-2 text-rose-700" id="offermsg">${obj.offer ? obj.offer : ''}</span>
              <span class="py-1 text-rose-700">${obj.message ? obj.message : ''}</span>
              <span class=" text-right text-xs">${obj.time ? obj.time : ''}</span>
              </div>
              `

              ownerID = obj.uid;
              chatbox.innerHTML += element;

            }
            document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight
          }

          // Swal.fire({
          //   timer: 1
          // })
        })

        onValue(chatviewRef, valSnap)


        function pushChat(chatRef, uid, name, message, time) {

          const abc = push(chatRef, { uid, name, message, time })
            .then(() => {
              document.getElementById('msgType').value = '';
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: `${error.message}`,
                showConfirmButton: true
              })
            })
        }


        document.getElementById('sendmsg').addEventListener('click', () => {
          const message = document.getElementById('msgType').value;
          const chatRef = ref(database, 'endchat/' + key)
          if (message) {
            // const currentTime = new Date();
            const messageTime = new Date(); // Replace this with the actual message timestamp

            const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timeString = messageTime.toLocaleString(undefined, timeOptions);

            const dateOptions = { weekday: 'short' };
            const dateString = messageTime.toLocaleString(undefined, dateOptions);

            const currentTimeString = `${timeString} ${dateString}`;

            pushChat(chatRef, auth.currentUser.uid, clientName, message, currentTimeString)
          }
        })


        // details(key);
      }
    })

    const msgRef = ref(database, auth.currentUser.uid + '/chatlist')
    let msglist = [];

    const msgSnap = ((snapshot) => {
      const objList = [];
      const msgData = snapshot.val()
      for (let msgid of Object.keys(msgData || {})) {
        const obj = msgData[msgid]
        objList.push({ ...obj, key: msgid })
      }
      for (const obj of objList) {
        msglist.push(obj.chatID);
      }
      msglist = msglist.filter((item, index) => msglist.indexOf(item) === index);
      for (let i = 0; i < msglist.length; i++) {
        const chatlist = ref(database, 'endchat/' + msglist[i])
        onValue(chatlist, (e) => { chatSnap(e, i) })
      }
      Swal.close()
    })
    onValue(msgRef, msgSnap)

  }
  else {
    window.location.href = '../signin/signin.html';
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



// const chatRef = ref(database, 'endchat/' + IDs[0]+IDs[1])