import * as d3 from "d3";
import SupabaseService from "~/api/supabase-service";
import {onMount} from "solid-js";

export default function ChartVisitedGyms() {
    function setChart(data: any) {
        const margin = {top: 20, right: 30, bottom: 40, left: 40};
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map((d: any) => d.name))
            .range([0, width])
            .padding(0.1);

        const maxValue = d3.max(data, (d: any) => d.value) || 100;

        const y = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, 0]);

        svg.append('g')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d: any) => x(d.name))
            .attr('y', (d: any) => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', (d: any) => height - y(d.value))
            .attr('fill', '#007C72');

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).ticks(3));
    }

    /**
     * Fetch all gyms from the database
     */
    async function fetchGyms() {
        return (await SupabaseService.getGyms()).gym;
    }

    /**
     * Get the count of events per gym
     */
    async function getGymVisitedCount() {
        let gymCountArray: any[] = [];
        let gyms = await fetchGyms();
        if (gyms) {
            await Promise.all(gyms?.map(async (gym: any) => {
                let count = (await SupabaseService.getEventsByLocation(gym.name)).events?.length;
                if (count > 0) {
                    gymCountArray.push({name: gym.name, value: count});
                    return gymCountArray;
                }
            }));
        }
        gymCountArray.sort((a: any, b: any) => b.value - a.value);
        return gymCountArray;
    }

    onMount(async () => {
        setChart(await getGymVisitedCount());
    });

    return (
        <div id="chart"></div>
    )
}