$(function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $("#loginEmail").html(user.email);
      var id = firebase.auth().currentUser.uid;

      var firebaseRef = firebase.database().ref("user/" + id); //ส่วนของการนำข้อมูลส่วนตัวมาแสดง
      firebaseRef.on("value", dataSnapshot => {
        if (dataSnapshot.val() !== "") {
          var name = dataSnapshot.val() && dataSnapshot.val().name;
          var lastName = dataSnapshot.val() && dataSnapshot.val().lastName;
          var pofileImage =
            dataSnapshot.val() && dataSnapshot.val().pofileImage;
          $("#pofileImageMenu").attr("src", pofileImage);
          $("#loginEmail").text(`${name} ${lastName}`);
          $("#pofileImagePost").attr("src", pofileImage);
        }
      });

      $(document).on("click", "#textPost", () => {
        $("#showButton").css("display", "block");
        $("#times").css("display", "block");
        $("#thumbnail").css("display", "block");
      });

      $(document).on("click", "#times", () => {
        $("#showButton").css("display", "none");
        $("#times").css("display", "none");
        $("#thumbnail").css("display", "none");
      });
      $(document).click(e => {
        var container = $("#formPost");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          $("#showButton").css("display", "none");
          $("#times").css("display", "none");
          $("#thumbnail").css("display", "none");
        }
      });
      $(document).on("keyup", "#textPost", () => {
        if ($("#textPost").val() != "") {
          $("#buttonPost").attr("disabled", false);
        } else {
          $("#buttonPost").attr("disabled", true);
        }
      });

      $("#upload").on("change", function (e) {
        $("#showButton").css("display", "block");
        imagesPreview(this, "#gallery");
      });

      var imagesPreview = function (input, placeToInsertImagePreview) {
        if (input.files) {
          $("#buttonPost").attr("disabled", false);
          var filesAmount = input.files.length;

          for (i = 0; i < filesAmount; i++) {
            var reader = new FileReader();

            reader.onload = function (event) {
              $($.parseHTML("<img>"))
                .attr("src", event.target.result)
                .appendTo(placeToInsertImagePreview);
            };

            reader.readAsDataURL(input.files[i]);
          }
        }
      };

      document.querySelector("#postForm").addEventListener("submit", e => {
        e.preventDefault();

        var myTextPost = $("#textPost").val();
        var myId = firebase.auth().currentUser.uid;
        var databaseRef = firebase.database().ref("post").child(myId);
        var postId = firebase.database().ref("post").child(myId).push().key;
        databaseRef.child(postId).set({
            textPost: myTextPost || "",
            time: Date.now()
          })
          .then(() => {
            if (document.querySelector('#gallery').childNodes.length) {
              for (let i = 0; i < document.querySelector("#gallery").childNodes.length; i++) {
                var fileName = Date.now();
                var firebaseFileRef = firebase.storage().ref("post").child(`${fileName}.jpg`);
                firebaseFileRef.putString(
                    document.querySelector("#gallery").childNodes[i].src,
                    "data_url", {
                      contentType: "image/jpg"
                    }
                  ).then(snapshot => snapshot.ref.getDownloadURL())
                  .then(url => {
                    firebase.database().ref("post").child(myId).child(postId).child("images").push().set({
                      imagePost: url
                    });
                  }).then(() => {
                    alert('โพสสำเร็จ');
                  })
              }
            } else {
              alert('โพสสำเร็จ');
            }
          })
      });

      $(document).on('click', '#logOut', () => {
        firebase.auth().signOut().then(() => {
          window.location = "login.html";
        });
      })
    } else {
      window.location = "login.html";
    }
  });
});