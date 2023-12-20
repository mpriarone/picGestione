/*
=======================
APS Framework Library 

V1.0
Author: Marco Priarone
Date:	2023-02-23

Neven Copyright 2023
=======================
*/


function TAPSFramework()
{
    var MiaProprietà = 1;
    var Initialized = 0;

	this.Post = function (Command, Data, Callback)
    {

        if (Initialized = 0)
        {
            APSInit();
            Initialized = 1;
        }
		// per accedere a MiaProprietà devo usare obbligatoriamente il prefisso this.
		// this.MiaProprietà = 2;
		// oppure
		// if (this.MiaProprietà > 5) ......
		

		// se lavoro su funzioni di callback devo per forza fare riferimento all'istanza $CMV!!!		
		
        var HttpAjax = new XMLHttpRequest();
        HttpAjax.onreadystatechange = function (answer) {
            if (HttpAjax.readyState == 4 || HttpAjax.readyState == "complete") {
                if (Callback != null)
				{
	                  Callback(HttpAjax.responseText);
				}
            }
        };
		console.log("POST "+Command);
        HttpAjax.open("POST", Command, true);
        var Message = Command;
        if (Data != null)
            Message += "=" + Data;
        HttpAjax.send(Message);
	    //console.log("SEND "+Message);
    }
		
	this.Initialize = function()
	{
		// TODO implementa inizializzazione di libreria
		
		//alert("Libreria CMV inizializzata");
	}
}

$APS = new TAPSFramework();

if (window.addEventListener) {
	window.addEventListener('load', function () { $APS.Initialize(); })
} else {
	window.attachEvent('onload', function () { $APS.Initialize(); })
}

