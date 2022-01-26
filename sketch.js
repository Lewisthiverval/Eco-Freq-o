// VAriable declarations

let people = [];
let sounds = [];
let images = [];
let sliders = [];
let targetSize = 30;
let field = new WaveFieldDesign();
let refresh;
let startbackgroundColor;
let newBackgroundColor;
let backgroundRefresh;
let isRefreshed;
let button1;
let button2;
let button3;
let button4;
let button5;
let slider1;
let slider3;
let mixer = [];
let testSound;
let carbonText;
let fft;
let peakDetect;
let slider2;
let settings = {
  numberOfagents: 30,
};

let numberOfagents = 30;
//preload images and sounds
function preload() {
  peopleData.forEach((p) => sounds.push(loadSound(p.sound)));
  peopleData.forEach((p) => images.push(loadImage(p.image)));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  getAudioContext().suspend();
  startbackgroundColor = random(backgroundPalette);
  background(startbackgroundColor);
  isRefreshed = false;
  field.setup();
  people = peopleData.map((x, i) =>
    createPerson(
      random(200, width - 50),
      random(200, height - 50),
      sounds[i],
      x.title,
      images[i],
      50,
      x.color
    )
  );

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  let xBoxPos = 40;
  let sliderYstart = 200;
  text("Number of branches. range 1-50", xBoxPos, sliderYstart + 30);
  slider1 = createSlider(1, 50, 30);
  slider1.position(xBoxPos, sliderYstart);
  text("Alpha value. range 0 - 170", xBoxPos, sliderYstart + 80);
  slider2 = createSlider(0, 170, 70);
  slider2.position(xBoxPos, sliderYstart + 50);
  text(
    "agents to remove on background refresh. range 0 - 50 ",
    xBoxPos,
    sliderYstart + 130
  );
  slider3 = createSlider(0, 50, 20);
  slider3.position(xBoxPos, sliderYstart + 100);
  button1 = createButton("refresh background color");
  button2 = createButton("reload whole page");
  button3 = createButton("Show titles");
  button4 = createButton("Stop Sound");
  button1.position(xBoxPos, 40);
  button2.position(xBoxPos, 90);
  button3.position(xBoxPos, 150);
  button4.position(xBoxPos, 120);
  // button5.position(40, 200);
  button1.style(
    "color: white; background-color: black; font-family: 'Roboto', sans-serif; width: 100px; border: solid #ffffff 1px;"
  );
  button2.style(
    "color: white; background-color: black; font-family: 'Roboto', sans-serif; width: 100px; border: solid #ffffff 1px;"
  );
  button4.style(
    "color: white; background-color: black; font-family: 'Roboto', sans-serif; width: 100px; border: solid #ffffff 1px;"
  );
  button3.style(
    "color: white; background-color: black; font-family: 'Roboto', sans-serif; width: 100px; border: solid #ffffff 1px;"
  );
  button1.mousePressed(refreshBackground);
  button2.mousePressed(refreshPage);
  button3.mousePressed(showTitles);
  button4.mousePressed(stopMusic);
  // button5.mousePressed(redraw);
}

function stopMusic() {
  people.forEach((p) => {
    p.soundStop();
  });
}
function showTitles() {
  people.forEach((p) => {
    p.drawtext();
  });
}
function redraw() {
  people.forEach((p) => {
    p.draw();
  });
}
function makeSlidersAppear() {
  people.forEach((p) => {
    p.createSlider();
  });
}
function makeSlidersDisappear() {
  people.forEach((p) => {
    p.hideSlider();
  });
}
function refreshBackground() {
  let m = map(carbonEmissionForecast, 0, 350, 0, 255);
  let newColor = background(random(backgroundPalette));
  let remove = field.removeAgents(slider3.value());
  console.log(slider3.value());
  return {
    newColor,
    remove,
  };

  // return background(random(images));
}
function refreshPage() {
  window.location.reload();
}
function draw() {
  textAlign(CENTER, CENTER);

  field.update();
  field.draw();
  people.forEach((p) => {
    p.draw();
  });
}

function createPerson(
  positionx,
  positiony,
  sound,
  caption,
  icon,
  size,
  palette
) {
  let newPerson = {
    positionx,
    positiony,
    sound,
    caption,
    icon,
    size,
    palette,
  };
  let slider;
  let isPlaying = false;
  return {
    createSlider: () => {
      slider = createSlider(0, 0.7, 1);
      slider.position(positionx, positiony + 40);
    },
    hideSlider: () => {
      slider.hide();
    },
    getposition: () => ({ x: newPerson.positionx, y: newPerson.positiony }),
    handleClick: (x, y) => {
      // console.log({ x, y, newPerson });
      let d = dist(newPerson.positionx, newPerson.positiony, x, y);
      if (d < size) {
        userStartAudio();
        if (isPlaying == false) {
          field.addAgents(slider1.value(), x, y, newPerson.palette);
          sound.play();

          isPlaying = true;
        } else if (isPlaying) {
          field.addAgents(slider1.value(), x, y, newPerson.palette);
        }
      }
    },
    updatePosition: () => {
      newPerson.positionx = newPerson.positionx + random(-1, 1);
      newPerson.positiony = newPerson.positiony + random(-1, 1);
    },
    draw: () => {
      image(
        newPerson.icon,
        newPerson.positionx,
        newPerson.positiony,
        targetSize + 10,
        targetSize + 10
      );
    },
    drawtext: () => {
      textSize(20);
      text(
        newPerson.caption,
        newPerson.positionx,
        newPerson.positiony - 20
        // newPerson.positionx + 50,
        // newPerson.positiony + 50
      );
    },
    soundStop: () => {
      sound.stop();
    },
  };
}

function mousePressed() {
  people.forEach((x) => {
    x.handleClick(mouseX, mouseY);
  });
}
