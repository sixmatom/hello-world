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
    
                getRooms("Laan Corpus den Hoorn 106")
                .then(function(rooms){
                    var promises = rooms.list.map(function(room) {
                        return getBookingByRoom(room.name);
                    });
                    return Promise.all(promises);
                })
                .then(function(data) {
                    // Here you can process the data returned by getBookingByRoom
                    window.location.href = "../home.html";
                })
                .catch(function(error){
                    console.log(error)
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