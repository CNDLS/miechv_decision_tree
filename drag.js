/*
 * Make 'wells' for dragging out multiple copies of the options.
 * Handle dragging options over dropzones & dropping them in.
 * Use one c.for both interact functions, so we can share
 * info about the dragged option.
 */

var c= {
  
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
	  c.dropped_onto_target = true;
    }
  },

  ondragleave: function (evt) {
    var activities = document.getElementsByClassName("activity");
    var activity;
    for (var i=0; i <= activities.length; i++) {
      activity = activities[i];
      if (activity === undefined) continue;
      activity.classList.remove("hovered");
      for (var j=0; j <= activity.children.length; j++) {
        if (activity.children[j] === undefined) continue;
        activity.children[j].classList.remove("hovered");
      }
    }
  },
  
  ondrop: function (evt) 
  {
    c.dragged_element = evt.relatedTarget;
    c.drop_target = evt.target;
    if (c.drop_target.title == c.option_title) 
	{
      c.thumb = document.body.removeChild(c.thumb);
	  var dropped_span = document.createElement("span");
	  dropped_span.innerHTML = c.thumb.innerHTML;
	  c.drop_target.appendChild(dropped_span);
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


interact('.well > span').draggable(c);
interact('.droptarget').dropzone(c);
