(function($) {

	"use strict";

	// Setup the calendar with the current date
$(document).ready(function(){
    var date = new Date();
    var end = new Date();
    if ($.cookie('start')) {
        date = new Date($.cookie('start'));
        end = new Date($.cookie('end'));
    } else {
        end.setDate(end.getDate()+1);
    }
    // Set click handlers for DOM elements
    $(".right-button-start").click({date: date, id: "start"}, next_year);
    $(".left-button-start").click({date: date, id: "start" }, prev_year);
    
    $(".right-button-end").click({date: end, id: "end"}, next_year);
    $(".left-button-end").click({date: end, id: "end" }, prev_year);
    

    $(".month-start").click({date: date, id: "start"}, month_click);
    $(".month-end").click({date: end, id: "end"}, month_click);
    // Set current month as active
    $(".months-row-start").children().eq(date.getMonth()).addClass("active-month-start");
    $(".months-row-end").children().eq(end.getMonth()).addClass("active-month-end");


    init_the_date(date, "start");   
    init_calendar(date, "start");
    init_the_date(end, "end");
    init_calendar(end, "end");

    if ( $.cookie('start') ) { 
        $(".calendar-start").hide(0);
        $(".calendar-end").hide(0);
        $(".ok-end").hide(0); 
        life();
    } else {
        $(".the-date-end").hide(0);
        $(".the-date-start").hide(0);
    }
    $(".the-date-start").click({}, expand_click);
    $(".the-date-end").click({}, expand_click);
    $(".ok-end").click({date: end, id: "end"}, ok_click);
});

function ok_click(event) {
    
    $(".calendar-end").hide(0);
    $(".calendar-start").hide(0);
    $(".the-date-end").show();
    $(".the-date-start").show();
    var id = "start";
    var date_start = new Date($(".active-month-"+id).html() + "/" + $(".active-date-"+id).html() + "/" + $(".year-"+id).html());
    init_the_date(date_start, id); 
    $.cookie(id, date_start);
    id = "end";
    var date_end = new Date($(".active-month-"+id).html() + "/" + $(".active-date-"+id).html() + "/" + $(".year-"+id).html());
    init_the_date(date_end, id); 
    $.cookie(id, date_end);
    $(".ok-end").hide(0);
    life();
}

function life() {
    var id = "start";
    var date_start = new Date($(".active-month-"+id).html() + "/" + $(".active-date-"+id).html() + "/" + $(".year-"+id).html());
    id = "end";
    var date_end = new Date($(".active-month-"+id).html() + "/" + $(".active-date-"+id).html() + "/" + $(".year-"+id).html());
    var Difference_In_Time = date_end.getTime() - date_start.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var date_now = new Date();
    var diff_time_now = date_now.getTime() - date_start.getTime();
    var diff_days_now = Math.round(diff_time_now / (1000 * 3600 * 24))+1;
    $(".life").empty();
    var in_a_row =$(".life").width() / 10 ;
    console.log(in_a_row);
    var days = $("<tabble class='days_in_life'></table>");
    var curr = 0;
    // //○◌●◐
    for (var i = 0;  i < Difference_In_Days; i+=in_a_row) {
        if (curr > Difference_In_Days) break;
        var row =  $("<tr></tr>");
        for (var j = 0;  j < in_a_row; j++) {
            if (curr > Difference_In_Days) break;
            curr ++;
            if (curr < diff_days_now) {
                row.append("<td>●</td>");
            } else if (curr === diff_days_now) {
                row.append("<td>◐</td>");
            } else {
                row.append("<td>○</td>");
            }
        }
        days.append(row);
        
    }
    $(".life").append(days);
}

function expand_click(event) {
    $(".calendar-start").show();
    $(".the-date-start").hide(0);
    $(".calendar-end").show();
    $(".the-date-end").hide(0);
    $(".ok-end").show();
}

function init_the_date(date, id) {
    $(".the-date-"+id).empty();
    var frm = "";
    if (id === "start") {
        frm = "<div style='font-size:12px; line-height: 10px'>From</div> ";
    } else {
        frm = "<div style='font-size:12px; line-height: 10px'>To</div>"
    }

    $(".the-date-"+id).append(frm + date.toLocaleDateString(undefined,{  year: 'numeric', month: 'short', day: 'numeric' }));
}

// Initialize the calendar by appending the HTML dates
function init_calendar(date, id) {
    $(".tbody-"+id).empty();
    var calendar_days = $(".tbody-"+id);
    var month = date.getMonth();
    var year = date.getFullYear();
    var day_count = days_in_month(month, year);
    var row = $("<tr class='table-row'></tr>");
    var today = date.getDate();
    
    // Set date to 1 to find the first day of the month
    date.setDate(1);
    var first_day = date.getDay();
    // 35+firstDay is the number of date elements to be added to the dates table
    // 35 is from (7 days in a week) * (up to 5 rows of dates in a month)
    var r = 0;
    for(var i=0; i<35+first_day; i++) {
        // Since some of the elements will be blank, 
        // need to calculate actual date from index
        var day = i-first_day+1;
        // If it is a sunday, make a new row
        if(i%7===0) {
            calendar_days.append(row);
            r += 1;
            row = $("<tr class='table-row'></tr>");
        }
        // if current index isn't a day in this month, make it blank
        if(i < first_day || day > day_count) {
            var curr_date = $("<td class='table-date nil' style='visibility:hidden;'>0</td>");
            row.append(curr_date);
        }   
        else {
            var curr_date = $("<td class='table-date'>"+day+"</td>");
            if(today===day && $(".active-date-"+id).length===0) {
                curr_date.addClass("active-date-"+id);
            }
            // Set onClick handler for clicking a date
            curr_date.click({month: months[month], day:day, id: id}, date_click);
            row.append(curr_date);
        }
    }
    // Append the last row and set the current year
    calendar_days.append(row);
     if (r != 6) {
        row = $("<tr class='table-row'><td class='table-date nil' style='visibility:hidden;''>0</td></tr>");
        calendar_days.append(row);
    }
    $(".year-"+id).text(year);
}

// Get the number of days in a given month/year
function days_in_month(month, year) {
    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 1);
    return (monthEnd - monthStart) / (1000 * 60 * 60 * 24);    
}

// Event handler for when a date is clicked
function date_click(event) {
    var id = event.data.id;
    $("#dialog").hide(250);
    $(".active-date-"+id).removeClass("active-date-"+id);
    $(this).addClass("active-date-"+id);

};

// Event handler for when a month is clicked
function month_click(event) {
    $("#dialog").hide(250);
    var date = event.data.date;
    console.log(date);
    var id = event.data.id;
    $(".active-month-"+id).removeClass("active-month-"+id);
    $(this).addClass("active-month-"+id);
    var new_month = $(".month-"+id).index(this);
    date.setMonth(new_month);
    console.log(date);
    init_calendar(date, id);
}

// Event handler for when the year right-button is clicked
function next_year(event) {
    $("#dialog").hide(250);
    var date = event.data.date;
    var id = event.data.id;
    var new_year = date.getFullYear()+1;
    $("year-"+id).html(new_year);
    date.setFullYear(new_year);
    init_calendar(date, id);
}

// Event handler for when the year left-button is clicked
function prev_year(event) {
    $("#dialog").hide(250);
    var date = event.data.date;
    var id = event.data.id;
    var new_year = date.getFullYear()-1;
    $("year-"+id).html(new_year);
    date.setFullYear(new_year);
    init_calendar(date, id);
}

const months = [ 
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December" 
];

})(jQuery);
