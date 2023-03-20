function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "../index.html";
    
}

if (localStorage.getItem("jwtToken")) {
    checkTokenExpiration(localStorage.getItem("jwtToken"));
    $('#logoutButton').click(logout);
} else {
    window.location.href = "../index.html";
}

function checkTokenExpiration(token) {
    if (!token) {
      // Token not found in local storage
      return;
    }
  
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert expiration time from seconds to milliseconds
    const currentTime = Date.now();
    const timeDifference = expirationTime - currentTime;
  
    if (timeDifference <= 0) {
      // Token has expired, remove from local storage
      localStorage.removeItem('jwtToken');
      window.location.href = "../index.html";

    }
  }

  function checkTokenUser(token){
    if(!token) {
    return;
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const userEmail = tokenData.sub; // Convert expiration time from seconds to milliseconds
    return userEmail;
  

  }