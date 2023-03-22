localStorage.getItem("jwtToken")
function getRooms(name) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: BASE_URL + "/getRooms",
      type: "POST",
      data: {
        name: name
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("jwtToken"));
      },
      success: function(data) {
         const rooms = data.list;
        localStorage.setItem("Rooms", JSON.stringify(rooms));
        resolve(data);
        
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // console.error('Error:', textStatus, errorThrown);
        reject(errorThrown);
      }
    });
  });
}

  
function getBooking (){
    
    $.ajax({
    url: BASE_URL + "/bookings",
    type: "GET",
    dataType: 'text',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("jwtToken"));
    },
    success: function (data) {
      // Do something with the booking data, e.g. create calendar events
      localStorage.setItem("Bookings", data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.error('Error:', textStatus, errorThrown);
    }
  });
}

function getBookingByRoom(roomName) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: BASE_URL + "/getBookingByRoom",
      type: "POST",
      data: {
        roomName: roomName
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("jwtToken"));
      },
      success: function(data) {
        localStorage.setItem(roomName, JSON.stringify(data.list));
        resolve(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // console.error('Error:', textStatus, errorThrown);
        reject(errorThrown);
      }
    });
  });
}

function makeBooking(name, timeStart, timeEnd, email, calendar) {
  return new Promise((resolve, reject) => {
    checkTokenExpiration(localStorage.getItem("jwtToken"))
    $.ajax({
      url: BASE_URL + "/makeBooking",
      type: "POST",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("jwtToken"));
      },
      headers: {
        'Content-Type': 'application/json'
      },

      data: JSON.stringify({
        "room": {
          "name": name
        },
        "timeStart": timeStart,
        "timeEnd": timeEnd,
        "userEmail": email,
        "user": {
          "email": email
        }
      }),
      success: function(data) {
        getBookingByRoom(name).then(function() {
        resolve(data);
      })
    },

      error: function(xhr, status, error) {
        // console.log(xhr.responseText);
        reject(xhr.responseText);
      }

    });

  });
}
function deleteBooking(bookingToken, roomName, userEmail) {
  return new Promise((resolve, reject) => {
  checkTokenExpiration(localStorage.getItem("jwtToken"))
  $.ajax({
  url: BASE_URL + "/cancelBooking",
  type: "POST",
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("jwtToken"));
  },
   
  data: {
    email: userEmail,
    token : bookingToken
  },
 
      
  success:function (data) {
    getBookingByRoom(roomName).then(function() {
      resolve(data);
    })
},
  
  error: function (xhr, status, error) {
    reject(xhr.responseText)
  }
});
});
}



  
  