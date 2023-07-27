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
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

onAuthStateChanged(auth, (users) => {
  Swal.showLoading()
  if (!auth.currentUser) {
    window.location.href = '../signin/signin.html'
  }
  else {
    const accName = document.createElement('span');
    dropdownButton.appendChild(accName);
    let allAds = ref(database, "allAds");
    onValue(allAds, valSnap);
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

    onValue(nameRef, nameSnap)
    accName.className = 'self-center mr-[13px] font-semibold max-[930px]:hidden';
    document.getElementById('signinDiv').style.display = 'none';

  }
})



function details(key) {
  // const recordsRef = ref(database, "allAds");
  const recordId = key;
  window.location.href = `../details/details.html?recordId=${recordId}`

}


const valSnap = ((snapshot) => {
  const urlParams = new URLSearchParams(window.location.search);
  let cat = urlParams.get('cat');
  if (!cat) {
    cat = 'All Categories';
  }
  document.getElementById('adList').innerHTML = ''
  document.getElementById('catTitle').innerHTML = cat

  const data = snapshot.val();

  const objList = [];
  for (let objId of Object.keys(data || {})) {
    const obj = data[objId]
    objList.push({ ...obj, key: objId })
  }
  objList.sort((a, b) => b.time - a.time)

  let count = 0;
  let htmlContent = ''
  let filteredList;
  if ((!cat) || (cat === 'All Categories')) {
    filteredList = objList;
    document.getElementById('catName').textContent = 'All Categories'
  } else {
    filteredList = objList.filter(obj => obj.Categories === cat)
    document.getElementById('catName').textContent = cat
  }
  for (let obj of filteredList) {
    let currentDate = new Date();
    let targetDate = obj.time;
    let differenceMs = currentDate.getTime() - targetDate;
    let days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    let element = `
      <div class="flex flex-col  bg-rose-100 records">
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
          <p class="text-rose-400 my-2 mt-auto">${days} days ago</p>
          </div>
          </div>
          </div>
          `
    if (!obj.sold) {
      document.getElementById('adList').innerHTML += element
    }
  }
  // Swal.fire()
  Swal.close()
  document.getElementById('adList').addEventListener('click', (event) => {
    if (event.target.classList.contains('details-button')) {
      const key = event.target.dataset.key;
      details(key);
    }
  });
})




document.getElementById('profile').addEventListener('click', () => {
  Swal.showLoading()
  onAuthStateChanged(auth, (users) => {
    if (users) {
      window.location.href = '../profile/profile.html';
    } else {
      window.location.href = '../signin/signin.html';
    }
  })
})

document.getElementById('seller').addEventListener('click', () => {
  Swal.showLoading()
  onAuthStateChanged(auth, (users) => {
    if (users) {
      window.location.href = '../seller/seller.html';
    } else {
      window.location.href = '../signin/signin.html';
    }
  })
})
document.getElementById('sellers').addEventListener('click', () => {
  Swal.showLoading()
  onAuthStateChanged(auth, (users) => {
    if (users) {
      window.location.href = '../seller/seller.html';
    } else {
      window.location.href = '../signin/signin.html';
    }
  })
})

document.getElementById('messages').addEventListener('click', () => {
  Swal.showLoading()
  onAuthStateChanged(auth, (users) => {
    if (users) {
      window.location.href = '../messages/messages.html';
    } else {
      window.location.href = '../signin/signin.html';
    }
  })
})
document.getElementById('message').addEventListener('click', () => {
  Swal.showLoading()
  onAuthStateChanged(auth, (users) => {
    if (users) {
      window.location.href = '../messages/messages.html';
    } else {
      window.location.href = '../signin/signin.html';
    }
  })
})


document.getElementById('signin').addEventListener('click', () => {
  Swal.showLoading()
  window.location.href = '../signin/signin.html';
})



document.getElementById('signout').addEventListener('click', () => {
  Swal.showLoading()
  signOut(auth).then(() => {
    window.location.href = '../signin/signin.html';
  }).catch((error) => {
    // An error happened.
    alert('Signing out failed!')
  });
})

//account dropdown

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




//categories dropdown
const categoriesButton = document.getElementById("categories");
const categoryList = document.getElementById("categorylist");

categoriesButton.addEventListener("click", () => {
  categoryList.classList.toggle("show");
});

window.addEventListener("click", (event) => {
  if (!event.target.matches(".categories")) {
    categoryList.classList.remove("show");
  }
});

const categoriesItems = document.getElementsByClassName("categoriesItems");
for (const i of categoriesItems) {
  i.addEventListener("click", () => {
    categoryList.classList.remove("show");
  });
}




const all = document.getElementById('All');
all.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${all.textContent}`;
})

const Mobile = document.getElementById('Mobile');
Mobile.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${Mobile.textContent}`;
})

const Vehicle = document.getElementById('Vehicles');
Vehicle.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${Vehicle.textContent}`;
})

const Electronics = document.getElementById('Electronics');
Electronics.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${Electronics.textContent}`;
})

const Books = document.getElementById('Books');
Books.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${Books.textContent}`;
})

const Furniture = document.getElementById('Furniture');
Furniture.addEventListener('click', () => {
  window.location.href = `../home/home.html?cat=${Furniture.textContent}`;
})



// Get the search input and button elements
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchbtn');

// Add an event listener to the search button
searchInput.addEventListener('input', () => {
  // Get the search query from the input field
  const query = searchInput.value.toLowerCase();

  // Loop through all the elements with a class of "searchable"
  const searchables = document.querySelectorAll('.records');
  searchables.forEach(searchable => {
    // Get the text content of the element and convert it to lowercase
    const text = searchable.textContent.toLowerCase().split(',').join('');

    // Check if the search query is in the text content of the element
    if (text.includes(query)) {
      // If it is, show the element
      searchable.style.display = 'block';
    } else {
      // If it's not, hide the element
      searchable.style.display = 'none';
    }
  });
});