
let video;
let poseNet;
let poses = [];
let skeletons = [];

let pg;
let HandX;
let HandY;

let pHandX;
let pHandY;

function setup() {
  var cnv = createCanvas(640, 480);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  video = createCapture(VIDEO);
  video.size(width, height);
  pixelDensity(1);
  pg = createGraphics(width, height);

  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function(results) {
    poses = results;
  });

  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);
  image(pg, 0, 0, width, height);

  drawKeypoints();
  drawSkeleton();
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < min(poses.length,1); i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.15) {
        //        fill(255, 0, 0);
        //        noStroke();
        //        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        //        fill(0,255,0);
        //        text(j, keypoint.position.x, keypoint.position.y);

        if (j == 0) {
          HandX = keypoint.position.x;
          HandY = keypoint.position.y;

          pg.stroke(230, 80, 0);
          pg.strokeWeight(5);
          pg.line(HandX, HandY, pHandX, pHandY);

          pHandX = HandX;
          pHandY = HandY;

        }

      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function keyPressed() {
  pg.clear();
}

function modelReady() {
  select('#status').html('Model Loaded!');
}
