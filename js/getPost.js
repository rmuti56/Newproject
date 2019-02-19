firebase.auth().onAuthStateChanged(user => {
  if (user) {

    firebase.database().ref("user").on("child_added", userResult => {
      const namePost = userResult.val().name || ''
      const profileImage = userResult.val().pofileImage || '/image/loading.gif'
      firebase.database().ref("post").child(userResult.key).once("value").then(response => {
        response.forEach(response => {
          var imageArr = '';
          var time = moment(response.val().time).format('DD-MM-YYYY HH:mm:ss');
          const textPost = response.val().textPost || '';
          const keyPost = response.key;
          firebase.database().ref("post").child(userResult.key).child(response.key+'/images').once('value').then(image => {
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
                <img class="circle" src="${profileImage}"  />&nbsp;
                <div class="col-sm-">
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
                <div class="col-md-6 text-center" id="showLikePostCount">
                  <a class="heartLike"><i class="fa fa-heart-o iconLike"></i><span id="likePostCount">&nbsp;0</span></a></div>
                <div class="col-md-6 text-center" id="showLinkCommnetCount">
                  <span class="fontPost">ความคิดเห็น &nbsp;<spnn id="commentPostCount">0</spnn>&nbsp;รายการ</span>
                </div>
              </div>
              <hr />

              <div class="row">
                <div class="col-md-6">
                  <button class="btn btn-light btn-block text-center">
                    <strong style="color:gray;"><i class="fa fa-heart-o">&nbsp;</i>ถูกใจ</strong>
                  </button>
                </div>

                <div class="col-md-6">
                  <button class="btn btn-light btn-block text-center"><strong style="color:gray;"><i class="fa fa-comment-o"></i>
                      แสดงความคิดเห็น</strong>
                  </button>
                </div>
              </div>

              <hr>
              <div class="row">
                <img class="circle" src="${profileImage}" id="userCommnet">
                <div class="col-md-11"> <input type="text text-block" id="textComment" class="textComment" placeholder="เขียนความคิดเห็น..."></div>
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