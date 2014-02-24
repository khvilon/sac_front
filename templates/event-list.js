<div class="show nav-elements" id="events-paramers-show"></div>
<div class="data" id="events-parametrs-widget">
    <h2>События</h2>
    <a href="#" class="hidden"></a>
    <div class="inner_table" id="events-list-table">
        <table>
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Событие</th>
                    <th>Регион</th>
                    <th>Источник</th>
                </tr>
            </thead>
            <tbody>
                <% _.each(events, function(evt) { %>
                    <tr data-id="<%= evt.id %>" class="status_<%= evt.event_status_id %>">
                        <td><%= evt.date_time.replace("T00:00:00Z", "") %></td>
                        <td><%= evt.name %></td>
                        <td><%= evt.subject_name %></td>
                        <td><%= evt.source %></td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>
</div>