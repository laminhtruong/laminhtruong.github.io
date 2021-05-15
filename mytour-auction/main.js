function Alignment()
{
    var iframe = document.getElementById("game");
    iframe.style.height = window.innerHeight;
    iframe.style.width = window.innerHeight * 9 / 16;
    iframe.style.display = "block"
    iframe.setAttribute("src", "./game/index.html");
}