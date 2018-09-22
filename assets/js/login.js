function reqListener() {
var data = JSON.parse(this.responseText);
if(!data.auth)
{
sweetAlert('Invalid Login!', 'Please try again', 'warning');    
document.getElementById("sfdcusername").focus();

}
else
{
    setjwtToken(data.token);
    document.location.href="/index";
}


}

window.onload = function() {
document.getElementById("sfdcusername").focus();

var input = document.getElementById("sfdcpassword");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("btnLogin").click();
  }
});
};





function reqError(err) {
sweetAlert('An Error Occured!', 'Please try again', 'error');    
}
    function doLogin()
    {
        item ={}
        item["email"] = document.getElementById('sfdcusername').value;
        item["password"] = document.getElementById('sfdcpassword').value;
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open(api_login_method,api_login, true);
        oReq.setRequestHeader('Content-Type','application/json; charset=utf-8');
        oReq.send(JSON.stringify(item));
    }