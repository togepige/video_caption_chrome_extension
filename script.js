document.getElementById("theButton").addEventListener("click",
    function() {
        debugger;
  window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
}, false);