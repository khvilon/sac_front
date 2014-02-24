<div class="inner">
    <span class="close"></span>
    <div class="cont_event table">
    	<table <% if(!event.descr) { %>class="full"<% } %>>
            <tbody>
                <tr>
                    <td><strong>Дата</strong></td><td><%= event.date_time.replace("T00:00:00Z", "") %></td>
                </tr>
                <tr>
                    <td><strong>Событие</strong></td><td><%= event.name %></td>
                </tr>
                <tr>
                    <td><strong>Регион</strong></td><td><%= event.subject_name %></td>
                </tr>
                <tr>
                    <td><strong>Источник</strong></td><td><%= event.source %></td>
                </tr>
            </tbody>
        </table>
        <% if(event.descr) { %>
	    	<div class="desc">
	    		<%= event.descr %>
	    	</div>
    	<% } %>
    </div>
    <div class="info">
    	<%= event.info %>
    </div>
</div>