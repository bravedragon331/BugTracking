var baseurl = '';
var homeurl = '/index';

var sfdcinfo_save = baseurl + '/sfdcinfo';
var sfdcinfo_getall = baseurl + '/sfdcinfo';
var sfdcinfo_getdetails = baseurl + '/sfdcinfo/';
var api_login = baseurl + '/api/login';
var api_logout = baseurl + '/api/logout';
var sfdcinfo_save = baseurl + '/sfdcinfo';
var create_a_scan = baseurl + '/scan';
var list_all_scans = baseurl + '/scan/list';
var download_a_scan = baseurl + '/scan/download';
var sfdcinfo_save_method = 'post';
var sfdcinfo_getall_method = 'get';
var api_login_method = 'post';
var api_logout_method = 'get';
var user_jwttoken = sessionStorage.getItem('user_jwttoken');;
var api_verifyjwtToken = '/api/verify_authentication';
var api_verifyjwtToken_method = 'post';
var sfdcinfo_getdetails_method = 'post';
var list_all_scans_method = 'post';
var download_a_scan_method = 'post';
var create_a_scan_method = 'post';


function setjwtToken (jwttoken)
{
	user_jwttoken = jwttoken;
	sessionStorage.setItem('user_jwttoken', user_jwttoken);
}

function deletejwtToken()
{
	sessionStorage.removeItem('user_jwttoken');	
	document.location.href="/logout";

}

function verifyjwtToken()
{
	if(user_jwttoken){
	var oReq = new XMLHttpRequest();
	oReq.onload = reqAuthListner;
	oReq.onerror = reqAuthError;
	oReq.open(api_verifyjwtToken_method,api_verifyjwtToken, true);
	oReq.setRequestHeader('Content-Type','application/json; charset=utf-8');
	oReq.setRequestHeader('x-access-token',user_jwttoken);
	oReq.send('{}');

	}
	else
	{
	document.location.href="/login";
	}
}

function reqAuthListner() {
	try{
var data = JSON.parse(this.responseText);
if(!data.auth)
{
sweetAlert('Login Again!', 'Your session expired', 'warning');  
setjwtToken();
document.location.href="/login";
}
else
{
	document.getElementById("spanUsername").innerText = htmlEncode(data.username);	
}
}
catch(ex)
{
sweetAlert('An error occured!', 'Please try again', 'error');	
}

}

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function reqAuthError(err) {
sweetAlert('An Error Occured!', 'Please try again', 'error');    
}