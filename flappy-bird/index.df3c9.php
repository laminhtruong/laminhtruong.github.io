<?php
	header('Content-Type: text/html; charset=utf-8');

	$jsParams ="var userParams = {};"
		."userParams['api'] = 'https://utop-app-pepsisummer-be-qa.azurewebsites.net/GamePlay';"
		."userParams['shareKey'] = '1b446038378321d37f7606a118b5b0d2';"
		."userParams['winCoin'] = 150;";
		."userParams['scorePerCoin'] = 10;";
		."userParams['distanceIncreaseRate'] = 12;";
		."userParams['spacingDecreaseRate'] = 8;";

	$phpParams = array("authorization", "tenantId", "campaignId", "transactionCode", "turnType", "remainingTurn", "highCoin", "homeUrl", "storeUrl");
	foreach ($phpParams as $key)
	{
		if (isset($_GET[$key]))
		{
			$value = $_GET[$key];
			$jsParams = $jsParams . "userParams['" . $key . "'] = '" . $value ."';";
		}
		else
		{
			$jsParams = $jsParams . "userParams['" . $key . "'] = '';";
		}
	}

	$html_string = file_get_contents('index.10316.html');
	$html_string = str_replace("{{params}}", $jsParams, $html_string);

	echo $html_string;
?>