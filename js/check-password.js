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