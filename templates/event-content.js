<div style='position:absolute; top:0px; left: 0px'><img src=<%= '/static/images/formats/adv'+event.event_status_id+'.png' %>></div>
<div class="inner">
    <span class="close" style="right:55px; top:65px"></span>
    <div style="font-size: 27px; position:absolute; top:60px; font-weight:bold; width:88%"><%= event.name %></div>
    <div style="font-size: 25px; position:relative; top: 40px"><%= event.subject_name %></div>
    <div style="font-size: 25px; position:relative; top: 70px"><%= event.source %></div>
    <div style="font-size: 25px; position:relative; top: 100px"><%= event.date_time.replace("T00:00:00Z", "") %></div>


 <div style="position:absolute; left:0px; top:326px; width:100%; height:114px; display: inline" id="cont_event_slider">
 	<div style="position:absolute; top:50%; margin-top:-36px; left:4%; cursor:pointer"><img id="prev_slide_button" src="/static/images/arrow_right.png"/></div>
 	<div style="position:absolute; top:px; margin-left:-444px; left:50%"><div id="cont_event_slider_inner"><ul id=cont_event_slider_ul></ul></div></div>
    <div style="position:absolute; top:50%; margin-top:-36px; right:4%; cursor:pointer"><img id="next_slide_button" src="/static/images/arrow_left.png"/></div>
 </div>

    <% if(event.descr) { %>
	    	<div class="desc" style="position:absolute; left:35px; top:450px; height:330px; text-align: justify; display: table;">
	    		<div style="display: table-cell; vertical-align: middle; font-size: 18px; line-height: 1.5">
	    			<%= event.descr + " " + event.info %>
	    		</div>
	    	</div>
    	<% } %>


 </div>