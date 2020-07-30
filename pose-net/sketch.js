let video;
let poseNet;
let poses = [];

function setup()
{
	createCanvas(640, 480);

	video = createCapture(VIDEO);
	video.size(width, height);
	video.hide();

	poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', function (results)
	{
		poses = results;
		if (poses.length > 0)
		{
			let nose = poses[0].pose.nose;
			//window.parent.postMessage(nose, "*");
		}
	});
}

function modelReady()
{
	console.log('Model Loaded');
}

let lastNose;
function draw()
{
	image(video, 0, 0, width, height);
	if (poses)
	{
		if (poses.length > 0)
		{
			let nose = poses[0].pose.nose;
			fill(255);
			ellipse(nose.x, nose.y, 64);
			lastNose = nose;
		}
		else if (lastNose)
		{
			fill(255);
			ellipse(lastNose.x, lastNose.y, 64);
		}
	}
}

