let API_URL = 'https://utop-app-game-qa.azurewebsites.net/GamePlay';
let transaction = '';
var params = window.UpdateParams();
let session = params.b;

window.ParseUrl = function(url)
{
    let regex = /[?&]([^=#]+)=([^&#]*)/g;
    let params = {};
    let match;

    while (match = regex.exec(url))
    {
        params[match[1]] = decodeURIComponent(match[2]);
    }
    return params;
}

window.UpdateParams = function()
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
}

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
        "idChannel": 1,
        "gamecode": 1,
        "sessionID": session || 1
    };
    HttpRequest('post', '/StartGame', JSON.stringify(body))
        .then(response =>
        {
            try
            {
                let data = JSON.parse(response);
                if (data.code == 0)
                {
                    transaction = data.idTrans;
                    //Start Unity game here
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
