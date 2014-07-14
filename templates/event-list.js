<% if(events) { %>
    <div class="show nav-elements" id="events-paramers-show"></div>
    <div class="event-data" id="events-parametrs-widget">
        <h2><%= title %></h2>
        <a href="#" class="hidden"></a>
        <div class="inner_table" id="events-list-table">
            <table width="100%">
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Событие</th>
                        <th>Регион</th>
                        <th>Источник</th>
                    </tr>
                </thead>
                <tbody>
                    <% if(events) { %>
                        <% _.each(events, function(evt) { %>
                            <tr data-id="<%= evt.id %>" data-status="<%= evt.event_status_id %>" class="status_<%= evt.event_status_id %>">
                                <td><% if(evt.date_time) { %><span></span><%= evt.date_time.SQLDatetimeToDate() %><% } %></td>
                                <td><%= evt.name %></td>
                                <td><%= evt.subject_name %></td>
                                <td><%= evt.source %></span><img id="event_delete_<%= evt.id %>" style="display:none; position:absolute; right:10px;" src="<%= host %>/static/images/delete.png" /></td>

                            </tr>
                        <% }); %>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
<% } %>