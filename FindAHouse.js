//Functions
//Function to extract value based on key from gptAdTargeting
function KeyValue(StringText, key)
{
	//Create Query
	var query = "gptAdTargeting.push({ key: \'"+key+"\', value: \'";
	if (StringText.includes(query))				
	{
		//Get the start index
		var QueryStart = StringText.indexOf(query);
		QueryStart = QueryStart + query.length;
		
		//Get everything after the start point
		var TempString = StringText.slice(QueryStart);
		
		//Find the end of the line \n
		var QueryEnd = TempString.indexOf("\'");
		
		//Extract the data needed
		var Result = TempString.substring(0,QueryEnd);
		return Result;
	}
	return "";
}

//Function to extract <meta property="og:latitude" content="45.5017304"/> -> 45.5017304
function getMeta(Tag)
{
	const metas = document.getElementsByTagName('meta');
	for (let i=0; i<metas.length; i++)
	{
		if (metas[i].getAttribute('property') === Tag)
		{
			return metas[i].getAttribute('content');
			break;
		}
	}
	return '';
}
// Read all database results
function readAll() 
{
	var db;
	var request = window.indexedDB.open("FindAHouseData", 1);
	
	request.onsuccess = function(event) 
	{
		db = request.result;
		var objectStore = db.transaction("NotSureWhatThisIs").objectStore("NotSureWhatThisIs");

		objectStore.openCursor().onsuccess = function(event) 
		{
			var cursor = event.target.result;

			if (cursor) 
			{
				console.log(cursor.value);
				cursor.continue();
			} 
			else 
			{
				//alert("No more entries!");
			}
		};
		
	};
	
	
}
//Function to add a listing to the database
function AddListing(db, Id, Price, Latitude, Longitude, Title, Stats, Comments, Url) 
{
	// Start a database transaction and get the notes object store
	let tx = db.transaction(['NotSureWhatThisIs'], 'readwrite');
	let store = tx.objectStore('NotSureWhatThisIs');  

	// Put the sticky note into the object store
	let note = {id: Id, price: Price, latitude: Latitude, longitude: Longitude, title: Title, stats: Stats, comments: Comments, url: Url};
	store.add(note);  // Wait for the database transaction to complete
	tx.oncomplete = function() 
	{ 
		console.log('Entry added!');
	}
	tx.onerror = function(event) 
	{
		console.log('error AddListing: ' + event.target.errorCode);
		window.alert('error AddListing: ' + event.target.errorCode);
	}
}

function submitNote() {
  let message = document.getElementById('newmessage');
  addStickyNote(db, message.value);
  message.value = '';
}

function ColorBorders(db,Id,DivId)
{
	//Variables 
	var DefaultImg = "http://3.bp.blogspot.com/-KL7d7LdSANg/Tm5VLQf9k4I/AAAAAAAAACo/cSV52JoD7vk/s1600/cat-wallpaper-34-713472.jpg";
	var Border_Yes = '2px solid #44C5CB'; 		//Inside geofence (Blue)
	var Border_No = '2px solid #F53D52'; 		//Outside geofence (Red)
	var Border_Maybe = '2px solid #FF9200'; 	//On the border (Orange)
	var Border_Unknown = '2px solid #FCE315';	//Unprocessed (Yellow)

	//Setup for IndexedDB query 
	var transaction = db.transaction(["NotSureWhatThisIs"]);
	var objectStore = transaction.objectStore("NotSureWhatThisIs");
	var request = objectStore.get(Id);
	
	//Error
	request.onerror = function(event) 
	{
		console.log('error GetListing: ' + event.target.errorCode);
		window.alert('error GetListing: ' + event.target.errorCode);
	};
	//Success
	request.onsuccess = function(event) 
	{
		//Get the image to be edited
		const Divs = document.getElementsByTagName('div');
		var img = Divs[DivId].getElementsByTagName("img");
		//img[0].src = DefaultImg;
		
		// Do something with the request.result!
		if(request.result) 
		{
			//Listing exists make the border blue
			console.log("Listing " +Id+": Found");
			console.log(request.result);
			img[0].style.border = Border_Yes;
			img[0].title="I'm sorry it's ended up this way and I'm trying to come up with something interesting to say but there is nothing interesting to say";
		} 
		else 
		{
			//Listing does not exist make the border yellow
			console.log("Listing " +Id+": Not found");
			img[0].style.border = Border_Unknown;
			img[0].title="Unknown";
		}
	};
}

		 

//IndexedDB Setup
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
         
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

//Check if IndexedDB is supported
if (!window.indexedDB) 
{          
	window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
//Create some sample data
const SampleData = [
{ id: 1484576623, price: 1500, latitude: 45.5350003, longitude: -73.6207934, title: "Condo for rent", stats: 0, comments: "None", url: "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/condo-for-rent/1484576623?siteLocale=en_CA"}
];




//Start of the project
console.log("Program Start FindAHouse");
//window.alert("Hello ^_^ FindAHouse is running!")









//Global Variables
var Id, Price, Latitude, Longitude, Title, Stats, Comments, Url;
Comments = "None"; //Default value
Stats = 0;

chrome.runtime.onMessage.addListener(assignTextToTextareas);
function assignTextToTextareas(message){
	console.log("PartA");
	
    Comments = message.updateTextTo;
	console.log(Comments);

    //chrome.runtime.onMessage.removeListener(assignTextToTextareas);  //optional
}
console.log("PartB");

















//Start the database and only proceed if database values have been received
let db;
let dbReq = indexedDB.open('FindAHouseData', 3);
dbReq.onupgradeneeded = function(event) 
{
	// Set the db variable to our database so we can use it!  
	db = event.target.result;	
	console.log("Database upgrade");
	
	var objectStore = db.createObjectStore("NotSureWhatThisIs", {keyPath: "id"});
	for (var i in SampleData) 
	{
		objectStore.add(SampleData[i]);
	}

}
dbReq.onsuccess = function(event) 
{
	//Database connected
	console.log("Database on");
	db = event.target.result;
	
	//Check if it's a specific listing or some search results
	var PageTitle = getMeta('og:title') //String

	var SearchMode = PageTitle.localeCompare("Kijiji Canada");
	if (SearchMode == 0)
	{
		//Enter search page mode
		console.log("Search page mode");
		
		//Get the div items
		const Divs = document.getElementsByTagName('div');
		for (let i=0; i<Divs.length; i++)
		{
			var Div = Divs[i];
			var tempId = Div.getAttribute('data-listing-id'); //String
			
			//If this Div has an Id
			if (tempId)
			{
				Id = parseInt(tempId);
				//Set the image and border
				ColorBorders(db,Id,i);
			}
		}
		
	}
	else
	{
		//Enter listing page mode
		console.log("Listing mode");
		
		//Get the header of the document (where all the content I need is stored)
		var theHead = document.head; //object
		
		//Get all the scripts in the header
		const Scripts  = theHead.getElementsByTagName('script');
		for (let i=0; i<Scripts.length; i++)
		{
			var Script = Scripts[i]; //Object
			if (Script.text) //Remove scripts without text
			{
				var ScriptText = Script.text;
				if (ScriptText.includes('gptAdTargeting'))
				{
					Price = KeyValue(ScriptText, "price");
					Id = KeyValue(ScriptText, "g_adid");
					if (Price.length > 0 || Id.length > 0)
					{
						break;
					}
				}	
			}				
		}
		// Only proceed if an Id has been found else 
		console.log(Id);
		if (Id.length>0)
		{
			//Enter valid listing mode
			console.log("Valid listing mode");
			
			//Other variables
			var Latitude = getMeta('og:latitude') //String
			var Longitude = getMeta('og:longitude') //String
			var Url = getMeta('og:url') //String
			var TitleLong = getMeta('og:title') //String
			
			//Trim Title
			var CutPoint = TitleLong.indexOf(" |");
			var Title =  TitleLong.substring(0,CutPoint);
			
			//Log results
			console.log(Price);
			console.log(Title);
			console.log(Latitude);
			console.log(Longitude);
			console.log(Url);
			
			//TESTING ZONE: Trying to change the text in the box
			
			

			
			
			
		}
		else
		{
			//It's not in the right format skip section
			console.log("Strange format listing skipped");
		}
		
		
	}


	//Stuff to do here
	//addStickyNote(db, 4);
	//AddListing(db, 5);
	//GetListing(db, 5); 
}
dbReq.onerror = function(event) 
{
	alert('error opening database ' + event.target.errorCode);
}
















/*
***** ROLL THE CREDITS *****
>> OTHERS <<
 * Firefox plug in tutorial			https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
 * Cat images with Javascript		https://stackoverflow.com/questions/19693915/replace-all-images-with-one-image-javascript
 * JavaScript HTML DOM Elements 	https://www.w3schools.com/js/js_htmldom_elements.asp
 * getMeta function					https://www.w3schools.com/jsref/met_element_getattribute.asp
 * IndexedDB help 					https://www.tutorialspoint.com/html5/html5_indexeddb.htm
 * More IndexedDB help				https://medium.com/@AndyHaskell2013/build-a-basic-web-app-with-indexeddb-8ab4f83f8bda
 * Color palette					https://www.schemecolor.com/4-colors-kite.php
 * Function with Promise			https://stackoverflow.com/questions/49128292/indexeddb-wait-for-event
 * Text on images 					https://community.canvaslms.com/docs/DOC-4096
 * Adding HTML to HTML				https://stackoverflow.com/questions/3762385/best-way-to-inject-html-using-javascript
 * Popup to content script			https://stackoverflow.com/questions/40645538/communicate-data-from-popup-to-content-script-injected-by-popup-with-executescri
 
***** Thanks everyone! ***** 
 */
