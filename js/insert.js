$(function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      //นำข้อมูลที่อยู่ใน firebase มาแสดง
      var id = firebase.auth().currentUser.uid;

      var firebaseRef = firebase.database().ref("user/" + id);
      firebaseRef.on("value", dataSnapshot => {
        if (dataSnapshot.val() !== "") {
          var age = dataSnapshot.val() && dataSnapshot.val().age;
          var name = dataSnapshot.val() && dataSnapshot.val().name;
          var lastName = dataSnapshot.val() && dataSnapshot.val().lastName;
          var sex = dataSnapshot.val() && dataSnapshot.val().sex;
          var tel = dataSnapshot.val() && dataSnapshot.val().tel;
          var pofileImage =
            dataSnapshot.val() && dataSnapshot.val().pofileImage;
          console.log(age, name, lastName, sex, tel, pofileImage);
          $("#pofileImageMenu").attr("src", pofileImage);
          $("#name").val(name);
          $("#lastName").val(lastName);
          $("#loginEmail").text(`${name} ${lastName}`);
          $("[name=sex]").val([sex]);
          $("#tel").val(tel);
          $("#age").val(age);
          $("#showImage").attr("src", pofileImage);
        }
      });

      //ฟังก์ชั่นสำหรับแสดงที่อัพโหลด
      function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $("#showImage").attr("src", e.target.result);
          };
          reader.readAsDataURL(input.files[0]);
        }
      }

      document.querySelector("#addForm").addEventListener("submit", e => {
        //เพิ่มข้อมูลไปยัง firebase
        // กำหนดตัวแปลเพื่อรับค่าจากการอัพโหลดไฟล์
        $("#addButton").text("กำลังทำการอัพเดรทข้อมูลส่วนตัว");
        e.preventDefault();
        var myName = $("#name").val(); //เก็บค่าสำหรับนำไปเพิ่ม
        var myLastName = $("#lastName").val();
        var myAge = $("#age").val();
        var myTel = $("#tel").val();
        var mySex = $(":radio:checked").val();
        var file = document.querySelector("#upload").files[0];

        var myId = firebase.auth().currentUser.uid; //เก็บค่า user ID
        var myEmail = user.email;
        var firebaseRef = firebase //อ้างอิงพาสที่จะนำข้อมูลไปบันทึก
          .database()
          .ref("user")
          .child(myId);
        if (file == null) {
          console.log("เข้าเงื่อนไข");
          firebaseRef
            .update({
              //ทำการบันทึกข้อมูล
              email: myEmail,
              name: myName,
              lastName: myLastName,
              age: myAge,
              tel: myTel,
              sex: mySex
            })
            .then(() => {
              alert("เพิ่มข้อมูลสำเร็จ");
            });
        } else {
          let metadata = {
            contentType: file.type //นามสกุลของไฟล์
          };
          let storage = firebase.storage(); //ติดต่อกับ storeage
          let pathReference = storage.ref(
            "images/" + file.name + "_" + new Date() //เลือกพาสที่จะนำภาพไปบันทึก
          );
          pathReference //บันทึกข้อมูลไปยัง
            .put(file, metadata) //เพิ่มไฟล์ไปยังพาสที่กำหนดไว้
            .then(() => {
              pathReference.getDownloadURL().then(url => {
                //จากนั้น copy พาสที่ได้บันทึกไฟล์
                firebaseRef.set({
                  //ทำการบันทึกข้อมูล
                  email: myEmail,
                  name: myName,
                  lastName: myLastName,
                  age: myAge,
                  tel: myTel,
                  sex: mySex,
                  pofileImage: url
                });
              });
            })
            .then(() => {
              alert("เพิ่มข้อมูลสำเร็จ");
            });

          $("#addButton").text("ยืนยันการเพิ่มข้อมูลส่วนตัว");
        }
      });

      function logOut() {
        firebase
          .auth()
          .signOut()
          .then(() => {
            window.location = "login.html";
          });
      }
    } else {
      window.location = "login.html";
    }
  });
});

// window.onload = function() {
//   var firebaseRef = firebase.database().ref("user");
//   firebaseRef.once("value").then(function(dataSnapshot) {
//     console.log(dataSnapshot.val());
//   });
// };