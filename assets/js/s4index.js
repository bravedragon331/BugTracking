var current_Org_Id;
var sfdcsaved = 1;

function getSFDCInfo() {
    doGetRequest(sfdcinfo_getall_method, sfdcinfo_getall, '');
}

function saveSFDCInfo() {
    item = {}
    item["name"] = document.getElementById('sfdcname').value;
    item["username"] = document.getElementById('sfdcusername').value;
    item["password"] = document.getElementById('sfdcpassword').value;
    item["security_token"] = document.getElementById('sfdcsecuritytoken').value;
    if (document.getElementById('toggle2').checked)
        item["istest"] = true;
    else
        item["istest"] = false;

    doRequest(sfdcinfo_save_method, sfdcinfo_save, JSON.stringify(item));
}

function reqListener() {
    var data = JSON.parse(this.responseText);
    console.log(data.errors);
    if (!(data.error || data.errors)) {
        var d = data
        d._id = htmlEncode(d._id);
        d._id = btoa(d._id);
        var result = '<td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="list-info"><div class="ei ei-shield" style="margin-top: 10;float: left;font-size: 25px;color: #25a0f5;"></div><div class="info"><span class="title">' + htmlEncode(d.name) + '</span><span class="sub-title">' + htmlEncode(d.username) + '</span></div></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="mrg-top-10"><span></span></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="relative mrg-top-10"><span class="status pending"> </span><span class="pdd-left-20">Pending</span></div></a></td>';
        var tableRef = document.getElementById('sfdcinfotbl');
        var newRow = tableRef.insertRow();
        newRow.innerHTML = result;
        sweetAlert('Salesforce Instance Saved for Monitoring!', 'You can now initiate scans', 'success');
        document.getElementById('closemodal').click();
    } else {
        sweetAlert('Error, Please Retry or Maximum License Limit Reached!', '', 'warning');
    }
}

function reqError(err) {
    sweetAlert('An Error Occured!', err, 'warning');
}

function doRequest(method, url, data) {
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.onerror = reqError;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.setRequestHeader('x-access-token', user_jwttoken);
    oReq.send(data);
}


function doGetRequest(method, url, data) {
    var oReq = new XMLHttpRequest();
    oReq.onload = reqgetListener;
    oReq.onerror = reqError;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.setRequestHeader('x-access-token', user_jwttoken);
    oReq.send(data);
}

function reqgetListener() {
    var data = JSON.parse(this.responseText);
    $.each(data, function(i, d) {
        d._id = htmlEncode(d._id);
        d._id = btoa(d._id);
        var result = '<td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="list-info"><div class="ei ei-cloud-loading" style="margin-top: 10;float: left;font-size: 25px;color: #25a0f5;"></div><div class="info"><span class="title">' + htmlEncode(d.name) + '</span><span class="sub-title">' + htmlEncode(d.username) + '</span></div></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="mrg-top-10"><span></span></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="relative mrg-top-10"><span class="status online"> </span><span class="pdd-left-20">Confirmed Monitoring</span></div></a></td>';
        var tableRef = document.getElementById('sfdcinfotbl');
        var newRow = tableRef.insertRow();
        newRow.innerHTML = result;
    });
}


function reqgetScanListener() {
    var data = JSON.parse(this.responseText);

    $.each(data, function(i, d) {
        d._id = htmlEncode(d._id);
        d._id = btoa(d._id);
        console.log("scan id is: " + d._id);
        var date = new Date(d.Created_date);
        var scanresults;

        if (d.status == "completed") {
            scanresults = '<td><a onclick="viewFindings(\'' + d._id + '\');"><div class="list-info"><div class="ei ei-shield" style="margin-top: 8;float: left;font-size: 25px;color: #25a0f5;"></div><div class="info"><span class="title" style="padding-top: 8px;">Security Scan @  ' + date.toGMTString() + '</span></div></div></a></td><td><a onclick="downloadScan(\'' + d._id + '\');"><div class="mrg-top-10"><span style="color:#ab0906;">' + htmlEncode(d.High) + '</span></div></a></td><td><a onclick="downloadScan(\'' + d._id + '\');"><div class="mrg-top-10"><span style="color:#f5a200;">' + htmlEncode(d.Medium) + '</span></div></a></td><td><a onclick="downloadScan(\'' + d._id + '\');"><div class="mrg-top-10"><span style="color:#0f9aee">' + htmlEncode(d.Low) + '</span></div></a></td><td><a onclick="downloadScan(\'' + d._id + '\');"><div class="relative mrg-top-10"><div class="ei ei-cloud-download"></div><span class="pdd-left-20">Download Results</span><span class="pdd-left-20">View Findings</span></div></a></td>';
        } else {
            scanresults = '<td><a ><div class="list-info"><div class="ei ei-shield" style="margin-top: 8;float: left;font-size: 25px;color: #25a0f5;"></div><div class="info"><span class="title" style="padding-top: 8px;">Security Scan @  ' + date.toGMTString() + '</span></div></div></a></td><td><a ><div class="mrg-top-10"><span style="color:#ab0906;">' + htmlEncode(d.High) + '</span></div></a></td><td><a ><div class="mrg-top-10"><span style="color:#f5a200;">' + htmlEncode(d.Medium) + '</span></div></a></td><td><a ><div class="mrg-top-10"><span style="color:#0f9aee">' + htmlEncode(d.Low) + '</span></div></a></td><td><a><div class="relative mrg-top-10" id="id' + d._id + '"><i class="fa fa-spinner fa-spin"></i><span class="pdd-left-20" style="color:#0f9aee;">Scan in progress</span></div></a></td>';
        }

        var result = scanresults;
        var tableRef = document.getElementById('sfdcscans');
        var newRow = tableRef.insertRow();
        newRow.innerHTML = result;
    });

    showScans();
}

function viewFindngs(Scan_Id){
	scanId = atob(Scan_Id);
    var body = {
    		orgId: atob(current_Org_Id),
    		scanId: atob(scan_id)
    }
    var options ={
    		headers: {
    			'Content-Type': 'application/json; charset=utf-8',
    			'x-access-token': user_jwttoken
    		}
    }
    axios.get('http://localhost:8080/scan/'+scanId, body, options)
        .then((response) => {
            console.log(response.data);
            var result = '<td><a onclick="getFindingsDetail(\'' + d._id + '\');"><div class="list-info"><div class="ei ei-cloud-loading" style="margin-top: 10;float: left;font-size: 25px;color: #25a0f5;"></div><div class="info"><span class="title">' + htmlEncode(d.name) + '</span><span class="sub-title">' + htmlEncode(d.username) + '</span></div></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="mrg-top-10"><span></span></div></a></td><td><a onclick="getsfdcScans(\'' + d._id + '\');"><div class="relative mrg-top-10"><span class="status online"> </span><span class="pdd-left-20">Confirmed Monitoring</span></div></a></td>';
            var tableRef = document.getElementById('sfdcfindings');
            var newRow = tableRef.insertRow();
        })
        .catch((err) => {
            console.log(err);
            var spanRef = document.getElementById('id' + scan_id);
            spanRef.innerHTML = '<div class="ei ei-crossroads"></div><span class="pdd-left-20" style="color:#FF0000;">Error</span>';
        });	
}
function downloadScan(Scan_Id) {
    item = {}
    item["scanid"] = atob(Scan_Id);
    doDownloadScansRequest(download_a_scan_method, download_a_scan, JSON.stringify(item));

}

function doDownloadScansRequest(method, url, data) {
    var oReq = new XMLHttpRequest();
    oReq.onload = reqDownloadScansListener;
    oReq.onerror = reqError;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.setRequestHeader('x-access-token', user_jwttoken);
    oReq.send(data);
}

function reqDownloadScansListener() {


    a = document.createElement('a');
    var binaryData = [];
    binaryData.push(this.responseText);
    a.href = window.URL.createObjectURL(new Blob(binaryData, {
        type: "application/octet-stream"
    }))
    a.download = "scan-file.xls";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
}

function reqCreateScanListener() {
    var data = JSON.parse(this.responseText);
    data._id = htmlEncode(data._id);
    data._id = btoa(data._id);
    console.log("new scan id" + data._id);
    runPMD(data._id);
}

function doCreateScanRequest(method, url, data) {
    var oReq = new XMLHttpRequest();
    oReq.onload = reqCreateScanListener;
    oReq.onerror = reqError;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.setRequestHeader('x-access-token', user_jwttoken);
    oReq.send(data);
}

function createAScan() {

    swal({
        title: "Do you want to initate a scan?",
        text: "You will receive an email once the Scan completes",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        confirmButtonColor: "#0f9aee",
        cancelButtonText: "No",
        cancelButtonColor: "#F8BB86",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(isConfirm) {
        if (isConfirm) {
            item = {}
            item["org_id"] = atob(current_Org_Id);
            doCreateScanRequest(create_a_scan_method, create_a_scan, JSON.stringify(item));
            getsfdcScans(current_Org_Id);
            swal("Scan Started!", "Your SFDC org is being scanned.", "success");
        } else {
            swal("Cancelled", "Scan aborted", "error");
        }
    });
}

function runPMD(scan_id) {
    console.log('in runPMD');
    
    var body = {
    		orgId: atob(current_Org_Id),
    		scanId: atob(scan_id)
    }
    var options ={
    		headers: {
    			'Content-Type': 'application/json; charset=utf-8',
    			'x-access-token': user_jwttoken
    		}
    }
    axios.post('http://localhost:8080/scan/start', body, options)
        .then((response) => {
            console.log(response.data);
            var spanRef = document.getElementById('id' + scan_id);
            spanRef.innerHTML = '<div class="ei ei-cloud-download"></div><span class="pdd-left-20" style="color:#7CFC00;">Scan complete</span>';
            //showPage();
            display(response.data);
            document.getElementById('VisualizeScan').click();
        })
        .catch((err) => {
            console.log(err);
            var spanRef = document.getElementById('id' + scan_id);
            spanRef.innerHTML = '<div class="ei ei-crossroads"></div><span class="pdd-left-20" style="color:#FF0000;">Error</span>';
        });
}

function getsfdcScans(Org_Id) {

    current_Org_Id = Org_Id;
    var tableRef = document.getElementById('sfdcscans');
    tableRef.innerHTML = '';
    item = {}
    item["org_id"] = atob(Org_Id);
    doGetScansRequest(list_all_scans_method, list_all_scans, JSON.stringify(item));
}



function doGetScansRequest(method, url, data) {
    item = {}
    item["name"] = document.getElementById('sfdcname').value;
    var oReq = new XMLHttpRequest();
    oReq.onload = reqgetScanListener;
    oReq.onerror = reqError;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    oReq.setRequestHeader('x-access-token', user_jwttoken);
    oReq.send(data);
}

function showFindings(){
    document.getElementById("findingslist").style.display = "block";
    document.getElementById("orgslist").style.display = "none";
    document.getElementById("scanslist").style.display = "none";
    document.getElementById("scansBreadCrumb").style.display = "none";
    document.getElementById("findingsBreadCrumb").style.display = "block";
}
function showScans(){
    document.getElementById("findingslist").style.display = "none";
    document.getElementById("orgslist").style.display = "none";
    document.getElementById("scanslist").style.display = "block";
    document.getElementById("scansBreadCrumb").style.display = "block";
    document.getElementById("findingsBreadCrumb").style.display = "none";
}
function showOrgs() {
    document.getElementById("findingslist").style.display = "none";
    document.getElementById("orgslist").style.display = "block";
    document.getElementById("scanslist").style.display = "none";
    document.getElementById("scansBreadCrumb").style.display = "none";
    document.getElementById("findingsBreadCrumb").style.display = "none";
}

verifyjwtToken();
getSFDCInfo();