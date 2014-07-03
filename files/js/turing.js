var de = de || {};
de.vad_systems = de.vad_systems || {};
de.vad_systems.turing = {};

/* Variables */
de.vad_systems.turing.interval = -1;

/* Machine Controls */
de.vad_systems.turing.controls = {};
	/* Read */
	de.vad_systems.turing.controls.read = function () {
		return document.querySelector("div#strip div.cell.selected").textContent;
	};
	
	/* Write */
	de.vad_systems.turing.controls.write = function (content) {
		document.querySelector("div#strip div.cell.selected").textContent = content;
	};
	
	/* Move */
	de.vad_systems.turing.controls.moveLeft = function () {
		de.vad_systems.turing.checkLeftEnd();
		
		var cell = document.querySelector("div#strip div.cell.selected");
		cell.classList.remove("selected");
		cell.previousSibling.classList.add("selected");
		document.querySelector("#view-content").scrollLeft = cell.offsetLeft;
	};
	
	de.vad_systems.turing.controls.moveRight = function () {
		de.vad_systems.turing.checkRightEnd();
		
		var cell = document.querySelector("div#strip div.cell.selected");
		cell.classList.remove("selected");
		cell.nextSibling.classList.add("selected");
		document.querySelector("#view-content").scrollLeft = cell.offsetLeft;
	};

/* Tick Execution */
de.vad_systems.turing.tick = function () {
	var rules = document.querySelectorAll("div#rules table tbody tr");
	var state = document.querySelector("div#info span#state").textContent;
	var read = document.querySelector("div#strip div.cell.selected").textContent;
	
	for(var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		if(rule.querySelector("td.condition_state").textContent == state) {
			// Rule matches State
			if(rule.querySelector("td.condition_read").textContent == read) {
				// Rule matches Read
				de.vad_systems.turing.executeRule(rule);
				var steps = document.querySelector("div#info span#steps");
				steps.textContent = steps.textContent*1 + 1;
				return;
			}
		}
	}
	
	// No rule found
	de.vad_systems.turing.io.stop();
};

de.vad_systems.turing.executeRule = function (rule) {
	if(rule.querySelector("td.action_state").textContent != "") {
		document.querySelector("div#info span#state").textContent = rule.querySelector("td.action_state").textContent;
	}
	
	if(rule.querySelector("td.action_write").textContent != "") {
		document.querySelector("div#strip div.cell.selected").textContent = rule.querySelector("td.action_write").textContent;
	}
	
	switch(rule.querySelector("td.action_move").textContent) {
		case "R":
			de.vad_systems.turing.controls.moveRight();
			break;
		case "L":
			de.vad_systems.turing.controls.moveLeft();
			break;
		default:
	}
};

/* Overflow Check */
de.vad_systems.turing.checkLeftEnd = function () {
	var strip = document.querySelector("div#strip");
	
	var end = strip.firstChild.nextSibling;
	if(end.classList.contains("selected")) {
		var c = de.vad_systems.turing.createCell();
		strip.insertBefore(c, document.querySelector("div#strip #plus-left").nextSibling);
	}
};

de.vad_systems.turing.checkRightEnd = function () {
	var strip = document.querySelector("div#strip");
	
	var end = strip.lastChild.previousSibling;
	if(end.classList.contains("selected")) {
		var c = de.vad_systems.turing.createCell();
		strip.insertBefore(c, document.querySelector("div#strip #plus-right"));
	}
};

de.vad_systems.turing.createCell = function () {
	var c = document.createElement("div");
	c.classList.add("cell");
	c.textContent = controls.querySelector("#blank-symbol").textContent;
	
	c.onclick = de.vad_systems.turing.event.enableInput;
	c.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	
	return c;
};

/* Event Handling */
de.vad_systems.turing.event = {};

/* Single Character Input */
	de.vad_systems.turing.event.singleKeyInput = function (e) {
		var s = String.fromCharCode(e.which);
		if(this.contentEditable) {
			this.textContent = s;
			this.contentEditable = false;
		}
	};
	
	/* Enabling Input */
	de.vad_systems.turing.event.enableInput = function () {
		this.contentEditable = true;
	};

/* IO */
de.vad_systems.turing.io = {};
	/* Start */
	de.vad_systems.turing.io.start = function () {
		de.vad_systems.turing.interval = window.setInterval(de.vad_systems.turing.tick, 500);
		var buttonToggle = document.querySelector("#run-toggle");
		buttonToggle.textContent = "Stop";
		buttonToggle.className = "active";
	};
	
	/* Stop */
	de.vad_systems.turing.io.stop = function () {
		window.clearInterval(de.vad_systems.turing.interval);
		var buttonToggle = document.querySelector("#run-toggle");
		buttonToggle.textContent = "Start";
		buttonToggle.className = "inactive";
	};
	
	/* Toggle Start/Stop */
	de.vad_systems.turing.io.toggleRun = function () {
		var buttonToggle = document.querySelector("#run-toggle");
		if(buttonToggle.textContent == "Start") {
			de.vad_systems.turing.io.start();
		}
		else {
			de.vad_systems.turing.io.stop();
		}
	};
	
	/* Reset */
	de.vad_systems.turing.io.reset = function () {
		de.vad_systems.turing.initialize(true);
	};

/* Rules Input */
de.vad_systems.turing.createRule = function () {
	var rules = document.querySelector("div#rules table tbody");
	
	var rule = document.createElement("tr");
	
	var condition_state = document.createElement("td");
	condition_state.classList.add("condition_state");
	condition_state.onclick = de.vad_systems.turing.event.enableInput;
	condition_state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(condition_state);
	
	var condition_read = document.createElement("td");
	condition_read.classList.add("condition_read");
	condition_read.onclick = de.vad_systems.turing.event.enableInput;
	condition_read.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(condition_read);
	
	var action_write = document.createElement("td");
	action_write.classList.add("action_write");
	action_write.onclick = de.vad_systems.turing.event.enableInput;
	action_write.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_write);
	
	var action_move = document.createElement("td");
	action_move.classList.add("action_move");
	action_move.onclick = de.vad_systems.turing.event.enableInput;
	action_move.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_move);
	
	var action_state = document.createElement("td");
	action_state.classList.add("action_state");
	action_state.onclick = de.vad_systems.turing.event.enableInput;
	action_state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_state);
	
	var option_remove = document.createElement("td");
	option_remove.classList.add("option_remove");
	var button = document.createElement("button");
	button.textContent = "X";
	button.onclick = function () {
		this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
	};
	option_remove.appendChild(button);
	rule.appendChild(option_remove);
	return rule;
};

/* Init */
de.vad_systems.turing.initialize = function (soft) {
	de.vad_systems.turing.initStrip();
	de.vad_systems.turing.initInfo();
	de.vad_systems.turing.initControls();
	if(soft !== true) {
		de.vad_systems.turing.initRules();
	}
};

de.vad_systems.turing.initStrip = function () {
	var strip = document.querySelector("#strip");
	strip.innerHTML = "";
	var plusLeft = document.createElement("button");
	plusLeft.textContent = "+";
	plusLeft.id = "plus-left";
	plusLeft.onclick = function () {
		document.querySelector("#strip").insertBefore(de.vad_systems.turing.createCell(), this.nextSibling);
		document.querySelector("#view-content").scrollLeft = this.offsetLeft;
	};
	
	var plusRight = document.createElement("button");
	plusRight.textContent = "+";
	plusRight.id = "plus-right";
	plusRight.onclick = function () {
		document.querySelector("#strip").insertBefore(de.vad_systems.turing.createCell(), this);
		document.querySelector("#view-content").scrollLeft = this.offsetLeft;
	};
	
	strip.appendChild(plusLeft);
	var c = de.vad_systems.turing.createCell();
	c.classList.add("initial");
	strip.appendChild(c);
	strip.appendChild(plusRight);
	
	document.querySelector("div:nth-child(2)").classList.add("selected");
	document.querySelector("#view-content").scrollLeft = document.querySelector("div:nth-child(1)").offsetLeft;
};

de.vad_systems.turing.initInfo = function () {
	var info = document.querySelector("#info");
	
	var state = info.querySelector("#state");
	state.textContent = "1";
	state.onclick = de.vad_systems.turing.event.enableInput;
	state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	
	var steps = info.querySelector("#steps");
	steps.textContent = "0";
};

de.vad_systems.turing.initRules = function () {
	var rules = document.querySelector("div#rules");
	
	rules.querySelector("table tbody").innerHTML = "";
	rules.querySelector("table tfoot button").onclick = function () {
		document.querySelector("div#rules table tbody").appendChild(de.vad_systems.turing.createRule());
	};
};

de.vad_systems.turing.initControls = function () {
	var controls = document.querySelector("#controls");
	
	var buttonToggle = controls.querySelector("#run-toggle");
	buttonToggle.onclick = de.vad_systems.turing.io.toggleRun;
	de.vad_systems.turing.io.stop();
	
	var buttonReset = controls.querySelector("#reset");
	buttonReset.textContent = "Reset";
	buttonReset.onclick = de.vad_systems.turing.io.reset;
	
	var blankSymbol = controls.querySelector("#blank-symbol");
	blankSymbol.onclick = de.vad_systems.turing.event.enableInput;
	blankSymbol.onkeypress = de.vad_systems.turing.event.singleKeyInput;
};
