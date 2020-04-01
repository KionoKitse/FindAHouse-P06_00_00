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
			//Get the comment associated with the record
			var data = event.target.result;
			Comments = data.comments;
			Stats = data.stats;
			
			//Listing exists make the border blue and set the comment
			console.log("Listing " +Id+": Found");
			console.log(request.result);
			img[0].style.border = Border_Yes;
			img[0].title = Stats + ": " + Comments;
		} 
		else 
		{
			//Listing does not exist make the border yellow
			console.log("Listing " +Id+": Not found");
			img[0].style.border = Border_Unknown;
		}
	};
}

//Check if a ID already exists in IndexedDB
function CheckExistId(db,Id, Price, Latitude, Longitude, Title, Stats, Comments, Url)
{
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
		// Do something with the request.result!
		if(request.result) 
		{
			//Listing exists don't do anything
			console.log("Listing already exists don't add to database");
		} 
		else 
		{
			//Listing does not exist add it to the database
			console.log("Listing does not exist add it to the database");
			AddListing(db, Id, Price, Latitude, Longitude, Title, Stats, Comments, Url); 
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

//Global Variables
var Id, Price, Latitude, Longitude, Title, Stats, Comments, Url;
Comments = "None"; //Default value
Stats = 0;

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
		
		//Get the Id number and the Price
		var ValidListing = false;
		const Scripts  = theHead.getElementsByTagName('script');
		for (let i=0; i<Scripts.length; i++)
		{
			var Script = Scripts[i]; //Object
			if (Script.text) //Remove scripts without text
			{
				var ScriptText = Script.text;
				if (ScriptText.includes('gptAdTargeting'))
				{
					var tempPrice = KeyValue(ScriptText, "price");
					var tempId = KeyValue(ScriptText, "g_adid");
					if (tempPrice.length > 0 || tempId.length > 0)
					{
						Price = parseInt(tempPrice);
						Id = parseInt(tempId);
						ValidListing = true;
						break;
					}
				}	
			}				
		}
		
		// Only proceed the listing is in the correct format 
		console.log(Id);
		if (ValidListing)
		{
			//Enter valid listing mode
			console.log("Valid listing mode");
			
			//Get the other variables
			Latitude = parseFloat(getMeta('og:latitude')); 
			Longitude = parseFloat(getMeta('og:longitude'));
			Url = getMeta('og:url');
			var tempTitle = getMeta('og:title');
			
			//Trim Title
			var CutPoint = tempTitle.indexOf(" |");
			Title =  tempTitle.substring(0,CutPoint);
			
			//Log results
			console.log(Price);
			console.log(Title);
			console.log(Latitude);
			console.log(Longitude);
			console.log(Stats);
			console.log(Comments);
			console.log(Url);
			
			//Check if the listing already exists in the database
			CheckExistId(db,Id, Price, Latitude, Longitude, Title, Stats, Comments, Url);
			

			
			
			
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


chrome.runtime.onMessage.addListener(AddComment);
function AddComment(message){
	console.log("Updating Record");
	
	//Get the comment from the message from popup.js
    Comments = message.updateTextTo;
	Stats = message.updateStats;
	
	//Print the relevant data
	console.log(Id);
	console.log(Stats);
	console.log(Comments);

    //Connect to the database
	let db;
	let dbReq = indexedDB.open('FindAHouseData', 3);
	dbReq.onsuccess = function(event) 
	{
		//Database connected
		db = event.target.result;
		
		//Setup for IndexedDB query to get the record associated with Id
		var transaction = db.transaction(["NotSureWhatThisIs"],"readwrite");
		var objectStore = transaction.objectStore("NotSureWhatThisIs");
		var request = objectStore.get(Id);
		
		//Error could not get the record
		request.onerror = function(event) 
		{
			console.log("AddComment: Could not get record");
		};
		
		//Success retrieved the record 
		request.onsuccess = function(event) 
		{
			//Get the old comment and replace it with the new comment
			var data = event.target.result;
			data.comments = Comments;
			data.stats = Stats;
			var objRequest = objectStore.put(data);
			
			//Comment updated
			objRequest.onsuccess = function(event)
			{
				console.log('Success in updating record');
			}
			//Could not update comment
			objRequest.onerror = function(event)
			{
				console.log("AddComment: Could not update record");
			}
		};
	}
	dbReq.onerror = function(event) 
	{
		console.log("AddComment: Could not connect");
		alert('AddComment: error opening database ' + event.target.errorCode);
	}
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
 * Updating a record				https://stackoverflow.com/questions/26177259/indexeddb-updating-a-record
 
***** Thanks everyone! ***** 
 */
