### Description  
 
### Notes to user 
 * Project documented at https://kionokitse.wordpress.com/findahouse/
 * The Geofence is hard coded and must be changed as needed (FindAHouse.js Line 204,205)
 
### Progress log 
 * 2020-03-17: Accidentally formatted my drive 
 * 2020-03-18: Trying to rebuild based on notes
 * 2020-03-18: Next step -> Find if I'm on a search page or listing in Kijiji 
 * 2020-03-18: Got everything back basically
 * 2020-03-18: Need to wait for a return form IndexedDB then store the result into an object to search latter
 * 2020-03-27: Added comments over the images
 * 2020-03-30: Adding popup dialog to extension icon and getting the comments from that popup
 * 2020-03-30: Add listing automatically and update record when new comment is received 
 * 2020-04-01: Added radio buttons for stats
 * 2020-04-04: Finishing everything up all functions seem to be working
 * 2020-04-05: Final commit for now everything should be nice and tidy for the next time I visit this project
 
### Open Points 
 * Known issue with creating a new database
   * If a database version is changed (FindAHouse.js Line 218) the old database must be deleted 
     * Ctrl+Shift+C > Application > IndexedDB then delete the old database
   * The fix need to be made in dbReq.onupgradeneeded = function(event) (FindAHouse.js Line 219) I think
   * When I open Chrome in developer mode the PC fan starts running I'm not sure if this is tied to my app or something else
   
 
### Notebook 
 * Add extension: chrome://extensions/
 * Page source: Ctrl + Shift + C
 
 * document.getElementById
 * document.getElementsByTagName
 * document.getElementById -> getElementsByTagName
 * document.getElementsByClassName
 
 * A cool place to test code quickly https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare

### Future modifications 
 * Distance from location to work
 * Distance to closest metro
 * How far location is away from geofence 
 * Backup the database
 * Open just the listings that I think are nice
 

