/* console */

import { Console as CLI } from "../../../libs/endap/0.0.4/endap.min.js";
const consoles = CLI.create("150px");
const cnt = document.getElementById("cnt");
const cli = consoles.el;
cnt.append(cli);


/* params */

const T0 = 1;
const tbeg = 0;
const tend = 4;
const dt = 0.001 * T0;
const Tobs = 0.05 * T0;
const digit = 3;
const g = 9.81;
const R = 0.248;
const a = 0.1;
const A = a * Math.PI;
const w0 = Math.sqrt(g/R);
const N = (tend - tbeg) / dt;

consoles.log("t\tθ-the\tθ-num");


/* datasets */

const data_the = [];
const data_num = [];

let tobs = 0;
let t = 0;
let w_num = 0;
let q_num = A;
for(let n = 0; n <= N; n++) {
  if(tobs >= Tobs || tobs == 0) {
    const q_the = A * Math.cos(w0 * t);
    const t_str = t.toFixed(digit);
    const q_the_str = q_the.toFixed(digit);
    const q_num_str = q_num.toFixed(digit);
    
    const x = t_str;
    
    const y_the = q_the_str;
    const p_the = {x: x, y: y_the};
    data_the.push(p_the);
    
    const y_num = q_num_str;
    const p_num = {x: x, y: y_num};
    data_num.push(p_num);
    
    consoles.log(t_str, "\t");
    consoles.log(q_the_str, "\t");
    consoles.log(q_num_str);
    tobs = 0;
  }
  w_num += -(g/R) * Math.sin(q_num) * dt;
  q_num += w_num * dt;
  
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
        label: "the",
        data: data_the,
        radius: 4,
        hoverRadius: 6,
        showLine: true,
        /*
        borderColor: "#458",
        backgroundColor: "#8df",
        */
      },
      
      {
        label: "num",
        data: data_num,
        radius: 4,
        hoverRadius: 6,
        showLine: true,
        /*
        borderColor: "#485",
        backgroundColor: "#8f8",
        */
      },

    ],
  },

  options: {

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
cnt.append(can);