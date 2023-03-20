document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.myButton').forEach(function(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
    });
  });
  getRooms();
  var rooms = JSON.parse(localStorage.getItem("Rooms"));    
  var events = createCalendarEvents(rooms);
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: 'bootstrap5',
    timeZone: 'local',
    allDaySlot: false,
    locale: navigator.language,
    initialView: 'timeGridWeek',
    selectable: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '19:00:00',
    events: events,
    hiddenDays: [0, 6],
    eventSources: [

    ],
    datesSet: function(info) {
      var startDate = info.start;
      var endDate = info.end;
      var events = createCalendarEvents(rooms, startDate, endDate);
      calendar.removeAllEvents();
      calendar.addEventSource(events);
    },
    eventClick: function(info) {
            
        var modalId = 'modal-' + info.event.id; // Add booking ID to modal ID
        var reserveBtnId = 'reserveBtn-' + info.event.id; // Add booking ID to reserve button ID
        var deleteBtnId = 'deleteBtn-' + info.event.id; // Add booking ID to delete button ID
      
        var modal = document.createElement('div');
        modal.id = modalId; // Set modal ID
        modal.classList.add('modal', 'fade');
        modal.innerHTML = `
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Booking Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Booked from ${moment(info.event.start).format('DD-MM-YYYY [Time:] HH:mm')} to ${moment(info.event.end).format('DD-MM-YYYY [Time:] HH:mm')}</p>
                <div><p>booked by ${info.event.extendedProps.email}</p></div>
                </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-action="delete" id="${deleteBtnId}">Delete</button>
                <button type="button" class="btn btn-primary" data-action="reserve" id="${reserveBtnId}">Reserve</button>
              </div>
            </div>
          </div>
        `;
      
        document.body.appendChild(modal);
        var modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      
        // Add click event listener to the buttons
        var reserveBtn = modal.querySelector(`#${reserveBtnId}`);
        if (reserveBtn) {
          reserveBtn.addEventListener('click', function () {
            // Check if this button is for an available slot or a booking
            var action = this.dataset.action;
            if (action === 'reserve') {
              makeBooking(info.event.title, info.event.start, info.event.end, checkTokenUser(localStorage.getItem("jwtToken")), calendar);
              console.log('Reserve button clicked for an available slot');
            }
            modalInstance.hide();
            modal.remove();
          });
        }
      
        var deleteBtn = modal.querySelector(`#${deleteBtnId}`);
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function () {
            deleteBooking(info.event.id, info.event.title, checkTokenUser(localStorage.getItem("jwtToken")));
            console.log('Delete button clicked');
            modalInstance.hide();
            modal.remove();
          });
        }
      }
          
      
    });
  calendar.render();
  calendar.on('datesSet', function (info) {
    calendar.refetchEvents();
  });
  });
  
  function createCalendarEvents(rooms, startDate, endDate) {
    var businessHours = {
      start: '07:00', // your business hours
      end: '19:00',
      dow: [1, 2, 3, 4, 5] // Monday - Friday
    };
  
    var events = [];
    
  
    rooms.forEach(function(room) {
      getBookingByRoom(room.name);
      bookings = JSON.parse(localStorage.getItem(room.name));      
      if (bookings === null) {
        bookings = [];
      }
        for (var i = 0; i < businessHours.dow.length; i++) {
          var dow = businessHours.dow[i];
          var start = moment(startDate).startOf('week').add(dow, 'days').add(businessHours.start);
          var end = moment(endDate).startOf('week').add(dow, 'days').add(businessHours.end);
  
          while (start.isBefore(end)) {
            var eventStart = start.format();
            start.add(1, 'hour');
            var eventEnd = start.format();
  
            var isBooked = false;
            bookings.forEach(function(booking) {
              if (moment(booking.timeStart).isBefore(eventEnd) && moment(booking.timeEnd).isAfter(eventStart)) {
                // The time slot is already booked, so skip it
                isBooked = true;
              }
            });
  
            if (!isBooked) {
              events.push({
                title: room.name,
                start: eventStart,
                end: eventEnd,
                backgroundColor: '#008000',
                borderColor: '#008000',
                textColor: '#fff',
                editable: false,
              });
            }
          }
        }
  
        bookings.forEach(function(booking) {
              var event = {
              email: booking.userEmail,
              id: booking.token,
              title: room.name,
              start: booking.timeStart,
              end: booking.timeEnd,
              backgroundColor:  '#FF0000',
              borderColor: '#FF0000',
              textColor: '#fff',
              editable: false,
              allDay: false
            };
            events.push(event);          
        });
      
      });
    
  
    return events;
  }

  
