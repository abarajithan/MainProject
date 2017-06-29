(function($wjq) {

    // Defaults
    var defaults = {
        // ...
    };
    
    
    var calendar = undefined;

    // Methods
    var methods = {
        // (Note that `initialize` isn't on this list)
        setData:    setData,
        populateLocation : populateLocation,
        getCurrentLocationId : getCurrentLocationId,
        populateResource : populateResource,
        getFilterObject: gererateFilterObject
        

    };

    // Utils
    var slice = Array.prototype.slice;

    // Expose the plugin
    $wjq.fn.sylvanCalendar = sylvanCalendar;

    // Main entry point to plugin
    function sylvanCalendar(arg) {
        var args = slice.call(arguments, 0);
        var method;
        var rv;

        // What are we doing?
        switch (typeof arg) {
            case "undefined":
            case "object":
                // Initializing
                rv = initialize.call(this, args);
                break;
            case "string":
                // Method, do we know it?
                method = methods[arg];
                if (!method) {
                    throw new Error("sylvanCalendar: Unknown method '" + arg + "'");
                }
                args.shift(); // We've consumed the method name

                // Do it, return whatever it returns
                rv = method.call(this, args);
                break;
            default:
                throw new Error("sylvanCalendar: Expected string or object as first argument if argument given.");
        }
        return rv;
    }

    // Initialize the plugin
    function initialize(args) {
        // Get the options
        var options = $wjq.extend({}, defaults, args[0]);
        // Loop through, initializing the elements
        this.each(function(i,element) {
            $wjq(element).load(window.location.protocol +"//"+window.location.host+"/WidgetCalendar/index.html");    
            main();
            // ...
            // (if appropriate here, you might detect whether you're being re-initialized
            // for the same element)
        });
        setTimeout(function(){
            if(options != undefined){
                options['location'] != undefined ? populateLocation(options['location']):'';
            }
        },100);

        // Enable chaining
        return this;
    }

    // Get data
    function getCurrentLocationId(args) {
        return this.first().data("sylvanCalendar");
    }

    // Set data; "set" operations apply to all elements
    function setData(args) {
        this.data("sylvanCalendar", args[0]);
        return this;
    }

    function populateLocation(args){
        var locationData = [];
        args[0][0] == undefined ? locationData = args:locationData = args[0];
        var locationList = [];
        for(var i=0;i<locationData.length;i++){
            if(!i)
            {
                $wjq(".loc-dropdown .btn:first-child").text(locationData[i].hub_centername);
                $wjq(".loc-dropdown .btn:first-child").val(locationData[i].hub_centerid);
            }
            locationList.push('<li><a tabindex="-1" value-id='+locationData[i].hub_centerid+' href="javascript:void(0)">'+locationData[i].hub_centername+'</a></li>');
        }
        $wjq(".loc-dropdown ul").html(locationList);
        $wjq(".loc-dropdown .dropdown-menu").on('click', 'li a', function(){
            if($wjq(".loc-dropdown .btn:first-child").val() != $wjq(this).attr('value-id')){
                $wjq(".loc-dropdown .btn:first-child").text($wjq(this).text());
                $wjq(".loc-dropdown .btn:first-child").val($wjq(this).attr('value-id'));
                resourceList = [];
                return fetchResources($wjq(this).attr('value-id'));
            }
        });
        return fetchResources(locationData[0].hub_centerid);
    }

    var resourceList = [];
    function populateResource(args){
        var resourceData = [];
        args[0][0] == undefined ? resourceData = args:resourceData = args[0];
        for(var i=0;i<resourceData.length;i++){
            resourceList.push({
                name: i+1,
                id: resourceData[i].hub_center_resourcesid
            });
        }
        calendar == undefined ? loadCalendar(): calendar.fullCalendar('resources',resourceList);
    }

    function main(){
        loadLibraries($wjq);      
    }

    function loadCalendar(){
        setTimeout(function(){
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
       
        var calendarOptions = {
            header: false,
            defaultView: 'resourceDay',
            minTime:9,
            maxTime:18,
            handleWindowResize:true,
            height:window.innerHeight - 50,
            slotMinutes : 30,
            selectable: true,
            selectHelper: true,
            select: function(start, end, allDay, event, resourceId) {
                var title = prompt('Event Title:');
                if (title) {
                    console.log("@@ adding event " + title + ", start " + start + ", end " + end + ", allDay " + allDay + ", resource " + resourceId);
                    calendar.fullCalendar('renderEvent',
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
                calendar.fullCalendar('unselect');
            },
            eventResize: function(event, dayDelta, minuteDelta) {
                console.log("@@ resize event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
            },
            eventDrop: function( event, dayDelta, minuteDelta, allDay) {
                console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
            },
            editable: true,
            resources: resourceList,
            events: [
                {
                    title: 'All Day Event 1',
                    start: new Date(y, m, d - 1),
                    end: new Date(y, m, d + 1),
                    resourceId: '0517a2c8-1b50-e711-80f1-c4346bacfbbc',
                    backgroundColor: '#27A0C9'
                },
                {
                    title: 'Short Event 1',
                    start: new Date(y, m, d, 11, 30),
                    end: new Date(y, m, d, 13, 00),
                    allDay: false,
                    resourceId: '0517a2c8-1b50-e711-80f1-c4346bacfbbc',
                    backgroundColor: '#27A0C9'
                },
                {
                    title: 'Short Event 2',
                    start: new Date(y, m, d + 1, 14, 00),
                    end: new Date(y, m, d + 1, 15, 00),
                    allDay: false,
                    resourceId: '9665d732-7f56-e711-80f1-c4346bad526c',
                    backgroundColor: '#27A0C9'
                },
                {
                    title: 'All Day Event 2',
                    start: new Date(y, m, d - 2),
                    end: new Date(y, m, d - 1),
                    resourceId: '9665d732-7f56-e711-80f1-c4346bad526c',
                    backgroundColor: '#3F51B5'
                },
                {
                    title: 'Lunch',
                    start: new Date(y, m, d, 12, 0),
                    end: new Date(y, m, d, 14, 0),
                    allDay: false,
                    resourceId: 'e48a5ea8-ad3b-e711-80ef-c4346badc680',
                    backgroundColor: '#3F51B5'                        
                },
                {
                    title: 'All Day Event 3',
                    start: new Date(y, m, d),
                    resourceId: 'e48a5ea8-ad3b-e711-80ef-c4346badc680'
                },
                {
                    title: 'Click for Google',
                    start: new Date(y, m, d, 16, 0),
                    end: new Date(y, m, d, 16, 30),
                    allDay: false,
                    url: 'http://google.com/',
                    resourceId: '9665d732-7f56-e711-80f1-c4346bad526c'
                }
            ]
        };  
        
        calendar = $wjq('#calendar').fullCalendar(calendarOptions);
        var currentCalendarDate = calendar.fullCalendar('getDate');
        $wjq('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
        if($wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').length){
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align','center');
            $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        }

        $wjq("#addResource").click(function(){
            var newResource = {
                name:"Resource "+ (resourceList.length+1),
                id:"resource"+ (resourceList.length+1)
            };
            resourceList.push(newResource);
            calendar.fullCalendar("addResource",[newResource]);
        }); 

        $wjq('.prevBtn').click(function(){
            calendar.fullCalendar('prev');
            var currentCalendarDate = calendar.fullCalendar('getDate');
            $wjq('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        });

        $wjq('.nextBtn').click(function(){
            calendar.fullCalendar('next');
            var currentCalendarDate = calendar.fullCalendar('getDate');
            $wjq('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
        });

        $wjq('.wkView').click(function(){
            var filterElement = undefined;
            $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align','center');
            if(calendar.fullCalendar('getView').name != 'agendaWeek'){
                var isFilterOpen = false;
                if($wjq('.filter-section').length){
                    isFilterOpen = $wjq('.filter-section').css("marginLeft");
                    filterElement = $wjq('.filter-section');
                    $wjq('.filter-section').remove();
                }
                calendar.fullCalendar('changeView','agendaWeek');
                if(filterElement != undefined){
                    $wjq(".fc-agenda-divider.fc-widget-header:visible").after(filterElement);
                }
                else{
                    $wjq(".fc-agenda-divider.fc-widget-header:visible").after("<div class='filter-section'></div>");
                    calendarFilter($wjq);
                }
                filterSlide($wjq,isFilterOpen == '0px');
            }
        });

        $wjq('.dayView').click(function(){
            var filterElement = undefined;
            if(calendar.fullCalendar('getView').name != 'resourceDay'){
                var isFilterOpen = false;
                if($wjq('.filter-section').length){
                    isFilterOpen = $wjq('.filter-section').css("marginLeft");
                    filterElement = $wjq('.filter-section');
                    $wjq('.filter-section').remove();
                }
                calendar.fullCalendar('changeView','resourceDay');
                setTimeout(function(){
                    var currentCalendarDate = calendar.fullCalendar('getDate');
                    $wjq('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
                    var dayOfWeek = moment(currentCalendarDate).format('dddd');
                    var dayofMonth = moment(currentCalendarDate).format('M/D');
                    $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
                },500); 
                if(filterElement != undefined){
                    $wjq(".fc-agenda-divider.fc-widget-header:visible").after(filterElement);
                }
                else{
                    $wjq(".fc-agenda-divider.fc-widget-header:visible").after("<div class='filter-section'></div>");
                    calendarFilter($wjq);
                }
                filterSlide($wjq,isFilterOpen == '0px');
            }
        });

        $wjq(".fc-agenda-divider.fc-widget-header").after("<div class='filter-section'></div>");
        calendarFilter($wjq);
        filterSlide($wjq,false);
        $wjq('#datepicker').datepicker({
            buttonImage: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/images/calendar.png",
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            showOn: 'button',
            onSelect: function(date) {
              var displayDate = new Date(date);
              calendar.fullCalendar( 'gotoDate', displayDate );
               $wjq('.headerDate').text(date);
               var dayOfWeek = moment(date).format('dddd');
               var dayofMonth = moment(date).format('M/D');
               $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);  
            }
        });
               
        $wjq('#addAppointment').on('click', function() {
            $wjq("#appointmentModal").dialog({
                modal: true 
            });
            $wjq("#appointmentModal").dialog('option', 'title', 'Add New Appointment Slot');
            setTimeout(function(){                      
                var etime;                        
                $wjq(".from-timepicker-input" ).timepicker({
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
                                $wjq(".to-timepicker-input").val(etime);  
                                $wjq(".to-timepicker-input").timepicker('option',{'minTime': stime.getHours()});
                            }                        
                        });                                   
                $wjq( ".to-timepicker-input" ).timepicker({    
                            timeFormat: 'h:mm p',                            
                            interval: 30,                            
                            minTime: $(".to-timepicker-input").val().split(' ')[0]+':00', 
                            maxTime: '6:00pm',                            
                            dynamic: false,                            
                            dropdown: true,                            
                            scrollbar: true                        
                        });                                   
            },300);
        });

        // From date for new appointment
        $wjq( ".from-datepicker-input" ).datepicker();
        var selectedFromDate; 
        $wjq(".from-datepicker-input").on("change",function(){
            selectedFromDate = $wjq(this).val();
        });

        $wjq(".from-up-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            $wjq( ".from-datepicker-input" ).val(selectedFromDate);
        });

        $wjq(".from-down-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() - 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            $wjq( ".from-datepicker-input" ).val(selectedFromDate);
        });

         // To date for new appointment
        $wjq( ".to-datepicker-input" ).datepicker();
        var selectedToDate; 
        $wjq(".to-datepicker-input").on("change",function(){
            selectedToDate = $wjq(this).val();
        });
         
        $wjq(".to-up-arrow").on("click",function(){
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            $wjq( ".to-datepicker-input" ).val(selectedToDate);
        });

        $wjq(".to-down-arrow").on("click",function(){
            var date = new Date(selectedToDate);
            date.setDate(date.getDate() - 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            $wjq( ".to-datepicker-input" ).val(selectedToDate);
        });

        $wjq("#save").click(function(){
            alert("success");
            var fromDate = $wjq("#fromDate").val();
            var fromTime = $wjq("#fromTime").val();
            var toDate = $wjq("#toDate").val();
            var toTime = $wjq("#toTime").val();
            var type = $wjq("#type").val();
            var capacity = $wjq("#capacity").val();
            var staff = $wjq("#staff").val();
            var location = $wjq("#location").val();
            var notes = $wjq("#notes").val();   
        });
        $wjq('.filter-header').click(function() { 
            var id = $wjq(this).parent().attr('id');
            let flag = $( "#"+id ).hasClass( "open" );
            if(flag){
                $wjq(this).parent().children('.option-header-container').remove();
                $wjq('#'+id).removeClass('open');
                $( "#"+id ).find('.filter-nav-icon').removeClass('open');
            }
            else{
                var indices = id.split('_');
                var index = indices[1];
                for(var i=0;i<filters[index].length;i++){
                    if (filters[index][i].radio) {
                        $wjq('#'+id).append('<div class="option_'+filters[index][i].id+' option-header-container">'+
                        '<label class="cursor option-title">'+
                            '<input type="radio" name="checkbox" value="value">'+filters[index][i].name+
                        '</label>'+
                    '</div>');
                    }else{
                        $wjq('#'+id).append('<div class="option_'+filters[index][i].id+' option-header-container">'+
                        '<label class="cursor option-title">'+
                            '<input type="checkbox" name="checkbox" value="value">'+filters[index][i].name+
                        '</label>'+
                    '</div>');
                    }
                    
                }
                $wjq('#'+id).addClass('open');
                $( "#"+id ).find('.filter-nav-icon').addClass('open');
            }
        });   
        //Student pane and TA pane Functionality
        var sofExpanded = false;
        var taExpanded = false;
        $wjq('.sof-pane').css('height',$wjq('#calendar').height() - 25 +"px"); 
        $wjq('.ta-pane').css('height',$wjq('#calendar').height() - 25 +"px"); 
        $wjq('.sof-pane').css('overflow-y','auto'); 
        $wjq('.ta-pane').css('overflow-y','auto'); 
        $wjq('.sof-btn').click(function(){
            if(taExpanded){
                taExpanded = !taExpanded; // to change the slide
                taExpanded ? $wjq('.ta-pane').addClass('open') : $wjq('.ta-pane').removeClass('open');
                $wjq('.ta-pane').animate(taExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
            }
            sofExpanded = !sofExpanded;
            sofExpanded ? $wjq('.sof-pane').addClass('open') : $wjq('.sof-pane').removeClass('open');
            $wjq('.sof-pane').animate(sofExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
        });
        $wjq('.ta-btn').click(function(){
            if(sofExpanded){
                sofExpanded = !sofExpanded;
                sofExpanded ? $wjq('.sof-pane').addClass('open') : $wjq('.sof-pane').removeClass('open');
                $wjq('.sof-pane').animate(sofExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
            }
            taExpanded = !taExpanded;
            taExpanded ? $wjq('.ta-pane').addClass('open') : $wjq('.ta-pane').removeClass('open');
            $wjq('.ta-pane').animate(taExpanded?{'marginRight':'0'} : {marginRight:'-260px'},500);
        });
    },100); 
    }

    function loadLibraries($wjq){
        var css_link = $wjq("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/full-calendar/fullcalendar.css" 
        });
        css_link.appendTo('head');

        css_link = $wjq("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/jquery/jquery-ui-1.8.23.css" 
        });
        css_link.appendTo('head'); 

        css_link = $wjq("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/libraries/bootstrap/css/bootstrap.min.css" 
        });
        css_link.appendTo('head'); 

        css_link = $wjq("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/common.css" 
        });
        css_link.appendTo('head');  

        css_link = $wjq("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/css/style.css" 
        });
        css_link.appendTo('head'); 

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/libraries/bootstrap/js/bootstrap.min.js" 
        });     
        css_link.appendTo('head');

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/moment/moment.min.js" 
        });     
        css_link.appendTo('head');    

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/jQuery/jquery-ui-1.8.23.min.js"
        });     
        css_link.appendTo('head'); 

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/jQuery/jquery-timepicker-1.3.5.min.js"
        });     
        css_link.appendTo('head');    

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/full-calendar/fullcalendar.js" 
        });     
        css_link.appendTo('head');    
    }


    /******** Create Filters ***********/
    var filters = Object();



    convertedFilterObj = new Object();

    function gererateFilterObject(args){
        args[0] == undefined ? filtersObj = args : filtersObj = args[0];
        // console.log(filtersObj);
        $wjq.each(filtersObj, function(key, value) {
            filters[key] = [];
            // console.log(key);
            $wjq.each(value, function(ke, val) {
                if (key == 'location') {
                    filters[key].push( {id: val.hub_centerid, name: val.hub_centername, radio: true} );
                    // console.log({id: val.hub_centerid, name: val.hub_centername});
                }else if(key == 'deliveryType'){
                    filters[key].push( {id: val.hub_deliverytypeid, name: val.hub_name, radio: false} );
                    // console.log({id: val.hub_deliverytypeid, name: val.hub_name});
                }else if(key == "time"){
                    filters[key].push( {id: val.id, name: val.name, radio: false});
                    // console.log({id: val.id, name: val.name});
                }else if(key == "grade"){
                    // console.log(val);
                    $wjq.each(val, function(name, id){
                        // console.log(name);
                        filters[key].push( {id: id, name: name, radio: false});
                    });
                }else if(key == "subject"){
                    // console.log(val);
                    $wjq.each(val, function(name, id){
                        // console.log(name);
                        filters[key].push( {id: id, name: name, radio: false});
                    });
                }else if(key == "student"){
                    // console.log(val);
                    filters[key].push({id: val._hub_student_value, 
                                        name: val['_hub_student_value@OData.Community.Display.V1.FormattedValue'], 
                                        startTime: val['hub_start_time@OData.Community.Display.V1.FormattedValue'],
                                        endTime: val['hub_end_time@OData.Community.Display.V1.FormattedValue'],
                                        sessionDate:val['hub_session_date@OData.Community.Display.V1.FormattedValue'],
                                        // resourceValue:val[''],
                                        radio: false
                                    });
                }

            });
        });
        console.log(filters);
    }
    
    function calendarFilter($wjq){
        buildFilterBody($wjq);
    }

    function filterSlide($wjq,expanded){
        $wjq('.filter-label-outer').click(function(){
            $wjq('.filter-section').animate(expanded?{'marginLeft':'-275px'} : {marginLeft:'0px'},500);
            expanded ? $wjq('.filter-slide-icon').removeClass('open') : $wjq('.filter-slide-icon').addClass('open');
            expanded = !expanded;
        });
    }

    function buildFilterBody($wjq){
        $wjq('.filter-section').html('<div class="filter-container"></div>'+
            '<div class="filter-label-outer">'+
                '<span class="filter-slide-icon"></span>'+
                '<div class="filter-label">FILTERS'+ 
                '</div>'+
            '</div>');
        // console.log(filters);
        $wjq.each(filters, function(key, value){
            // console.log(key);
            $wjq('.filter-container').append(
                '<div id="filter_'+key+'" class="filter-header-container">'+
                    '<div class="filter-header cursor">' +
                        '<div class="filter-title">'+key+'</div>' +
                        '<span class="filter-nav-icon"></span>' +
                    '</div>' +
                '</div>'
            );  
        });
        $wjq('.filter-section').css('height',$wjq('.filter-section').next().height() - 2 +"px");  
        $wjq('.filter-container').css({'height':$wjq('.filter-section').next().height() - 2 +"px","overflow-y":"auto"});
    } 


})(wjQuery);