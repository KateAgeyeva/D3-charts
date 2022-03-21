
//GLOBAL VARIABLES
let calls, nestedCalls, stackedArea, timeline, donut, revenueBar, durationBar, unitBar


const parseTime = d3.timeParse('%d/%m/%Y');
const formatTime = d3.timeFormat('%d/%m/%Y')

d3.json('data/calls.json').then(data => {
	data.forEach(d => {
		d.call_revenue = d.call_revenue,
		d.units_sold = d.units_sold,
		d.call_duration = d.call_duration,
		d.date = parseTime(d.date)
	});

	calls = data;

	nestedCalls = d3.nest() 
		.key(d => d.category)
		.entries(calls);

	stackedArea = new StackedAreaChart('#stacked-area');
	//timeline = new Timeline("#timeline")
})

