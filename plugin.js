function SylvanCalendar(){
    this.resourceList = [];
    this.calendar = undefined;
    this.filters = new Object();
    this.eventList = [];

    this.init = function(element){
        wjQuery('#'+element).load(window.location.protocol +"//"+window.location.host+"/WidgetCalendar/index.html");    
        this.loadLibraries();
    }
    this.loadLibraries = function(){
        var css_link = wjQuery("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/full-calendar/fullcalendar.css" 
        });
        css_link.appendTo('head');

        css_link = wjQuery("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/jquery/jquery-ui-1.8.23.css" 
        });
        css_link.appendTo('head'); 

        css_link = wjQuery("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/libraries/bootstrap/css/bootstrap.min.css" 
        });
        css_link.appendTo('head'); 

        css_link = wjQuery("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/common.css" 
        });
        css_link.appendTo('head');  

        css_link = wjQuery("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/style.css" 
        });
        css_link.appendTo('head'); 

        css_link = wjQuery("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/libraries/bootstrap/js/bootstrap.min.js" 
        });     
        css_link.appendTo('head');

        css_link = wjQuery("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/moment/moment.min.js" 
        });     
        css_link.appendTo('head');    

        css_link = wjQuery("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/jQuery/jquery-ui-1.8.23.min.js"
        });     
        css_link.appendTo('head'); 

        css_link = wjQuery("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/jQuery/jquery-timepicker-1.3.5.min.js"
        });     
        css_link.appendTo('head');    

        css_link = wjQuery("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/full-calendar/fullcalendar.js" 
        });     
        css_link.appendTo('head');
    }

    this.populateLocation = function(args){
        var locationData = [];
        args[0][0] == undefined ? locationData = args:locationData = args[0];
        var locationList = [];
        for(var i=0;i<locationData.length;i++){
            if(!i)
            {
                wjQuery(".loc-dropdown .btn:first-child").text(locationData[i].hub_centername);
                wjQuery(".loc-dropdown .btn:first-child").val(locationData[i].hub_centerid);
            }
            locationList.push('<li><a tabindex="-1" value-id='+locationData[i].hub_centerid+' href="javascript:void(0)">'+locationData[i].hub_centername+'</a></li>');
        }
        wjQuery(".loc-dropdown ul").html(locationList);
        wjQuery(".loc-dropdown .dropdown-menu").on('click', 'li a', function(){
            if(wjQuery(".loc-dropdown .btn:first-child").val() != wjQuery(this).attr('value-id')){
                wjQuery(".loc-dropdown .btn:first-child").text(wjQuery(this).text());
                wjQuery(".loc-dropdown .btn:first-child").val(wjQuery(this).attr('value-id'));
                this.resourceList = [];
                return wjQuery(this).attr('value-id');
            }
        });
        return locationData[0].hub_centerid;
    }

    this.populateResource = function(args){
        var resourceData = [];
        args[0][0] == undefined ? resourceData = args:resourceData = args[0];
        for(var i=0;i<resourceData.length;i++){
            this.resourceList.push({
                name: i+1,
                id: resourceData[i].hub_center_resourcesid
            });
        }
        this.calendar == undefined ? this.loadCalendar(): this.calendar.fullCalendar('resources',this.resourceList);
    }

    this.calendarFilter = function(){
         this.buildFilterBody();
        //console.log("calendarFilter loaded");
    }

    this.filterSlide = function(expanded){
        wjQuery('.filter-label-outer').click(function(){
            wjQuery('.filter-section').animate(expanded?{'marginLeft':'-275px'} : {marginLeft:'0px'},500);
            expanded ? wjQuery('.filter-slide-icon').removeClass('open') : wjQuery('.filter-slide-icon').addClass('open');
            expanded = !expanded;
        });
    }

    this.buildFilterBody = function(){
        wjQuery('.filter-section').html('<div class="filter-container"></div>'+
            '<div class="filter-label-outer">'+
                '<span class="filter-slide-icon"></span>'+
                '<div class="filter-label">FILTERS'+ 
                '</div>'+
            '</div>');
        wjQuery.each(this.filters, function(key, value){
            wjQuery('.filter-container').append(
                '<div id="filter_'+key+'" class="filter-header-container">'+
                    '<div class="filter-header cursor">' +
                        '<div class="filter-title">'+key+'</div>' +
                        '<span class="filter-nav-icon"></span>' +
                    '</div>' +
                '</div>'
            );  
        });
        wjQuery('.filter-section').css('height',wjQuery('.filter-section').next().height() - 2 +"px");  
        wjQuery('.filter-container').css({'height':wjQuery('.filter-section').next().height() - 2 +"px","overflow-y":"auto"});
    } 

    this.populateTAPane = function(teacherData){
        var teacherArray = [];
        var currentCalendarDate = this.calendar.fullCalendar('getDate');
        for(var i=0;i<teacherData.length; i++){
            if(teacherData[i].hub_+ moment(currentCalendarDate).format('dddd').toLowerCase()){
                var obj = {
                    name : teacherData[i]['_hub_staffid_value@OData.Community.Display.V1.FormattedValue'],
                    id: teacherData[i]['_hub_staffid_value'],
                    startDate : teacherData[i]['hub_startdate@OData.Community.Display.V1.FormattedValue'],
                    endDate : teacherData[i]['hub_enddate@OData.Community.Display.V1.FormattedValue'],
                    locationId : teacherData[i]['astaff_x002e_hub_center']
                }
                switch(moment(currentCalendarDate).format('dddd').toLowerCase()){
                    case 'monday':
                        obj.startTime = teacherData[i]['hub_monstarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                    case 'tuesday':
                        obj.startTime = teacherData[i]['hub_tuestarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                    case 'wednesday':
                        obj.startTime = teacherData[i]['hub_wedstarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                    case 'thursday':
                        obj.startTime = teacherData[i]['hub_thurstarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                    case 'friday':
                        obj.startTime = teacherData[i]['hub_fristarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                    case 'saturday':
                        obj.startTime = teacherData[i]['hub_satstarttime@OData.Community.Display.V1.FormattedValue'];
                    break ;
                    case 'sunday':
                        obj.startTime = teacherData[i]['hub_sunstarttime@OData.Community.Display.V1.FormattedValue'];
                    break;
                }
                obj.endTime = moment(obj.startTime, 'h:mm A').add(1,'h').format('h:mm A');
                teacherArray.push(obj);
            }
        }
        for(var j=0;j<teacherArray.length;j++){
            var elm =   '<div class="teacher-block"> <div class="teacher-container">'+
                            '<div class="display-inline-block padding-right-xs">'+ teacherArray[j].name+'</div>'+
                            '<div class="subject-identifier"></div>'+
                            '<div>'+ teacherArray[j].startTime +' - '+ teacherArray[j].endTime +'</div>'+
                        '</div></div>';
            wjQuery('.ta-pane').append(elm);
        }   
    }

    this.loadCalendar = function(){

        // assign filter object to local scope filter to avoid this conflict
        var filters = this.filters;

        var date = new Date();
        
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
       
        var calendarOptions = {
            header: false,
            defaultView: 'resourceDay',
            minTime:9,
            maxTime:18,
            droppable: true,
            drop: function(date, allDay) {
                alert("Dropped on " + date + " with allDay=" + allDay);
            },
            handleWindowResize:true,
            height:window.innerHeight - 60,
            slotMinutes : 30,
            selectable: true,
            selectHelper: true,
            select: function(start, end, allDay, event, resourceId) {
                var title = prompt('Event Title:');
                if (title) {
                    console.log("@@ adding event " + title + ", start " + start + ", end " + end + ", allDay " + allDay + ", resource " + resourceId);
                    this.calendar.fullCalendar('renderEvent',
                    {
                        title: title,
                        start: start,
                        end: end,
                        allDay: allDay,
                        resourceId: resourceId
                    },
                    true // make the event "stick"
                );
                }
                this.calendar.fullCalendar('unselect');
            },
            eventResize: function(event, dayDelta, minuteDelta) {
                console.log("@@ resize event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
            },
            eventDrop: function( event, dayDelta, minuteDelta, allDay) {
                console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
            },
            editable: true,
            resources: this.resourceList,
            events: this.eventList
        };  
        
        this.calendar = wjQuery('#calendar').fullCalendar(calendarOptions);
        var currentCalendarDate = this.calendar.fullCalendar('getDate');
        wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
        if(wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').length){
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align','center');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        }

        wjQuery("#addResource").click(function(){
            var newResource = {
                name:"Resource "+ (this.resourceList.length+1),
                id:"resource"+ (this.resourceList.length+1)
            };
            this.resourceList.push(newResource);
            this.calendar.fullCalendar("addResource",[newResource]);
        }); 

        this.prev = function(){
            this.calendar.fullCalendar('prev');
            var currentCalendarDate = this.calendar.fullCalendar('getDate');
            wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        }

        this.next = function(){
            this.calendar.fullCalendar('next');
            var currentCalendarDate = this.calendar.fullCalendar('getDate');
            wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        }

        this.weekView = function(){
            var filterElement = undefined;
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align','center');
            if(this.calendar.fullCalendar('getView').name != 'agendaWeek'){
                var isFilterOpen = false;
                if(wjQuery('.filter-section').length){
                    isFilterOpen = wjQuery('.filter-section').css("marginLeft");
                    filterElement = wjQuery('.filter-section');
                    wjQuery('.filter-section').remove();
                }
                this.calendar.fullCalendar('changeView','agendaWeek');
                if(filterElement != undefined){
                    wjQuery(".fc-agenda-divider.fc-widget-header:visible").after(filterElement);
                }
                else{
                    wjQuery(".fc-agenda-divider.fc-widget-header:visible").after("<div class='filter-section'></div>");
                    this.calendarFilter();
                }
                this.filterSlide(wjQuery,isFilterOpen == '0px');
            }
        }

        this.dayView = function(){
            var filterElement = undefined;
            if(this.calendar.fullCalendar('getView').name != 'resourceDay'){
                var isFilterOpen = false;
                if(wjQuery('.filter-section').length){
                    isFilterOpen = wjQuery('.filter-section').css("marginLeft");
                    filterElement = wjQuery('.filter-section');
                    wjQuery('.filter-section').remove();
                }
                this.calendar.fullCalendar('changeView','resourceDay');
                setTimeout(function(){
                    var currentCalendarDate = this.calendar.fullCalendar('getDate');
                    wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
                    var dayOfWeek = moment(currentCalendarDate).format('dddd');
                    var dayofMonth = moment(currentCalendarDate).format('M/D');
                    wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
                },500); 
                if(filterElement != undefined){
                    wjQuery(".fc-agenda-divider.fc-widget-header:visible").after(filterElement);
                }
                else{
                    wjQuery(".fc-agenda-divider.fc-widget-header:visible").after("<div class='filter-section'></div>");
                    this.calendarFilter();
                }
                this.filterSlide(wjQuery,isFilterOpen == '0px');
            }
        }

        wjQuery(".fc-agenda-divider.fc-widget-header").after("<div class='filter-section'></div>");
        this.calendarFilter();
        this.filterSlide(false);
        wjQuery('#datepicker').datepicker({
            buttonImage: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/images/calendar.png",
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            showOn: 'button',
            onSelect: function(date) {
              var displayDate = new Date(date);
              this.calendar.fullCalendar( 'gotoDate', displayDate );
               wjQuery('.headerDate').text(date);
               var dayOfWeek = moment(date).format('dddd');
               var dayofMonth = moment(date).format('M/D');
               wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);  
            }
        });
               
        this.addAppointment = function(){
            wjQuery("#appointmentModal").dialog({
                modal: true 
            });
            wjQuery("#appointmentModal").dialog('option', 'title', 'Add New Appointment Slot');
            setTimeout(function(){                      
                var etime;                        
                wjQuery(".from-timepicker-input" ).timepicker({
                            timeFormat: 'h:mm p', 
                            interval: 30,                            
                            minTime: '9',                            
                            maxTime: '6:00pm',                            
                            startTime: '9:00',                            
                            dynamic: false,                            
                            dropdown: true,                            
                            scrollbar: true,       
                            change: function ()
                            {                            
                                var stime = new Date;                            
                                stime.setMinutes(stime.getMinutes() + 30);    
                                var hours = stime.getHours();       
                                var minutes = stime.getMinutes();  
                                var ampm = hours >= 12 ? 'PM' : 'AM';    
                                hours = hours % 12;            
                                hours = hours ? hours : 12; 
                                minutes = minutes < 10 ? '0'+minutes : minutes; 
                                var etime = hours + ':' + minutes + ' ' + ampm; 
                                wjQuery(".to-timepicker-input").val(etime);  
                                wjQuery(".to-timepicker-input").timepicker('option',{'minTime': stime.getHours()});
                            }                        
                        });                                   
                wjQuery( ".to-timepicker-input" ).timepicker({    
                            timeFormat: 'h:mm p',                            
                            interval: 30,                            
                            minTime: wjQuery(".to-timepicker-input").val().split(' ')[0]+':00', 
                            maxTime: '6:00pm',                            
                            dynamic: false,                            
                            dropdown: true,                            
                            scrollbar: true                        
                        });                                   
            },300);
        }

        // From date for new appointment
        wjQuery( ".from-datepicker-input" ).datepicker();
        var selectedFromDate; 
        wjQuery(".from-datepicker-input").on("change",function(){
            selectedFromDate = wjQuery(this).val();
        });

        wjQuery(".from-up-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            wjQuery( ".from-datepicker-input" ).val(selectedFromDate);
        });

        wjQuery(".from-down-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() - 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            wjQuery( ".from-datepicker-input" ).val(selectedFromDate);
        });

         // To date for new appointment
        wjQuery( ".to-datepicker-input" ).datepicker();
        var selectedToDate; 
        wjQuery(".to-datepicker-input").on("change",function(){
            selectedToDate = wjQuery(this).val();
        });
         
        wjQuery(".to-up-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            wjQuery( ".to-datepicker-input" ).val(selectedToDate);
        });

        wjQuery(".to-down-arrow").on("click",function(){
            var date = new Date(selectedToDate);
            date.setDate(date.getDate() - 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            wjQuery( ".to-datepicker-input" ).val(selectedToDate);
        });

        wjQuery("#save").click(function(){
            alert("success");
            var fromDate = wjQuery("#fromDate").val();
            var fromTime = wjQuery("#fromTime").val();
            var toDate = wjQuery("#toDate").val();
            var toTime = wjQuery("#toTime").val();
            var type = wjQuery("#type").val();
            var capacity = wjQuery("#capacity").val();
            var staff = wjQuery("#staff").val();
            var location = wjQuery("#location").val();
            var notes = wjQuery("#notes").val();   
        });
        wjQuery('.filter-header').click(function() { 
            var id = wjQuery(this).parent().attr('id');
            let flag = wjQuery( "#"+id ).hasClass( "open" );
            if(flag){
                wjQuery(this).parent().children('.option-header-container').remove();
                wjQuery('#'+id).removeClass('open');
                wjQuery( "#"+id ).find('.filter-nav-icon').removeClass('open');
            }
            else{
                var indices = id.split('_');
                var index = indices[1];
                for(var i=0;i<filters[index].length;i++){
                    if (filters[index][i].radio) {
                        wjQuery('#'+id).append('<div class="option_'+filters[index][i].id+' option-header-container">'+
                        '<label class="cursor option-title">'+
                            '<input type="radio" name="checkbox" value="value">'+filters[index][i].name+
                        '</label>'+
                    '</div>');
                    }else{
                        wjQuery('#'+id).append('<div class="option_'+filters[index][i].id+' option-header-container">'+
                        '<label class="cursor option-title">'+
                            '<input type="checkbox" name="checkbox" value="value">'+filters[index][i].name+
                        '</label>'+
                    '</div>');
                    }
                    
                }
                wjQuery('#'+id).addClass('open');
                wjQuery( "#"+id ).find('.filter-nav-icon').addClass('open');
            }
        });   
        //Student pane and TA pane Functionality
        var sofExpanded = false;
        var taExpanded = false;
        wjQuery('.sof-pane').css('height',wjQuery('#calendar').height() - 25 +"px"); 
        wjQuery('.ta-pane').css('height',wjQuery('#calendar').height() - 25 +"px"); 
        wjQuery('.sof-pane').css('overflow-y','auto'); 
        wjQuery('.ta-pane').css('overflow-y','auto'); 
        
        this.sofPane = function(){
            wjQuery('.sof-pane').show();
            if(taExpanded){
                taExpanded = !taExpanded; // to change the slide
                taExpanded ? wjQuery('.ta-pane').addClass('open') : wjQuery('.ta-pane').removeClass('open');
                wjQuery('.ta-pane').animate(taExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
            }
            sofExpanded = !sofExpanded;
            if(sofExpanded){
                wjQuery('.ta-pane').hide();
            }
            sofExpanded ? wjQuery('.sof-pane').addClass('open') : wjQuery('.sof-pane').removeClass('open');
            wjQuery('.sof-pane').animate(sofExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
        }
        this.taPane = function(){
            wjQuery('.ta-pane').show();
            if(sofExpanded){
                sofExpanded = !sofExpanded;
                sofExpanded ? wjQuery('.sof-pane').addClass('open') : wjQuery('.sof-pane').removeClass('open');
                wjQuery('.sof-pane').animate(sofExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
            }
            taExpanded = !taExpanded;
            if(taExpanded){
                wjQuery('.sof-pane').hide();
            }
            taExpanded ? wjQuery('.ta-pane').addClass('open') : wjQuery('.ta-pane').removeClass('open');
            wjQuery('.ta-pane').animate(taExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
        }
    
    }

    this.generateFilterObject = function(args){
        args[0] == undefined ? filtersObj = args : filtersObj = args[0];
        var filterArray = this.filters;
        var eventList = this.eventList;
        wjQuery.each(filtersObj, function(key, value) {
            filterArray[key] = [];
            wjQuery.each(value, function(ke, val) {
                if (key == 'location') {
                    filterArray[key].push( {id: val.hub_centerid, name: val.hub_centername, radio: true} );
                }else if(key == 'deliveryType'){
                    filterArray[key].push( {id: val.hub_deliverytypeid, name: val.hub_name, radio: false} );
                }else if(key == "time"){
                    filterArray[key].push( {id: val.id, name: val.name, radio: false});
                }else if(key == "grade"){
                    wjQuery.each(val, function(name, id){
                        filterArray[key].push( {id: id, name: name, radio: false});
                    });
                }else if(key == "subject"){
                    wjQuery.each(val, function(name, id){
                        filterArray[key].push( {id: id, name: name, radio: false});
                    });
                }else if(key == "student"){
                    filterArray[key].push({
                        id: val._hub_student_value, 
                        name: val['_hub_student_value@OData.Community.Display.V1.FormattedValue'], 
                        startTime: val['hub_session_date@OData.Community.Display.V1.FormattedValue'] +" "+ val['hub_start_time@OData.Community.Display.V1.FormattedValue'],
                        endTime: val['hub_session_date@OData.Community.Display.V1.FormattedValue'] +" "+ val['hub_end_time@OData.Community.Display.V1.FormattedValue'],
                        sessionDate:val['hub_session_date@OData.Community.Display.V1.FormattedValue'],
                        resourceId:val['_hub_resourceid_value'],
                        centerId:val['_hub_center_value'],
                        radio: false
                    });
                    var sDate = new Date(val['hub_session_date@OData.Community.Display.V1.FormattedValue'] +" "+ val['hub_start_time@OData.Community.Display.V1.FormattedValue']);
                    var eDate = new Date(val['hub_session_date@OData.Community.Display.V1.FormattedValue'] +" "+ val['hub_end_time@OData.Community.Display.V1.FormattedValue']);
                    // console.log(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), sDate.getMinutes());
                    // console.log(eDate.getFullYear(), eDate.getMonth(), eDate.getDate(), eDate.getHours(), eDate.getMinutes());
                    eventList.push({
                        title:val['_hub_student_value@OData.Community.Display.V1.FormattedValue'],
                        start:new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), sDate.getMinutes()),
                        end:new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate(), eDate.getHours(), sDate.getMinutes()),
                        allDay: false,
                        resourceId: '9665d732-7f56-e711-80f1-c4346bad526c',
                        backgroundColor: '#333333'
                        // url:"http://google.com/"
                    });
                }
            });
        });
        this.filters = filterArray;
        this.eventList = eventList;
        // console.log(this.filters);
    }
}