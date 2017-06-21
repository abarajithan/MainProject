(function() {

    // Localize jQuery variable
    var jQuery;
    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.8.1') {
        var jQ_script_tag = document.createElement('script');
        jQ_script_tag.setAttribute("type","text/javascript");
        jQ_script_tag.setAttribute("src",
            window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/jQuery/jquery-1.8.1.min.js");
        if (jQ_script_tag.readyState) {
          jQ_script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                  scriptLoadHandler();
              }
          };
        } 
        else {
          jQ_script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(jQ_script_tag);
        
    } 
    else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(false);    
        main();
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
    var filters = [];
    var filterObj = {
        header : 'Location',
        options : ['Satelite','Gotham City','Tales']
    };    
    filters.push(filterObj);
    filterObj = {
        header : 'Sample',
        options : ['Option 1','Option 2','Option 3','Option 4']
    };    
    filters.push(filterObj);
    function calendarFilter($wjq){
        buildFilterBody($wjq);
        var expanded = false;
        $wjq('.filter-label-outer').click(function(){
            $wjq('.filter-section').animate(expanded?{'marginLeft':'-225px'} : {marginLeft:'0px'},500);
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
        for(var i=0;i<filters.length;i++){
            $wjq('.filter-container').append(
            '<div id="filter_'+i+'" class="filter-header-container">'+
                '<div class="filter-header cursor">' +
                    '<div class="filter-title">'+filters[i].header+'</div>' +
                    '<span class="filter-nav-icon"></span>' +
                '</div>' +
            '</div>');
        }
        $wjq('.filter-section').css('height',$wjq('.filter-section').next().height() - 2 +"px");  
        $wjq('.filter-container').css({'height':$wjq('.filter-section').next().height() - 2 +"px","overflow-y":"auto"});
    } 

    /******** Our main function ********/
    function main() { 
        jQuery(document).ready(function($wjq) { 
            /******* Load External Libraries *******/
            loadLibraries($wjq);   
            //load the widget HTML into the div we get   
            $wjq('#widget-calendar').load(window.location.protocol +"//"+window.location.host+"/WidgetCalendar/index.html");
            
            setTimeout(function(){      
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
                
                var resourceList = [
                        {
                            name: '1',
                            id: 'resource1'
                        },
                        {
                            name: '2',
                            id: 'resource2'
                        },
                        {
                            name: '3',
                            id: 'resource3'
                        },
                        {
                            name: '4',
                            id: 'resource4'
                        },
                        {
                            name: '5',
                            id: 'resource5'
                        },
                        {
                            name: '6',
                            id: 'resource6'
                        },
                        {
                            name: '7',
                            id: 'resource7'
                        }
                    ];
                var calendarOptions = {
                    header: false,
                    defaultView: 'resourceDay',
                    minTime:9,
                    maxTime:18,
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
                            resourceId: 'resource1',
                            backgroundColor: '#27A0C9'
                        },
                        {
                            title: 'Short Event 1',
                            start: new Date(y, m, d, 11, 30),
                            end: new Date(y, m, d, 13, 00),
                            allDay: false,
                            resourceId: 'resource1',
                            backgroundColor: '#27A0C9'
                        },
                        {
                            title: 'Short Event 2',
                            start: new Date(y, m, d + 1, 14, 00),
                            end: new Date(y, m, d + 1, 15, 00),
                            allDay: false,
                            resourceId: 'resource1',
                            backgroundColor: '#27A0C9'
                        },
                        {
                            title: 'All Day Event 2',
                            start: new Date(y, m, d - 2),
                            end: new Date(y, m, d - 1),
                            resourceId: 'resource2',
                            backgroundColor: '#3F51B5'
                        },
                        {
                            title: 'Lunch',
                            start: new Date(y, m, d, 12, 0),
                            end: new Date(y, m, d, 14, 0),
                            allDay: false,
                            resourceId: 'resource2',
                            backgroundColor: '#3F51B5'                        
                        },
                        {
                            title: 'All Day Event 3',
                            start: new Date(y, m, d),
                            resourceId: 'resource4'
                        },
                        {
                            title: 'Click for Google',
                            start: new Date(y, m, d, 16, 0),
                            end: new Date(y, m, d, 16, 30),
                            allDay: false,
                            url: 'http://google.com/',
                            resourceId: 'resource3'
                        }
                    ]
                };    

                var calendar = $wjq('#calendar').fullCalendar(calendarOptions);
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
                    if($wjq('.filter-section').length){
                        filterElement = $wjq('.filter-section');
                        $wjq('.filter-section').remove();
                    }
                    if(calendar.fullCalendar('getView').name != 'agendaWeek'){
                        calendar.fullCalendar('changeView','agendaWeek');
                        if(filterElement != undefined){
                            $wjq(".fc-agenda-divider.fc-widget-header:visible").after(filterElement);
                        }
                        else{
                             $wjq(".fc-agenda-divider.fc-widget-header:visible").after("<div class='filter-section'></div>");
                            calendarFilter($wjq);
                        }
                    }
                });
                $wjq('.dayView').click(function(){
                    var filterElement = undefined;
                    if($wjq('.filter-section').length){
                        filterElement = $wjq('.filter-section');
                        $wjq('.filter-section').remove();
                    }
                    if(calendar.fullCalendar('getView').name != 'resourceDay'){
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
                    }
                });
                $wjq(".fc-agenda-divider.fc-widget-header").after("<div class='filter-section'></div>");
                calendarFilter($wjq);
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
                        $wjq( ".from-timepicker-input" ).on("click", function(){
                            $wjq( ".from-timepicker-input" ).timepicker();
                            $wjq( ".from-timepicker-input" ).after($wjq('.ui-timepicker-container'));
                            $wjq('.ui-timepicker-container').css('top',$wjq( ".from-timepicker-input" ).offset().top - 70 +'px');
                            $wjq('.ui-timepicker-container').css('left',$wjq( ".from-timepicker-input" ).offset().left -520 +'px');
                        });
                        $wjq( ".to-timepicker-input" ).on("click", function(){
                            $wjq( ".to-timepicker-input" ).timepicker();
                            $wjq( ".to-timepicker-input" ).after($wjq('.ui-timepicker-container'));
                            $wjq('.ui-timepicker-container').css('top',$wjq(".to-timepicker-input").offset().top - 70 +'px');
                            $wjq('.ui-timepicker-container').css('left',$wjq(".to-timepicker-input").offset().left -520 +'px');
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
                    let flag = $( "#"+id ).hasClass( "open" )
                    if(flag){
                        $wjq(this).parent().children('.option-header-container').remove();
                        $wjq('#'+id).removeClass('open');
                        $( "#"+id ).find('.filter-nav-icon').removeClass('open');
                    }
                    else{
                        var indices = id.split('_');
                        var index = parseInt(indices[1]);
                        for(var i=0;i<filters[index].options.length;i++){
                            $wjq('#'+id).append('<div class="option_'+i+' option-header-container">'+
                                    '<label class="cursor option-title">'+
                                        '<input type="checkbox" name="checkbox" value="value">'+filters[index].options[i]+
                                    '</label>'+
                            '</div>');
                        }
                        $wjq('#'+id).addClass('open');
                        $( "#"+id ).find('.filter-nav-icon').addClass('open');
                    }
                });    
            },100);
       });
    }
})();
