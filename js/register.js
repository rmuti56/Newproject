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

  document.querySelector("#registerForm").addEventListener("submit", e => {
    e.preventDefault();
    var email = $("#email").val();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    document.getElementById("wait").style.display = "block";

    if (password !== confirmPassword) {
      swal({
        icon: 'error',
        type: 'error',
        title: 'ข้อผิดพลาด',
        text: 'รหัสผ่านไม่ตรงกัน...',
      })
      document.getElementById("password").setCustomValidity("");
      document.getElementById("password").style.borderColor = "#E34234";
      document.getElementById("confirmPassword").style.borderColor = "#E34234";
      document.getElementById("wait").style.display = "none";
    } else {
      firebase
        .auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          firebase.database().ref('user').child(user.user.uid).set({
            age: '',
            email: user.user.email,
            lastName: '',
            name: '',
            pofileImage: '',
            sex: '',
            tel: ''
          }).then(() => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                swal({
                  icon: 'success',
                  title: 'สมัครสมาชิกสำเร็จ'
                }).then(() => {
                  var textMail = $("#email").val(null)
                  var textPass = $("#password").val(null);
                  var textConfirm = $("#confirmPassword").val(null);
                  $("#wait").css("display", "none");
                })
              });
          })
        })
        .catch(e => {
          console.log(e.code);
          swal({
            icon: 'error',
            title: 'ผู้ใช้งานนี้มีอยู่แล้ว'
          })
          $("#wait").css("display", "none");
        })
    }
  });
});