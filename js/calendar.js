document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.myButton').forEach(function(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
    });
  });
  
  var rooms = JSON.parse(localStorage.getItem("Rooms")); 
  
  
 
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
  events: function(info, successCallback, failureCallback) {
    createCalendarEvents(rooms, info.start, info.end).then(function(events) {
      successCallback(events);
    }).catch(function(error) {
      failureCallback(error);
    });
  },
  hiddenDays: [0, 6],
  eventSources: [],
  datesSet: function(info) {
    calendar.removeAllEvents();
    calendar.refetchEvents();
  },
    eventClick: function(info) {        
      var modalId = 'modal-' + info.event.id;
      var modal = document.createElement('div');
      modal.id = modalId;
      modal.classList.add('modal', 'fade');
    
      var modalBody = document.createElement('div');
      modalBody.classList.add('modal-body');
    
      if (info.event.extendedProps.type === 'open') {
        var reserveBtnId = 'reserveBtn-' + info.event.id;
        var reserveBtn = document.createElement('button');
        reserveBtn.id = reserveBtnId;
        reserveBtn.classList.add('btn', 'btn-primary');
        reserveBtn.innerText = 'Reserve';
        reserveBtn.addEventListener('click', function() {
          // Handle click event for reserve meeting button
        });
        modalBody.appendChild(reserveBtn);
      } else if (info.event.extendedProps.type === 'booked') {
        var deleteBtnId = 'deleteBtn-' + info.event.id;
        var deleteBtn = document.createElement('button');
        deleteBtn.id = deleteBtnId;
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', function() {
          // Handle click event for delete button
        });
        modalBody.appendChild(deleteBtn);
      }
    
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
        ${info.event.type === 'open' ? modalBody.innerHTML : ''}
        ${info.event.type === 'booked' ? modalBody.innerHTML : ''}
      </div>
    </div>
  </div>
`;

var modalFooter = modal.querySelector('.modal-footer');
modalFooter.appendChild(modalBody);
modalFooter.classList.add('text-end');

      
    
      document.body.appendChild(modal);
      var modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    
      
        // Add click event listener to the buttons
        var reserveBtn = modal.querySelector(`#${reserveBtnId}`);
        if (reserveBtn) {
          reserveBtn.addEventListener('click', function () {
            
              makeBooking(info.event.title, info.event.start, info.event.end, checkTokenUser(localStorage.getItem("jwtToken")), calendar)
              .then(function(data){
                createCalendarEvents(rooms, info.start, info.end)
                .then(function(events){
                  
                 calendar.addEventSource(events);
                 calendar.removeAllEvents();
                 calendar.refetchEvents();
        })
            })
            .catch(function(error){
              var errorModal = document.createElement("div");
              errorModal.className = "modal";
              errorModal.addEventListener('click', function () {
                errorModal.remove();
              });
              
              errorModal.innerHTML = `
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <p>${error}</p>
                </div>
              `;
              document.body.appendChild(errorModal); 
              
              errorModal.style.display = "block";
              
            });
            
            modalInstance.hide();
            modal.remove();
          });        
            }
      
            var deleteBtn = modal.querySelector(`#${deleteBtnId}`);
            if (deleteBtn) {
              deleteBtn.addEventListener('click', function () {
                deleteBooking(info.event.id, info.event.title, checkTokenUser(localStorage.getItem("jwtToken")))
                .then(function(data){
                  createCalendarEvents(rooms, info.start, info.end)
                  .then(function(events){
                    calendar.addEventSource(events);
                    calendar.removeAllEvents();
                    calendar.refetchEvents();
                  })
                })
                .catch(function(error){
                  var errorModal = document.createElement("div");
                  errorModal.className = "modal";
                  errorModal.addEventListener('click', function () {
                    errorModal.remove();
                  });
                  
                  errorModal.innerHTML = `
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <p>${error}</p>
                    </div>
                  `;
                  document.body.appendChild(errorModal); 
                  
                  errorModal.style.display = "block";
                  
                });
                
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
    return new Promise(function(resolve, reject) {
    var businessHours = {
      start: '07:00', // your business hours
      end: '19:00',
      dow: [1, 2, 3, 4, 5] // Monday - Friday
    };
  
    var events = [];
    
  
    rooms.forEach(function(room) {
      getBookingByRoom(room.name)
      .then(function(data) {})
      .catch(function(error){
        console.log(error)
      })
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
                type: "open",
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
              type:"booked",
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
      resolve(events);
    });
  }
  

  
