let API_URL = 'https://utop-app-game-qa.azurewebsites.net/GamePlay';
let LANDING_URL = 'https://iomgame.com/Utopmini/landing-page-game.html'
let transaction = '';
let session = '';

window.ParseUrl = function (url)
{
    let regex = /[?&]([^=#]+)=([^&#]*)/g;
    let params = {};
    let match;

    while (match = regex.exec(url))
    {
        params[match[1]] = decodeURIComponent(match[2]);
    }
    return params;
};

window.UpdateParams = function ()
{
    let params = this.ParseUrl(location && location.href || "");
    Object.keys(params).forEach(key =>
    {
        if (key == "initCustomParams")
        {
            let subParams = this.ParseUrl(params[key]);
            Object.keys(subParams).forEach(key =>
            {
                params[key] = subParams[key];
            });
            delete params[key];
        }
        else if (key == "d")
        {
            params[key] = JSON.parse(params[key]);
        }
    });

    return params;
};

window.HttpRequest = function (method, url, body)
{
    return new Promise((resolve, reject) =>
    {
        let xhr = new XMLHttpRequest();
        xhr.open(method, API_URL + url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () =>
        {
            if (xhr.readyState == 4)
            {
                if (xhr.status == 200)
                {
                    resolve(xhr.response);
                }
                else
                {
                    reject(xhr.response);
                }
            }
        };
        xhr.send(body);
    });
};

window.StartGame = function ()
{
    let body = {
        "gamecode": 1,
        "sessionID": session || 1
    };
    HttpRequest('post', '/StartUtopGame', JSON.stringify(body))
        .then(response =>
        {
            try
            {
                let data = JSON.parse(response);
                if (data.code == 0)
                {
                    transaction = data.idTrans;
                }
                else
                {
                    window.UnityShowPopup(data.result);
                }
            }
            catch (e)
            {
                window.UnityShowPopup("Dữ liệu không đúng cấu trúc.");
            }
        })
        .catch(error =>
        {
            window.UnityShowPopup("Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.");
        });
};

window.EndGame = function (score)
{
    let body = {
        "idTrans": transaction,
        "sessionID": session,
        "score": score
    };
    HttpRequest('post', '/EndGame', JSON.stringify(body))
        .then(response =>
        {
            try
            {
                let data = JSON.parse(response);
                if (data.code == 0)
                {
                    if (data.typeKQ == 0)
                    {
                        window.UnityShowLose("Bạn không đủ điểm để trúng thưởng");
                    }
                    else if (data.typeKQ == 1)
                    {
                        window.UnityShowLose("Số lượng quà đã vượt quá giới hạn");
                    }
                    else if (data.typeKQ == 3)
                    {
                        if (data.gameRewardType == 0)
                        {
                            window.UnityShowLose("Số lượng quà đã vượt quá giới hạn");
                        }
                        else
                        {
                            window.UnityShowWin(data.rewardName);
                        }
                    }
                }
                else
                {
                    window.UnityShowPopup(data.loi);
                }
            }
            catch (e)
            {
                window.UnityShowPopup("Dữ liệu không đúng cấu trúc.");
            }
        })
        .catch(error =>
        {
            window.UnityShowPopup("Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.");
        });
};

window.Home = function()
{
    window.parent.location.href = LANDING_URL + "?" + window.location.href.split("?")[1];
}

window.CloseGame = function ()
{
    try
    {
        let message = {
            name: 'redirect',
            body: 'UTop'
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
    catch (e)
    {

    }
};

window.UnityShowPopup = function (message)
{
    unityInstance.SendMessage('GameMgr', 'ShowPopup', message);
};

window.UnityShowWin = function (message)
{
    unityInstance.SendMessage('GameMgr', 'ShowWin', message);
};

window.UnityShowLose = function (message)
{
    unityInstance.SendMessage('GameMgr', 'ShowLose', message);
};

window.RegisterVisibilityChange = function()
{
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined")
    { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    }
    else if (typeof document.msHidden !== "undefined")
    {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    }
    else if (typeof document.webkitHidden !== "undefined")
    {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange()
    {
        if (document[hidden])
        {
            unityInstance.SendMessage('GameMgr', 'Pause');
        }
        else
        {
            unityInstance.SendMessage('GameMgr', 'Resume');
        }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === undefined)
    {
        console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    }
    else
    {
        // Handle page visibility change
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}

let params = window.UpdateParams();
session = params.b;

RegisterVisibilityChange();
