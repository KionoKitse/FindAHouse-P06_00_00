/*
Just draw a border round the document.body.
Search Montreal $630
div data-listing-id="1482457149"
1483568696
1483140003
1482850958
1479796933

for(i=0;i<document.getElementsByTagName('img').length;i++){
    var imgTag=document.getElementsByTagName('img')[i];
    imgTag.style.border='2px solid #E8272C';
    imgTag.onclick=function(){
        return !window.open(this.src);
    }
}
search for an element within a tag structure 
*/
//document.body.style.border = "5px solid red";
var imgs = document.getElementsByTagName("img");
for(var i=0, l=imgs.length;i<l;i++){
	imgs[i].src = "http://3.bp.blogspot.com/-KL7d7LdSANg/Tm5VLQf9k4I/AAAAAAAAACo/cSV52JoD7vk/s1600/cat-wallpaper-34-713472.jpg";
	imgs[i].style.border ='2px solid #E8272C';
}
/*
***** ROLL THE CREDITS *****
>> OTHERS <<
* Firefox plug in tutorial          https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
* Cat images with Javascript        https://stackoverflow.com/questions/19693915/replace-all-images-with-one-image-javascript
***** Thanks everyone! ***** 
 */
