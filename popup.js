function ButtonAction() 
{
	var TextContent = document.getElementById('comments').value;
	var StatsContent = document.getElementsByName("Stats");
	var StatVal = '0';

    for(var i = 0; i < StatsContent.length; i++) 
    {
         if(StatsContent[i].checked)
		 {
			StatVal = StatsContent[i].id;
		 }
   }
   
	
	
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