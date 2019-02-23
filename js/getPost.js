getWallPost();

//ฟังก์ชั่นในการรับค่าการกดไลค์
function likePost(id) {
  var key = $(id).attr('key-post');
  var keyPost = JSON.parse(key).keyPost;
  var keyUserPost = JSON.parse(key).keyUserPost;


  firebase.auth().onAuthStateChanged(user => {
    firebase.database().ref("user").child(user.uid).on("value", userResult => {
      var nameLike = userResult.val().name || "";
      var lastNameLike = userResult.val().lastName || "";
      var pofileImageLike = userResult.val().pofileImage || "../image/default.png";
      var check = "";
      var databaseRef = firebase.database().ref("post").child(keyUserPost).child(keyPost)
      databaseRef.once("value", valuePost => {
        check = valuePost.val().likePost
        if (check == null) {
          databaseRef.child("likePost").child(user.uid).set({
            name: nameLike,
            lastName: lastNameLike,
            pofileImage: pofileImageLike,
            time: Date.now()
          })
        } else {
          databaseRef.child("likePost").once("value", like => {
            like.forEach(like => {
              if (user.uid == like.key) {
                return databaseRef.child("likePost").child(user.uid).remove();
              } else {
                databaseRef.child("likePost").child(userResult.key).set({
                  name: nameLike,
                  lastName: lastNameLike,
                  pofileImage: pofileImageLike,
                  time: Date.now()
                })
              }
            })
          })
        }
      })
    })
  })
}

//ฟังก์ชั่นในการรับค่าจากคอมเม้น
function commentPost(id) {
  var textComment = $(id).val();
  console.log(textComment);
  var key = $(id).attr('key-comment');
  var keyPost = JSON.parse(key).keyPost;
  var keyUserPost = JSON.parse(key).keyUserPost;

  firebase.auth().onAuthStateChanged(user => {
    firebase.database().ref("user").child(user.uid).on("value", userResult => {
      var nameComment = userResult.val().name || "";
      var lastNameComment = userResult.val().lastName || "";
      var pofileImageComment = userResult.val().pofileImage || "../image/default.png";

      firebase.database().ref('post').child(keyUserPost).child(keyPost).child("comment").push({
        name: nameComment,
        lastName: lastNameComment,
        pofileImage: pofileImageComment,
        textComment: textComment,
        time: Date.now(),
        userkey: userResult.key

      })
    })
  })
  let clear = $('#textComment' + keyPost).val(null);
}

//ฟังก์ชั่นในการซ่อนแสดงคอมเมนค์
function showComment(id) {
  var key = $(id).attr('key-showComment');
  $('#userAllComment' + key).toggle();
}

function focusText(id) {
  var key = $(id).attr('key-focusText');
  $('#userAllComment' + key).toggle();
  $('#textComment' + key).focus();
}

function getWallPost() {
  $('#gallery').empty();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentImage = '';
      firebase.database().ref("user").on("child_added", userResult => {


        const namePost = userResult.val().name || ''
        const profileImage = userResult.val().pofileImage || '../image/default.png'
        if (user.uid == userResult.key) {
          currentImage = profileImage;
        }
        firebase.database().ref("post").child(userResult.key).once("value", response => {
          var data = [];

          var keyUserPost = response.key;
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

            var commentArr = '';
            var likeArr = '';
            var time = moment(response.time).format('DD-MM-YYYY HH:mm:ss');
            const textPost = response.textPost || '';
            const keyPost = response.key;
            var commentCount = 0;
            var likePostCount = 0;
            firebase.database().ref("post").child(userResult.key).child(keyPost + '/comment').on('value', comment => {
              comment.forEach(comment => {

                commentArr += ` <div class="col-md-1" >
                <img class="circle" src="${comment.val().pofileImage}" id="userCommnet${keyPost}"> </div>
                <div class="col-md-11"> <label type="label text-block" id="labelComment${keyPost}" class="labelComment">
                <span value=" ">${comment.val().name} &nbsp</span><span value="">${comment.val().lastName} </spna>&nbsp; &nbsp;<span value="">${comment.val().textComment}</span></label> 
                </div>\n`
                commentCount++

              })
            })
            likeArr = ` <strong style="color:gray;" id="likePost${keyPost}"><i class="fa fa-heart-o">&nbsp;</i>ถูกใจ</strong>`;
            firebase.database().ref("post").child(userResult.key).child(keyPost + '/likePost').on("value", (like) => {
              like.forEach(like => {
                if (like.key == user.uid) {
                  likeArr = ` <strong style="color:	#FF69B4;" id="likePost${keyPost}"><i class="fa fa-heart-o">&nbsp;</i>ถูกใจ</strong>`;
                }
                likePostCount++
              })
            })

            firebase.database().ref("post").child(userResult.key).child(keyPost + '/images').once('value').then(image => {
              image.forEach(image => {

                imageArr += `<div class='col-6'><img src='${image.val().imagePost}' class='img-responsive img-post'></div> \n`;

              })
            }).then(() => {

              var domCard = document.createElement('div');
              domCard.className = 'card';
              domCard.innerHTML = ` 
          <div class="card-body">
            <i class="fa fa-align-justify choice" ></i>

            <div class="row">
            <div class="col-md-1">
              <img class="circle" src="${profileImage}"  />&nbsp;</div>
              <div class="col-md">
                <p>${namePost}</p>
                <p class="fontPost">${time}</p>
              </div>
            </div>

            <div class="form-group">
              <span>${textPost}</span>
            </div>

            <div class="row justify-content-md-center img-center">
            ${imageArr} 
            </div>

            <div class="row ">
              <div class="col-md-6 text-center" id="showLikePostCount${keyPost}">
                <a class="heartLike"><i class="fa fa-heart-o iconLike"></i><span id="likePostCount${keyPost}">&nbsp;${likePostCount}</span></a></div>
              <div class="col-md-6 text-center" id="showLinkCommnetCount">
                <span class="fontPost" style="cursor:pointer" onclick="showComment(this)" key-showComment=${JSON.stringify(keyPost)}>ความคิดเห็น &nbsp;<spnn>${commentCount}</spnn>&nbsp;รายการ</span>   
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-6">
                <button class="btn btn-light btn-block text-center" onclick="likePost(this)" key-post=${JSON.stringify({ 
                  keyPost,
                  keyUserPost
                })}>
                  ${likeArr}
                </button>
              </div>

              <div class="col-md-6">
                <button class="btn btn-light btn-block text-center"  onclick="focusText(this)" key-focusText=${JSON.stringify(keyPost)}><strong style="color:gray;" ><i class="fa fa-comment-o"></i>
                    แสดงความคิดเห็น</strong>
                </button>
              </div>
            </div>

            <hr>
          
            <div class="row" id="userAllComment${keyPost}" style="display:none">
           
              ${commentArr} 
            </div>
          
            <div class="row">
            <div class="col-md-1" >
              <img class="circle" src="${currentImage}" id="userCommnet${keyPost}"> </div>
              <div class="col-md-11"> <input type="text text-block" id="textComment${keyPost}" onkeypress="if (event.keyCode==13){commentPost(this); return false;}"
              key-comment=${JSON.stringify({
                keyPost,
                keyUserPost
              })} class="textComment" placeholder="เขียนความคิดเห็น..."></div>
            </div>

        </div>
        `
              $('#allPost').append(domCard);


            })

          })
        })


      })

    }
  })
}