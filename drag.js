/*
 * Make 'wells' for dragging out multiple copies of the options.
 * Handle dragging options over dropzones & dropping them in.
 * Use one c.for both interact functions, so we can share
 * info about the dragged option.
 */

var c = {
  
  // enable inertial throwing
  inertia: true,

  // enable autoScroll
  autoScroll: true,
  
  // we'll be dragging a copy of the clicked item.
  thumb: null,
  option_title: null,
  accept: null,
  
  // we keep track of whether it was dropped somewhere good.
  dropped_onto_target: false,
  
  // create a copy of the clicked item.
  onstart: function (evt) {
    c.thumb = evt.target.cloneNode(true);
    // to match styles and position easily, just put the thumb in the original's parent.
    document.body.appendChild(c.thumb);
    c.thumb.style.position = "absolute";
    c.thumb.classList.add('dragging','clone');
  
    // associate the correct droptargets for the chosed option.
    c.option_title = evt.target.parentNode.title;
    c.accept = "title[" + c.option_title + "]";
  
    var orig_rect = evt.target.getBoundingClientRect();
    c.thumb.dataset.drag_x = 0;
    c.thumb.dataset.drag_y = 0;
    c.thumb.style.left = orig_rect.left + "px";
    c.thumb.style.top = orig_rect.top + "px";
    c.thumb.style.width = (orig_rect.right - orig_rect.left) + "px";
  },

  onmove: function (evt) {
    // keep the dragged position in the data-x/data-y attributes
    x = (c.thumb.dataset.drag_x|0) + evt.dx,
    y = (c.thumb.dataset.drag_y|0) + evt.dy;

    // translate the element
    c.thumb.style.webkitTransform =
    c.thumb.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
      c.thumb.dataset.drag_x = x;
      c.thumb.dataset.drag_y = y;
  },

  ondragenter: function (evt) {
    c.dragged_element = evt.relatedTarget;
    c.drop_target = evt.target;
    if (c.drop_target.title == c.option_title) {
      c.drop_target.classList.add("hovered");
      c.drop_target.parentNode.classList.add("hovered");
    }
  },

  ondragleave: function (evt) {
    var activities = document.getElementsByClassName("activity");
    var activity;
    for (var i=0; i < activities.length; i++) {
      activity = activities[i];
      if (activity === undefined) continue;
      activity.classList.remove("hovered");
      for (var j=0; j < activity.children.length; j++) {
        if (activity.children[j] === undefined) continue;
        activity.children[j].classList.remove("hovered");
      }
    }
  },
  
  ondrop: function (evt) 
  {
    c.dragged_element = evt.relatedTarget;
    c.drop_target = evt.target;
    // make sure we're over the right type of container.
    if (c.drop_target.title == c.option_title) {
      // make sure there isn't one of these already in the container.
      var already_dropped_options = c.drop_target.getElementsByTagName("span");
      var option_already_here = false;
      for (var i=0; i <already_dropped_options.length; i++) {
        if (already_dropped_options[i].innerHTML == c.dragged_element.innerHTML) {
          option_already_here = true;
        }
      }
      if (!option_already_here) {
        c.thumb = document.body.removeChild(c.thumb);
    	  var dropped_span = document.createElement("span");
    	  dropped_span.innerHTML = c.thumb.innerHTML;
    	  c.drop_target.appendChild(dropped_span);
        c.drop_target.classList.remove("hovered");
        var activities = document.getElementsByClassName("activity");
        var activity;
        for (var i=0; i < activities.length; i++) {
          activity = activities[i];
          if (activity === undefined) continue;
          activity.classList.remove("hovered");
        }
  	    c.dropped_onto_target = true;
      }
    }
  },
  
  onend: function (evt) {
     // if not dropped over a valid target, remove the draggable.
     if (!c.dropped_onto_target) {
       document.body.removeChild(c.thumb);
     }
     c.dropped_onto_target = false;
   },
  
}

// for discarding dragged copies once they have been placed.
var d = {
  onstart: function (evt) {
    d.parentNode = evt.target.parentNode;
    var orig_rect = evt.target.getBoundingClientRect();
    evt.target.style.position = "absolute";
    var x = evt.interaction.startOffset.left;
    var y = evt.interaction.startOffset.top;
    // translate the element
    evt.target.style.webkitTransform =
    evt.target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';
  },
  
  onmove: function (evt) {
    // keep the dragged position in the data-x/data-y attributes
    x = (evt.target.dataset.drag_x|0) + evt.dx,
    y = (evt.target.dataset.drag_y|0) + evt.dy;

    // translate the element
    evt.target.style.webkitTransform =
    evt.target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    evt.target.dataset.drag_x = x;
    evt.target.dataset.drag_y = y;
  },
  
  onend: function (evt) {
    evt.target.parentNode.removeChild(evt.target);
  }
}

// hash of definitions for tooltips.
defs = {
  "Trained Lay/Professional": "Professionals or laypersons who have received specific training in the tools used.",
  "Prof/Team Ed/Serv": "Specialist professionals (e.g. psychologists, physical therapists, physicians, etc.) or teams of professions working in early childhood / early intervention service or educational or contexts.",
  "Prof/Team Health": "Specialist professionals (e.g. psychologists, physical therapists, physicians, etc.) or teams of professions working in healthcare settings.",
  "Structured inter/quest": "Structured interviews or sets of questions that are used to gather information in a standardized way.",
  "Structured obs of interact": "Using tools where you record in a standard way things you observe in family.",
  "Standard tests": "Standardized tests used by trained professionals that have formal scoring and norms",
  "Clinical Procedures": "Exams done by professionals such as physical exams, checking of range of motion of joints, etc.",
  "Medical dx": "Medical tests such as laboratory tests, x-rays, scans, etc.",
  "Parent/self -report": "Information is provided by the parent about the child's functioning or family functioning. This is information that is not directly observed by the person taking the information.",
  "Child/parent history": "Information about the child's or parent's history of health or family and  life experiences that is provided by the parent and is not directly observed by the person taking the information. ",
  "Rate observations": "Information is provided by ratings by someone trained to use a tool to record what they see happening between children and family members",
  "Obs beh/abilities": "Information is obtained in a standard way by seeing or asking a child to show certain behaviors, skills to see how well the child does them. The person who is doing the screening directly sees how well the child does and records this information. Examples include IQ tests, tests of motor or language development, etc.",
  "Clinical judgment": "Information comes from a specialist professional pulling together information from seeing the child or family, reviewing records and test results to form an opinion.",
  "Know possible risk": "Based on findings there is a possibility of increased risk for a particular problem.",
  "Need work-up/serv": "Based on findings there is an immediate need to refer for in-depth work up or services to address a problem.",
  "Detailed info": "Based on the findings there is detailed information about current functioning.",
  "Info interventions": "Based on the findings there is information to decide on individualized services in programs.",
  "Info progress": "Based on the findings there is information that can be used to track progress across time and to see if interventions are working",
  "Diagnoses": "Based on the findings there is information that can be used to make a diagnosis (e.g physical or emotional disorder, a developmental or intellectual disability, etc.)",
  "Medical tx": "Based on the findings there is information that can be used to develop a plan for medical treatment.",
  "Therapy plans": "Based on the findings there is information that can be used to develop individualized therapy plans (e.g. physical therapy, psychotherapy, etc.)"
}

document.addEventListener("DOMContentLoaded", function(event) { 
  // initialize definition tooltips.
  var options = document.getElementsByTagName("span");
  var option;
  for (var i=0; i<options.length; i++) {
    option = options[i];
    option.title = defs[option.innerHTML];
  }
  
  // initialize drag-and-drop.
  interact('.well > span').draggable(c);
  interact('.droptarget').dropzone(c);
  interact('.activity > div:not(.guy) span').draggable(d);
});