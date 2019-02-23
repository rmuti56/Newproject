$(function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      var userEmail = user.email;
      var id = firebase.auth().currentUser.uid;

      var firebaseRef = firebase.database().ref("user/" + id); //ส่วนของการนำข้อมูลส่วนตัวมาแสดง
      firebaseRef.on("value", dataSnapshot => {
        if (dataSnapshot.val() !== "") {
          var name = dataSnapshot.val().name;
          var lastName = dataSnapshot.val().lastName;
          var pofileImage = dataSnapshot.val().pofileImage || '../image/default.png';

          $("#pofileImageMenu").attr("src", pofileImage);
          if (!name && !lastName) {
            $("#loginEmail").text(userEmail);
          } else {
            $("#loginEmail").text(`${name} ${lastName}`);

          }
          $("#pofileImagePost").attr("src", pofileImage);
        }
      });

      $("#textPost").click(() => {
        $("#showButton").css("display", "block");
        $("#times").css("display", "block");
        $("#gallery").css("display", "block");
      });

      $("#times").click(() => {
        $("#showButton").css("display", "none");
        $("#times").css("display", "none");
        $("#gallery").css("display", "none");
      });
      $(document).click(e => {
        var container = $("#formPost");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          $("#showButton").css("display", "none");
          $("#times").css("display", "none");
          $("#gallery").css("display", "none");
        }
      });
      $("#textPost").keyup(() => {
        if ($("#textPost").val() != "") {
          $("#buttonPost").attr("disabled", false);
        } else {
          $("#buttonPost").attr("disabled", true);
        }
      });

      $("#upload").change(function (e) {
        $("#gallery").css("display", "block");
        $("#showButton").css("display", "block");
        $("#times").css("display", "block")
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
        $('#buttonPost').text('กำลังโพส..')
        var myTextPost = $("#textPost").val();
        var myId = firebase.auth().currentUser.uid;
        var databaseRef = firebase.database().ref("post").child(myId);
        var postId = firebase.database().ref("post").child(myId).push().key;
        if (document.querySelector('#gallery').childNodes.length == "0") {
          console.log("เข้าเงื่อนไข");
          databaseRef.child(postId).set({
            textPost: myTextPost || "",
            time: Date.now()
          }).then(() => {
            swal({
              icon: 'success',
              title: 'โพสสำเร็จ'
            })
          }).then(() => {
            $('#gallery').empty();
            $("#textPost").val('');
            $('#buttonPost').text('โพส')
            setTimeout(() => {
              window.location.reload()
            }, 500);
          })

        } else {
          databaseRef.child(postId).set({
              textPost: myTextPost || "",
              time: Date.now()
            })
            .then(() => {
              if (document.querySelector('#gallery').childNodes.length) {
                var j = 1;
                for (let i = 0; i < document.querySelector("#gallery").childNodes.length; i++) {
                  var fileName = Date.now();
                  var firebaseFileRef = firebase.storage().ref("post").child(`${fileName}.jpg`);
                  firebaseFileRef.putString(
                    document.querySelector("#gallery").childNodes[i].src,
                    "data_url", {
                      contentType: "image/jpg"
                    }
                  ).then((snapshot) => {
                    uploadImage(snapshot).then((url) => {
                      postData(url, myId, postId).then(() => {
                        if (j == document.querySelector('#gallery').childNodes.length) {
                          swal({
                            title: 'โพสสำเร็จ',
                            icon: 'success'
                          }).then(() => {
                            $('#gallery').empty();
                            $("#textPost").val('');
                            $('#buttonPost').text('โพส')
                            setTimeout(() => {
                              window.location.reload()
                            }, 500);
                          })
                        }
                        j++;
                      })
                    })
                  })
                }
              }
            })
        }
      });

      var postData = function (url, myId, postId) {
        return new Promise((resolve, reject) => {
          firebase.database().ref("post").child(myId).child(postId).child("images").push().set({
            imagePost: url
          }).then(() => {
            resolve('success');
          })
        });
      }

      var uploadImage = function (snapshot) {
        return new Promise((resolve, reject) => {
          snapshot.ref.getDownloadURL().then(url => {
            resolve(url);
          })
        })
      }
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