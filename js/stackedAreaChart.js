//STACKED AREA CHART

class StackedAreaChart {
    constructor(_parentElement) {
        this.parentElement = _parentElement

        this.initVis()
    }

    initVis() {
        const vis = this;

        //SVG SIZE
        vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 };
        vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
        vis.HEIGHT = 370 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

        vis.svg = d3.select(vis.parentElement)
            .append('svg')
            .attr('width', vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
            .attr('height', vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

        //CHART POSITION INSIDE SVG
        vis.g = vis.svg.append('g')
            .attr('transform', `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

        //VISUALIZATION COLOR
        vis.color = d3.scaleOrdinal(d3.schemePastel2);

        //VISUALIZATION X Y SCALES
        vis.x = d3.scaleTime().range([0, vis.WIDTH]);
        vis.y = d3.scaleLinear().range([vis.HEIGHT, 0]);

        vis.yAxisCall = d3.axisLeft();
        vis.xAxisCall = d3.axisBottom();
            // .ticks(5)

        //CHART CLASSES AND REVERT POSITION
        vis.xAxis = vis.g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${vis.HEIGHT})`);
        vis.yAxis = vis.g.append('g')
            .attr('class', 'y-axis');

        //DATA FOR VISUALIZATION
        vis.stack = d3.stack()
            //MAYBE DATA.TEAM
            .keys(['west', 'south', 'northeast', 'midwest']);

        //CREATE A FILLED CHART LINE
        vis.area = d3.area()
            .x(d => vis.x(parseTime(d.data.date)))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        vis.addLegend();
        vis.wrangleData();
    }

    wrangleData() {
        const vis = this;

        vis.variable = $('#var-select').val();

        vis.dayNest = d3.nest()
            .key(d => formatTime(d.date))
            .entries(calls);

        vis.dataFiltered = vis.dayNest.map(day => day.values.reduce(
            (accumulator, current) => {
                accumulator.date = day.key;
                accumulator[current.team] = accumulator[current.team] + current[vis.variable];
                return accumulator;
            }, {
                'northeast': 0,
                'midwest': 0,
                'south': 0,
                'west': 0
            }
        ));

        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        vis.t = d3.transition()
            .duration(700);

        vis.maxDateVal = d3.max(vis.dataFiltered, d => {
            let vals = d3.keys(d).map(key => key !== 'date' ? d[key] : 0);
            return d3.sum(vals);
        })

        //SCALES UPDATE
        vis.x.domain(d3.extent(vis.dataFiltered, (d) => parseTime(d.date)));
        vis.y.domain([0, vis.maxDateVal])

        //AXES UPDATE
        
    }
}