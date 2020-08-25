var userParams = getParams(location.href || "");
var baseURL = "https://gameapiutop.azurewebsites.net/api";

function httpRequest(method, url, body, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4)
        {
            if (xhr.status == 200)
            {
                success(xhr.response);
            }
            else
            {
                error(xhr.response);
            }
        }
    };
    xhr.send(body);
}

function getParams(url)
{
    var array = url.split("?");
    var array = array[1] && array[1].split("&") || [];
    var params = {};

    array.forEach(item =>
    {
        var data = item.split("=");
        if (data[0] == 'd')
        {
            let key = data.shift();
            let value = data.join("=");
            params[key] = value;
        }
        else
        {
            params[data[0]] = decodeURIComponent(data[1]);
        }
    });

    return params;
}

function canStartGame(success, error)
{
    var body = {
        IDChannel: userParams.channel || 1,
        IDUser: userParams.c || 1,
        GameCode: userParams.gamecode || 1,
        sessionID: userParams.b || 1
    };

    httpRequest('post', baseURL + "/TestStartGame", JSON.stringify(body), success, error);
}

function sendDataToGame()
{
    canStartGame(
        function (response)
        {
            try
            {
                var data = JSON.parse(response);
                if (data.Result == "OK")
                {
                    var body = {
                        "channel": "utop",
                        "event": "start-game",
                        "message": {
                            "IDChannel": userParams.channel,
                            "IDUser": userParams.c,
                            "GameCode": userParams.gamecode,
                            "sessionID": userParams.b,
                        }
                    };
                    httpRequest('post', 'https://utop-pusher.herokuapp.com/push', JSON.stringify(body));
                }
                else
                {

                }
            }
            catch (e)
            {

            }
        },
        function (error)
        {

        });
}

function closeGame()
{
    try
    {
        var message = {
            name: 'redirect',
            body: 'UTop'
        };
        ReactNativeWebView.postMessage(JSON.stringify(message));
    }
    catch (e)
    {

    }
}