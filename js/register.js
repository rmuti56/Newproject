$(function () {
  $(document).on("keydown", "#password", result => {
    var password = result.target.value;
    if (String(password).length < 6) {
      document
        .getElementById("password")
        .setCustomValidity("รหัสผ่านต้องอย่างน้อย 7 ตัว");
    } else {
      document.getElementById("password").setCustomValidity("");
    }
  });
});

document.querySelector("#registerForm").addEventListener("submit", e => {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  document.getElementById("wait").style.display = "block";

  if (password !== confirmPassword) {
    document.getElementById("password").setCustomValidity("");
    document.getElementById("password").style.borderColor = "#E34234";
    document.getElementById("confirmPassword").style.borderColor = "#E34234";
    document.getElementById("wait").style.display = "none";
  } else {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        if (user) {
          firebase
            .auth()
            .signOut()
            .then(() => {
              $("#wait").text("สมัครสมาชิกสำเร็จ");
            });
        }
      })
      .catch(() => {
        alert("มีบางอย่างผิดพลาด");
        document.getElementById("wait").style.display = "none";
      });
  }
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location = "login.html";
  }
});