// Declaring the varibles
let w;
let h;
let canvas;
let context;
let base_color;
let conn_color;
let mate_color;
let conn_size = 0.5;
let mate_size = 2;
let private_space = 200;
let conn_radius = 100;
let movement_speed = 1.5;
let secondsPassed = 0;
let oldTimeStamp = 0;
let timePassed = 0;
let first_play = true;
let society = {};

window.onload = init;


// Initializing the canvas
function init() {

    canvas = document.getElementById('bg-canvas');
    base_color = canvas.getAttribute('base')
    conn_color = canvas.getAttribute('line');
    mate_color = canvas.getAttribute('dot');

    w = window.innerWidth;
    h = window.innerHeight;

    context = canvas.getContext('2d');
    context.canvas.width = w;
    context.canvas.height = h;
    let population = Math.round(w / private_space) * Math.round(h / private_space);

    for (let index = 0; index < population; index++) {
        society[index] = {
            h: false,
            speed: movement_speed,
            angle: Math.floor(Math.random() * 360),
            x: Math.floor(Math.random() * w),
            y: Math.floor(Math.random() * h),
        }
    }

    window.requestAnimationFrame(gameLoop);
    // draw();

}

// Defining the gameLoop
function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    update(secondsPassed);
    draw(first_play);
    first_play = false;
    window.requestAnimationFrame(gameLoop);
}

// Updating the canvas
function update(secondsPassed) {
    timePassed += secondsPassed;

    for (let id in society) {
        let person = society[id];

        if (person.x >= w - 10) {
            person.mate = null;
            person.x = 11;
        }
        if (person.y >= h - 10) {
            person.mate = null;
            person.y = 11;
        }
        if (person.y <= 0) {
            person.mate = null;
            person.y = h - 11;
        }
        if (person.x <= 0) {
            person.mate = null;
            person.x = w - 11;
        }

        if (person.mate) {
            let m = person.mate;
            let distance = Math.hypot(m.x - person.x, m.y - person.y);
            if (distance >= conn_radius) {
                person.mate = null;
            }
        }

        if (!person.mate) {
            let available = {};
            for (let _id in society) {
                if (_id != id) {
                    let _notmate = society[_id];
                    let distance = Math.hypot(_notmate.x - person.x, _notmate.y - person.y);
                    if (distance <= conn_radius) {
                        available[distance] = society[_id];
                    }
                }
            }
            if (available.length != 0) {
                let diss = Object.keys(available);
                let min = Math.min(...diss);
                let m = available[min];
                person.mate = m;
            }
        }
        person.x += person.speed * Math.cos(person.angle);
        person.y += person.speed * Math.sin(person.angle);

        if (person.mate) {
            person.speed = 0.8;
        } else {
            person.speed = movement_speed;
        }
    }

}

// Drawing the canvas
function draw(first) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = base_color;
    // context.fillRect(0, 0, w, h);

    for (let id in society) {
        let person = society[id];
        context.beginPath();
        context.arc(person.x, person.y, mate_size, 0, Math.PI * 2, false);
        context.fillStyle = mate_color;
        context.fill();
        context.closePath();

        if (person.h) {
            context.beginPath();
            context.arc(person.x, person.y, conn_radius, 0, Math.PI * 2, false);
            context.strokeStyle = mate_color;
            context.stroke();
            context.closePath();
        }

        if (person.mate) {
            let mate = person.mate;
            if (mate.x != undefined) {
                context.globalAlpha = 0.2;
                context.beginPath();
                context.moveTo(person.x, person.y);
                context.lineTo(mate.x, mate.y);
                context.strokeStyle = conn_color;
                context.lineWidth = conn_size;
                context.stroke();
                context.closePath();
            }
        }
    }
}