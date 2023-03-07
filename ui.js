class UI {
    constructor(simulation, ui_list) {
        this.simulation = simulation;
        this.ui_list = ui_list;
        this.objects = {}

        this.eventHandler();



    }

    showObjectList() {
        this.ui_list.innerHTML = "";

        for (var i = 0; i < this.simulation.objects.length; i++) {
            let object = this.simulation.objects[i];
            this.ui_list.innerHTML += `<div class='ui_list_item'>
                <p>Mass: ` + object["mass"] + `</p>
                <p>Color: ` + object["color"] + `</p>
                <button body_id='` + object["id"] + `' class='ui_delete_button'>Delete</button>
            </div>`;
        }
    }

    addObject(mass, size, pos_x, pos_y, color, init_speed_x, init_speed_y, is_static) {
        this.simulation.addObject(mass, size, pos_x, pos_y, color, init_speed_x, init_speed_y, is_static);

        // var new_object = this.simulation.objects[this.simulation.objects.length - 1];
        this.showObjectList();
    }

    eventHandler() {
        var self = this;
        function tick() {
            var tick_time_start = performance.now();

            var buttons = document.querySelectorAll('.ui_delete_button');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function (event) {
                    let button = event.target;
                    let id = button.getAttribute("body_id");
                    for (var j = 0; j < self.simulation.objects.length; j++) {
                        if (self.simulation.objects[j]["id"] == id) {
                            self.simulation.objects.splice(j, 1);
                            self.showObjectList();
                        }
                    }
                };
            }

            var tick_time_end = performance.now();
            var delta_time = tick_time_end - tick_time_start;
            setTimeout(tick, 0.001 - delta_time);
        }
        tick();
    }
}

function isNumeric(str) {
    // use type coercion to convert string to number and then back to string
    // if the resulting string is the same as the original, then it's numeric
    return !isNaN(parseFloat(str)) && isFinite(str);
}

simulation = new Simulation();


document.getElementById("ui_spawn_button").addEventListener("click", function () {
    var mass = document.getElementById("ui_mass_input").value;
    var init_move_x = document.getElementById("ui_init_move_x_input").value;
    var init_move_y = document.getElementById("ui_init_move_y_input").value;
    var color = document.getElementById("ui_color_input").value;
    var size = document.getElementById("ui_size_input").value;
    var pos_x = document.getElementById("ui_pos_y_input").value;
    var pos_y = document.getElementById("ui_pos_x_input").value;
    var is_static = document.getElementById("ui_static_checkbox").checked;

    // Validate all inputs:
    if (isNumeric(mass) == false) {
        alert("please enter correct mass")
        return;
    }
    if (isNumeric(init_move_x) == false || isNumeric(init_move_y) == false) {
        alert("please enter correct initial speeds");
        return;
    }
    if (isNumeric(size) == false) {
        alert("please enter correct size");
        return;
    }
    if (isNumeric(pos_x) == false || isNumeric(pos_y) == false) {
        alert("please enter correct spawn positions");
        return;
    }
    ui.addObject(parseFloat(mass), parseFloat(size), parseFloat(pos_x), parseFloat(pos_y), color, parseFloat(init_move_x), parseFloat(init_move_y), is_static);

});

window.addEventListener("load", () => {
    // (A) CHECK FOR MOBILE
    var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);

    // (B) DO SOMETHING...
    if (isMobile) { alert("Hey there! Thanks for your interest in my project! Unfortunately, this is one of my few mobile unfriendly sites :(\n\nSo please consider trying it on your PC!") }
    else { console.log("Not mobile device"); }
});

ui = new UI(simulation, document.getElementById("ui_objects_list"));
ui.addObject(3330000000000000, 5, 50, 50, "yellow", 0, 0, false);
ui.addObject(10000000000, 2, 64, 50, "blue", 0, 100, false);
ui.addObject(10000000000, 2, 4, 50, "red", 20, 40, false);