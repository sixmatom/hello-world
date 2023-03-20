$(document).ready(function () {
    $("#login-form").submit(function (e) {
        e.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        $.ajax({
            url: BASE_URL + "/test/authenticate",
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            data: JSON.stringify({
                email: email,
                password: password,
                }),
            success: function (data) {
               
                var token = data.token;
                

                // Store the token in local storage
                localStorage.setItem("jwtToken", token);

                getRooms("test1");

                window.location.href = "../home.html";
            },
            error: function (xhr, status, error) {
                const errorMessage = "Error: " + xhr.responseJSON.error;
                const errorElement = document.querySelector(".w-form-fail > div");
                errorElement.textContent = errorMessage;

                
                console.log("Error: " + xhr.responseJSON.error );
            }
        });
    });
});