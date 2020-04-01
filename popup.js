function ButtonAction() 
{
	var TextContent = document.getElementById('comments').value;
	var StatsContent = document.getElementsByName("Stats");
	var StatVal;

    for(var i = 0; i < StatsContent.length; i++) 
    {
         if(StatsContent[i].checked)
		 {
			StatVal = StatsContent[i].id;
		 }
   }
   
	
	alert('ButtonAction: ' + StatVal);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
	{
		chrome.tabs.executeScript(tabs[0].id, 
		{file: "FindAHouse.js"}, 
		function()
		{
			chrome.tabs.sendMessage(tabs[0].id,{
				updateTextTo: TextContent,
				updateStats: StatVal
			});
		});
	});
}

document.getElementById('ButtonId').addEventListener('click', ButtonAction);