$("#login-form").submit(function (e) {
    e.preventDefault();

    var email = $("#email").val();
    var password = $("#password").val();
    const errorElement = document.querySelector(".w-form-fail > div");
            errorElement.textContent = "waiting for login";
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