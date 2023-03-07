//const simulation = document.getElementById("simulation");
const WIDTH = simulation.clientWidth;
const HEIGHT = simulation.clientHeight;

const FPS = 0.001//1000 / 144; // LEAVE AS IS!

function cssConvert(value) {
    return value + "%";
}

class Simulation {
    constructor() {
        this.objects = [];
        this.sim_env = document.getElementById("simulation");
        this.simulation();

        this.constants = {
            "G": 6.674 * 10 ** -11
        };
    }

    addObject(mass, diameter, pos_x, pos_y, color, init_velocity_x = 0, init_velocity_y = 0, is_static = false) {
        var ran_id = (Math.random() + 1).toString(36).substring(7);

        var object = {
            "id": ran_id,
            "mass": mass,
            "diameter": diameter,
            "coords": [pos_x, pos_y],
            "color": color,
            "static": is_static,
            "velocity_x": init_velocity_x,
            "velocity_y": init_velocity_y
        }

        this.objects.push(object);
    }

    clearObjects() {
        this.sim_env.innerHTML = "";
        //document.getElementById("mySvg").innerHTML = "";
        return;
    }

    drawObject(object) {
        var id = object["id"];
        var diameter = object["diameter"];
        var pos_x = object["coords"][0];
        var pos_y = object["coords"][1];
        var color = object["color"];

        this.sim_env.innerHTML += "<div class='simulated_object' id='" + id + "'></div>";
        var object = document.getElementById(id);

        var size_offset = diameter / 2

        // Set object position
        object.style.left = cssConvert(pos_x - size_offset);
        object.style.top = cssConvert(pos_y - size_offset);

        object.style.setProperty("--color", color);

        // Set object size
        object.style.width = cssConvert(diameter);
        object.style.height = cssConvert(diameter);

        return;
    }

    calculatePosition(object_num) {
        var obj_1 = this.objects[object_num];
        if (this.objects.length != 1) {
            for (var i = 0; i < this.objects.length; i++) {
                if (i != object_num) {
                    var obj_2 = this.objects[i];

                    var obj_1_x = obj_1["coords"][0];
                    var obj_1_y = obj_1["coords"][1];
                    var obj_2_x = obj_2["coords"][0];
                    var obj_2_y = obj_2["coords"][1];

                    // Calculate distance between obj_1 and obj_2 using the pythagoran theorem (a²+b²=c²)
                    var distance_x = obj_2_x - obj_1_x;
                    var distance_y = obj_2_y - obj_1_y;
                    var distance = Math.sqrt(distance_x ** 2 + distance_y ** 2);

                    var force = this.constants["G"] * ((obj_1["mass"] * obj_2["mass"]) / distance ** 2);

                    // Calculate acceleration
                    var acceleration_x = force / obj_1["mass"] * distance_x / distance;
                    var acceleration_y = force / obj_1["mass"] * distance_y / distance;

                    // Calculate new velocity
                    obj_1["velocity_x"] += acceleration_x * FPS;
                    obj_1["velocity_y"] += acceleration_y * FPS;

                    // Calculate new position
                    var x = obj_1_x + obj_1["velocity_x"] * FPS;
                    var y = obj_1_y + obj_1["velocity_y"] * FPS;

                    // Apply new position
                    obj_1["coords"][0] = x;
                    obj_1["coords"][1] = y;

                    // // Draw changes
                    // this.drawObject(obj_1);
                    // this.drawObject(obj_2);

                }
            }
        } else {
            var obj_1_x = obj_1["coords"][0];
            var obj_1_y = obj_1["coords"][1];

            // Calculate new position
            var x = obj_1_x + obj_1["velocity_x"] * FPS;
            var y = obj_1_y + obj_1["velocity_y"] * FPS;
            obj_1["coords"][0] = x;
            obj_1["coords"][1] = y;
        }
    }



    simulation() {
        var self = this;
        function simulation_tick() {
            var tick_time_start = performance.now();

            self.clearObjects();
            for (var i = 0; i < self.objects.length; i++) {
                var object = self.objects[i];
                if (!object["static"]) {
                    self.calculatePosition(i);

                }
                self.drawObject(object);
                //self.drawLines();
                // else {
                //    self.drawObject(object);
                //}

            }

            var tick_time_end = performance.now();
            var delta_time = tick_time_end - tick_time_start;
            setTimeout(simulation_tick, FPS - delta_time);
        }
        simulation_tick();
    }
}