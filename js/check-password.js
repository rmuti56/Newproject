$(document).ready(function () {
  $("#passwordConfirm").on({
    keyup: function (result) {
      var passwordConfirm = result.target.value;
      var password = $("#password").val();

      if (passwordConfirm != password) {
        $("#passwordConfirm").addClass("wrong-password");
        $("#submit").attr("disabled", "disabled");
      } else {
        $("#passwordConfirm").removeClass("wrong-password");
        $("#submit").attr("disabled", false);
      }
    }
  }, {
    keydown: function (result) {
      var passwordConfirm = result.target.value;
      var password = $("#password").val();

      if (passwordConfirm != password) {
        $("#passwordConfirm").addClass("wrong-password");
        $("#submit").attr("disabled", "disabled");
      } else {
        $("#passwordConfirm").removeClass("wrong-password");
        $("#submit").attr("disabled", false);
      }
    }
  });

  $("#password").on({
    keyup: function (result) {
      var password = result.target.value;
      var passwordConfirm = $("#passwordConfirm").val();

      if (password == passwordConfirm) {
        $("#passwordConfirm").removeClass("wrong-password");
        $("#submit").attr("disabled", false);
      } else {
        if (passwordConfirm) {
          $("#passwordConfirm").addClass("wrong-password");
          $("#submit").attr("disabled", "disabled");
        }
      }
    }
  }, {
    keydown: function (result) {
      var password = result.target.value;
      var passwordConfirm = $("#passwordConfirm").val();

      if (password == passwordConfirm) {
        $("#passwordConfirm").removeClass("wrong-password");
        $("#submit").attr("disabled", false);
      } else {
        if (passwordConfirm) {
          $("#passwordConfirm").addClass("wrong-password");
          $("#submit").attr("disabled", "disabled");
        }
      }
    }
  });
});

function getWallPost() {
  $('#gallery').empty();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentImage = "";
      firebase.database().ref("user").on("child_added", userResult => {
        const namePost = userResult.val().name || "";
        const profileImage = userResult.val().pofileImage || "../image/defualt.png"
        if (user.uid = userResult.key) {
          currentImage = profileImage;
        }
        firebase.database().ref("post").child(userResult.key).once("value").then(response => {
          var data = [];
          response.forEach(response => {
            data.push({
              time: response.val().time,
              textPost: response.val().textPost,
              key: response.key
            })
          })
          data = data.reverse();
          data.forEach(response => {
            var imageArr = '';
            var time = moment(response.time).formait('DD-MM-YYYY HH:mm:ss');
            const textPost = response.val().textPost || '';
            const keyPost = reponse.key;

            firebase.database().ref('post').child(userResult.key).child(keyPost + "/images").once('value').then((images) => {
              image.forEach(image => {
                imageArr += `<div class='col-6><img src= ${image.val().imagePost} class='img-responsive img-post'></div> \n`;
              })
            })
          })
        })
      })
    }
  })
}


key - comment = JSON.stringify(keyPost) //สร้างแอททริบิลขึ้นมาใหม่การเก็บข้อมูลให้อยู่ในรูปแบบ JSON