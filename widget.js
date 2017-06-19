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
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/full-calendar/fullcalendar.js" 
        });     
        css_link.appendTo('head');    

        css_link = $wjq("<script>", { 
            type: "text/javascript", 
            src: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/js/script.js" 
        });     
        css_link.appendTo('head');
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
                            backgroundColor: '#3F51B5'                        },
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
                    calendar.fullCalendar('changeView','agendaWeek');
                });
                $wjq('.dayView').click(function(){
                    calendar.fullCalendar('changeView','resourceDay');
                    setTimeout(function(){
                        var currentCalendarDate = calendar.fullCalendar('getDate');
                        $wjq('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
                        var dayOfWeek = moment(currentCalendarDate).format('dddd');
                        var dayofMonth = moment(currentCalendarDate).format('M/D');
                        $wjq('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek +" <br/> "+ dayofMonth);
                    },50); 
                });
                $wjq(".fc-agenda-divider.fc-widget-header").after("<div class='filter-section'></div>");
                $wjq('.filter-section').css('height',$wjq('.filter-section').next().height() - 2 +"px");
                $wjq('.filter-section').html('<p class="filter-title">FILTERS</p>');
                var expanded = false;
                $wjq('.filter-section').click(function(){
                    $wjq('.filter-section').animate(expanded?{width:'30px'} : {width:'200px'},500);
                    expanded = !expanded;
                });

                $wjq('#datepicker').datepicker({
                    buttonImage: window.location.protocol +"//"+window.location.host+"/WidgetCalendar/images/calendar.png",
                    buttonImageOnly: true,
                    changeMonth: true,
                    changeYear: true,
                    showOn: 'button',
                });

            },100);

       });
    }
})();
