$(document).ready(function () {
    $("#register-form").submit(function (e) {
        e.preventDefault();

        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var company = $("#company").val();
console.log(firstName,lastName)
        $.ajax({
            url: BASE_URL + "/test/register",
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            data: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                company: company
            }),
            success: function (data) {
                var token = data.token;
                

                // Store the token in local storage
                localStorage.setItem("jwtToken", token);
                getRooms("test1").then(function(){
                window.location.href = "../home.html";
                });
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