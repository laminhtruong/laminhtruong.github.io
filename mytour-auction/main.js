function Alignment()
{
    var iframe = document.getElementById("game");
    var param = window.parent.location.href.split('?')[1];
    if (param)
    {
        param = `?${param}`;
    }
    else
    {
        param = "";
    }
    iframe.style.height = window.innerHeight;
    iframe.style.width = window.innerHeight * 9 / 16;
    iframe.style.display = "block"
    iframe.setAttribute("src", `./game/index.html${param}`);
}