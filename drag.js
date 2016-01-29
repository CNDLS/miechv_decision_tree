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
	overlap: 0.1,
	

  
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
	  c.dragged_element.classList.add('drop-target');
	  c.dragged_element.classList.add('can-drop');
	  c.dragged_element.textContent = 'Dragged in';
    }
  },
  
  ondrop: function (evt) 
  {
     c.dragged_element = evt.relatedTarget;
     c.drop_target = evt.target;
     if (c.drop_target.title == c.option_title) 
	 {
       c.thumb = document.body.removeChild(c.thumb);
       c.thumb.style.left = c.thumb.style.top = "0";
       c.drop_target.appendChild(c.dragged_element);
	   c.drop_target.classList.remove('drop-target');
	   c.dragged_element.textContent = 'Dropped';
     }
	 
   },
 


  ondragleave: function (evt) 
   {
    var activities = document.getElementsByClassName("activity");
    var activity;
    for (var i=0; i <= activities.length; i++) 
	{
      activity = activities[i];
      if (activity === undefined) continue;
      activity.classList.remove("hovered");
      for (var j=0; j <= activity.children.length; j++) 
	  {
        if (activity.children[j] === undefined) continue;
        activity.children[j].classList.remove("hovered");
		evt.target.classList.remove('drop-target');
		evt.relatedTarget.classList.remove('can-drop');
		evt.relatedTarget.classList.textContent = 'Dragged out';
      }
    }
  },
  
//********************************************
  
  ondropactivate: function (evt) {
      c.drop_target = evt.target;
      if (c.drop_target.title == c.option_title) 
 	 {
 	   c.drop_target.classList.add('drop-active');
      }

   },
		  
ondropdeactivate: function (evt) {
    c.drop_target = evt.target;
    if (c.drop_target.title == c.option_title) 
 	{
      c.drop_target.classList.remove('drop-target');
    }
  },
	 
}

interact('.well > span').draggable(c);
interact('.droptarget').dropzone(c);

