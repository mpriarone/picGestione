function timeToDecimal(t) {
    var arr = t.split(':');
    var dec = parseInt((arr[1]/6)*10, 10);
    return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
}
var tp = {
    // (A) INIT - GENERATE TIME PICKER HTML
    hwrap: null, // entire html time picker
    hhr: null,   // html hour value
    hmin: null,  // html min value
    totalhm: null, // total h + m
    init: () => {
        // (A1) ADD TIME PICKER TO BODY
        tp.hwrap = document.createElement("div");
        tp.hwrap.id = "tp-wrap";
        document.body.appendChild(tp.hwrap);

        // (A2) TIME PICKER INNER HTML
        tp.hwrap.innerHTML =
        `<div id="tp-box">
        <div class="tp-cell" id="tp-hr">
          <div class="tp-label">Ore:</div>
          <div class="tp-up">&#65087;</div> <div class="tp-val">0</div> <div class="tp-down">&#65088;</div>
        </div>
        <div class="tp-cell" id="tp-min">
          <div class="tp-label">Minuti:</div>
          <div class="tp-up">&#65087;</div> <div class="tp-val">0</div> <div class="tp-down">&#65088;</div>
        </div>
        <button id="tp-close" onclick="tp.hwrap.classList.remove('show')">Annulla</button>
        <button id="tp-set" onclick="tp.set()">Salva</button>
        </div>`;

        // (A3) GET VALUE ELEMENTS + SET CLICK ACTIONS
        for (let segment of ["hr", "min"]) {
            let up = tp.hwrap.querySelector(`#tp-${segment} .tp-up`),
                down = tp.hwrap.querySelector(`#tp-${segment} .tp-down`);
            tp["h" + segment] = tp.hwrap.querySelector(`#tp-${segment} .tp-val`);

            up.onmousedown = () => tp.spin(true, segment);
            down.onmousedown = () => tp.spin(false, segment);
            up.onmouseup = () => tp.spin(null);
            down.onmouseup = () => tp.spin(null);
            up.onmouseleave = () => tp.spin(null);
            down.onmouseleave = () => tp.spin(null);
        }
    },

    // (B) SPIN HOUR/MIN/AM/PM
    //  direction : true (up), false (down), null (stop)
    //  segment : "hr", "min", "ap" (am/pm)
    timer: null, // for "continous" time spin
    minhr: 1,    // min spin limit for hour
    maxhr: 12,   // max spin limit for hour
    minmin: 0,   // min spin limit for minute
    maxmin: 30,  // max spin limit for minute
    spin: (direction, segment) => {
        // (B1) CLEAR TIMER
        if (direction == null) {
            if (tp.timer != null) {
                clearTimeout(tp.timer);
                tp.timer = null;
            }
        }

        // (B3) SPIN FOR HR/MIN
        else {
            // (B3-1) INCREMENT/DECREMENT
            let next = +tp["h" + segment].innerHTML;
            next = direction ? next + 1 : next - 1;

            // (B3-2) MIN/MAX
            if (segment == "hr") {
                if (next > tp.maxhr) { next = tp.maxhr; }
                if (next < tp.minhr) { next = tp.minhr; }
            } else {
                if (next > tp.maxmin) { next = tp.maxmin; }
                if (next < tp.minmin) { next = tp.minmin; }
            }

            // (B3-3) SET VALUE
            if (next < 10) { next = "0" + next; }
            tp["h" + segment].innerHTML = next;

            // (B3-4) KEEP ROLLING - LOWER TIMEOUT WILL SPIN FASTER
            tp.timer = setTimeout(() => tp.spin(direction, segment), 100);
        }
    },

    // (C) ATTACH TIME PICKER TO HTML FIELD
    //  target : html field to attach to
    //  after : optional, function to run after selecting time
    attach: instance => {
        // (C1) READONLY FIELD + NO AUTOCOMPLETE
        // IMPORTANT, PREVENTS ON-SCREEN KEYBOARD
        instance.target.readOnly = true;
        instance.target.setAttribute("autocomplete", "off");
        // (C3) CLICK TO OPEN TIME PICKER
        instance.target.addEventListener("click", () => tp.show(instance));
    },

    // (D) SHOW TIME PICKER
    setfield: null, // set selected time to this html field
    setafter: null, // run this after selecting time
    show: instance => {
        // (D1) INIT FIELDS TO SET + OPTIONS
        tp.setfield = instance.target;
        tp.setafter = instance.after;
        tp.minhr = 0;
        tp.maxhr = 12;

        // (D2) READ CURRENT VALUE
        let val = tp.setfield.value;
        if (val == "") {
            tp.hhr.innerHTML = "0" + tp.minhr;
            tp.hmin.innerHTML = "0" + tp.minmin;
        } else {
            tp.hhr.innerHTML = val.substring(0, 2);  
            tp.hmin.innerHTML = val.substring(3, 5);
        }

        // (D3) SHOW TIME PICKER
        tp.hwrap.classList.remove("tp-24"); 
        tp.hwrap.classList.add("show");
    },

    // (E) SET TIME
    set: () => {
        // (E1) TIME TO FIELD
        tp.setfield.value = tp.hhr.innerHTML + ":" + tp.hmin.innerHTML;
        tp.hwrap.classList.remove("show");
        tp.totalhm=timeToDecimal(tp.setfield.value);
        // (E2) RUN AFTER, IF SET
        if (tp.setafter) { tp.setafter(tp.totalhm); }
    }
};
document.addEventListener("DOMContentLoaded", tp.init);