function ButtonAction() 
{
	var TextContent = document.getElementById('comments').value;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
	{
		chrome.tabs.executeScript(tabs[0].id, 
		{file: "FindAHouse.js"}, 
		function()
		{
			chrome.tabs.sendMessage(tabs[0].id,{
				updateTextTo: TextContent
			});
		});
	});
}

document.getElementById('ButtonId').addEventListener('click', ButtonAction);