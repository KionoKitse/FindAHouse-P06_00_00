//Functions
//Function to extract value based on key from gptAdTargeting
function KeyValue(StringText, key)
{
	//Create Query
	var query = "gptAdTargeting.push({ key: \'"+key+"\', value: \'";
	if (ScriptText.includes(query))				
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
function AddListing(db, Id, Price, Latitude, Longitude, Title, Url) 
{
	// Start a database transaction and get the notes object store
	let tx = db.transaction(['NotSureWhatThisIs'], 'readwrite');
	let store = tx.objectStore('NotSureWhatThisIs');  

	// Put the sticky note into the object store
	let note = {id: Id, price: Price, latitude: Latitude, longitude: Longitude, title: Title, url: Url};
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

//Function to get a specific listing
function GetListing(db, Id) 
{
	var transaction = db.transaction(["NotSureWhatThisIs"]);
	var objectStore = transaction.objectStore("NotSureWhatThisIs");
	var request = objectStore.get(Id);

	request.onerror = function(event) 
	{
		console.log('error GetListing: ' + event.target.errorCode);
		window.alert('error GetListing: ' + event.target.errorCode);
		return 0;
	};

	request.onsuccess = function(event) 
	{
		// Do something with the request.result!
		if(request.result) 
		{
			console.log("Listing " +Id+": Found");
			console.log(request.result);
			return 1;
		} 
		else 
		{
			console.log("Listing " +Id+": Not found");
			return 2;
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
{ id: 1485561878, price: 800, latitude: 45.5410856, longitude: -73.6129627, title: "Looking for  furnished studio", url: "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/looking-for-furnished-studio/1485561878?siteLocale=en_CA"}
];



//Variables 
var DefaultImg = "http://3.bp.blogspot.com/-KL7d7LdSANg/Tm5VLQf9k4I/AAAAAAAAACo/cSV52JoD7vk/s1600/cat-wallpaper-34-713472.jpg";

var Border_Yes = '2px solid #44C5CB'; 		//Inside geofence (Blue)
var Border_No = '2px solid #F53D52'; 		//Outside geofence (Red)
var Border_Maybe = '2px solid #FF9200'; 	//On the border (Orange)
var Border_Unknown = '2px solid #FCE315';	//Unprocessed (Yellow)



//Start of the project
console.log("Program Start FindAHouse");
//window.alert("Hello ^_^ FindAHouse is running!")

//Start the database and only proceed if database values have been received
let db;
let dbReq = indexedDB.open('FindAHouseData', 1);
dbReq.onupgradeneeded = function(event) 
{
	// Set the db variable to our database so we can use it!  
	db = event.target.result;
	
	console.log("Database upgrade");
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
			var Id = Div.getAttribute('data-listing-id');

			
			//If an Id is returned
			if (Id)
			{
				// Print the Id
				console.log(Id);
				
				//Check if the listing exists in the database
				var Status = GetListing(db,Id);
			
				//Get the image and modify 
				var Image = Div.getElementsByClassName("image");		
				var img = Div.getElementsByTagName("img");
				img[0].src = DefaultImg;
				
				if (Status == 1)
				{
					img[0].style.border = Border_Yes;
				}
				if (Status == 2)
				{
					img[0].style.border = Border_No;
				}
				
				//TODO: need to highlight what is good and other etc
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
		var Price;
		var Id;
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
	GetListing(db, 5); 
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
***** Thanks everyone! ***** 
 */
