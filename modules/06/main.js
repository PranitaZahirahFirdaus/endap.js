/* console */

import { Console as CLI } from "../../libs/endap/0.0.4/endap.min.js";
const consoles = CLI.create("150px");
const cnt = document.getElementById("cnt");
const cli = consoles.el;
cnt.append(cli);


/* params */

const T = 2;
const tbeg = 0;
const tend = 4;
const dt = 0.001 * T;
const Tobs = 0.01 * T;
const digit = 3;
const N = (tend - tbeg) / dt;

const xc = 2;
const yc = 3;
const R = 0.5;
const w = 2 * Math.PI / T;
const phi0 = Math.PI / 2;


/* datasets */

const data = [];

let tobs = Tobs;
let t = 0;
for(let n = 0; n <= N; n++) {
  if(tobs >= Tobs) {
    
    const x = xc + R * Math.cos(w * t + phi0);
    const y = yc + R * Math.sin(w * t + phi0);
    
    const ts = t.toFixed(digit);
    const xs = x.toFixed(digit);
    const ys = y.toFixed(digit);
    const p = {x: xs, y: ys};
    data.push(p);
    
    consoles.log(ts, "\t");
    consoles.log(xs, "\t");
    consoles.log(ys);
    tobs = 0;
  }
  
  t += dt;
  tobs += dt; 
}


/* chart */

const can = document.createElement("canvas");
Object.assign(can.style, {
  width: "100%",
  border: "1px solid var(--muted-border)",
  marginTop: "10px",
});

const config = {
  type: 'scatter',
  
  data: {
    datasets: [
      {
        label: "data",
        data: data,
        radius: 4,
        hoverRadius: 6,
        showLine: true,
      },
      {
        label: "center",
        data: [
          {
            x: xc,
            y: yc,
          }
        ],
        radius: 4,
        hoverRadius: 6,
        showLine: true,
      },
    ],
  },

  options: {
    
    maintainAspectRatio: true,
    aspectRatio: 1,
    
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 't',
          font: { size: 14, },
        },
      },

      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'θ',
          font: { size: 14, },
        },
      },

    },
  },

};
const chart = new Chart(can, config);

const div = document.createElement("div");
Object.assign(div.style, {
  border: "0px solid blue",
  width: "500px",
});

cnt.append(div);
div.append(can);