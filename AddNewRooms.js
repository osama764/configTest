// configuration of Project 
// const firebaseConfig = {
//   apiKey: "AIzaSyC1pII7CHpUYKDELsSO6QV6AllnIUutCqg",
//   authDomain: "smart-home-fb189.firebaseapp.com",
//   databaseURL: "https://smart-home-fb189-default-rtdb.firebaseio.com",
//   projectId: "smart-home-fb189",
//   storageBucket: "smart-home-fb189.appspot.com",
//   messagingSenderId: "395648266554",
//   appId: "1:395648266554:web:1d9ec392d8c14ca6272003"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAAUwKpK6j5fy3gTzMwamS5QHTJ7xSic0c",
  authDomain: "smart-test-ee901.firebaseapp.com",
  databaseURL: "https://smart-test-ee901-default-rtdb.firebaseio.com",
  projectId: "smart-test-ee901",
  storageBucket: "smart-test-ee901.appspot.com",
  messagingSenderId: "608199887325",
  appId: "1:608199887325:web:1830f4c5d50e2ce9c6ce34"
};

firebase.initializeApp(firebaseConfig);
// Get a reference to  RealTime Database service
const database = firebase.database();


let addRoom = document.querySelector(".addRoom");
let contentAddRoom = document.querySelector(".contentAddRoom");
let close = document.querySelector(".close");

// button add New Room will appear form to add data of this Room
addRoom.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(0vw)";
});

// this button will close form (adding data of Room)
close.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(120vw)";
});

// initialization variables to use later
let nameRoom     = document.getElementById("nameRoom");
let imageRoom    = document.getElementById("imageRoom");
let addNewRoom   = document.querySelector(".addNewRoom");
let contentRooms = document.querySelector(".contentRooms");
let body         = document.querySelector("body");

// this button will add New Room in container Rooms after take data of this Room
addNewRoom.addEventListener("click", (e) => {
  e.preventDefault(); // To prevent the page from loading 

  // To ensure that the data is correct
  if (imageRoom.value != "" && nameRoom.value != "") {
    // calling Function add Room in RealTime Database in Firebase
    addNewRoomInFirebase();
    // close form and browser will speech that Room added 
    contentAddRoom.style.transform = "translateX(120vw)";

  } else {
    // if data of Room can't correct will appear message above form ( color Red )
    let h5 = document.createElement("h5");
    h5.innerHTML = "أدخل البيانات بشكل صحيح";
    h5.classList = "alertMessage";
    contentAddRoom.prepend(h5);

    // Remove message after 3 seconds
    setTimeout(() => {
      let deletAlert = document.querySelector(".alertMessage");
      deletAlert.remove();
    }, 3000);
  }
});



async function addNewRoomInFirebase() {
  // Taking the values ​​from the input fields for the room name and the room photo 
  const nameRoomValue = nameRoom.value;
  const imageRoomValue = imageRoom.value;

  // add values in this Object to send data to RealTime Database
  const data = {
    Name: nameRoomValue,
    image: imageRoomValue,
    devices: [],
    devicesPush: [],
  };

  try {
    const response = await fetch('https://smart-test-ee901-default-rtdb.firebaseio.com/Rooms.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      DisplayData()
      console.log('Room added successfully');
    } else {
      throw new Error('Failed to add room');
    }
  } catch (error) {
    console.error('Failed to add room:', error.message);
  }
}
function DisplayData() {
  // إنشاء طلب HTTP
  const request = new XMLHttpRequest();
  request.open('GET', 'https://smart-test-ee901-default-rtdb.firebaseio.com/Rooms.json');

  // إرسال الطلب
  request.send();

  // إضافة معالج لاستجابة الطلب
  request.onload = function () {
    if (request.status === 200) {
      // تحويل البيانات إلى كائن JSON
      const data = JSON.parse(request.responseText);

      // حذف جميع العناصر الحالية
      contentRooms.innerHTML = '';

      // عرض بيانات الغرف
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const room = data[key];
          const roomId = key; // معرف الغرفة

          let card = `
            <div class="card border-0 p-3 m-2 text-center" style="background-image: url(../images/${room.image}.jpg);">
              <i class="fa-solid fa-trash-can deletbtnThisRoom"></i>
              <h3 class="mt-3 mb-3 room__title">${room.Name}</h3>
              <button class="btn btn-warning visit">فتح الغرفة</button>
              <span style="opacity: 0">${roomId}</span>
            </div>
          `;
          contentRooms.innerHTML += card;
        }
      }
    } else {
      // رسالة خطأ في حالة فشل الطلب
      alert('حدث خطأ أثناء استرداد بيانات الغرف');
    }
  };
}
// calling function display during loading Page
window.onload = DisplayData();

// this is container for all Rooms
contentRooms.addEventListener("click", (e) => {
  
  // the Element that contains classes : ( card  border-0   p-3 m-2   text-center )


  if (e.target.classList == "btn btn-warning  visit") {

    // Fetching room data via this current element on which the event takes place
    const nameImage = e.target.parentElement.style.backgroundImage
    const nameRoom =
    e.target.parentElement.lastElementChild.previousElementSibling.previousElementSibling
    .innerHTML

    // Encrypt the data and send it to the home page in the url
    const encodedImage = encodeURIComponent(nameImage);
    const encodedName = encodeURIComponent(nameRoom);
    // path Home Page
    const url = 
      "ShowMyRooms.html?nameRoom=" +
      encodedName +
      "&nameImage=" +
      encodedImage;
    window.location.href = url;
  }

    // the Element that contains classes : ( fa-solid  fa-xmark  deletbtnThisRoom )
  if (e.target.classList == "fa-solid fa-trash-can deletbtnThisRoom") {
  
    // uid is id that use to delete this Room 
    let uid = e.target.parentElement.lastElementChild.innerHTML
    // passing uid in function to delete this Room
    deleteRoom(uid)
  

   }




})


let selectImage = document.querySelector(".select");
let closeImages = document.querySelector("#closeImages");

// button select image
selectImage.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(1)";
});

// close list of Images
closeImages.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(0)";
});

let containerSelectionImages = document.querySelector(
  ".containerSelectionImages"
);

// for loop ( 12 image ) : 12 is not fixed, it changes according to the number of images
for (let i = 1; i <= 6; i++) {
  let newImage = `
<div class="cardImage">
<img src="../images/${i}.jpg" alt="">
<span>${i}</span>
</div>
`;
  containerSelectionImages.innerHTML += newImage;
}

const images = document.querySelectorAll(".cardImage img");

// in click any image will take name for this image and close List of Images
images.forEach(function (image) {
  image.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "img") {
      const card = event.target.closest(".cardImage");
      const span = card.querySelector("span");
      imageRoom.value = span.textContent;
      containerImage.style.transform = " scale(0)";
    }
  });
});







function deleteRoom(roomKey) {
  // إنشاء طلب HTTP
  const request = new XMLHttpRequest();
  request.open('DELETE', `https://smart-test-ee901-default-rtdb.firebaseio.com/Rooms/${roomKey}.json`);

  // إرسال الطلب
  request.send();

  // إضافة معالج لاستجابة الطلب
  request.onload = function () {
    if (request.status === 200) {
      // تم حذف الغرفة بنجاح
      console.log('تم حذف الغرفة بنجاح');
      DisplayData()
      // يمكنك إجراء أي إجراءات إضافية هنا بعد حذف الغرفة بنجاح
    } else {
      // حدث خطأ أثناء حذف الغرفة
      console.error('حدث خطأ أثناء حذف الغرفة');
    }
  };
}
