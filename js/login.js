document.querySelector("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  $("#wait").css("display", "block");
  firebase
    .auth()
    .signInWithEmailAndPassword(email, String(password))
    .then(user => {
      if (user) {
        $("#wait").text("ลงชื่อเข้าใช้สำเร็จ");
      }
    })
    .catch(e => {
      if (e.code === "auth/wrong-password") {
        alert("รหัสผ่านไม่ถูกต้อง");
        $("#wait").css("color", "red");
        $("#wait").text("รหัสผ่านไม่ถูกต้อง");
      } else if (e.code === "auth/user-not-found") {
        alert("รหัสผ่านไม่ถูกต้อง");
        $("#wait").css("color", "red");
        $("#wait").text("ไม่ได้เป็นสมาชิก");
      } else {
        alert("มีบางอย่างผิดพลาด");

        $("#wait").css("display", "none");
      }
    });
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location = "menu.html";
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

// function login() {
//     var email = document.getElementById("email").value;
//     var password = document.getElementById("password").value;
//     document.getElementById("loginButton").innerHTML = "Please wait..";
// firebase
//   .auth()
//   .signInWithEmailAndPassword(email, String(password))
//   .then(user => {
//     if (user) {
//       alert("ล็อคอินสำเร็จ");
//       document.getElementById("loginButton").innerHTML = "Login";
//     }
//   })
//       .catch(e => {
//         console.log(e.code);
//         if (e.code === "auth/wrong-password") {
//           alert("รหัสผ่านไม่ถูกต้อง");
//           document.getElementById("loginButton").innerHTML = "Login";
//         } else if (e.code === "auth/user-not-found") {
//           alert("ไม่ได้เป็นสมาชิก");
//           document.getElementById("loginButton").innerHTML = "Login";
//         } else {
//           alert("มีบางอย่างผิดพลาด");
//           document.getElementById("loginButton").innerHTML = "Login";
//         }
//       });
//   }