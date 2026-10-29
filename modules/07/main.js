console.log("Chart.js:", typeof Chart);
console.log("Elemen cnt1:", document.getElementById("cnt1"));

const x0 = 0;
const y0 = 0;

const v0x = 20;
const v0y = 40;

const g = 10;

const tbeg = 0;
const tend = 8;
const dt = 0.5;

// Menyiapkan data
const times = [];
const xs = [];
const ys = [];

for (let t = tbeg; t <= tend + 1e-9; t += dt) {
    times.push(t);

    const x = x0 + v0x * t;
    const y = y0 + v0y * t - 0.5 * g * t * t;

    xs.push(x);
    ys.push(y);
}

// Mengambil tempat grafik
const cnt = document.getElementById("cnt1");

cnt.innerHTML = "";

cnt.style.display = "grid";
cnt.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(300px, 1fr))";
cnt.style.gap = "20px";

// Fungsi membuat grafik
function createChart(title, xlabel, ylabel, xData, yData) {
    const panel = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent = title;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";

    panel.appendChild(heading);
    panel.appendChild(canvas);
    cnt.appendChild(panel);

    new Chart(canvas, {
        type: "scatter",

        data: {
            datasets: [{
                label: title,
                data: xData.map((x, i) => ({
                    x: x,
                    y: yData[i]
                })),
                showLine: true,
                pointRadius: 4
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                x: {
                    type: "linear",
                    title: {
                        display: true,
                        text: xlabel
                    }
                },

                y: {
                    type: "linear",
                    title: {
                        display: true,
                        text: ylabel
                    }
                }
            }
        }
    });
}

// Grafik 1: posisi horizontal terhadap waktu
createChart(
    "data x-t",
    "Waktu t (s)",
    "Posisi x (m)",
    times,
    xs
);

// Grafik 2: posisi vertikal terhadap waktu
createChart(
    "data y-t",
    "Waktu t (s)",
    "Posisi y (m)",
    times,
    ys
);

// Grafik 3: posisi vertikal terhadap posisi horizontal
createChart(
    "data x-y",
    "Posisi x (m)",
    "Posisi y (m)",
    xs,
    ys
);

function quadraticFit(x, y) {
    const n = x.length;

    let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0;
    let sy = 0, sxy = 0, sx2y = 0;

    for (let i = 0; i < n; i++) {
        const xi = x[i];
        const yi = y[i];

        sx += xi;
        sx2 += xi ** 2;
        sx3 += xi ** 3;
        sx4 += xi ** 4;

        sy += yi;
        sxy += xi * yi;
        sx2y += xi ** 2 * yi;
    }

    const A = [
        [sx4, sx3, sx2, sx2y],
        [sx3, sx2, sx, sxy],
        [sx2, sx, n, sy]
    ];

    // Eliminasi Gauss
    for (let i = 0; i < 3; i++) {
        let pivot = A[i][i];

        for (let j = i; j < 4; j++) {
            A[i][j] /= pivot;
        }

        for (let k = 0; k < 3; k++) {
            if (k === i) continue;

            const factor = A[k][i];

            for (let j = i; j < 4; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }

    return {
        a: A[0][3],
        b: A[1][3],
        c: A[2][3]
    };
}

const fitXT = quadraticFit(times, xs);
const fitYT = quadraticFit(times, ys);
const fitXY = quadraticFit(xs, ys);

console.log("Persamaan fitting x-t:");
console.log(`x(t) = ${fitXT.a.toFixed(4)}t² + ${fitXT.b.toFixed(4)}t + ${fitXT.c.toFixed(4)}`);

console.log("Persamaan fitting y-t:");
console.log(`y(t) = ${fitYT.a.toFixed(4)}t² + ${fitYT.b.toFixed(4)}t + ${fitYT.c.toFixed(4)}`);

console.log("Persamaan fitting x-y:");
console.log(`y(x) = ${fitXY.a.toFixed(4)}x² + ${fitXY.b.toFixed(4)}x + ${fitXY.c.toFixed(4)}`);