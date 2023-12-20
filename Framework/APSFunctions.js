/*
=======================
APSFramework Library 

V1.0
Author: Marco Priarone
Date:	2023-02-23

Neven Copyright 2023
=======================
*/

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
var canvas;
var cnvsRelay;

var ctx;
var ctxRelay;

//Image Dish
var imgDishA;
var imgDishB;

//Active Dish
var imgDishAA;
var imgDishBA;

//Inactive Dish
var imgDishAI;
var imgDishBI;

//blind angels
var semiAngleA=0;
var semiaAngleB=0;

var DistA;
var DistB;

var DistAValue = 0;
var DistBValue = 0;

var AzimutA=0, AzimutB=0;


var valALimitLow = 0;
var valALimitUp = 180;
var valBLimitLow = 0;
var valBLimitUp = 180;

// same as above but cx and cy are the location of the point of rotation
// in image pixel coordinates
function drawImageCenter(image, x, y, cx, cy, scale, rotation){
	ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.rotate(rotation);
    ctx.drawImage(image, -cx, -cy,100,100);
} 
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
   // ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, radius, startAngle-Math.PI/2, endAngle-Math.PI/2);
    ctx.closePath();
    ctx.fill();
}

function drawBlindAngleA() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // sets scale and origin
    //console.log(valALimitLow+" "+valALimitUp);
    drawPieSlice(ctx, 50, 50, 48, valALimitLow, valALimitUp, '#ff0000');
}

function drawBlindAngleB() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // sets scale and origin
    drawPieSlice(ctx, 250, 50, 48, valBLimitLow, valBLimitUp, '#ff0000');
}
//crea una funzione per generare la lista di input text

function generaListaInput(id,numInput) {
    // ottiene il riferimento al div in cui verranno creati gli input
    var divInput = document.getElementById(id);
    
    // cicla per creare il numero di input specificati
    for (var i = 0; i < numInput; i++) {
      // crea un nuovo elemento input
      var nuovoInput = document.createElement("input");
      
      //imposta i valori di attributo per l'elemento input
      nuovoInput.type = "text";
      nuovoInput.id = "input-" + i;
      nuovoInput.name = "input-" + i;
      nuovoInput.placeholder = "Input " + (i + 1);
      
      // aggiunge l'elemento input al div
      divInput.appendChild(nuovoInput);
    }
  }
async function APSInit() {
    //console.log("APSInit");
    $APS.Post("APSInit", "", this.value);
    /*
    $APS.Post("SASGetRelayStatus", "", function (answer) {
        ControllerData= JSON.parse(answer); 
               
        if (ControllerData.Rel1)
            ctxRelay.drawImage(imgRelayOn,x,row,20,20);
        else
            ctxRelay.drawImage(imgRelayOff,x,row,20,20);
        
        document.getElementById("AzimutA").innerHTML = ControllerData.AzimutA/10;
        AzimutA = Number(ControllerData.AzimutA) * Math.PI / 1800;
    
    });
    */

   
/*
 sldALimitLow.oninput = function () {
        outpALimitLow.innerHTML = this.value;
		$SAS.Post("SASSetALimitLow", this.value, null);
    }
*/
  	
	/*
    var t = setInterval(function () {
		///$APS.Post("SASRefresh", this.value, null);
    }, 1000);
*/
}

function APSDownloadTable(table,callback) 
{ 
    console.log("DownloadTable " + table);  
    $APS.Post("DownloadTable", table, function(answer){ 
    console.log("GetSensor answer:"+answer);
    callback(answer);
});
}
function APSDownloadConfig(table,customerID,callback) 
{ 
    $APS.Post("DownloadConfig", table + "=" + customerID, function(answer){ 
    callback(answer);
});
}

function CheckLogin(username,password,callback) 
{ 
    $APS.Post("CheckLogin", username + "=" + password, function(answer){ 
    callback(answer);
});
}

function CheckLoginPIC(username,password,callback) 
{ 
    $APS.Post("CheckLoginPIC", username + "=" + password, function(answer){ 
    callback(answer);
});
}

function DownloadSwitchValue(customerID,callback) 
{ 
    console.log("DownloadSwitchValue " + customerID);  
    $APS.Post("DownloadSwitchValue", customerID, function(answer){ 
    console.log("answer:"+answer);
    callback(answer);
});
}

function DownloadJobsPIC(jobType,callback) 
{ 
    console.log("DownloadJobs " + jobType);  
    $APS.Post("DownloadJobsPIC", jobType, function(answer){ 
    console.log("answer:"+answer);
    callback(answer);
});
}

function SendTimeServicePIC(userID, jobID, service_date,service_time, service_description)
{
$APS.Post("SendTimeServicePIC", userID + "=" + jobID + "=" + service_date + "=" + service_time + "=" + service_description);
}
function CheckJobsInDayPIC(userID, jobDate,callback)
{
    $APS.Post("CheckJobsInDayPIC", userID + "=" + jobDate , function(answer){ 
        callback(answer);
    });   
}
function DownloadActivityPIC(id,callback) 
{ 
    console.log("DownloadActivity " + id);  
    $APS.Post("DownloadActivityPIC", id, function(answer){ 
    console.log("answer:"+answer);
    callback(answer);
});
}
function EditDeletePIC(userID,id,callback) 
{ 
    console.log("EditDelete " + id);  
    $APS.Post("DeleteActivityPIC", userID + "="+ id, function(answer){ 
    console.log("answer:"+answer);
    callback(answer);
});
}
function EditActivityPIC(userID, jobID, activityID, service_date, service_ticks, service_time, service_description)
{
$APS.Post("EditActivityPIC", userID + "=" + jobID + "=" + activityID + "="+ service_date + "=" + service_ticks + "="+ service_time + "=" + service_description);
}
/*
function SASSelectSmart(){ console.log("SelectSmart"); $SAS.Post("SASSelectSmart","", null); }
function SASSelectDirect(){ console.log("SelectDirect"); $SAS.Post("SASSelectDirect","", null); }

function SASSelectA(){ console.log("SelectA"); $SAS.Post("SASSelectA","", null); }
function SASSelectB(){ console.log("SelectB"); $SAS.Post("SASSelectB","", null); }
function SASSelectAuto() { console.log("SelectAuto"); $SAS.Post("SASSelectAuto", "", null); }

function SASSelectModelA(model) { console.log("SelectModelA " + model); $SAS.Post("SASSelectModelA", model, null); }
function SASSelectModelB(model) { console.log("SelectModelB " + model); $SAS.Post("SASSelectModelB", model, null); }
*/
//function SASSubmitIP() { console.log("IP " + IPA.value + " " + IPB.value + " " + IPController.value); $SAS.Post("SASSubmitIP", IPA.value +"="+ IPB.value + "=" + IPController.value, null); }