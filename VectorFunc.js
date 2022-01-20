let group = [];
let agent;
let damping = 1;

class WaveFieldDesign {
  constructor(config) {
    this.agents = [];
    this.tail = [];
  }
  setup() {}
  update() {
    for (let agent of this.agents) {
      let mouse = new p5.Vector(mouseX, mouseY);
      seperate(agent, this.agents, 1.5);
      align(agent, this.agents, 0.7);
      //cohesion(agent, group, );
      //seek(agent, mouse, 1.5);
      move(agent);
      wrap(agent);
      if (agent.lifeSpan == 0) {
        this.agents.splice(agent, 1);
        console.log(this.agents.length);
      }
    }
  }
  draw() {
    for (let agent of this.agents) {
      render(agent);
    }
  }
  addAgents(number = 50, x, y, palette) {
    let p = palette;
    for (let i = 0; i < number; i++) {
      this.agents.push(createAgent(new p5.Vector(x, y), p));
    }
  }
}
window.WaveFieldDesign = WaveFieldDesign;

function makeDesign() {
  //not being used for now
  if (group.length < 100) {
    agent = createAgent();
    group.push(agent);
  }
  let seek = new p5.Vector(random(width), random(height));
  for (let agent of group) {
    previous.push();
    let prev = agent;
    seperate(agent, group, 1);
    align(agent, group, 1);
    // cohesion(agent, group, 0.7);
    seek(agent, 1);
    move(agent);
    wrap(agent);

    render(agent);
    render(prev);

    if (agent.lifeSpan == 0) {
      group.splice(agent, 1);
    }
  }
}
window.makeDesign = makeDesign;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createAgent(position, palette) {
  let newAgent = {
    position: position,
    velocity: new p5.Vector(random(-1, 1), random(1, -1)),
    acceleration: new p5.Vector(),
    lifespan: 300,
    maxspeed: random(2, 6),
    maxforce: random(0.09, 0.2),
    color: palette,
    colorChangeTimer: 50,
    finalColorTimer: 300,
    indexOfpalette: 0,
  };

  return newAgent;
}

function cloneAgent(agent) {
  return {
    ...agent,
    position: new p5.Vector(agent.position.x, agent.position.y),
    velocity: new p5.Vector(agent.velocity.x, agent.velocity.y),
    acceleration: agent.acceleration.x,
  };
}

function wrap(agent) {
  if (agent.position.x < -20) {
    agent.position.x = width + 20;
  }
  if (agent.position.y < -20) {
    agent.position.y = height + 20;
  }
  if (agent.position.x > width + 20) {
    agent.position.x = -20;
  }
  if (agent.position.y > height + 20) {
    agent.position.y = -20;
  }
}

function render(agent) {
  agent.colorChangeTimer -= 1;
  if (agent.colorChangeTimer == 0) {
    if (agent.indexOfpalette < agent.color.length - 1) {
      agent.indexOfpalette += 1;
      agent.colorChangeTimer = 50;
    } else if (agent.indexOfpalette == agent.color.length - 1) {
      agent.indexOfpalette = 0;
      agent.colorChangeTimer = 50;
    }
  }
  let newIndex = agent.indexOfpalette;

  rectMode(CENTER);
  push();
  translate(agent.position.x, agent.position.y);
  rotate(agent.velocity.heading());

  stroke(
    agent.color[newIndex][0],
    agent.color[newIndex][1],
    agent.color[newIndex][2],
    (alpha = slider2.value())
  );

  strokeWeight(random(0.1, 2));
  //rect(0, 0, 40, 10);
  //line(-20, 0, 20, 0);
  line(-25, 0, 25, 0);
  pop();
}

function move(agent) {
  agent.velocity.add(agent.acceleration);
  agent.velocity.mult(damping);
  agent.position.add(agent.velocity);
  agent.acceleration.mult(0);
  agent.lifespan = agent.lifespan - 1;
}

function addForce(agent, force, strength = 1) {
  force.mult(strength);
  agent.acceleration.add(force);
}

function seek(agent, target, strength = 1) {
  let targetDirection = p5.Vector.sub(target, agent.position);
  targetDirection.normalize();
  targetDirection.mult(agent.maxspeed);
  steer(agent, targetDirection, strength);
}

function steer(agent, targetDirection, strength) {
  let steer = p5.Vector.sub(targetDirection, agent.velocity);
  steer.limit(agent.maxforce);
  addForce(agent, steer, strength);
}

function seperate(agent, group, strength = 1) {
  let seperation = 40;

  sum = new p5.Vector();
  let count = 0;

  for (let other of group) {
    let d = agent.position.dist(other.position);
    if (d > 0 && d < seperation) {
      let diff = p5.Vector.sub(agent.position, other.position);
      diff.normalize();
      diff.div(d);
      sum.add(diff);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.setMag(agent.maxspeed);
    steer(agent, sum, strength);
  }
}

function align(agent, group, strength = 1) {
  let neighbourhood = 50;

  sum = new p5.Vector();
  let count = 0;

  for (let other of group) {
    let d = agent.position.dist(other.position);
    if (d > 0 && d < neighbourhood) {
      sum.add(other.velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(agent.maxspeed);
    steer(agent, sum, strength);
  }
}

function cohesion(agent, group, strength = 1) {
  let neighbourhood = 50;

  sum = new p5.Vector();
  let count = 0;

  for (let other of group) {
    let d = agent.position.dist(other.position);
    if (d > 0 && d < neighbourhood) {
      sum.add(other.position);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    steer(agent, sum, strength);
  }
}

function removeAgent(group) {
  for (i = group.length - 1; i > 0; i--) {
    let agent = group[i];
    if (agent.lifespan == 0) {
      group.splice(i, 1);
    }
  }
}
