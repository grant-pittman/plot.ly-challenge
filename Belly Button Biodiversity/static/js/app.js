function demInfo(id) {
	
	//retrieving data from the JSON file
    d3.json("../../data/samples.json").then(function(data){

    //locate the data for the id the user selects from dropdown menu
        var meta_data = data.metadata.filter(s => s.id.toString() === id.toString())[0];
        
        //selecting the panel html element and reseting its value
        var panel = d3.select("#sample-metadata");
        panel.html("");
        
        Object.entries(meta_data).forEach(function([key,value]) {	
            panel.append("p").text(`${key}: ${value}`);	    
        });
    });
}

function bubbleChart(id) {
		
	//retrieving data from the JSON file
    d3.json("../../data/samples.json").then(function(data){
    
    
        var sample_data = data.samples.filter(s => s.id.toString() === id)[0];
        
        var s_values = sample_data.sample_values;
        var s_ids = sample_data.otu_ids;
        //converting the otu_ids to strings for proper plotting
        var otu_ids = s_ids.map(s => s.toString());
        var otu_labels = sample_data.otu_labels;
        
        //creating the trace for the bubble Chart
        var trace = {
            y: s_values,
            x: s_ids,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: s_values,
                colorscale:"Jet"
                    },
            text: otu_labels,
            
        };

        var data = [trace];

        //formatting the chart
        var layout = {
            xaxis: {title:"OTU ID"},
        };

        Plotly.newPlot("bubble", data, layout);
    });
};

function barPlot(id) {
		
		
    d3.json("../../data/samples.json").then(function(data){
        var sample_data = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(sample_data);
        
        var s_values = sample_data.sample_values.slice(0,10).reverse();
        var s_ids = sample_data.otu_ids.slice(0,10).reverse();
        var otu_ids = s_ids.map(s => `OTU ${s.toString()}`);
        var otu_labels = sample_data.otu_labels.slice(0,10).reverse();
        
        var trace = {
            x: s_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTU",
            
        };

        Plotly.newPlot("bar", data, layout);
        console.log(`${sample_data.id}:{${otu_ids}}`);
    });
};

//creating a listener event for any changes on the DOM, specifically the dropdown menu user selection
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly(){
    var dropID = d3.select("#selDataset");
    var id = dropID.node().value;

    //the other functions are called anytime there is a change to update the graphics
    barPlot(id);
    bubbleChart(id);
    demInfo(id);
};

function init() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    
    d3.json("../../data/samples.json").then(function(data){
    
        data.samples.forEach(function(d) {
            
            dropdownMenu.append("option").text(d.id).property("value");	
        
        });

        barPlot(data.samples[0].id);
        demInfo(data.samples[0].id);
        bubbleChart(data.samples[0].id);
	});
}

//initializing with a standin value 
init();